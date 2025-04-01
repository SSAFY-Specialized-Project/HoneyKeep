package com.barcode.honeykeep.category.controller;

import com.barcode.honeykeep.category.dto.CategoryCreateRequest;
import com.barcode.honeykeep.category.dto.CategoryCreateResponse;
import com.barcode.honeykeep.category.dto.CategoryUpdateRequest;
import com.barcode.honeykeep.category.dto.CategoryUpdateResponse;
import com.barcode.honeykeep.category.dto.CategoryWithPocketsResponse;
import com.barcode.honeykeep.category.service.CategoryService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * 카테고리 목록 조회
     * @param userId
     * @return
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryCreateResponse>>> getAllCategories(@AuthenticationPrincipal UserId userId) {
        List<CategoryCreateResponse> categories = categoryService.getAllCategories(userId.value());

        return categories == null || categories.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No categories found", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success(categories));
    }

    /**
     * 카테고리별 포켓 목록 조회
     * @param userId 인증된 사용자
     * @param categoryId 카테고리 ID
     * @return 포켓 목록
     */
    @GetMapping("/{categoryId}/pockets")
    public ResponseEntity<ApiResponse<List<PocketSummaryResponse>>> getPocketsByCategory(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long categoryId) {
        List<PocketSummaryResponse> pockets = categoryService.getPocketsByCategory(userId.value(), categoryId);

        return pockets == null || pockets.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No pockets found in this category", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success(pockets));
    }

    /**
     * 모든 카테고리와 각 카테고리에 속한 포켓들을 함께 조회
     * @param userId 인증된 사용자
     * @return 카테고리와 포켓 정보가 포함된 응답 리스트
     */
    @GetMapping("/with-pockets")
    public ResponseEntity<ApiResponse<List<CategoryWithPocketsResponse>>> getAllCategoriesWithPockets(
            @AuthenticationPrincipal UserId userId) {
        List<CategoryWithPocketsResponse> response = categoryService.getAllCategoriesWithPockets(userId.value());

        return response == null || response.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No categories with pockets found", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success("모든 카테고리 및 모든 포켓 조회 성공", response));
    }

    /**
     * 카테고리 생성
     * @param userId
     * @param categoryCreateRequest
     * @return
     */
    @Transactional
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryCreateResponse>> createCategory(
            @AuthenticationPrincipal UserId userId,
            @RequestBody CategoryCreateRequest categoryCreateRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(categoryService.createCategory(userId.value(), categoryCreateRequest)));
    }

    /**
     * 카테고리 수정
     * @param userId
     * @param categoryId
     * @param categoryUpdateRequest
     * @return
     */
    @Transactional
    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryUpdateResponse>> updateCategory(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long categoryId,
            @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(categoryService.updateCategory(userId.value(), categoryId, categoryUpdateRequest)));
    }

    /**
     * 카테고리 삭제
     * @param userId
     * @param categoryId
     * @return
     */
    @Transactional
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long categoryId) {
        categoryService.deleteCategory(userId.value(), categoryId);
        return ResponseEntity.ok()
                .body(ApiResponse.success("카테고리가 성공적으로 삭제되었습니다.", null));
    }

}