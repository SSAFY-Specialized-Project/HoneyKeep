### 삭제 규칙

---

- **논리적 삭제(Soft Delete) 사용**
    - 금융 서비스 특성상(법적 요구사항, 데이터 복구, 데이터 분석 등) 논리적 삭제 사용
    - 단, 테이블 크기가 커지고 모든 조회 쿼리에 deleted 컬럼이 false 인지를 확인하는 where 절이 포함되므로 성능 저하가 발생한다.
- **아카이빙 전략을 함께 사용**
    - 삭제 로직이 있는 엔티티에서 `deleted = true`인 컬럼들은 아카이브 테이블로 옮긴다.
    - 아카이브 테이블로 옮겨진 컬럼들은 원래 엔티티의 Repository 에서 물리적 삭제 진행
    - 아카이브 서비스는 아카이브 테이블의 데이터를 스케쥴링을 통해 특정 시간에 완전한 물리적 삭제를 진행
- **엔티티 삭제 처리는 항상 `BaseSoftDeleteEntity`의 `delete()` 메서드를 사용**

### 복구 규칙

---

- 삭제 처리된 데이터를 복구하는 로직은 다음의 로직을 따른다.
1. 아카이브에서 데이터를 조회한다.
2. 원본 테이블로 복구 및 저장한다.
3. 해당 아카이브 데이터를 삭제한다. 

### ID 전략 규칙

---

- JPA에서 ID 전략은 보통 `IDENTITY`를 사용한다.
- `BaseEntity` 를 상속받은 하위 클래스는 id 필드를
- 대량 INSERT가 필요한 경우에는 UUID 전략 사용
    - `IDENTITY` 전략은 대량 INSERT 시 성능 저하 발생
    - 다른 DB 사용시 `SEQUENCE` 전략을 사용하면 되지만 ~~MySQL은 사용 불가능~~ → 8.0 이상부터 MySQL도 sequence 사용 가능

```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 50)
    private Long id;
    
    private String username;
}
```

### 인덱스 규칙

---

- 인덱스 명명 규칙: `idx_테이블명_컬럼명`
- 복합 인덱스 사용 시 카디널리티가 높은 컬럼을 앞에 배치한다.

```java
@Entity
@Table(
    name = "orders",
    indexes = {
        @Index(name = "idx_orders_created_at", columnList = "created_at"),
        @Index(name = "idx_orders_user_id", columnList = "user_id")
    }
)
public class Order extends BaseEntity {
    // ...
}
```

### 컬렉션 필드 초기화 규칙

---

- JPA는 `null`인 컬렉션을 관리하지 못하므로, 컬렉션은 반드시 필드에서 바로 초기화한다.
- `@Builder` 사용 시 `@Builder.Default` 필수

```java
@Entity
public class Order extends BaseEntity {
    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems = new ArrayList<>();  // 즉시 초기화

    @OneToMany(mappedBy = "order")
    @Builder.Default  // Builder 사용 시 필수
    private Set<OrderStatus> statusHistory = new LinkedHashSet<>();
}
```

### 영속성 전이(Cascade) 규칙

---

- **CascadeType은 반드시 상황에 따라 적절히 사용한다.**

| `CascadeType` 옵션 | 설명 |
| --- | --- |
| `ALL` | 아래 모든 옵션을 포함 (Persist, Merge, Remove, Refresh, Detach) |
| `PERSIST` | 부모 저장 시, 자식도 **자동 저장** (`entityManager.persist()`) |
| `MERGE` | 부모 수정 시, 자식도 **자동 수정** (`entityManager.merge()`) |
| `REMOVE` | 부모 삭제 시, 자식도 **자동 삭제** (`entityManager.remove()`) |
| `REFRESH` | 부모 새로고침 시, 자식도 **자동 새로고침** (`entityManager.refresh()`) |
| `DETACH` | 부모 detach 시, 자식도 **자동 detach** (`entityManager.detach()`) |
- **단, 논리적 삭제(Soft Delete)를 사용할 경우, `CascadeType.ALL`과 `CascadeType.REMOVE`는 사용할 수 없다.**
- **논리적 삭제에서의 영속성 전이를 `ALL`또는 `REMOVE`와 같은 효과로 사용하려면?**
    - 자신을 먼저 소프트 딜리트 한다.
    - 연관 엔티티들을 소프트 딜리트 한다.