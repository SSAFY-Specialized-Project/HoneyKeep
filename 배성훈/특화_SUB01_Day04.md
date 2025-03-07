### 고아 객체 제거 속성과 영속성 전이

---

- `CascadeType.ALL`과 `orphanRemoval = true`속성이 함께 많이 쓰인다.
    - 부모 엔티티를 통해 자식의 생명 주기를 완벽히 관리할 수 있기 때문에 굉장히 편리하다.
- 그러나 논리적 삭제를 하는 경우에는  orphanRemoval 속성을 사용할 수 없기 때문에, 부모 엔티티 제거시 자식 엔티티 제거를 직접 구현한다.

```java
@Getter
@MappedSuperclass
@Where(clause = "deleted = false") // 삭제되지 않은 데이터만 조회
public abstract class BaseSoftDeleteEntity extends BaseEntity {
		// 기존 필드들
		
    protected void delete(String deletedBy, String reason) {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
        this.deleteReason = reason;

        // 연관된 엔티티들도 삭제하는 메서드 호출 (오버라이딩 가능)
        cascadeSoftDelete(deletedBy, reason);
    }

		// 부모 엔티티 삭제시 자식 엔티티들도 삭제될 수 있도록 추상 메서드 제공
		// 삭제 로직이 필요한 엔티티는 이 메서드를 오버라이드하여 사용한다.
    protected void cascadeSoftDelete(String deletedBy, String reason) {
        // 자식 엔티티 삭제 로직을 오버라이드할 수 있도록 빈 메서드 제공
    }
}
```

### Builder 패턴

---

- **기본적으로 Builder 패턴을 고려한다.**
    - 공통 엔티티로 인해 컬럼이 많음
    - 필수값 제어가 쉽다
- 기본 생성자를 protected로 설정
- 컬렉션은 @Builder.Default로 초기화한다.
- 생성자에 `@Builder(access = AccessLevel.PRIVATE)` 를 달아서 필수값을 제어한다. 이때 접근제어자는 protected로 설정
- 필수값은 생성자에서 검증한다.
- 초기값이 필요한 필드는 생성자에서 세팅한다.

```java
@Entity
@Table(name = "accounts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseEntity {
    
    @Column(nullable = false, unique = true)
    private String accountNumber;  // 계좌번호56 
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // 계좌 소유주
    
    @Embedded
    @Column(nullable = false)
    private Money balance;  // 잔액
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status;  // 계좌 상태
    
    @OneToMany(mappedBy = "account")
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();  // 거래 내역
    
    @Builder
    protected Account(User user, String accountNumber, Money initialBalance) {
        // 필수값 검증
        if (user == null) throw new IllegalArgumentException("계좌 소유주는 필수입니다.");
        if (accountNumber == null || accountNumber.isBlank()) throw new IllegalArgumentException("계좌번호는 필수입니다.");
        if (initialBalance == null || initialBalance.isNegative()) throw new IllegalArgumentException("초기 잔액이 유효하지 않습니다.");
        
        this.user = user;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.status = AccountStatus.ACTIVE;  // 초기 상태는 활성
    }
}

// 사용 예시
Account account = Account.builder()
    .user(user)
    .accountNumber("1234-5678")
    .initialBalance(Money.of(BigDecimal.ZERO, Currency.KRW))
    .build();
```

### Value Object

---

- **원시값이나 문자열로 표현 가능한 중요 도메인에 대해서는 Value Object를 고려한다.**
    - 잔액, 계좌번호, 환율, 통화 등등…
    - **비즈니스 규칙이 중앙화됨**
- 엔티티에서 직접 처리하다가 더 복잡해지면 Value Object로 리팩토링 하는 것도 좋음.

**❌ Value Object 미사용 - 검증이 중복됨**

```java
@Entity
public class Account {
    private BigDecimal balance;
    
    public void withdraw(BigDecimal amount) {
        validateAmount(amount);  // 검증 1
        this.balance = this.balance.subtract(amount);
    }
}

@Entity
public class Payment {
    private BigDecimal amount;
    
    public void setAmount(BigDecimal amount) {
        validateAmount(amount);  // 검증 2
        this.amount = amount;
    }
}

@Entity
public class Transfer {
    private BigDecimal amount;
    
    public void execute(BigDecimal amount) {
        validateAmount(amount);  // 검증 3
        this.amount = amount;
    }
}
```

**✅ Value Object 사용**

```java
@Embeddable
public class Money {
    private BigDecimal amount;
    private Currency currency;
    
    // 검증은 한 번만 구현하면됨
    private void validateAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("금액은 0보다 커야 합니다.");
        }
        if (amount.scale() > 2) {
            throw new IllegalArgumentException("소수점 둘째자리까지만 허용됩니다.");
        }
    }
}

@Entity
public class Account {
    private Money balance;  // 검증된 값만 들어옴
}

@Entity
public class Payment {
    private Money amount;  // 여기도 안전
}
```

