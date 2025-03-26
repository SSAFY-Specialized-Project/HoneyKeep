from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

app = Flask(__name__)

MODEL_PATH = 'model/fixed_expense_model.pkl'
MODEL_TRAINED = os.path.exists(MODEL_PATH)

# app.py 최상단에 설정 추가
DEFAULT_MODEL_PARAMS = {
    'n_estimators': 100, 
    'random_state': 42,
    'max_depth': None,
    'min_samples_split': 2
}

# 모델 로드 또는 새로 생성
def get_model():
    global MODEL_TRAINED
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            MODEL_TRAINED = True
            return pickle.load(f)
    MODEL_TRAINED = False
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
def train():
    try:
        data = request.json
        df = pd.DataFrame(data['transactions'])
        
        # 데이터 형식 검증
        required_columns = ['amountScore', 'dateScore', 'persistenceScore', 
                          'transactionCount', 'avgInterval', 'isFixedExpense']
        
        if not all(col in df.columns for col in required_columns):
            return jsonify({
                'error': '필수 열이 누락되었습니다',
                'required': required_columns,
                'provided': list(df.columns)
            }), 400
        
        # 데이터 준비
        X = df[['amountScore', 'dateScore', 'persistenceScore', 'transactionCount', 'avgInterval']]
        y = df['isFixedExpense'].astype(bool)
        
        # 데이터가 충분한지 확인
        if len(df) < 10:
            return jsonify({
                'status': 'insufficient_data',
                'message': '학습을 위한 데이터가 충분하지 않습니다.',
                'samples': len(df)
            })
        
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
            y_pred = model.predict(X_test)
            report = classification_report(y_test, y_pred, output_dict=True)
        else:
            # 데이터가 적으면 전체 데이터로 학습
            model.fit(X, y)
            accuracy = None
            report = None
        
        # 모델 저장
        save_model(model)
        
        # 특성 중요도 계산
        feature_importance = dict(zip(X.columns, model.feature_importances_))
        
        return jsonify({
            'status': 'success', 
            'accuracy': accuracy,
            'feature_importance': feature_importance,
            'training_samples': len(df)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)