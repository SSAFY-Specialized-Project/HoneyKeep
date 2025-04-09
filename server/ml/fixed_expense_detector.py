import pandas as pd
import numpy as np
from scipy.fft import fft
import pickle
import os
import re
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import collections.abc # Use this for robust checking

# --- Helper Function to Convert NumPy Types ---
def convert_numpy_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        # Handle potential NaN values before converting to float
        if np.isnan(obj):
            return None # Or return 0.0, depending on desired behavior for NaN
        return float(obj)
    elif isinstance(obj, np.ndarray):
        # Convert numpy arrays to lists, applying conversion to elements
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, collections.abc.Mapping): # Check if it's a dictionary-like object
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, collections.abc.Sequence) and not isinstance(obj, (str, bytes)): # Check if it's a list/tuple but not string/bytes
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj
# ---------------------------------------------

# 전역 변수 및 설정
MODEL_PATH = 'model/fixed_expense_model.pkl'
MODEL_TRAINED = os.path.exists(MODEL_PATH)
DEFAULT_MODEL_PARAMS = {
    'objective': 'binary:logistic',
    'n_estimators': 100,
    'learning_rate': 0.1,
    'max_depth': 4,
    'gamma': 0.25,
    'reg_lambda': 10,
    'scale_pos_weight': 3,
    'subsample': 0.9,
    'colsample_bytree': 0.5,
    'random_state': 42
}

# 모델 로드 또는 새로 생성 함수
def get_model():
    global MODEL_TRAINED
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            MODEL_TRAINED = True
            return pickle.load(f)
    MODEL_TRAINED = False
    return XGBClassifier(**DEFAULT_MODEL_PARAMS)

# 모델 저장 함수
def save_model(model):
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)

