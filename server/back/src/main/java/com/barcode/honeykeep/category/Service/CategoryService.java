package com.barcode.honeykeep.category.service;

import com.barcode.honeykeep.category.dto.CategoryCreateRequest;
import com.barcode.honeykeep.category.dto.CategoryCreateResponse;
import com.barcode.honeykeep.category.dto.CategoryUpdateRequest;
import com.barcode.honeykeep.category.dto.CategoryUpdateResponse;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.category.repository.CategoryRepository;
import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
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
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final PocketRepository pocketRepository;

    /**
     * 모든 카테고리 조회 (삭제되지 않은 카테고리만)
     * @param userId 인증된 사용자 ID (향후 사용자별 카테고리 분리 기능 구현 시 사용)
     */
    public List<CategoryCreateResponse> getAllCategories(Long userId) {

        List<Category> categories = categoryRepository.findByIsDeletedFalse();
        
        return categories.stream()
                .map(this::mapToCategoryCreateResponse)
                .collect(Collectors.toList());
    }

    /**
     * 특정 카테고리에 속한 모든 포켓 조회
     * @param userId 인증된 사용자 ID
     * @param categoryId 조회할 카테고리 ID
     * @return 포켓 요약 정보 리스트
     */
    public List<PocketSummaryResponse> getPocketsByCategory(Long userId, Long categoryId) {
        // 카테고리 존재 여부 확인
        Category category = getCategoryById(categoryId);

        // 포켓 리포지토리를 통해 해당 카테고리의 포켓 조회
        // 사용자 ID로 필터링하여 본인 소유의 포켓만 볼 수 있도록 함
        List<Pocket> pockets = pocketRepository.findByAccountUserIdAndCategory_IdAndIsDeletedFalse(userId, categoryId);

        // PocketSummaryResponse로 변환
        return pockets.stream()
                .map(pocket -> PocketSummaryResponse.builder()
                        .id(pocket.getId())
                        .name(pocket.getName())
                        .accountName(pocket.getAccount().getAccountName())
                        .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                        .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                        .type(pocket.getType().getType())
                        .isFavorite(pocket.getIsFavorite())
                        .endDate(pocket.getEndDate())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 생성
     * @param userId 인증된 사용자 ID (향후 사용자별 카테고리 분리 기능 구현 시 사용)
     * @param request 카테고리 생성 요청 데이터
     */
    @Transactional
    public CategoryCreateResponse createCategory(Long userId, CategoryCreateRequest request) {

        Category category = Category.builder()
                .name(request.name())
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        
        return mapToCategoryCreateResponse(savedCategory);
    }

    /**
     * 카테고리 수정
     * @param userId 인증된 사용자 ID (향후 사용자별 카테고리 분리 기능 구현 시 사용)
     * @param categoryId 수정할 카테고리 ID
     * @param request 카테고리 수정 요청 데이터
     */
    @Transactional
    public CategoryUpdateResponse updateCategory(Long userId, Long categoryId, CategoryUpdateRequest request) {

        Category category = getCategoryById(categoryId);
        
        category.updateName(request.name());
        
        return mapToCategoryUpdateResponse(category);

    }

    /**
     * 카테고리 삭제 (논리적 삭제)
     * @param userId 인증된 사용자 ID (향후 사용자별 카테고리 분리 기능 구현 시 사용)
     * @param categoryId 삭제할 카테고리 ID
     */
    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        
        Category category = getCategoryById(categoryId);
        
        // 카테고리 및 연관된 포켓들 논리적 삭제
        category.delete("사용자에 의한 삭제");
    }

    /**
     * ID로 카테고리 조회하는 헬퍼 메서드 (삭제되지 않은 카테고리만)
     */
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findByIdAndIsDeletedFalse(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 카테고리를 찾을 수 없습니다: " + categoryId));
    }
    
    /**
     * Category 엔티티를 CategoryCreateResponse DTO로 변환
     */
    private CategoryCreateResponse mapToCategoryCreateResponse(Category category) {
        return CategoryCreateResponse.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .build();
    }
    
    /**
     * Category 엔티티를 CategoryUpdateResponse DTO로 변환
     */
    private CategoryUpdateResponse mapToCategoryUpdateResponse(Category category) {
        return CategoryUpdateResponse.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .build();
    }
}