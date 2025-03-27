import pandas as pd
import numpy as np
from scipy.fft import fft
import pickle
import os


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
        'n_estimators': 100, 
        'random_state': 42,
        'max_depth': None,
        'min_samples_split': 2
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
    
    df = pd.DataFrame(data['transactions'])
    
    # 데이터 준비
    X = df[['amountScore', 'dateScore', 'persistenceScore', 'transactionCount', 'avgInterval']]
    y = df['isFixedExpense'].astype(bool)
    
    # 데이터가 충분한지 확인
    if len(df) < 10:
        return {'status': 'insufficient_data', 'samples': len(df)}
    
    # 모델 로드 또는 새로 생성
    model = get_model()
    
    # 데이터 분할 비율 조정
    test_size = 0.1 if len(df) < 50 else 0.2
    
    # 테스트 데이터 분리 (데이터가 충분한 경우)
    if len(df) >= 20:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )
        
        # 모델 학습
        model.fit(X_train, y_train)
        
        # 모델 평가
        accuracy = model.score(X_test, y_test)
    else:
        # 데이터가 적으면 전체 데이터로 학습
        model.fit(X, y)
        accuracy = None
    
    # 모델 저장
    save_model(model)
    
    # 특성 중요도 계산
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    
    return {
        'status': 'success', 
        'accuracy': accuracy,
        'feature_importance': feature_importance,
        'training_samples': len(df)
    }

# FixedExpenseDetector 클래스 구현
class FixedExpenseDetector:
    def __init__(self, amount_weight=0.25, date_weight=0.25,
                 persistence_weight=0.4, periodicity_weight=0.1):
        self.amount_weight = amount_weight
        self.date_weight = date_weight
        self.persistence_weight = persistence_weight
        self.periodicity_weight = periodicity_weight

    def detect(self, transactions_df):
        # 입력 데이터 전처리
        df = self._preprocess(transactions_df)

        # 가맹점별 그룹화
        merchant_groups = df.groupby('merchant')
        candidates = []
        ml_training_data = []

        for merchant, group in merchant_groups:
            # 최소 3회 이상 거래만 분석
            if len(group) < 3:
                continue

            # 월별 거래 그룹화
            group['month'] = group['date'].dt.to_period('M')
            monthly_counts = group.groupby('month').size()

            # 월별 평균 거래 횟수가 1.34 초과면 제외
            if len(group) / len(monthly_counts) > 1.34:
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

            # ML 모델 사용 가능한 경우
            ml_prediction = False
            ml_confidence = 0.0

            # ML 모델 입력 특성
            features = {
                'amountScore': amount_score,
                'dateScore': date_score,
                'persistenceScore': persistence_score,
                'transactionCount': len(group),
                'avgInterval': self._calculate_avg_interval(group)
            }

            # ML 모델 예측 시도
            try:
                model = get_model()
                if MODEL_TRAINED:
                    X = pd.DataFrame([features])
                    ml_prediction = bool(model.predict(X)[0])
                    proba = model.predict_proba(X)[0]
                    ml_confidence = float(proba[1] if ml_prediction else proba[0])
                else:
                    ml_prediction = rule_score >= 0.7
            except Exception as e:
                print(f"ML 예측 오류: {e}")
                ml_prediction = rule_score >= 0.7

            # ML 학습 데이터 수집
            training_data = dict(features)
            training_data['isFixedExpense'] = rule_score >= 0.7
            ml_training_data.append(training_data)

            # 최종 판단 (하이브리드 접근)
            is_fixed_expense = ml_prediction if MODEL_TRAINED else (rule_score >= 0.7)

            if is_fixed_expense:
                # 기본 정보 계산
                avg_amount = group['amount'].mean()
                avg_day = int(round(group['date'].dt.day.mean()))
                latest_date = group['date'].max()

                candidates.append({
                    'merchant': merchant,
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
                    'userId': int(group['userId'].iloc[0]) if 'userId' in group.columns else None,
                    'accountId': int(group['accountId'].iloc[0]) if 'accountId' in group.columns else None
                })

        # ML 모델 학습 데이터가 충분하면 학습 실행
        if len(ml_training_data) >= 10:
            try:
                train_data = {'transactions': ml_training_data}
                train(train_data)
            except Exception as e:
                print(f"ML 학습 오류: {e}")

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
                if abs(day - cluster_day) <= 5:
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

            # 월간 주기 (25~35일)인지 확인
            is_monthly = 25 <= period_days <= 35

            # 월간 주기면 가산점
            bonus = 0.2 if is_monthly else 0

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