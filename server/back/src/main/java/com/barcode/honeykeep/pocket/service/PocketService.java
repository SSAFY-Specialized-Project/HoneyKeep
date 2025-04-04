package com.barcode.honeykeep.pocket.service;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.service.AccountService;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.category.service.CategoryService;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.dto.*;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.exception.PocketErrorCode;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.pocket.type.CrawlingStatusType;
import com.barcode.honeykeep.pocket.type.PocketType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PocketService {

    private final PocketRepository pocketRepository;
    private final AccountService accountService;
    private final CategoryService categoryService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final CrawlingService crawlingService;

    /**
     * 포켓 생성
     */
    @Transactional
    public PocketCreateResponse createPocket(Long userId, PocketCreateRequest request) {

        Account account = accountService.getAccountById(request.account().getId());
        Category category = null;

        if (request.categoryId() != null) {
            category = categoryService.getCategoryById(request.categoryId());
        }

        boolean isActivated = !request.totalAmount().isGreaterThan(account.getAccountBalance());

        Pocket pocket = Pocket.builder()
                .account(account)
                .category(category)
                .name(request.name())
                .totalAmount(request.totalAmount())
                .savedAmount(request.savedAmount() != null ? request.savedAmount() : Money.zero())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .isFavorite(false)
                .type(PocketType.UNUSED)
                .isActivated(isActivated)
                .build();

        Pocket savedPocket = pocketRepository.save(pocket);

        return mapToPocketCreateResponse(savedPocket);
    }

    /**
     * 링크로 추가하여 포켓 생성
     * 링크를 입력하면 크롤링 실행
     */
    @Transactional
    public String createPocketWithLink(Long userId, String link) {
        // redis와 postgresql을 연결할 수 있는 식별자 저장
        String uuid = UUID.randomUUID().toString();
        log.info("링크로 포켓 생성 시작. UUID: {}, 링크: {}", uuid, link);

        // 초기 데이터 저장
        Map<String, Object> initialData = new HashMap<>();
        initialData.put("status", CrawlingStatusType.PENDING);
        redisTemplate.opsForValue().set("crawling:" + uuid, initialData);
        log.info("Redis에 초기 크롤링 상태(PENDING) 저장, UUID: {}", uuid);

        // 비동기 크롤링 시작
        log.info("비동기 크롤링 호출 시작, UUID: {}", uuid);
        crawlingService.asyncCrawling(uuid, link);
        log.info("비동기 크롤링 호출 완료, UUID: {}", uuid);

        return uuid;
    }

    /**
     * 링크 입력 후 사용자가 수기로 입력하는 정보 저장
     */
    @Transactional
    public Long saveManualInput(PocketManualRequest pocketManualRequest) {
        log.info("수기 입력 정보 저장 시작, 크롤링 UUID: {}", pocketManualRequest.getCrawlingUuid());

        // 계좌 조회
        Account account = accountService.getAccountById(pocketManualRequest.getAccount().getId());
        Category category = null;

        // 카테고리 조회
        if (pocketManualRequest.getCategoryId() != null) {
            category = categoryService.getCategoryById(pocketManualRequest.getCategoryId());
        }

        // 포켓 생성
        Pocket pocket = Pocket.builder()
                .account(account)
                .category(category)
                .name(null)
                .productName(null)
                .totalAmount(null)
                .savedAmount(Money.zero())
                .link(null)
                .startDate(pocketManualRequest.getStartDate())
                .endDate(pocketManualRequest.getEndDate())
                .isFavorite(false)
                .type(PocketType.UNUSED)
                .imgUrl(null)
                .crawlingUuid(pocketManualRequest.getCrawlingUuid())
                .build();

        Pocket savedPocket = pocketRepository.save(pocket);

        log.info("수기 입력으로 생성된 포켓 저장 완료. 포켓 ID: {}, 크롤링 UUID: {}",
                savedPocket.getId(), pocketManualRequest.getCrawlingUuid());

        // Redis에서 UUID로 크롤링 데이터 있는지 조회
        Object crawlingData = redisTemplate.opsForValue().get("crawling:" + pocketManualRequest.getCrawlingUuid());
        if (!(crawlingData instanceof HashMap)) {
            PocketCrawlingResult pocketCrawlingResult = (PocketCrawlingResult) crawlingData;

            if(pocketCrawlingResult == null) {
                throw new CustomException(PocketErrorCode.REDIS_SAVE_ERROR);
            }

            // 크롤링 완료된 데이터 업데이트
            if (pocketCrawlingResult.getStatus().equals(CrawlingStatusType.COMPLETED)) {
                String productName = pocketCrawlingResult.getProductName();
                BigDecimal productPrice = pocketCrawlingResult.getProductPrice();
                String productImgUrl = pocketCrawlingResult.getProductImgUrl();
                String link = pocketCrawlingResult.getLink();

                savedPocket.update(null, null, productName, productName, new Money(productPrice), null, link, null, null, null, productImgUrl);
                savedPocket = pocketRepository.save(savedPocket);
                redisTemplate.delete("crawling:" + pocketManualRequest.getCrawlingUuid());
                log.info("포켓(ID: {})에 크롤링 결과 업데이트 완료, UUID: {}", savedPocket.getId(), pocketManualRequest.getCrawlingUuid());
            } else {
                log.warn("크롤링 결과가 완료 상태가 아님, UUID: {}", pocketManualRequest.getCrawlingUuid());
            }
        }

        return savedPocket.getId();
    }

    /**
     * 배치 처리로 포켓 정보 업데이트
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void batchUpdate() {
        log.info("배치 크롤링 시작");
        crawlingService.batchCrawling();
        log.info("배치 크롤링 업데이트 성공적으로 완료됨");
    }

    /**
     * 포켓 더모으기 (금액 추가)
     */
    @Transactional
    public PocketGatherResponse gatherPocket(Long userId, Long pocketId, PocketGatherRequest request) {
        Pocket pocket = getPocketById(pocketId);

        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount(), userId);

        // 이전 금액 저장
        Long previousAmount = pocket.getSavedAmount().getAmountAsLong();
        Long addedAmount = request.savedAmount().getAmountAsLong();
        
        // 저장 금액 업데이트
        Money newSavedAmount = Money.of(previousAmount + addedAmount);
        pocket.updateSavedAmount(newSavedAmount);
        
        pocketRepository.save(pocket);
        
        return mapToPocketGatherResponse(pocket, previousAmount, addedAmount);
    }

    /**
     * 모든 포켓 조회
     */
    public List<PocketSummaryResponse> getAllPockets(Long userId) {
        List<Pocket> pockets = pocketRepository.findByAccountUserId(userId);
        return pockets.stream()
                .map(this::mapToPocketSummaryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 포켓 검색 (이름 기준)
     */
    public List<PocketSummaryResponse> searchPockets(Long userId, String name) {
        List<Pocket> pockets = pocketRepository.findByAccountUserIdAndNameContaining(userId, name);
        return pockets.stream()
                .map(this::mapToPocketSummaryResponse)
                .collect(Collectors.toList());
    }

    /**
     * 포켓 상세 조회
     */
    public PocketDetailResponse getPocketDetail(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount(), userId);
        return mapToPocketDetailResponse(pocket);
    }

    /**
     * 포켓 즐겨찾기 설정/해제
     */
    @Transactional
    public PocketFavoriteResponse setFavoritePocket(Long userId, Long pocketId, PocketFavoriteRequest request) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount(), userId);

        pocket.setFavorite(request.isFavorite());
        
        pocketRepository.save(pocket);
        
        return mapToPocketFavoriteResponse(pocket);
    }

    /**
     * 포켓 정보 수정
     */
    @Transactional
    public PocketUpdateResponse updatePocket(Long userId, Long pocketId, PocketModifyRequest request) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount(), userId);
        
        // 계좌 변경 시 조회
        Account account = pocket.getAccount();
        if (request.account() != null) {
            account = accountService.getAccountById(request.account().getId());
            // 변경하려는 계좌도 같은 사용자 소유인지 확인
            accountService.validateAccountOwner(account, userId);
        }
        
        // 카테고리 변경 시 조회
        Category category = pocket.getCategory();
        if (request.category() != null) {
            category = categoryService.getCategoryById(request.category().getId());
        }

        pocket.update(
            account,
            category,
            request.name(),
            request.productName(),
            request.totalAmount(),
            request.savedAmount(),
            request.link(),
            request.startDate(),
            request.endDate(),
            request.isFavorite(),
                request.imgUrl()
        );

        pocketRepository.save(pocket);
        
        return mapToPocketUpdateResponse(pocket);
    }

    /**
     * 포켓 삭제
     */
    @Transactional
    public void deletePocket(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        accountService.validateAccountOwner(pocket.getAccount(), userId);
        pocket.delete("사용자에 의한 삭제");
    }

    /**
     * 포켓 필터링 조회 (날짜 범위 포함)
     */
    public List<PocketSummaryResponse> getFilteredPockets(Long userId, PocketFilterRequest filterRequest) {
        // 기본 필터 적용 (카테고리, 타입, 즐겨찾기)
        List<Pocket> pockets = pocketRepository.findPocketsByBasicFilters(
                userId,
                filterRequest.categoryId(),
                filterRequest.type(),
                filterRequest.isFavorite()
        );

        // 날짜 필터 적용 (Java 코드에서 처리)
        List<Pocket> filteredPockets = pockets;

        // 두 날짜가 모두 제공된 경우에만 필터링
        if (filterRequest.startDate() != null && filterRequest.endDate() != null) {
            filteredPockets = pockets.stream()
                    .filter(pocket -> {
                        // 두 날짜 범위가 겹치는지 확인
                        LocalDateTime pocketStart = pocket.getStartDate();
                        LocalDateTime pocketEnd = pocket.getEndDate();

                        // null 체크
                        if (pocketStart == null || pocketEnd == null) {
                            return true; // 날짜가 없는 포켓은 포함
                        }

                        // 날짜 범위 겹침 확인
                        return !filterRequest.endDate().isBefore(pocketStart) &&
                                !filterRequest.startDate().isAfter(pocketEnd);
                    })
                    .toList();
        }

        // DTO로 변환
        return filteredPockets.stream()
                .map(this::mapToPocketSummaryResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * ID로 포켓 조회하는 헬퍼 메서드
     */
    private Pocket getPocketById(Long pocketId) {
        return pocketRepository.findById(pocketId)
                .orElseThrow(() -> new CustomException(PocketErrorCode.POCKET_NOT_FOUND));
    }
    
    /**
     * Pocket 엔티티를 PocketDetailResponse DTO로 변환
     */
    private PocketDetailResponse mapToPocketDetailResponse(Pocket pocket) {
        return PocketDetailResponse.builder()
                .id(pocket.getId())
                .accountId(pocket.getAccount().getId())
                .accountName(pocket.getAccount().getAccountName())
                .categoryId(pocket.getCategory() != null ? pocket.getCategory().getId() : null)
                .categoryName(pocket.getCategory() != null ? pocket.getCategory().getName() : null)
                .name(pocket.getName())
                .productName(pocket.getProductName())
                .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                .link(pocket.getLink())
                .imgUrl(pocket.getImgUrl())
                .startDate(pocket.getStartDate())
                .endDate(pocket.getEndDate())
                .isFavorite(pocket.getIsFavorite())
                .type(pocket.getType().getType())
                .isActivated(pocket.getIsActivated())
                .createdAt(pocket.getCreatedAt())
                .updatedAt(pocket.getUpdatedAt())
                .build();
    }

    /**
     * Pocket 엔티티를 PocketSummaryResponse DTO로 변환
     */
    private PocketSummaryResponse mapToPocketSummaryResponse(Pocket pocket) {
        return PocketSummaryResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .accountName(pocket.getAccount().getAccountName())
                .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                .type(pocket.getType().getType())
                .isActivated(pocket.getIsActivated())
                .isFavorite(pocket.getIsFavorite())
                .imgUrl(pocket.getImgUrl())
                .endDate(pocket.getEndDate())
                .build();
    }

    /**
     * Pocket 엔티티를 PocketCreateResponse DTO로 변환
     */
    private PocketCreateResponse mapToPocketCreateResponse(Pocket pocket) {
        return PocketCreateResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .accountId(pocket.getAccount().getId())
                .accountName(pocket.getAccount().getAccountName())
                .categoryId(pocket.getCategory().getId())
                .categoryName(pocket.getCategory().getName())
                .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                .imgUrl(pocket.getImgUrl())
                .startDate(pocket.getStartDate())
                .endDate(pocket.getEndDate())
                .isFavorite(pocket.getIsFavorite())
                .type(pocket.getType().getType())
                .isActivated(pocket.getIsActivated())
                .createdAt(pocket.getCreatedAt())
                .build();
    }

    /**
     * Pocket 엔티티를 PocketUpdateResponse DTO로 변환
     */
    private PocketUpdateResponse mapToPocketUpdateResponse(Pocket pocket) {
        return PocketUpdateResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .accountId(pocket.getAccount().getId())
                .accountName(pocket.getAccount().getAccountName())
                .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                .link(pocket.getLink())
                .startDate(pocket.getStartDate())
                .endDate(pocket.getEndDate())
                .isFavorite(pocket.getIsFavorite())
                .type(pocket.getType().getType())
                .updatedAt(pocket.getUpdatedAt())
                .build();
    }

    /**
     * Pocket 엔티티를 PocketFavoriteResponse DTO로 변환
     */
    private PocketFavoriteResponse mapToPocketFavoriteResponse(Pocket pocket) {
        return PocketFavoriteResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .isFavorite(pocket.getIsFavorite())
                .build();
    }

    /**
     * Pocket 엔티티를 PocketGatherResponse DTO로 변환 (이전 금액 정보 필요)
     */
    private PocketGatherResponse mapToPocketGatherResponse(Pocket pocket, Long previousAmount, Long addedAmount) {
        Long currentAmount = pocket.getSavedAmount().getAmountAsLong();
        Long totalAmount = pocket.getTotalAmount().getAmountAsLong();
        double progressPercentage = totalAmount > 0 ? (double) currentAmount / totalAmount * 100 : 0;
        
        return PocketGatherResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .previousAmount(previousAmount)
                .addedAmount(addedAmount)
                .currentAmount(currentAmount)
                .totalAmount(totalAmount)
                .progressPercentage(Math.min(progressPercentage, 100.0)) // 100%를 넘지 않도록
                .updatedAt(pocket.getUpdatedAt())
                .build();
    }

    /**
     * 포켓 사용 시작 처리
     * @param pocketId 사용 시작할 포켓 ID
     * @return 업데이트된 포켓 정보
     */
    @Transactional
    public PocketUpdateResponse startUsingPocket(Long pocketId) {
        Pocket pocket = getPocketById(pocketId);

        pocket.updateType(PocketType.USING);

        pocketRepository.save(pocket);

        return mapToPocketUpdateResponse(pocket);
    }

    /**
     * 포켓 사용 완료 처리
     * @param pocketId 결제에 사용된 포켓 ID
     * @return 업데이트된 포켓 정보
     */
    @Transactional
    public PocketUpdateResponse completePocketPayment(Long pocketId) {
        Pocket pocket = getPocketById(pocketId);

        pocket.updateType(PocketType.USED);

        pocketRepository.save(pocket);

        return mapToPocketUpdateResponse(pocket);
    }

    /**
     * 계좌 잔액에 따른 포켓 활성화 상태 업데이트
     */
    @Transactional
    public void updatePocketsActivationStatus(Long accountId) {
        // 계좌 조회
        Account account = accountService.getAccountById(accountId);
        Money currentBalance = account.getAccountBalance();

        // 해당 계좌에 속한 모든 포켓 조회
        List<Pocket> pockets = pocketRepository.findByAccountId(accountId);

        // 각 포켓의 활성화 상태 업데이트
        for (Pocket pocket : pockets) {
            boolean shouldBeActivated = !pocket.getTotalAmount().isGreaterThan(currentBalance);

            // 현재 상태와 다른 경우에만 업데이트
            if (pocket.getIsActivated() != shouldBeActivated) {
                log.info("포켓 활성화 상태 변경: ID={}, 이름={}, 이전 상태={}, 변경 후 상태={}",
                        pocket.getId(), pocket.getName(), pocket.getIsActivated(), shouldBeActivated);
                pocket.updateActivationStatus(shouldBeActivated);
                pocketRepository.save(pocket);
            }
        }
    }
}