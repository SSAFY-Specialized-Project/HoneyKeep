package com.barcode.honeykeep.pocket.service;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.service.AccountService;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.category.service.CategoryService;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.dto.*;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.pocket.type.PocketType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PocketService {
    
    private final PocketRepository pocketRepository;
    private final AccountService accountService;
    private final CategoryService categoryService;

    /**
     * 포켓 생성
     */
    @Transactional
    public PocketCreateResponse createPocket(Long userId, PocketCreateRequest request) {
        // 계좌 조회 - AccountService 활용
        Account account = accountService.getAccountById(request.account().getId());

        // 카테고리 조회 - 필드가 있는 경우에만
        Category category = null;
        if (request.categoryId() != null) {
            category = categoryService.getCategoryById(request.categoryId());
        }

        // 포켓 생성
        Pocket pocket = Pocket.builder()
                .account(account)
                .category(category)
                .name(request.name())
                .productName(request.productName())
                .totalAmount(request.totalAmount())
                .savedAmount(request.savedAmount() != null ? request.savedAmount() : Money.zero())
                .link(request.link())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .isFavorite(false)
                .type(PocketType.GATHERING)
                .imgUrl(request.imgUrl())
                .build();

        Pocket savedPocket = pocketRepository.save(pocket);

        return mapToPocketCreateResponse(savedPocket);
    }

    /**
     * 포켓 더모으기 (금액 추가)
     */
    @Transactional
    public PocketGatherResponse gatherPocket(Long userId, Long pocketId, PocketGatherRequest request) {
        Pocket pocket = getPocketById(pocketId);
        
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
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
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        return mapToPocketDetailResponse(pocket);
    }

    /**
     * 포켓 즐겨찾기 설정/해제
     */
    @Transactional
    public PocketFavoriteResponse setFavoritePocket(Long userId, Long pocketId, PocketFavoriteRequest request) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        // 즐겨찾기 상태 설정 (Builder 패턴 대신 메서드 호출)
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
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        // 계좌 변경 시 조회
        Account account = pocket.getAccount();
        if (request.account() != null) {
            account = accountService.getAccountById(request.account().getId());
            // 변경하려는 계좌도 같은 사용자 소유인지 확인
            accountService.validateAccountOwner(account.getId(), userId);
        }
        
        // 카테고리 변경 시 조회
        Category category = pocket.getCategory();
        if (request.category() != null) {
            category = categoryService.getCategoryById(request.category().getId());
        }
        
        // 포켓 정보 업데이트
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
        
        // 변경된 객체 저장
        pocketRepository.save(pocket);
        
        return mapToPocketUpdateResponse(pocket);
    }

    /**
     * 포켓 삭제
     */
    @Transactional
    public void deletePocket(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        // 물리적 삭제 대신 논리적 삭제 사용
        pocket.delete("사용자에 의한 삭제");
    }

    /**
     * 포켓 사용하기 (상태 변경: GATHERING → USING)
     */
    @Transactional
    public PocketStatusResponse usePocket(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        String previousType = pocket.getType().getType();
        
        // Builder 대신 메서드 호출
        pocket.changeType(PocketType.USING);
        
        pocketRepository.save(pocket);
        
        return mapToPocketStatusResponse(pocket, previousType);
    }

   /**
     * 포켓 사용완료 처리 (상태 변경: USING → COMPLETED)
     */
    @Transactional
    public PocketStatusResponse completePocket(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        String previousType = pocket.getType().getType();
        
        // Builder 대신 메서드 호출
        pocket.changeType(PocketType.COMPLETED);
        
        pocketRepository.save(pocket);
        
        return mapToPocketStatusResponse(pocket, previousType);
    }

    /**
     * 포켓 사용완료 취소 (상태 변경: COMPLETED → USING)
     */
    @Transactional
    public PocketStatusResponse revertCompletionPocket(Long userId, Long pocketId) {
        Pocket pocket = getPocketById(pocketId);
        // 계좌 소유자 확인 - 보안상 추가
        accountService.validateAccountOwner(pocket.getAccount().getId(), userId);
        
        String previousType = pocket.getType().getType();
        
        // Builder 대신 메서드 호출
        pocket.changeType(PocketType.USING);
        
        pocketRepository.save(pocket);
        
        return mapToPocketStatusResponse(pocket, previousType);
    }
    
    /**
     * ID로 포켓 조회하는 헬퍼 메서드
     */
    private Pocket getPocketById(Long pocketId) {
        return pocketRepository.findByIdAndIsDeletedFalse(pocketId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 포켓을 찾을 수 없습니다: " + pocketId));
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
                .link(pocket.getLink())
                .imgUrl(pocket.getImgUrl())
                .startDate(pocket.getStartDate())
                .endDate(pocket.getEndDate())
                .isFavorite(pocket.getIsFavorite())
                .type(pocket.getType().getType())
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
     * Pocket 엔티티를 PocketStatusResponse DTO로 변환 (이전 상태 정보 필요)
     */
    private PocketStatusResponse mapToPocketStatusResponse(Pocket pocket, String previousType) {
        return PocketStatusResponse.builder()
                .id(pocket.getId())
                .name(pocket.getName())
                .type(pocket.getType().getType())
                .savedAmount(pocket.getSavedAmount().getAmountAsLong())
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
        Double progressPercentage = totalAmount > 0 ? (double) currentAmount / totalAmount * 100 : 0;
        
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
}