### 일급 컬렉션 사용

---

- 일급 컬렉션은 컬렉션을 래핑하고, 컬렉션과 관련된 동작을 수행하는 클래스.
- **컬렉션 필드에 대해서 복잡한 로직들이 적용이 된다면, 일급 컬렉션을 고려한다.**
- 간단한 CRUD만 수행하는 컬렉션에 대해서는 고려하지 않는다.

**❌ 일급 컬렉션 미사용**

```java
@Entity
public class Account {
    @OneToMany(mappedBy = "account")
    private List<Transaction> transactions = new ArrayList<>();
    
    // 입금 시
    public void deposit(BigDecimal amount) {
        // 1. 하루 입금 한도 체크
        BigDecimal todayTotal = transactions.stream()
            .filter(t -> t.getCreatedAt().toLocalDate().equals(LocalDate.now()))
            .filter(t -> t.getType() == TransactionType.DEPOSIT)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (todayTotal.add(amount).compareTo(new BigDecimal("50000000")) > 0) {
            throw new IllegalStateException("일일 입금 한도 초과");
        }
        
        // 2. 거래 추가
        transactions.add(new Transaction(amount, TransactionType.DEPOSIT));
    }
    
    // 출금 시
    public void withdraw(BigDecimal amount) {
        // 1. 하루 출금 한도 체크
        Money todayTotal = transactions.stream()
            .filter(t -> t.getCreatedAt().toLocalDate().equals(LocalDate.now()))
            .filter(t -> t.getType() == TransactionType.WITHDRAW)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (todayTotal.add(amount).compareTo(new BigDecimal("30000000")) > 0) {
            throw new IllegalStateException("일일 출금 한도 초과");
        }
        
        // 2. 잔액 체크
        Money balance = transactions.stream()
            .map(t -> t.getType() == TransactionType.DEPOSIT ? 
                 t.getAmount() : t.getAmount().negate())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
            
        if (balance.subtract(amount).compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException("잔액 부족");
        }
        
        // 3. 거래 추가
        transactions.add(new Transaction(amount, TransactionType.WITHDRAW));
    }
}
```

**✅ 일급 컬렉션 사용**

```java
@Embeddable
public class TransactionHistory {
    private static final BigDecimal DAILY_DEPOSIT_LIMIT = new BigDecimal("50000000");
    private static final BigDecimal DAILY_WITHDRAW_LIMIT = new BigDecimal("30000000");
    
    @OneToMany(mappedBy = "account")
    private final List<Transaction> transactions = new ArrayList<>();
    
    // 입금 관련 검증
    public void validateDeposit(BigDecimal amount) {
        BigDecimal todayDepositTotal = calculateTodayTotal(TransactionType.DEPOSIT);
        if (todayDepositTotal.add(amount).compareTo(DAILY_DEPOSIT_LIMIT) > 0) {
            throw new DailyDepositLimitExceededException();
        }
    }
    
    // 출금 관련 검증
    public void validateWithdrawal(BigDecimal amount) {
        validateDailyWithdrawLimit(amount);
        validateBalance(amount);
    }
    
    private void validateDailyWithdrawLimit(BigDecimal amount) {
        BigDecimal todayWithdrawTotal = calculateTodayTotal(TransactionType.WITHDRAW);
        if (todayWithdrawTotal.add(amount).compareTo(DAILY_WITHDRAW_LIMIT) > 0) {
            throw new DailyWithdrawLimitExceededException();
        }
    }
    
    private void validateBalance(BigDecimal withdrawAmount) {
        if (getBalance().subtract(withdrawAmount).compareTo(BigDecimal.ZERO) < 0) {
            throw new InsufficientBalanceException();
        }
    }
    
    // 특정 날짜의 특정 타입 거래 총액 계산
    private BigDecimal calculateTodayTotal(TransactionType type) {
        return transactions.stream()
            .filter(t -> t.getCreatedAt().toLocalDate().equals(LocalDate.now()))
            .filter(t -> t.getType() == type)
            .map(Transaction::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // 현재 잔액 계산
    public BigDecimal getBalance() {
        return transactions.stream()
            .map(t -> t.getType() == TransactionType.DEPOSIT ? 
                 t.getAmount() : t.getAmount().negate())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // 거래 추가
    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }
    
    // 거래 내역 조회 (불변 리스트로 반환)
    public List<Transaction> getTransactions() {
        return Collections.unmodifiableList(transactions);
    }
}

@Entity
public class Account {
    @Embedded
    private TransactionHistory transactionHistory;
    
    public void deposit(BigDecimal amount) {
        transactionHistory.validateDeposit(amount);
        transactionHistory.addTransaction(
            new Transaction(amount, TransactionType.DEPOSIT)
        );
    }
    
    public void withdraw(BigDecimal amount) {
        transactionHistory.validateWithdrawal(amount);
        transactionHistory.addTransaction(
            new Transaction(amount, TransactionType.WITHDRAW)
        );
    }
    
    public BigDecimal getBalance() {
        return transactionHistory.getBalance();
    }
}
```

