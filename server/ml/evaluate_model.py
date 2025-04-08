import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold # 데이터를 비율 맞춰 나눠주는 도구
from xgboost import XGBClassifier # fixed_expense_detector.py에서 사용하는 모델
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score # 평가 지표 계산 도구
import os # 모델 파라미터 가져오기 위함

# fixed_expense_detector.py 에 정의된 기본 파라미터 사용 (만약 다르다면 해당 파일 참조 필요)
# 또는 최적화된 파라미터를 사용하고 싶다면 해당 값을 직접 명시
DEFAULT_MODEL_PARAMS = {
    'objective': 'binary:logistic',
    'n_estimators': 100,
    'learning_rate': 0.1,
    'max_depth': 4,
    'gamma': 0.25,
    'reg_lambda': 10,
    'scale_pos_weight': 3, # 이 값은 데이터 불균형에 따라 조정될 수 있음
    'subsample': 0.9,
    'colsample_bytree': 0.5,
    'random_state': 42
}
print("라이브러리 및 기본 모델 파라미터 준비 완료.")


# --- 1. 데이터 불러오기 및 준비 --- #
# --- ▼▼▼ 사용자 입력 필요 ▼▼▼ ---
# 1. 라벨링된 568개 데이터가 있는 파일의 경로를 지정하세요.
data_path = 'data/detected_fixed_expenses.csv' # 예시 경로입니다. 실제 파일 경로로 수정하세요.

# 2. 실제 라벨(1=ACCEPTED, 0=REJECTED)이 저장된 컬럼 이름을 지정하세요.
label_column = 'status' # 예시 컬럼 이름입니다. 실제 컬럼 이름으로 수정하세요.

# 3. 모델 학습에 사용할 특성(feature) 컬럼 이름 목록을 지정하세요. (userId, accountId 제외)
#    fixed_expense_detector.py의 train 함수에서 사용한 특성 목록과 일치해야 합니다.
feature_columns = [
    'amount_score', 'date_score', 'persistence_score', 'transaction_count',
    'avg_interval', 'weekend_ratio', 'interval_std',
    'interval_cv', 'continuity_ratio', 'amount_trend_slope', 'amount_trendr2'
]
# --- ▲▲▲ 사용자 입력 필요 ▲▲▲ ---

print(f"데이터 파일 경로: {data_path}")
print(f"라벨 컬럼: {label_column}")
print(f"사용할 특성 컬럼: {feature_columns}")

try:
    # CSV 파일 읽기 시도, 존재하지 않는 파일 예외 처리
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"데이터 파일을 찾을 수 없습니다: {data_path}")
    data = pd.read_csv(data_path)
    print(f"데이터 로드 완료. 총 샘플 수: {len(data)}")
except FileNotFoundError as e:
    print(e)
    exit()
except Exception as e:
    print(f"오류: 데이터를 로드하는 중 문제가 발생했습니다: {e}")
    exit()

# 라벨 컬럼 존재 확인
if label_column not in data.columns:
    print(f"오류: 지정된 라벨 컬럼 '{label_column}'이 데이터 파일에 없습니다.")
    print(f"사용 가능한 컬럼: {data.columns.tolist()}")
    exit()

# 라벨 값 확인 및 변환 (이미 0/1 이라면 이 부분은 필요 없을 수 있음)
if data[label_column].dtype == 'object':
    print(f"라벨 컬럼 '{label_column}'을 0/1로 변환합니다 ('APPROVED'=1, 다른 값=0).")
    # 'APPROVED'가 아닌 모든 값을 0으로 처리 (REJECTED 포함)
    data[label_column] = data[label_column].apply(lambda x: 1 if str(x).upper() == 'APPROVED' else 0)
elif not data[label_column].isin([0, 1]).all():
    # 0/1이 아닌 값이 있을 경우 경고 (NaN 값 처리 포함)
    invalid_labels = data[~data[label_column].isin([0, 1]) & data[label_column].notna()]
    if not invalid_labels.empty:
        print(f"경고: 라벨 컬럼 '{label_column}'에 0 또는 1이 아닌 값이 포함되어 있습니다: {invalid_labels.unique().tolist()}")
    # NaN 값을 0 (Negative)으로 처리할지 결정 (또는 다른 값으로 대체)
    if data[label_column].isnull().any():
        print(f"경고: 라벨 컬럼 '{label_column}'에 NaN 값이 있습니다. 0으로 처리합니다.")
        data[label_column] = data[label_column].fillna(0)
    # 최종적으로 0/1 로 변환되었는지 재확인 후 데이터 타입 변환
    data[label_column] = data[label_column].astype(int)

