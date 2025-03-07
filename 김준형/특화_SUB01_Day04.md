# JPA

---

### 📌 **JPA 정리본**

### 1. **JPA 개념**

- Java Persistence API의 약자로, 자바에서 ORM(Object-Relational Mapping)을 제공하는 인터페이스.
- SQL을 직접 작성하지 않고 객체 중심으로 DB를 다룰 수 있게 해줌.
- Hibernate, EclipseLink 같은 구현체가 있음.

---

### 2. **JPA 주요 개념**

✅ **Entity**

- DB 테이블과 매핑되는 클래스.
- `@Entity`, `@Table(name="테이블명")` 사용.

✅ **Primary Key**

- `@Id` : 기본 키 설정.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`: 자동 증가 설정.

✅ **Column**

- `@Column(name = "컬럼명", nullable = false, length = 100)`: 컬럼 속성 설정.

✅ **연관관계 매핑**

- `@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany` 사용.
- `@JoinColumn(name = "컬럼명")`으로 외래 키 매핑.

---

### 3. **EntityManager**

- JPA의 핵심 객체로, 엔티티의 생명주기 관리.
- `persist()`, `merge()`, `remove()`, `find()` 메서드 제공.

```java
@EntityManager em = emf.createEntityManager();
em.getTransaction().begin();
em.persist(entity);
em.getTransaction().commit();
```

---

### 4. **Spring Data JPA**

✅ **JpaRepository**

- CRUD 기본 메서드 제공.
- `findBy필드명()`, `@Query`로 커스텀 쿼리 가능.

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
}
```

✅ **JPQL (Java Persistence Query Language)**

- SQL과 유사하지만, 테이블이 아닌 엔티티 기준으로 작성.

```java
@Query("SELECT u FROM User u WHERE u.name = :name")
List<User> findByUserName(@Param("name") String name);
```

✅ **페이징 & 정렬**

- `Pageable`과 `Sort` 사용.

```java
Page<User> findByAgeGreaterThan(int age, Pageable pageable);
List<User> findByNameContaining(String name, Sort sort);
```

---

### 5. **트랜잭션 관리**

- `@Transactional` 사용하여 한 단위로 처리.
- Spring Boot에서는 기본적으로 트랜잭션을 관리함.

---

### 6. **Lazy vs Eager Loading**

✅ **Lazy (지연 로딩)**

- 필요할 때 데이터를 가져옴 (`@ManyToOne(fetch = FetchType.LAZY)`).
- 성능 최적화에 도움.

✅ **Eager (즉시 로딩)**

- 연관된 엔티티를 한 번에 가져옴 (`@ManyToOne(fetch = FetchType.EAGER)`).
- 불필요한 데이터 로딩으로 성능 저하 가능.

---

### 7. **캐시와 영속성 컨텍스트**

- **1차 캐시**: 같은 트랜잭션 내에서는 같은 객체를 반환.
- **2차 캐시**: 애플리케이션 전반에서 캐싱 활용.

```java
User user1 = em.find(User.class, 1L);
User user2 = em.find(User.class, 1L); // 같은 트랜잭션에서는 캐시 사용
```