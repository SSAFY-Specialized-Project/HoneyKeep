package com.barcode.honeykeep.pocket.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pocket.dto.*;
import com.barcode.honeykeep.pocket.service.PocketService;
import com.barcode.honeykeep.pocket.type.PocketType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
     * 사용자가 링크를 제출하면 UUID를 반환 (크롤링 API 호출)
     */
    @PostMapping("/link")
    public ResponseEntity<ApiResponse<PocketCreateWithLinkResponse>> submitLink(@AuthenticationPrincipal UserId userId,
                                                          @RequestBody PocketCrawlingRequest pocketCrawlingRequest) {
        String uuid = pocketService.createPocketWithLink(userId.value(), pocketCrawlingRequest.getLink());

        return ResponseEntity.ok().body(ApiResponse.success(PocketCreateWithLinkResponse.builder()
                .productUuid(uuid)
                .build()));
    }

    /**
     * 사용자가 링크 입력 후 수기 입력 데이터를 제출하면 Pocket 엔티티를 생성/업데이트하여 반환
     */
    @PostMapping("/link-input")
    public ResponseEntity<ApiResponse<PocketManualInputResponse>> submitManualInput(@RequestBody PocketManualRequest pocketManualRequest) {
        Long pocketId = pocketService.saveManualInput(pocketManualRequest);

        return ResponseEntity.ok().body(
                ApiResponse.success(PocketManualInputResponse.builder()
                        .pocketId(pocketId)
                        .build()
                )
        );
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
        List<PocketSummaryResponse> pockets = pocketService.getAllPockets(userId.value());

        return pockets == null || pockets.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No pockets found", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success(pockets));
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
        List<PocketSummaryResponse> pockets = pocketService.searchPockets(userId.value(), name);

        return pockets == null || pockets.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No pockets found with the given name", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success(pockets));
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
     * 포켓 필터링 조회
     * @param userId 인증된 사용자 ID
     * @param categoryId 카테고리 ID 필터 (선택 사항)
     * @param type 포켓 타입 필터 (선택 사항, GATHERING/USING/COMPLETED)
     * @param isFavorite 즐겨찾기 여부 필터 (선택 사항)
     * @param startDate 조회 시작 날짜 (yyyy-MM-dd 형식, 선택 사항)
     * @param endDate 조회 종료 날짜 (yyyy-MM-dd 형식, 선택 사항)
     * @return 필터링된 포켓 목록
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<PocketSummaryResponse>>> getFilteredPockets(
            @AuthenticationPrincipal UserId userId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isFavorite,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        // 문자열 타입을 enum으로 변환
        PocketType pocketType = null;
        if (type != null && !type.isEmpty()) {
            pocketType = PocketType.valueOf(type);
        }

        // 문자열 날짜를 LocalDateTime으로 변환
        LocalDateTime startDateTime = null;
        LocalDateTime endDateTime = null;

        if (startDate != null && !startDate.isEmpty()) {
            startDateTime = LocalDate.parse(startDate).atStartOfDay();
        }

        if (endDate != null && !endDate.isEmpty()) {
            endDateTime = LocalDate.parse(endDate).plusDays(1).atStartOfDay().minusNanos(1);
        }

        PocketFilterRequest filterRequest = new PocketFilterRequest(
                categoryId, pocketType, isFavorite, startDateTime, endDateTime);

        List<PocketSummaryResponse> pockets = pocketService.getFilteredPockets(userId.value(), filterRequest);

        return pockets == null || pockets.isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("No pockets found with the given filters", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success(pockets));
    }

    /**
     * 포켓 사용 시작 처리
     * @param pocketId 사용 시작할 포켓 ID
     * @return 업데이트된 포켓 정보
     */
    @Transactional
    @PatchMapping("/{pocketId}/start-using")
    public ResponseEntity<ApiResponse<PocketUpdateResponse>> startUsingPocket(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {

        PocketUpdateResponse response = pocketService.startUsingPocket(pocketId);

        return ResponseEntity.ok()
                .body(ApiResponse.success("포켓 사용중 처리 완료", response));
    }

    /**
     * 포켓 결제 완료 처리
     * @param pocketId 결제에 사용된 포켓 ID
     * @return 업데이트된 포켓 정보
     */
    @Transactional
    @PatchMapping("/{pocketId}/complete")
    public ResponseEntity<ApiResponse<PocketUpdateResponse>> completePocketPayment(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long pocketId) {

        PocketUpdateResponse response = pocketService.completePocketPayment(pocketId);

        return ResponseEntity.ok()
                .body(ApiResponse.success("포켓 사용완료 처리 성공", response));
    }
}