# 특성(X)과 라벨(y) 분리
# 실제 데이터 파일에 존재하는 특성 컬럼만 사용하도록 필터링
available_features = [col for col in feature_columns if col in data.columns]
missing_features = set(feature_columns) - set(available_features)
if missing_features:
    print(f"경고: 정의된 특성 중 일부가 데이터 파일에 없습니다: {missing_features}")
    print(f"  사용 가능한 특성으로만 진행합니다: {available_features}")

if not available_features:
    print("오류: 사용할 수 있는 특성 컬럼이 데이터 파일에 하나도 없습니다. 컬럼 이름을 확인하세요.")
    exit()

X = data[available_features]
y = data[label_column]

print(f"특성(X)과 라벨(y) 분리 완료. X 형태: {X.shape}, y 형태: {y.shape}")

# --- 중요: 모델이 기대하는 카멜 케이스로 컬럼 이름 변경 ---
# 스네이크 케이스 -> 카멜 케이스 매핑 정의
camel_case_map = {
    'amount_score': 'amountScore',
    'date_score': 'dateScore',
    'persistence_score': 'persistenceScore',
    'transaction_count': 'transactionCount',
    'avg_interval': 'avgInterval',
    'weekend_ratio': 'weekendRatio',
    'interval_std': 'intervalStd',
    'interval_cv': 'intervalCv',
    'continuity_ratio': 'continuityRatio',
    'amount_trend_slope': 'amountTrendSlope',
    'amount_trendr2': 'amountTrendR2' # CSV 헤더의 'amount_trendr2'를 모델이 기대하는 'amountTrendR2'로
}

# 실제 사용 가능한 특성들에 대해서만 이름 변경 적용
X.rename(columns={k: v for k, v in camel_case_map.items() if k in X.columns}, inplace=True)
print("X 데이터프레임 컬럼 이름을 카멜 케이스로 변경 완료.")
print("변경된 X 컬럼:", X.columns.tolist())
# ----------------------------------------------------

# 클래스 분포 확인 (참고용)
pos_count = y.sum()
neg_count = len(y) - pos_count
print(f"클래스 분포: Positive(1)={pos_count}, Negative(0)={neg_count}")

# 데이터가 너무 적거나 한 클래스만 있는 경우 교차 검증 불가
if len(data) < 10 or pos_count == 0 or neg_count == 0:
    print("오류: 데이터가 너무 적거나 한 클래스만 존재하여 교차 검증을 수행할 수 없습니다.")
    exit()

# scale_pos_weight 값 업데이트 (데이터 불균형 고려)
calculated_scale_pos_weight = neg_count / pos_count
print(f"데이터 기반 scale_pos_weight 계산됨: {calculated_scale_pos_weight:.2f}")
# XGBoost 파라미터에 반영 (기존 값 덮어쓰기)
DEFAULT_MODEL_PARAMS['scale_pos_weight'] = calculated_scale_pos_weight
print(f"모델 파라미터 scale_pos_weight 업데이트: {DEFAULT_MODEL_PARAMS['scale_pos_weight']:.2f}")

# --- 2. 교차 검증 설정 및 실행 루프 --- #
k = 5 # k값 설정 (보통 5 또는 10)
# 데이터 수에 따라 k값 조정 (최소 2개 필요)
k = min(k, pos_count, neg_count)
if k < 2:
    print("오류: 각 클래스의 샘플 수가 너무 적어 교차 검증을 수행할 수 없습니다 (k < 2).")
    exit()
skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=42) # 비율 유지하며 k겹 분할기 생성

print(f"\n{k}-겹 교차 검증을 시작합니다...")

# 각 폴드의 성능 지표를 저장할 리스트
fold_accuracies = []
fold_precisions = []
fold_recalls = []
fold_f1s = []

