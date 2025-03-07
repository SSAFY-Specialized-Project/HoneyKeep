## JPA Entity 컨벤션션

### 기본 설계 원칙

---

1. **JPA 표준 어노테이션 사용 (`javax.persistence` 또는 `jakarta.persistence`)**
    - Hibernate 전용 어노테이션(X) → JPA 표준(O)
    - 벤더 종속성이 최소화되어서, 유지보수성과 이식성이 높아짐
    - 현재는 Hibernate가 가장 인기 있지만, 이후 다른 구현체로 쉽게 전환이 가능
    - 우선 JPA 표준을 먼저 시도하고, 주로 성능 최적화가 필요할 경우 Hibernate 기능 활용 고려할 것
2. **Getter는 허용, Setter는 지양**
    - 값 변경이 필요한 경우 비즈니스 메서드로 제공
3. **`@Builder` 사용 시 생성자 공개 범위 제한**
    - `@AllArgsConstructor(access = AccessLevel.PROTECTED)`
4. **생성 시 ID 값 설정 금지** 
    - `@GeneratedValue` 사용
5. **연관관계 매핑 시 `mappedBy`, `cascade`, `fetch` 등 명확히 지정**
6. **기본 생성자 필수**
    - JPA가 내부적으로 리플렉션 사용
7. **`@EqualsAndHashCode`는 `id` 필드만 포함**
    - 순환참조 위험