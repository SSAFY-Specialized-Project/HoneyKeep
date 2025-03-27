package com.barcode.honeykeep.pocket.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pocket.dto.*;
import com.barcode.honeykeep.pocket.service.PocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/pockets")
@RequiredArgsConstructor
public class PocketController {
    
    private final PocketService pocketService;

    /**
     * 포켓 만들기
     * @param userId
     * @param pocketCreateRequest
     * @return
     */
    @Transactional
    @PostMapping
    public ResponseEntity<ApiResponse<PocketCreateResponse>> createPocket(
            @AuthenticationPrincipal UserId userId,
            @RequestBody PocketCreateRequest pocketCreateRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.createPocket(userId.value(), pocketCreateRequest)));
    }

    /**
     * 포켓 더모으기
     * @param userId
     * @param pocketId
     * @param pocketGatherRequest
     * @return
     */
    @Transactional
    @PatchMapping("/{pocketId}/add")
    public ResponseEntity<ApiResponse<PocketGatherResponse>> gatherPocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId,
            @RequestBody PocketGatherRequest pocketGatherRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.gatherPocket(userId.value(), pocketId, pocketGatherRequest)));
    }

    /**
     * 포켓 목록 조회
     * @param userId
     * @return
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PocketSummaryResponse>>> getAllPockets(@AuthenticationPrincipal UserId userId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.getAllPockets(userId.value())));
    }

    /**
     * 포켓 검색
     * @param userId
     * @param name
     * @return
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<PocketSummaryResponse>>> searchPockets(
            @AuthenticationPrincipal UserId userId,
            @RequestParam String name) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.searchPockets(userId.value(), name)));
    }

    /**
     * 포켓 상세 조회
     * @param userId
     * @param pocketId
     * @return
     */
    @GetMapping("/{pocketId}")
    public ResponseEntity<ApiResponse<PocketDetailResponse>> getPocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.getPocketDetail(userId.value(), pocketId)));
    }

    /**
     * 포켓 즐겨찾기 등록
     * @param userId
     * @param pocketId
     * @param pocketFavoriteRequest
     * @return
     */
    @Transactional
    @PatchMapping("/{pocketId}/favorite")
    public ResponseEntity<ApiResponse<PocketFavoriteResponse>> setFavoritePocket(
        @AuthenticationPrincipal UserId userId,
        @PathVariable Long pocketId,
        @RequestBody PocketFavoriteRequest pocketFavoriteRequest) {
        return ResponseEntity.ok()
        .body(ApiResponse.success(pocketService.setFavoritePocket(userId.value(), pocketId, pocketFavoriteRequest)));
}

    /**
     * 포켓 수정
     * @param userId
     * @param pocketId
     * @param pocketModifyRequest
     * @return
     */
    @Transactional
    @PutMapping("/{pocketId}")
    public ResponseEntity<ApiResponse<PocketUpdateResponse>> updatePocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId,
            @RequestBody PocketModifyRequest pocketModifyRequest) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.updatePocket(userId.value(), pocketId, pocketModifyRequest)));
    }

    /**
     * 포켓 삭제
     * @param userId
     * @param pocketId
     * @return
     */
    @Transactional
    @DeleteMapping("/{pocketId}")
    public ResponseEntity<ApiResponse<Void>> deletePocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {
        pocketService.deletePocket(userId.value(), pocketId);
        return ResponseEntity.ok()
                .body(ApiResponse.success("포켓이 성공적으로 삭제되었습니다.", null));
    }

    /**
     * 포켓 사용하기
     * @param userId
     * @param pocketId
     * @return
     */
    @Transactional
    @PatchMapping("/{pocketId}/use")
    public ResponseEntity<ApiResponse<PocketStatusResponse>> usePocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.usePocket(userId.value(), pocketId)));
    }

    /**
     * 포켓 사용완료 처리
     * @param userId
     * @param pocketId
     * @return
     */
    @Transactional
    @PatchMapping("/{pocketId}/complete")
    public ResponseEntity<ApiResponse<PocketStatusResponse>> completePocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.completePocket(userId.value(), pocketId)));
    }

    /**
     * 포켓 사용완료 취소
     * @param userId
     * @param pocketId
     * @return
     */
    @Transactional
    @PatchMapping("/{pocketId}/revert-completion")
    public ResponseEntity<ApiResponse<PocketStatusResponse>> revertCompletionPocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {
        return ResponseEntity.ok()
                .body(ApiResponse.success(pocketService.revertCompletionPocket(userId.value(), pocketId)));
    }
}