# k겹 교차 검증 루프
for fold_num, (train_index, test_index) in enumerate(skf.split(X, y)):
    print(f"--- 폴드 {fold_num + 1}/{k} ---")

    # 1. 학습 데이터와 테스트 데이터 분리
    X_train, X_test = X.iloc[train_index], X.iloc[test_index]
    y_train, y_test = y.iloc[train_index], y.iloc[test_index]
    print(f"  학습 데이터: {len(X_train)}개, 테스트 데이터: {len(X_test)}개")

    # 2. 매 폴드마다 새로운 모델 생성 및 학습
    print("  새로운 XGBoost 모델 생성 및 학습 중...")
    # ※ 중요: 매번 새로운 모델 객체를 만듭니다.
    model = XGBClassifier(**DEFAULT_MODEL_PARAMS)
    model.fit(X_train, y_train)
    print("  학습 완료.")

    # 3. 테스트 데이터로 예측 수행
    y_pred_ml = model.predict(X_test)
    # y_prob_ml = model.predict_proba(X_test)[:, 1] # 필요시 확률값 사용 (예: AUC 계산)
    print("  테스트 데이터 예측 완료.")

    # 4. 성능 평가 및 저장 (Positive class = 1, 즉 'ACCEPTED' 또는 Positive 라벨 기준)
    acc = accuracy_score(y_test, y_pred_ml)
    prec = precision_score(y_test, y_pred_ml, pos_label=1, zero_division=0) # 1 예측 정확성
    rec = recall_score(y_test, y_pred_ml, pos_label=1, zero_division=0)    # 실제 1을 얼마나 잘 찾았나
    f1 = f1_score(y_test, y_pred_ml, pos_label=1, zero_division=0)      # 정밀도와 재현율의 조화 평균

    fold_accuracies.append(acc)
    fold_precisions.append(prec)
    fold_recalls.append(rec)
    fold_f1s.append(f1)

    print(f"  폴드 {fold_num + 1} 결과: 정확도={acc:.4f}, 정밀도={prec:.4f}, 재현율={rec:.4f}, F1={f1:.4f}")

print("\n교차 검증 완료.")


# --- 3. ML 모델 최종 성능 (평균) 계산 --- #
avg_ml_accuracy = np.mean(fold_accuracies)
avg_ml_precision = np.mean(fold_precisions)
avg_ml_recall = np.mean(fold_recalls)
avg_ml_f1 = np.mean(fold_f1s)

print("\n--- ML 모델 교차 검증 평균 성능 --- ")
print(f"평균 정확도 (Accuracy):     {avg_ml_accuracy:.4f}")
print(f"평균 정밀도 (Precision):    {avg_ml_precision:.4f}  <- 모델이 ACCEPTED라고 한 것 중 진짜 비율")
print(f"평균 재현율 (Recall):       {avg_ml_recall:.4f}  <- 실제 ACCEPTED 중 모델이 맞춘 비율")
print(f"평균 F1 점수 (F1 Score):    {avg_ml_f1:.4f}  <- 정밀도와 재현율의 조화 평균")


# --- 4. 규칙 기반 시스템 성능 계산 --- #
# 규칙 기반 예측 생성 (모두 1로 예측)
y_pred_rule = np.ones_like(y) # y와 같은 크기의 배열을 만들고 모두 1로 채움

# 규칙 기반 성능 계산
rule_accuracy = accuracy_score(y, y_pred_rule)
rule_precision = precision_score(y, y_pred_rule, pos_label=1, zero_division=0)
rule_recall = recall_score(y, y_pred_rule, pos_label=1, zero_division=0)
rule_f1 = f1_score(y, y_pred_rule, pos_label=1, zero_division=0)

print("\n--- 규칙 기반 시스템 성능 --- ")
print(f"정확도 (Accuracy):     {rule_accuracy:.4f}")
print(f"정밀도 (Precision):    {rule_precision:.4f}  <- 규칙이 ACCEPTED라고 한 것 중 진짜 비율")
print(f"재현율 (Recall):       {rule_recall:.4f}  <- 실제 ACCEPTED 중 규칙이 맞춘 비율 (1.0 예상)")
print(f"F1 점수 (F1 Score):    {rule_f1:.4f}  <- 정밀도와 재현율의 조화 평균")


# --- 5. 최종 비교 결과 출력 --- #
print("\n================ 최종 비교 ================")
print(f"사용된 데이터: {len(data)}개 ({k}-겹 교차 검증)")
print("--------------------------------------------")
print("| 성능 지표      | ML 모델 (평균) | 규칙 기반 |")
print("|----------------|----------------|-----------|")
print(f"| 정확도         | {avg_ml_accuracy:.4f}       | {rule_accuracy:.4f}  |")
print(f"| 정밀도         | {avg_ml_precision:.4f}       | {rule_precision:.4f}  |")
print(f"| 재현율         | {avg_ml_recall:.4f}       | {rule_recall:.4f}  |")
print(f"| F1 점수        | {avg_ml_f1:.4f}       | {rule_f1:.4f}  |")
print("--------------------------------------------")
print("* 정밀도: 예측이 얼마나 정확한가 (모델이 ACCEPTED라고 한 것 중 진짜 비율)")
print("* 재현율: 실제 정답을 얼마나 잘 찾아내는가 (실제 ACCEPTED 중 모델이 맞춘 비율)")
print("* F1 점수: 정밀도와 재현율의 균형")
print("============================================") 