import pandas as pd
import numpy as np
from scipy.fft import fft
import pickle
import os
import re  # 정규식 모듈 추가

# 전역 변수 및 설정
MODEL_PATH = 'model/fixed_expense_model.pkl'
MODEL_TRAINED = os.path.exists(MODEL_PATH)

# 모델 로드 또는 새로 생성 함수
def get_model():
    global MODEL_TRAINED
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            MODEL_TRAINED = True
            return pickle.load(f)
    from sklearn.ensemble import RandomForestClassifier
    MODEL_TRAINED = False
    DEFAULT_MODEL_PARAMS = {
        'n_estimators': 200,
        'random_state': 42,
        'max_depth': 10,
        'min_samples_split': 4,
        'class_weight': 'balanced'
    }
    return RandomForestClassifier(**DEFAULT_MODEL_PARAMS)

# 모델 저장 함수
def save_model(model):
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)

# 모델 학습 함수
def train(data):
    import pandas as pd
    from sklearn.model_selection import train_test_split
    
    # 트랜잭션 데이터를 데이터프레임으로 변환
    df = pd.DataFrame(data['detectedFixedExpenses'])
    
    # 피드백 데이터가 부족한 경우 처리
    if len(df) < 10:
        return {'status': 'insufficient_data', 'samples': len(df)}
    
    # 모델 학습에 필요한 특성 선택
    X = df[['amountScore', 'dateScore', 'persistenceScore', 'transactionCount', 'avgInterval']]
    # 타겟 값 (고정지출 여부)
    y = df['isFixedExpense']
    
    # 모델 로드 또는 새로 생성
    model = get_model()
    
    # 데이터 분할 및 학습 로직 간소화
    # 데이터가 충분히 많은 경우에만 테스트 분할
    if len(df) >= 50:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        model.fit(X_train, y_train)
        accuracy = model.score(X_test, y_test)
    else:
        # 데이터가 적으면 전체 데이터로 학습하고 정확도는 계산하지 않음
        model.fit(X, y)
        accuracy = None
    
    # 모델 저장
    save_model(model)
    
    # 특성 중요도 계산
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    
    # 학습 결과 반환
    return {
        'status': 'success',
        'accuracy': accuracy,
        'feature_importance': feature_importance,
        'training_samples': len(df),
        'feedback_approved': int(df[df['status'] == 'APPROVED'].shape[0]),
        'feedback_rejected': int(df[df['status'] == 'REJECTED'].shape[0])
    }

# FixedExpenseDetector 클래스 구현
class FixedExpenseDetector:
    def __init__(self, amount_weight=0.15, date_weight=0.25,
                 persistence_weight=0.4, periodicity_weight=0.2):
        self.amount_weight = amount_weight
        self.date_weight = date_weight
        self.persistence_weight = persistence_weight
        self.periodicity_weight = periodicity_weight

    def detect(self, transactions_df, ml_enabled_user_ids=None):
        """
        고정지출 감지 함수
        
        Args:
            transactions_df: 거래 데이터
            ml_enabled_user_ids: ML 모델을 적용할 수 있는 사용자 ID 목록
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

            # 사용자 ID 추출
            user_id = int(group['userId'].iloc[0]) if 'userId' in group.columns else None
            
            # 거래 ID 생성 (가맹점명 + 계좌ID 조합)
            account_id = int(group['accountId'].iloc[0]) if 'accountId' in group.columns else 'unknown'
            transaction_id = f"{merchant}_{account_id}"
            
            # ML 모델 사용 가능한 경우
            ml_prediction = False
            ml_confidence = 0.0
            use_ml_model = False

            # ML 모델 입력 특성
            features = {
                'amountScore': amount_score,
                'dateScore': date_score,
                'persistenceScore': persistence_score,
                'transactionCount': len(group),
                'avgInterval': self._calculate_avg_interval(group),
                'transactionId': transaction_id,
                'userId': user_id,
                'accountId': account_id
            }

            # ML 모델 예측 시도 - 사용자별 피드백이 10개 이상인 경우에만
            try:
                model = get_model()
                # 해당 사용자에게 ML 모델 적용 가능 여부 확인
                # 자바에서 전달한 ML 적용 가능 사용자 목록 사용
                if MODEL_TRAINED and user_id and ml_enabled_user_ids and user_id in ml_enabled_user_ids:
                    use_ml_model = True
                    X = pd.DataFrame([{k: v for k, v in features.items() 
                                      if k not in ['transactionId', 'userId', 'accountId', 'status']}])
                    ml_prediction = bool(model.predict(X)[0])
                    proba = model.predict_proba(X)[0]
                    ml_confidence = float(proba[1] if ml_prediction else proba[0])
                else:
                    ml_prediction = rule_score >= 0.65
            except Exception as e:
                print(f"ML 예측 오류: {e}")
                ml_prediction = rule_score >= 0.65
            
            # 규칙 기반 점수를 0~1 사이로 정규화
            rule_probability = min(1.0, rule_score)
            
            # 조합된 확률 계산
            if use_ml_model:
                ml_weight = 0.7  # ML 모델의 가중치
                rule_weight = 0.3  # 규칙 기반의 가중치
                combined_probability = (ml_confidence * ml_weight) + (rule_probability * rule_weight)
            else:
                combined_probability = rule_probability
            
            # 최종 판단
            is_fixed_expense = combined_probability >= 0.55

            if is_fixed_expense:
                # 기본 정보 계산
                avg_amount = group['amount'].mean()
                avg_day = int(round(group['date'].dt.day.mean()))
                latest_date = group['date'].max()

                candidates.append({
                    'merchant': merchant,
                    'transactionId': transaction_id,
                    'amountScore': float(amount_score),
                    'dateScore': float(date_score),
                    'persistenceScore': float(persistence_score),
                    'periodicityScore': float(periodicity_score),
                    'totalScore': float(rule_score),
                    'mlConfidence': float(ml_confidence),
                    'averageAmount': float(avg_amount),
                    'averageDay': avg_day,
                    'transactionCount': int(len(group)),
                    'latestDate': latest_date.isoformat(),
                    'userId': user_id,
                    'accountId': account_id,
                    'status': 'DETECTED',
                    'features': features,
                    'usingMlModel': use_ml_model
                })

        return candidates

    def _preprocess(self, df):
        # 필요한 필드가 있는지 확인
        required_fields = ['amount', 'merchant', 'date']
        if not all(field in df.columns for field in required_fields):
            raise ValueError(f"필수 필드 누락: {required_fields}")

        # 데이터 타입 변환
        df = df.copy()
        if isinstance(df['date'].iloc[0], str):
            df['date'] = pd.to_datetime(df['date'])

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