### 최종 엔티티 예시

---

```java
@Entity
@Table(
    name = "accounts",
    indexes = {
        @Index(name = "idx_accounts_account_number", columnList = "account_number", unique = true),
        @Index(name = "idx_accounts_user_id", columnList = "user_id")
    }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseSoftDeleteEntity {  // 논리적 삭제 사용

    @Column(name = "account_number", nullable = false, unique = true, length = 20)
    private String accountNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Embedded
    @Column(nullable = false)
    private Money balance;  // Value Object 사용

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountStatus status;

    @Embedded
    private TransactionHistory transactionHistory;  // 일급 컬렉션 사용

    @OneToMany(mappedBy = "account", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Builder.Default
    private List<AccountHolder> accountHolders = new ArrayList<>();  // 컬렉션 즉시 초기화

    @Builder
    protected Account(User user, String accountNumber, Money initialBalance) {
        // 필수값 검증
        validateAccount(user, accountNumber, initialBalance);
        
        // 값 세팅
        this.user = user;
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.status = AccountStatus.ACTIVE;
        this.transactionHistory = new TransactionHistory();
    }

    // 검증 로직
    private void validateAccount(User user, String accountNumber, Money initialBalance) {
        if (user == null) {
            throw new IllegalArgumentException("계좌 소유주는 필수입니다.");
        }
        if (accountNumber == null || !accountNumber.matches("\\d{4}-\\d{4}-\\d{4}")) {
            throw new IllegalArgumentException("올바른 계좌번호 형식이 아닙니다.");
        }
        if (initialBalance == null || initialBalance.isNegative()) {
            throw new IllegalArgumentException("초기 잔액이 유효하지 않습니다.");
        }
    }

    // 비즈니스 메서드
    public void deposit(Money amount, String description) {
        validateAccountStatus();
        transactionHistory.validateDeposit(amount);
        
        this.balance = this.balance.add(amount);
        transactionHistory.addTransaction(
            Transaction.builder()
                      .account(this)
                      .amount(amount)
                      .type(TransactionType.DEPOSIT)
                      .description(description)
                      .build()
        );
    }

    public void withdraw(Money amount, String description) {
        validateAccountStatus();
        transactionHistory.validateWithdrawal(amount);
        
        this.balance = this.balance.subtract(amount);
        transactionHistory.addTransaction(
            Transaction.builder()
                      .account(this)
                      .amount(amount)
                      .type(TransactionType.WITHDRAW)
                      .description(description)
                      .build()
        );
    }

    public void addAccountHolder(AccountHolder holder) {
        accountHolders.add(holder);
        holder.setAccount(this);
    }

    // 상태 검증
    private void validateAccountStatus() {
        if (status != AccountStatus.ACTIVE) {
            throw new IllegalStateException("유효하지 않은 계좌 상태입니다.");
        }
    }

    // 논리적 삭제 오버라이드
    @Override
    protected void delete(String deletedBy, String reason) {
        validateAccountStatus();
        if (balance.isPositive()) {
            throw new IllegalStateException("잔액이 있는 계좌는 삭제할 수 없습니다.");
        }
        
        super.delete(deletedBy, reason);
        this.status = AccountStatus.CLOSED;
        
        // 연관 엔티티도 함께 삭제
        accountHolders.forEach(holder -> holder.delete(deletedBy, "계좌 삭제로 인한 보유자 정보 삭제"));
    }

    // Getter (필요한 것만 제공)
    public String getAccountNumber() {
        return accountNumber;
    }

    public Money getBalance() {
        return balance;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public List<Transaction> getTransactions() {
        return transactionHistory.getTransactions();
    }
}
```

사용 예시

```java
Account account = Account.builder()
    .user(user)
    .accountNumber("1234-5678-9012")
    .initialBalance(Money.of(BigDecimal.ZERO, Currency.KRW))
    .build();

account.deposit(Money.of(new BigDecimal("100000"), Currency.KRW), "급여");
account.withdraw(Money.of(new BigDecimal("50000"), Currency.KRW), "생활비");
```