# 모델 학습 함수
def train(data):
    # 트랜잭션 데이터를 데이터프레임으로 변환
    df = pd.DataFrame(data['detectedFixedExpenses'])
    
    # 피드백 데이터가 부족한 경우 처리
    if len(df) < 10:
        return {'status': 'insufficient_data', 'samples': len(df)}
    
    # 모델 학습에 필요한 특성 선택
    feature_columns = [
        'amountScore', 'dateScore', 'persistenceScore', 'transactionCount',
        'avgInterval',          'weekendRatio', 'intervalStd',
        'intervalCv', 'continuityRatio', 'amountTrendSlope', 'amountTrendR2'
    ]
    
    # 실제 존재하는 컬럼만 선택
    X_columns = [col for col in feature_columns if col in df.columns]
    X = df[X_columns]
    y = df['isFixedExpense']
    
    # 하이퍼파라미터 최적화 여부 결정 (데이터가 충분할 때만)
    use_grid_search = len(df) >= 100  # 데이터가 100개 이상일 때만 하이퍼파라미터 튜닝

    # 클래스 분포 계산    
    pos_class_count = np.sum(y)
    neg_class_count = len(y) - pos_class_count

    if use_grid_search:
        # 하이퍼파라미터 그리드 정의
        param_grid = {
            'max_depth': [3, 4, 5],
            'learning_rate': [0.05, 0.1, 0.2],
            'gamma': [0, 0.1, 0.25],
            'reg_lambda': [1, 5, 10],
            'scale_pos_weight': [1, 3, 5],
            'subsample': [0.8, 0.9, 1.0],
            'colsample_bytree': [0.5, 0.7, 0.9]
        }
        
        # 클래스 불균형을 고려한 가중치 계산
        if pos_class_count > 0 and neg_class_count > 0:
            scale_pos_weight = neg_class_count / pos_class_count
            param_grid['scale_pos_weight'] = [1, scale_pos_weight, scale_pos_weight * 1.5]
        
        # 1단계: 빠른 검색으로 대략적인 범위 찾기
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
        
        # 계산 비용 줄이기 위해 파라미터 샘플링
        from sklearn.model_selection import ParameterSampler
        import random
        
        param_distributions = ParameterSampler(
            param_grid, n_iter=10, random_state=42
        )
        
        best_score = -1
        best_params = None
        
        for params in param_distributions:
            model = XGBClassifier(objective='binary:logistic', n_estimators=100, **params, random_state=42)
            model.fit(X_train, y_train, eval_set=[(X_val, y_val)], early_stopping_rounds=10, verbose=False)
            
            y_pred = model.predict(X_val)
            f1 = f1_score(y_val, y_pred)
            
            if f1 > best_score:
                best_score = f1
                best_params = params
        
        # 2단계: 최적 파라미터 주변 더 자세히 탐색
        refined_param_grid = {}
        for param, value in best_params.items():
            if param in ['max_depth', 'scale_pos_weight']:
                refined_param_grid[param] = [max(1, value - 1), value, value + 1]
            elif param in ['learning_rate', 'gamma', 'subsample', 'colsample_bytree']:
                refined_param_grid[param] = [max(0.01, value - 0.05), value, min(1.0, value + 0.05)]
            elif param in ['reg_lambda']:
                refined_param_grid[param] = [max(0, value - 2), value, value + 2]
        
        grid_search = GridSearchCV(
            XGBClassifier(objective='binary:logistic', n_estimators=100, random_state=42),
            refined_param_grid,
            cv=min(5, len(X_train) // 20),  # 최소 20개 샘플 필요
            scoring='f1',
            n_jobs=-1
        )
        
        grid_search.fit(X_train, y_train)
        best_params = grid_search.best_params_
        model = grid_search.best_estimator_
    else:
        # 기본 모델 사용
        model = get_model()
        best_params = DEFAULT_MODEL_PARAMS
    
    # 최종 평가를 위한 데이터 분할
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 최종 모델 학습 (조기 종료 사용)
    if not use_grid_search:
        # 검증 세트 생성
        _, X_val, _, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42)
        model.fit(X_train, y_train, 
                eval_set=[(X_val, y_val)], 
                early_stopping_rounds=10, 
                eval_metric='auc',
                verbose=False)
    
    # 기본 평가 지표
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]  # 양성 클래스 확률
    
    # 주요 평가 지표 계산
    metrics = {}
    metrics['accuracy'] = float(model.score(X_test, y_test))
    metrics['precision'] = float(precision_score(y_test, y_pred, zero_division=0))
    metrics['recall'] = float(recall_score(y_test, y_pred, zero_division=0))
    metrics['f1_score'] = float(f1_score(y_test, y_pred, zero_division=0))
    
    # AUC-ROC (클래스가 하나만 있으면 계산 불가)
    if len(np.unique(y_test)) > 1:
        metrics['auc_roc'] = float(roc_auc_score(y_test, y_prob))
    else:
        metrics['auc_roc'] = None
    
    # 교차 검증 (최소 2개 클래스 필요)
    if len(np.unique(y)) > 1 and len(df) >= 50:
        cv_scores = cross_val_score(model, X, y, cv=min(5, len(df) // 10), scoring='f1')
        metrics['cv_f1_mean'] = float(np.mean(cv_scores))
        metrics['cv_f1_std'] = float(np.std(cv_scores))
    else:
        metrics['cv_f1_mean'] = None
        metrics['cv_f1_std'] = None
    
    # 혼동행렬 계산 (문자열로 변환하여 JSON 직렬화 가능하게)
    cm = confusion_matrix(y_test, y_pred)
    metrics['confusion_matrix'] = cm.tolist()
    
    # 혼동행렬에서 파생된 지표
    tn, fp, fn, tp = cm.ravel() if cm.size == 4 else (0, 0, 0, 0)
    metrics['true_negative'] = int(tn)
    metrics['false_positive'] = int(fp)
    metrics['false_negative'] = int(fn)
    metrics['true_positive'] = int(tp)
    
    # 모델 저장
    save_model(model)
    
    # 특성 중요도 계산 (변환 적용)
    feature_importance = {k: float(v) for k, v in zip(X.columns, model.feature_importances_)}
    
    # 학습 결과 반환 (최종 변환 적용)
    result = {
        'status': 'success',
        'metrics': metrics, # metrics 내부 값들은 이미 float/int/list로 변환됨
        'feature_importance': feature_importance,
        'training_samples': int(len(df)),
        'class_distribution': {
            'positive': int(pos_class_count),
            'negative': int(neg_class_count),
            'positive_ratio': float(pos_class_count / len(y)) if len(y) > 0 else 0.0
        },
        'feedback_approved': int(df[df['status'] == 'APPROVED'].shape[0]),
        'feedback_rejected': int(df[df['status'] == 'REJECTED'].shape[0]),
        'best_parameters': {k: (float(v) if isinstance(v, (np.float32, np.float64, np.floating)) else
                                (int(v) if isinstance(v, np.integer) else v))
                            for k, v in best_params.items()}
    }
    
    # 모델 학습 함수의 마지막에 추가
    from model_monitoring import save_metrics, send_alert
    import datetime

    # 모델 버전 정보 추가 (날짜 기반)
    model_version = datetime.datetime.now().strftime("%Y%m%d_%H%M")

    # 모니터링
    drift_result = save_metrics(metrics, version=model_version)
    send_alert(drift_result)
    
    return convert_numpy_types(result) # 최종 결과 전체에 변환 적용

# FixedExpenseDetector 클래스 구현
class FixedExpenseDetector:
    def __init__(self, amount_weight=0.15, date_weight=0.25,
                 persistence_weight=0.4, periodicity_weight=0.2,
                 rule_candidate_threshold=0.5):
        self.amount_weight = amount_weight
        self.date_weight = date_weight
        self.persistence_weight = persistence_weight
        self.periodicity_weight = periodicity_weight
        self.rule_candidate_threshold = rule_candidate_threshold

    def detect(self, transactions_df, enable_ml=False):
        """
        고정지출 감지 함수
        
        Args:
            transactions_df: 거래 데이터
            enable_ml: ML 모델을 적용할 수 있는 사용자인지
        """
        # 입력 데이터 전처리
        df = self._preprocess(transactions_df)

        # 가맹점별 그룹화
        merchant_groups = df.groupby('merchant')
        candidates = []

        for merchant, group in merchant_groups:
            # 최소 3회 이상 거래만 분석
            if len(group) < 3:
                continue

            # 월별 거래 그룹화
            group['month'] = group['date'].dt.to_period('M')
            monthly_counts = group.groupby('month').size()

            # 월별 평균 거래 횟수가 1.5 초과면 제외
            if len(group) / len(monthly_counts) > 1.5:
                continue

            # 각 점수 계산
            amount_score = self._calculate_amount_score(group)
            date_score = self._calculate_date_score(group)
            persistence_score = self._calculate_persistence_score(group)
            periodicity_score = self._calculate_periodicity_score(group)

            # 규칙 기반 총점
            rule_score = (amount_score * self.amount_weight +
                          date_score * self.date_weight +
                          persistence_score * self.persistence_weight +
                          periodicity_score * self.periodicity_weight)

            # --- 1단계: 규칙 기반 필터링 ---
            if rule_score < self.rule_candidate_threshold:
                continue # 임계값 미만이면 후보에서 제외하고 다음 그룹으로
            # -------------------------------

            # 거래 ID 생성 (가맹점명 + 계좌ID 조합)
            account_id = int(group['accountId'].iloc[0]) if 'accountId' in group.columns else 'unknown'
            transaction_id = f"{merchant}_{account_id}"
            
            # --- 2단계: ML 모델 예측 (후보 그룹에 대해서만) ---
            is_fixed_expense = False # 기본값은 False
            ml_prediction = False
            ml_confidence = 0.0
            use_ml_model = False
            features = {} # features 딕셔너리 초기화

            try:
                model = get_model()
                if MODEL_TRAINED:
                    use_ml_model = True
                    # ML 모델 입력 특성 계산
                    base_features = {
                        'amountScore': amount_score,
                        'dateScore': date_score,
                        'persistenceScore': persistence_score,
                        'transactionCount': len(group),
                        'avgInterval': self._calculate_avg_interval(group),
                    }
                    advanced_features = self._extract_advanced_features(group)
                    features = {**base_features, **advanced_features, 'transactionId': transaction_id, 'accountId': account_id}
                    
                    # 특성 확인 및 누락된 특성 추가
                    required_features = ['amountScore', 'dateScore', 'persistenceScore', 'transactionCount',
                                        'avgInterval',          'weekendRatio', 'intervalStd', 'intervalCv',
                                        'continuityRatio', 'amountTrendSlope', 'amountTrendR2']
                    features_for_model = {k: features.get(k, 0.0) for k in required_features}
                    X = pd.DataFrame([features_for_model])
                    
                    # ML 예측 수행 및 최종 판단
                    ml_prediction = bool(model.predict(X)[0])
                    is_fixed_expense = ml_prediction # ML 예측 결과를 최종 판단으로 사용
                    
                    # 신뢰도 계산 (결과 저장용)
                    proba = model.predict_proba(X)[0]
                    ml_confidence = float(proba[1] if ml_prediction else proba[0])
                else:
                    # 학습된 모델이 없을 경우의 Fallback 처리
                    # 예: 규칙 점수가 특정 기준 이상이면 True (기존 로직과 유사하게)
                    is_fixed_expense = rule_score >= 0.55 # 또는 다른 기준 적용 가능
                    ml_prediction = is_fixed_expense # Fallback 결과를 ml_prediction에도 반영
                    # features 계산 (결과 저장용, 모델 없어도 기본 점수는 계산 가능)
                    base_features = {
                        'amountScore': amount_score,
                        'dateScore': date_score,
                        'persistenceScore': persistence_score,
                        'transactionCount': len(group),
                        'avgInterval': self._calculate_avg_interval(group),
                    }
                    advanced_features = self._extract_advanced_features(group) # 계산 시도
                    features = {**base_features, **advanced_features, 'transactionId': transaction_id, 'accountId': account_id}

            except Exception as e:
                print(f"ML 예측 또는 Fallback 오류: {e}")
                # 오류 발생 시 Fallback (예: 규칙 점수 기준)
                is_fixed_expense = rule_score >= 0.55
                ml_prediction = is_fixed_expense
                # features 계산 (오류 시에도 최대한 정보 남기기)
                try:
                    base_features = {
                        'amountScore': amount_score,
                        'dateScore': date_score,
                        'persistenceScore': persistence_score,
                        'transactionCount': len(group),
                        'avgInterval': self._calculate_avg_interval(group),
                    }
                    advanced_features = self._extract_advanced_features(group)
                    features = {**base_features, **advanced_features, 'transactionId': transaction_id, 'accountId': account_id}
                except: # 특성 계산 중 오류 시 빈 딕셔너리
                    features = {'transactionId': transaction_id, 'accountId': account_id}
            # --------------------------------------------------

            # 최종적으로 고정 지출로 판단된 경우만 candidates 리스트에 추가
            if is_fixed_expense:
                # 기본 정보 계산
                avg_amount = group['amount'].mean()
                avg_day = int(round(group['date'].dt.day.mean()))
                latest_date = group['date'].max()
                # user_id 추출 로직 수정: features 딕셔너리에서 먼저 찾고, 없으면 group에서 찾음
                user_id_val = group['userId'].iloc[0] if 'userId' in group.columns and not group['userId'].empty else 'unknown'
                # account_id 추출 로직 수정
                account_id_val = group['accountId'].iloc[0] if 'accountId' in group.columns and not group['accountId'].empty else 'unknown'

                # features 딕셔너리 생성 및 값들 소수점 처리 (금액 관련만)
                base_features = {
                    'amountScore': amount_score, # 소수점 처리 제거
                    'dateScore': date_score, # 소수점 처리 제거
                    'persistenceScore': persistence_score, # 소수점 처리 제거
                    'transactionCount': len(group),
                    'avgInterval': self._calculate_avg_interval(group), # 소수점 처리 제거
                }
                advanced_features = self._extract_advanced_features(group) # 내부에서 amountTrendSlope만 round 처리됨
                features = {
                    **base_features,
                    **advanced_features,
                    'transactionId': transaction_id,
                    'accountId': account_id_val, # accountId 저장
                    'userId': user_id_val       # userId 저장
                }
                features = convert_numpy_types(features) # features 딕셔너리 내부 NumPy 타입 변환

                # 최종 후보 딕셔너리 생성 (소수점 처리 적용)
                candidate_data = {
                    'merchant': merchant,
                    'transactionId': transaction_id,
                    'amountScore': amount_score, # 소수점 처리 제거
                    'dateScore': date_score, # 소수점 처리 제거
                    'persistenceScore': persistence_score, # 소수점 처리 제거
                    'periodicityScore': periodicity_score, # 소수점 처리 제거
                    'totalScore': rule_score, # 소수점 처리 제거
                    'mlConfidence': ml_confidence, # 소수점 처리 제거
                    'averageAmount': round(avg_amount, 2), # 금액만 소수점 둘째 자리
                    'averageDay': avg_day,
                    'transactionCount': len(group),
                    'latestDate': latest_date.strftime('%Y-%m-%d'),
                    'accountId': account_id_val,
                    'userId': user_id_val,
                    'status': 'DETECTED',
                    'features': features,
                    'usingMlModel': use_ml_model,
                    'originalMerchant': group['original_merchant'].iloc[0] if 'original_merchant' in group.columns else merchant
                }

                # 최종 후보 딕셔너리 전체에 대해 NumPy 타입 변환 적용
                candidates.append(convert_numpy_types(candidate_data))

        # 최종 반환 전에 전체 candidates 리스트에 대해 변환 적용 (이중 확인)
        return convert_numpy_types(candidates)

    def _preprocess(self, df):
        # 필요한 필드가 있는지 확인
        required_fields = ['amount', 'merchant', 'date']
        if not all(field in df.columns for field in required_fields):
            raise ValueError(f"필수 필드 누락: {required_fields}")

        # 안전한 변환 코드
        df = df.copy()
        try:
            # 'format="mixed"'로 다양한 형식의 날짜 처리
            df['date'] = pd.to_datetime(df['date'], format='mixed')
        except Exception as e:
            # 실패 시 ISO 형식으로 시도
            try:
                df['date'] = pd.to_datetime(df['date'], format='ISO8601')
            except Exception as e2:
                print(f"날짜 변환 오류 2차: {e2}")
                # 마지막 대안: 에러 무시 옵션
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
                # NaT 값 확인 및 처리
                if df['date'].isna().any():
                    print(f"일부 날짜가 NaT로 변환됨: {df['date'].isna().sum()}개")
            
        # 가맹점 이름 정규화 (원본 저장)
        df['original_merchant'] = df['merchant']  # 원본 가맹점명 보존
        
        # 통신사 패턴
        kt_pattern = r'^KT\d+'
        df.loc[df['merchant'].str.match(kt_pattern, na=False), 'merchant'] = '휴대폰요금'
        skt_pattern = r'^SK[Tt]\d+'
        df.loc[df['merchant'].str.match(skt_pattern, na=False), 'merchant'] = '휴대폰요금'
        lgu_pattern = r'^LG[Uu]\+?\d+'
        df.loc[df['merchant'].str.match(lgu_pattern, na=False), 'merchant'] = '휴대폰요금'
        
        # 전기요금 패턴
        electric_patterns = [r'(?i)한국전력', r'(?i)KEPCO', r'(?i)전기요금', r'\(한전\).*', r'한전',
                          r'전기.*요금', r'.*전력공사.*']
        for pattern in electric_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '전기요금'
        
        # 가스요금 패턴
        gas_patterns = [r'(?i)도시가스', r'(?i)가스공사', r'(?i)가스요금', r'\(가스\).*', r'\(도시가스\).*',
                     r'가스.*요금', r'.*도시가스.*', r'.*가스공사.*']
        for pattern in gas_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '도시가스'
            
        # 수도요금 패턴
        water_patterns = [r'(?i)수도요금', r'(?i)상수도', r'(?i)하수도', r'(?i)수자원공사', r'\(수도\).*', r'\(상수도\).*',
                       r'수도.*요금', r'.*상수도.*', r'.*하수도.*', r'.*수자원.*']
        for pattern in water_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '수도요금'
            
        # 건강보험 패턴
        health_insurance_patterns = [r'(?i)국민건강보험', r'(?i)건강보험', r'(?i)건강보험공단', r'(?i)건강보험료', 
                                  r'\(건강보험\).*', r'.*건강.*보험.*', r'.*국민건강.*', r'.*건보.*', r'(?i)건강']
        for pattern in health_insurance_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '건강보험'
            
        # 보험료 패턴 - 괄호 패턴 추가
        insurance_patterns = [r'(?i)생명보험', r'(?i)손해보험', r'(?i)화재보험', r'(?i)자동차보험', 
                             r'(?i)삼성생명', r'(?i)한화생명', r'(?i)교보생명', r'(?i)현대해상',
                             r'(?i)메리츠화재', r'(?i)DB손해보험', r'(?i)KB손해보험',
                             r'\(보험\).*', r'\(생명\).*', r'\(손해\).*', r'\(화재\).*',
                             r'.*보험료.*', r'.*보험금.*', r'.*생명.*', r'.*화재.*', 
                             r'.*손해.*', r'.*자동차보험.*']
        for pattern in insurance_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '보험료'
            
        # 통신비 추가 패턴
        telecom_patterns = [r'(?i)통신', r'(?i)핸드폰', r'(?i)모바일', r'(?i)휴대폰', r'(?i)통신요금', 
                         r'(?i)휴대폰요금', r'(?i)모바일요금', r'(?i)KT', r'(?i)SK[Tt]', r'(?i)LG[Uu]']
        for pattern in telecom_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '휴대폰요금'
            
        # 인터넷 패턴 (별도 처리)
        internet_patterns = [r'(?i)인터넷', r'(?i)와이파이', r'(?i)WIFI', r'(?i)broadband', r'(?i)브로드밴드']
        for pattern in internet_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '인터넷'
        
        # 구독서비스 패턴
        netflix_pattern = r'(?i)넷플릭스|netflix'
        df.loc[df['merchant'].str.contains(netflix_pattern, regex=True, na=False), 'merchant'] = '넷플릭스'
        
        disney_pattern = r'(?i)디즈니\+|disney\+|디즈니플러스'
        df.loc[df['merchant'].str.contains(disney_pattern, regex=True, na=False), 'merchant'] = '디즈니플러스'
        
        watcha_pattern = r'(?i)왓챠|watcha'
        df.loc[df['merchant'].str.contains(watcha_pattern, regex=True, na=False), 'merchant'] = '왓챠'
        
        wavve_pattern = r'(?i)웨이브|wavve'
        df.loc[df['merchant'].str.contains(wavve_pattern, regex=True, na=False), 'merchant'] = '웨이브'
        
        # 음악 서비스
        music_patterns = [r'(?i)멜론|melon', r'(?i)지니|genie', r'(?i)스포티파이|spotify', r'(?i)유튜브뮤직|youtube music']
        music_services = {'(?i)멜론|melon': '멜론', '(?i)지니|genie': '지니', 
                        '(?i)스포티파이|spotify': '스포티파이', '(?i)유튜브뮤직|youtube music': '유튜브뮤직'}
        for pattern, service in music_services.items():
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = service
            
        # 클라우드 서비스
        cloud_patterns = {
            r'(?i)icloud|아이클라우드': '애플 클라우드',
            r'(?i)google (one|drive)|구글 (원|드라이브)': '구글 클라우드',
            r'(?i)onedrive|원드라이브': '마이크로소프트 클라우드'
        }
        for pattern, service in cloud_patterns.items():
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = service
            
        # 관리비/임대료 패턴
        management_patterns = [r'(?i)관리비', r'(?i)아파트', r'(?i)공동주택', r'.*관리.*', r'.*아파트.*', r'.*주택관리.*', r'.*관리사무소.*']
        for pattern in management_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '관리비'
            
        rent_patterns = [r'(?i)월세', r'(?i)임대료', r'(?i)전세금', r'.*월세.*', r'.*임대.*', r'.*전세.*']
        for pattern in rent_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '임대료'
            
        # 추가 공과금 패턴
        tax_patterns = [r'(?i)지방세', r'(?i)재산세', r'(?i)소득세', r'(?i)종합소득세', r'(?i)자동차세', r'(?i)취득세',
                      r'.*세금.*', r'.*세납부.*', r'.*지방세.*', r'.*국세.*']
        for pattern in tax_patterns:
            df.loc[df['merchant'].str.contains(pattern, regex=True, na=False), 'merchant'] = '세금'

        return df

    def _calculate_amount_score(self, df):
        # 금액 일관성 점수 계산
        if df['amount'].std() == 0 or df['amount'].mean() == 0:
            return 1.0

        cv = df['amount'].std() / df['amount'].mean()
        return max(0, 1 - min(cv, 1))

    def _calculate_date_score(self, df):
        # 날짜 일관성 점수 계산
        days = df['date'].dt.day
        day_clusters = {}

        for day in days:
            found = False
            for cluster_day in list(day_clusters.keys()):
                if abs(day - cluster_day) <= 3:
                    day_clusters[cluster_day] += 1
                    found = True
                    break
            if not found:
                day_clusters[day] = 1

        if not day_clusters:
            return 0.0

        max_cluster_size = max(day_clusters.values())
        return max_cluster_size / len(df)

    def _calculate_persistence_score(self, df):
        # 지속성 점수 계산
        first_date = df['date'].min()
        last_date = df['date'].max()

        # 기간이 너무 짧으면 점수 할인
        if (last_date - first_date).days < 45:  # 1.5개월 미만
            return 0.5

        first_month = pd.Period(first_date, freq='M')
        last_month = pd.Period(last_date, freq='M')
        expected_months = (last_month - first_month).n + 1

        actual_months = len(df['date'].dt.to_period('M').unique())

        return min(1.0, actual_months / expected_months)

    def _calculate_periodicity_score(self, df):
        # 주기성 점수 계산 (FFT 활용)
        if len(df) < 3:
            return 0.0

        date_range = pd.date_range(start=df['date'].min(), end=df['date'].max())
        ts = pd.Series(0, index=date_range)

        for date in df['date']:
            if date in ts.index:
                ts[date] = 1

        # FFT 계산
        fft_result = np.abs(fft(ts.values))
        fft_freqs = np.fft.fftfreq(len(ts))

        # DC 성분 제외
        fft_result[0] = 0

        # 주요 주파수 성분 찾기
        max_idx = np.argmax(fft_result)

        if max_idx > 0:
            period_days = 1 / abs(fft_freqs[max_idx])
            periodicity_strength = fft_result[max_idx] / len(df)

            # 월간 주기 (27~33일)인지 확인
            is_monthly = 27 <= period_days <= 33

            # 월간 주기면 가산점
            bonus = 0.3 if is_monthly else 0

            return min(1.0, periodicity_strength + bonus)
        else:
            return 0.0

    def _calculate_avg_interval(self, df):
        # 평균 거래 간격 계산
        dates = df['date'].sort_values().tolist()
        if len(dates) < 2:
            return 0.0

        total_days = 0
        for i in range(1, len(dates)):
            total_days += (dates[i] - dates[i - 1]).days

        return total_days / (len(dates) - 1)
    
    def _extract_advanced_features(self, group):
        """고급 특성 추출"""
        features = {}
        
        # 1. 시간적 패턴 특성
        group['dayofweek'] = group['date'].dt.dayofweek
        group['weekend'] = group['dayofweek'].apply(lambda x: 1 if x >= 5 else 0)
        group['quarter'] = group['date'].dt.quarter
        
        # 주중/주말 거래 비율 (주말 거래가 많으면 고정지출 가능성 낮음)
        weekend_ratio = group[group['weekend'] == 1].shape[0] / len(group)
        features['weekendRatio'] = weekend_ratio
        
        # 2. 사용자 행동 기반 특성
        # 해당 사용자의 다른 거래와 비교한 상대적 크기
        # user_id = group['userId'].iloc[0] # 이 부분은 고급 특성 추출인데, userId를 사용하지 않으므로 주석 처리하거나 관련 로직 제거
        account_id = group['accountId'].iloc[0]
        
        # 이 기능 구현을 위해 모든 거래에 대한 참조가 필요함
        # 데이터베이스나 캐시에서 사용자 평균 거래액을 가져와야 함
        # features['relative_to_user_avg'] = group['amount'].mean() / user_avg_transaction # userId가 없으면 이 특성은 계산 불가
        
        # 3. 시계열 특성
        # 거래일 간격의 표준편차 (낮을수록 고정지출 가능성 높음)
        dates = sorted(group['date'])
        if len(dates) >= 3: # 최소 3개의 날짜가 있어야 간격 계산 가능
            intervals = [(dates[i] - dates[i-1]).days for i in range(1, len(dates))]
            if intervals: # 간격 리스트가 비어있지 않은 경우에만 계산
                std_interval = np.std(intervals)
                mean_interval = np.mean(intervals)
                features['intervalStd'] = std_interval # 소수점 처리 제거
                features['intervalCv'] = std_interval / mean_interval if mean_interval > 0 else 0.0 # 소수점 처리 제거
            else:
                features['intervalStd'] = 0.0
                features['intervalCv'] = 0.0
        else:
            features['intervalStd'] = 0.0
            features['intervalCv'] = 0.0
        
        # 4. 연속성 특성 - 거래 누락 비율 (낮을수록 고정지출 가능성 높음)
        first_date = group['date'].min()
        last_date = group['date'].max()
        expected_count = (last_date.to_period('M') - first_date.to_period('M')).n + 1
        actual_count = len(group['date'].dt.to_period('M').unique())
        features['continuityRatio'] = actual_count / expected_count if expected_count > 0 else 0.0 # 소수점 처리 제거
        
        # 5. 금액 경향성 (Slope만 소수점 처리)
        if len(group) >= 3:
            amounts = group.sort_values('date')['amount'].values
            try:
                from scipy.stats import linregress
                # linregress는 최소 2개의 점이 필요
                if len(amounts) >= 2:
                    slope, _, rvalue, _, _ = linregress(range(len(amounts)), amounts)
                    features['amountTrendSlope'] = round(slope, 2) # 금액 경향 기울기만 소수점 둘째 자리
                    features['amountTrendR2'] = rvalue ** 2 # R2는 소수점 처리 제거
                else:
                    features['amountTrendSlope'] = 0.0
                    features['amountTrendR2'] = 0.0
            except ImportError:
                 print("scipy.stats.linregress 를 찾을 수 없습니다. 경향성 분석 건너뜀.")
                 features['amountTrendSlope'] = 0.0
                 features['amountTrendR2'] = 0.0
            except ValueError as e: # 데이터 부족 등 linregress 내부 오류 처리
                print(f"금액 경향성 계산 오류 (linregress): {e}")
                features['amountTrendSlope'] = 0.0
                features['amountTrendR2'] = 0.0
        else:
            features['amountTrendSlope'] = 0.0
            features['amountTrendR2'] = 0.0

        # 최종 반환 전에 features 딕셔너리 타입 변환 (NumPy 타입 변환은 유지)
        return convert_numpy_types(features)
