import json
import os
import datetime
import numpy as np

# 성능 지표 저장 경로
MONITORING_PATH = 'monitoring/model_metrics.json'
ALERT_THRESHOLD = 0.1  # 성능 10% 이상 저하 시 알림

def save_metrics(metrics, version=None):
    """모델 성능 지표 저장"""
    os.makedirs(os.path.dirname(MONITORING_PATH), exist_ok=True)
    
    # 기존 데이터 로드
    history = {'metrics': []}
    if os.path.exists(MONITORING_PATH):
        with open(MONITORING_PATH, 'r') as f:
            history = json.load(f)
    
    # 새 지표 추가
    metrics_entry = {
        'timestamp': datetime.datetime.now().isoformat(),
        'version': version or 'unknown',
        'metrics': metrics
    }
    
    history['metrics'].append(metrics_entry)
    
    # 저장
    with open(MONITORING_PATH, 'w') as f:
        json.dump(history, f, indent=2)
    
    # 드리프트 감지 및 결과 반환
    return check_drift(history)

def check_drift(history):
    """성능 저하 감지"""
    if len(history['metrics']) < 2:
        return {'drift_detected': False}
    
    # 최근 2개 지표 비교
    current = history['metrics'][-1]['metrics']
    previous = history['metrics'][-2]['metrics']
    
    # 핵심 지표만 비교
    key_metrics = ['f1_score', 'precision', 'recall', 'auc_roc']
    degradation = {}
    
    for metric in key_metrics:
        if metric in current and metric in previous and current[metric] is not None and previous[metric] is not None:
            if current[metric] < previous[metric] * (1 - ALERT_THRESHOLD):
                degradation[metric] = {
                    'previous': previous[metric],
                    'current': current[metric],
                    'change': (current[metric] - previous[metric]) / previous[metric]
                }
    
    if degradation:
        return {
            'drift_detected': True,
            'degraded_metrics': degradation,
            'message': f"성능 저하 감지: {', '.join(degradation.keys())}"
        }
    
    return {'drift_detected': False}

def send_alert(drift_result):
    """성능 저하 알림 전송"""
    if drift_result['drift_detected']:
        # 로그에 기록
        with open('monitoring/alerts.log', 'a') as f:
            f.write(f"{datetime.datetime.now().isoformat()}: {drift_result['message']}\n")
        
        # 실제 환경에서는 여기에 이메일, Slack 메시지 등 추가
        print(f"[경고] {drift_result['message']}")