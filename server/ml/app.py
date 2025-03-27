from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from fixed_expense_detector import FixedExpenseDetector, get_model, save_model, MODEL_TRAINED, train

app = Flask(__name__)

# 모델 파라미터 설정
DEFAULT_MODEL_PARAMS = {
    'n_estimators': 100, 
    'random_state': 42,
    'max_depth': None,
    'min_samples_split': 2
}

# 모델 로드 또는 새로 생성
def get_model():
    global MODEL_TRAINED
    if MODEL_TRAINED:
        return get_model()
    MODEL_TRAINED = True
    return RandomForestClassifier(**DEFAULT_MODEL_PARAMS)

# 모델 저장
def save_model(model):
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)

# 헬스체크 엔드포인트
@app.route('/health')
def health():
    return "OK"

# 고정지출 감지 엔드포인트
@app.route('/detect-fixed-expenses', methods=['POST'])
def detect_fixed_expenses():
    try:
        data = request.json
        if 'transactions' not in data:
            return jsonify({'error': '트랜잭션 데이터가 없습니다'}), 400

        transactions = pd.DataFrame(data['transactions'])

        detector = FixedExpenseDetector()
        candidates = detector.detect(transactions)

        return jsonify({
            'candidates': candidates
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 예측 API
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # 입력 데이터 형식 검증
    required_features = ['amountScore', 'dateScore', 'persistenceScore', 
                        'transactionCount', 'avgInterval']
    
    if not all(feature in data for feature in required_features):
        return jsonify({
            'error': '필수 특성이 누락되었습니다',
            'required': required_features
        }), 400
    
    # 데이터프레임 변환
    features = pd.DataFrame([{
        'amountScore': float(data['amountScore']),
        'dateScore': float(data['dateScore']),
        'persistenceScore': float(data['persistenceScore']),
        'transactionCount': int(data['transactionCount']),
        'avgInterval': float(data['avgInterval'])
    }])
    
    # 모델 로드 및 예측
    model = get_model()
    
    # 모델이 학습되지 않았으면 규칙 기반 결과 반환
    if not MODEL_TRAINED:
        # 규칙 기반 점수 계산
        total_score = float(data['amountScore']) + float(data['dateScore']) + float(data['persistenceScore'])
        return jsonify({
            'is_fixed_expense': total_score >= 0.75,
            'score': total_score,
            'model_status': 'not_trained'
        })
    
    # 학습된 모델로 예측
    prediction = bool(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    confidence = float(probabilities[1] if prediction else probabilities[0])
    
    return jsonify({
        'is_fixed_expense': prediction,
        'confidence': confidence,
        'model_status': 'trained'
    })

# 학습 API
@app.route('/train', methods=['POST'])
def train_api():
    try:
        data = request.json
        result = train(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)