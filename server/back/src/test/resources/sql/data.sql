-- 1. 사용자(User) 데이터 삽입
INSERT INTO users (id, user_key, email, name, institution_code, identity_number, password, phone_number, created_at, updated_at, is_deleted)
VALUES
    (1, 'USER-0001', 'user1@example.com', '사용자1', '00100', '900101-1', '$2a$10$CApofgQByH34Y5lfEfidleo5a02pVRxO/ZoT8RNTPvCrA1mTlYVg2', '010-1111-1111', NOW(), NOW(), false),
    (2, 'USER-0002', 'user2@example.com', '사용자2', '00100', '900202-2', '$2a$10$dMDCjGN/Q652UApekR20.eBIDqo.P4F13xI3p/IAV0ovYamDWoYhu', '010-2222-2222', NOW(), NOW(), false),
    (3, 'USER-0003', 'user3@example.com', '사용자3', '00100', '900303-3', '$2a$10$4BL/j/AZKEU7KnTdngHNbu2..r5e37s3.3fZMeqSRskf5exwY51aG', '010-3333-3333', NOW(), NOW(), false);

-- 2. 은행(Bank) 데이터 삽입
INSERT INTO banks (code, name)
VALUES ('001', '테스트은행');

-- 3. 계좌(Account) 데이터 삽입
-- 각 계좌는 해당 사용자의 id와 은행 코드 '001'을 참조합니다.
INSERT INTO accounts (id, user_id, bank_code, account_name, account_number, account_expiry_date, account_balance, daily_transfer_limit, one_time_transfer_limit, last_transaction_date, is_deleted, created_at, updated_at)
VALUES
    (1, 1, '001', '계좌 A', 'A-0001', '2030-12-31', 10000.00, 10000.00, 10000.00, '2020-01-01', false, NOW(), NOW()),
    (2, 1, '001', '계좌 B', 'B-0001', '2030-12-31', 5000.00, 5000.00, 5000.00, '2020-01-01', false, NOW(), NOW()),
    (3, 2, '001', '계좌 C', 'C-0001', '2030-12-31', 8000.00, 8000.00, 8000.00, '2020-01-01', false, NOW(), NOW()),
    (4, 3, '001', '계좌 D', 'D-0001', '2030-12-31', 12000.00, 12000.00, 12000.00, '2020-01-01', false, NOW(), NOW());
