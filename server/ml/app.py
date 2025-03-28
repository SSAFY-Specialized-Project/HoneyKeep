from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from typing import List, Dict, Any, Optional
from fixed_expense_detector import FixedExpenseDetector, train

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
    ml_enabled_user_ids: Optional[List[int]] = None


# 고정지출 감지 엔드포인트
@app.post('/detect-fixed-expenses')
def detect_fixed_expenses(data: TransactionData):
    try:
        transactions = pd.DataFrame(data.transactions)
        detector = FixedExpenseDetector()
        
        # 자바 측에서 전달한 ML 적용 가능 사용자 ID 목록 사용
        candidates = detector.detect(transactions, data.ml_enabled_user_ids)
        return {"candidates": candidates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 학습 API
class TrainRequest(BaseModel):
    data: Dict[str, Any]


@app.post('/train')
def train_api(data: TrainRequest):
    try:
        # 요청 데이터 로깅
        expenses_count = len(data.data.get('detectedFixedExpenses', []))
        print(f"학습 요청 데이터 수신: {expenses_count}개 트랜잭션")

        # 자바에서 이미 APPROVED나 REJECTED 상태인 데이터만 보내고 있다고 가정
        print(f"자바에서 필터링된 피드백 데이터: {expenses_count}개")

        # 모델 학습 실행
        result = train(data.data)
        return result
    except Exception as e:
        print(f"학습 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
