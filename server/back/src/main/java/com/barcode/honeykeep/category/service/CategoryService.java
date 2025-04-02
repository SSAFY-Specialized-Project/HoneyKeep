package com.barcode.honeykeep.category.service;

import com.barcode.honeykeep.category.dto.CategoryCreateRequest;
import com.barcode.honeykeep.category.dto.CategoryCreateResponse;
import com.barcode.honeykeep.category.dto.CategoryUpdateRequest;
import com.barcode.honeykeep.category.dto.CategoryUpdateResponse;
import com.barcode.honeykeep.category.dto.CategoryWithPocketsResponse;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.category.repository.CategoryRepository;
import com.barcode.honeykeep.category.exception.CategoryErrorCode;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
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
        List<Category> categories = categoryRepository.findAll();
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
        Category category = getCategoryById(categoryId);
        List<Pocket> pockets = pocketRepository.findByAccountUserIdAndCategory_Id(userId, categoryId);
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
     * 모든 카테고리와 각 카테고리에 속한 포켓들을 함께 조회
     * @param userId 인증된 사용자 ID
     * @return 카테고리와 포켓 정보가 포함된 응답 리스트
     */
    public List<CategoryWithPocketsResponse> getAllCategoriesWithPockets(Long userId) {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(category -> {
                    List<Pocket> pockets = pocketRepository.findByAccountUserIdAndCategory_Id(userId, category.getId());

                    if (pockets == null || pockets.isEmpty()) {
                        return null;
                    }

                    List<PocketSummaryResponse> pocketResponses = pockets.stream()
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

                    return CategoryWithPocketsResponse.builder()
                            .categoryId(category.getId())
                            .name(category.getName())
                            .icon(category.getIcon())
                            .pockets(pocketResponses)
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * 카테고리 생성
     * @param userId 인증된 사용자 ID (향후 사용자별 카테고리 분리 기능 구현 시 사용)
     * @param request 카테고리 생성 요청 데이터
     */
    @Transactional
    public CategoryCreateResponse createCategory(Long userId, CategoryCreateRequest request) {

        // 요청 데이터 유효성 검증
        validateCategoryRequest(request);

        // 카테고리 이름 중복 검증
        validateCategoryNameDuplicate(request.name());

        Category category = Category.builder()
                .name(request.name())
                .icon(request.icon())
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

        // 요청 데이터 유효성 검증
        validateCategoryRequest(request);

        Category category = getCategoryById(categoryId);

        // 이름이 변경되었고 중복된 이름인 경우 검증
        if (!category.getName().equals(request.name())) {
            validateCategoryNameDuplicate(request.name());
        }

        category.update(request.name(), request.icon());
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
        category.delete("사용자에 의한 삭제");
    }

    /**
     * ID로 카테고리 조회하는 헬퍼 메서드 (삭제되지 않은 카테고리만)
     */
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(CategoryErrorCode.CATEGORY_NOT_FOUND));
    }

    /**
     * Category 엔티티를 CategoryCreateResponse DTO로 변환
     */
    private CategoryCreateResponse mapToCategoryCreateResponse(Category category) {
        return CategoryCreateResponse.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .build();
    }

    /**
     * Category 엔티티를 CategoryUpdateResponse DTO로 변환
     */
    private CategoryUpdateResponse mapToCategoryUpdateResponse(Category category) {
        return CategoryUpdateResponse.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .build();
    }

    /**
     * 카테고리 요청 데이터 유효성 검증
     * @param request 카테고리 요청 데이터 (생성 또는 수정)
     * @throws CustomException 유효성 검증 실패 시 발생
     */
    private void validateCategoryRequest(Object request) {
        // 요청 자체가 null인 경우
        if (request == null) {
            throw new CustomException(CategoryErrorCode.EMPTY_REQUEST_DATA);
        }

        String name = null;
        if (request instanceof CategoryCreateRequest) {
            name = ((CategoryCreateRequest) request).name();
        } else if (request instanceof CategoryUpdateRequest) {
            name = ((CategoryUpdateRequest) request).name();
        }

        // 이름이 null이거나 비어있는 경우
        if (name == null || name.trim().isEmpty()) {
            throw new CustomException(CategoryErrorCode.INVALID_CATEGORY_NAME);
        }
    }

    /**
     * 카테고리 이름 중복 검증
     * @param name 검증할 카테고리 이름
     * @throws CustomException 중복된 이름이 있을 경우 발생
     */
    private void validateCategoryNameDuplicate(String name) {
        List<Category> categories = categoryRepository.findAll();
        boolean isDuplicate = categories.stream()
                .anyMatch(category -> category.getName().equalsIgnoreCase(name));

        if (isDuplicate) {
            throw new CustomException(CategoryErrorCode.DUPLICATE_CATEGORY_NAME);
        }
    }
}