## JPA Entity 규칙

### 설계 컨벤션

---

| **항목** | **내용** |
| --- | --- |
| 클래스명 | 단수형 명사 사용(`User`, `Order`, `Product`) |
| 테이블명 | 복수형 명사 사용, `@Table(name = “users”)` |
| 기본 키(PK) | `@Id @GeneratedValue(strategy = GenerationType.IDENTITY)` |
| 기본 생성자 | `@NoArgsConstructor(access = AccessLevel.PROTECTED)` |
| Setter 사용 | X (대신 비즈니스 메서드 제공)  |
| Enum 저장 방식 | `@Enumerated(EnumType.STRING)` (ORDINAL 사용 )  |
| 날짜 필드 | `createdAt`, `updatedAt` (기본값 `LocalDateTime.now()`) |
| 테이블 컬럼 제약 조건 | `@Column(nullable = false, length = 50)` |
| 삭제 플래그 | `@Column(name = "deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")` |

### 연관관계 매핑

---

- 연관관계는 다대일 양방향을 통해 거의 모든 요구사항이 커버 가능하다.
- 일대다를 연관관계의 주인으로 사용 금지(성능 문제 있음)
- 지연 로딩(`FetchType.LAZY`) 사용 권장

```java
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 다대일 관계
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Builder
    public Order(User user) {
        this.user = user;
        this.orderDate = LocalDateTime.now();
    }

    // 연관관계 편의 메서드
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
}
```

### 공통 엔티티(BaseEntity) 분리

---

- 모든 엔티티가 공통으로 쓸 필드를 넣어놓을 공통 엔티티를 하나 구현할 것
- 모든 엔티티는 구현된 공통 엔티티(BaseEntity)를 상속하여 사용

```java
import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate; 
import org.springframework.data.annotation.LastModifiedDate; 
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Getter
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate  // JPA 표준
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // 생성 일자

    @LastModifiedDate  // JPA 표준
    @Column(nullable = false)
    private LocalDateTime updatedAt; // 수정 일자
}
```

- 삭제 규칙을 논리적 삭제로 한다면 삭제 관련 필드들도 공통 엔티티로 분리하는 것이 편하나, 성능 문제로 인해 삭제가 꼭 필요한 엔티티만 삭제용 공통 엔티티를 분리한다.
- 삭제 로직이 필요한 엔티티는 `BaseEntity` 대신 `BaseSoftDeleteEntity`를 상속받는다.

```java
@Getter
@MappedSuperclass
@Where(clause = "deleted = false")  // 삭제되지 않은 데이터만 조회
public abstract class BaseSoftDeleteEntity extends BaseEntity {

    @Column(name = "deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean deleted;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private String deletedBy;

    @Column(name = "delete_reason")
    private String deleteReason;

    protected void delete(String deletedBy, String reason) {
        this.deleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = deletedBy;
        this.deleteReason = reason;
    }

    protected void restore() {
        this.deleted = false;
        this.deletedAt = null;
        this.deletedBy = null;
        this.deleteReason = null;
    }
}
```