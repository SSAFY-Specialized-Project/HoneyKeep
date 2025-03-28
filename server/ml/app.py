from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from typing import List, Dict, Any, Optional
from fixed_expense_detector import FixedExpenseDetector, get_model, MODEL_TRAINED, train

app = FastAPI()

# 모델 파라미터 설정
DEFAULT_MODEL_PARAMS = {
    'n_estimators': 100,
    'random_state': 42,
    'max_depth': None,
    'min_samples_split': 2
}


# 헬스체크 엔드포인트
@app.get('/health')
def health():
    return "OK"


# 요청 데이터 모델 정의
class TransactionData(BaseModel):
    transactions: List[Dict[str, Any]]


# 고정지출 감지 엔드포인트
@app.post('/detect-fixed-expenses')
def detect_fixed_expenses(data: TransactionData):
    try:
        transactions = pd.DataFrame(data.transactions)
        detector = FixedExpenseDetector()
        candidates = detector.detect(transactions)
        return {"candidates": candidates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 예측 요청 데이터 모델
class PredictRequest(BaseModel):
    amountScore: float
    dateScore: float
    persistenceScore: float
    transactionCount: int
    avgInterval: float


# 예측 API
@app.post('/predict')
def predict(data: PredictRequest):
    # 입력 데이터 형식 검증
    required_features = ['amountScore', 'dateScore', 'persistenceScore', 'transactionCount', 'avgInterval']

    # 데이터프레임 변환
    features = pd.DataFrame([data.dict()])

    # 모델 로드 및 예측
    model = get_model()

    # 모델이 학습되지 않았으면 규칙 기반 결과 반환
    if not MODEL_TRAINED:
        # 규칙 기반 점수 계산
        total_score = float(data['amountScore']) + float(data['dateScore']) + float(data['persistenceScore'])
        return {
            'is_fixed_expense': total_score >= 0.75,
            'score': total_score,
            'model_status': 'not_trained'
        }

    # 학습된 모델로 예측
    prediction = bool(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    confidence = float(probabilities[1] if prediction else probabilities[0])

    return {
        'is_fixed_expense': prediction,
        'confidence': confidence,
        'model_status': 'trained'
    }


# 학습 API
class TrainRequest(BaseModel):
    data: Dict[str, Any]


@app.post('/train')
def train_api(data: TrainRequest):
    try:
        result = train(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
