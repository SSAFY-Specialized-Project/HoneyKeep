package com.barcode.honeykeep.category.controller;

import com.barcode.honeykeep.category.dto.CategoryCreateRequest;
import com.barcode.honeykeep.category.dto.CategoryCreateResponse;
import com.barcode.honeykeep.category.dto.CategoryUpdateRequest;
import com.barcode.honeykeep.category.dto.CategoryUpdateResponse;
import com.barcode.honeykeep.category.service.CategoryService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
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
        return ResponseEntity.ok()
                .body(ApiResponse.success(categoryService.getAllCategories(userId.value())));
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
        return ResponseEntity.noContent()
                .build();
    }
}