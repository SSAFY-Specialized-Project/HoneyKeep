package com.barcode.honeykeep.pocket.service;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.dto.PocketCrawlingResult;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.exception.PocketErrorCode;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.pocket.type.CrawlingStatusType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CrawlingService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PocketRepository pocketRepository;

    /**
     * 비동기 크롤링
     * @param uuid 크롤링 UUID
     * @param link 크롤링 할 상품 판매처 링크
     */
    @Async
    public void asyncCrawling(String uuid, String link) {

        PocketCrawlingResult pocketCrawlingResult;

        pocketCrawlingResult = crawling(link);

        // Redis에 크롤링 결과 업데이트
        redisTemplate.opsForValue().set("crawling:" + uuid, pocketCrawlingResult);
        log.info("크롤링 결과 Redis에 저장됨, UUID: {}", uuid);

        // 크롤링 완료 후, 같은 UUID를 가진 데이터가 postgresql에 있다면 update
        Optional<Pocket> existPocket = pocketRepository.findByCrawlingUuid(uuid);
        if (existPocket.isPresent()) {
            Pocket pocket = existPocket.get();

            // 수기 입력된 정보는 그대로 두고, 크롤링 된 값만 새로 업데이트
            pocket.update(null, null, pocketCrawlingResult.getProductName(), pocketCrawlingResult.getProductName(), new Money(pocketCrawlingResult.getProductPrice()), null, link, null, null, null, pocketCrawlingResult.getProductImgUrl());
            pocketRepository.save(pocket);
            redisTemplate.delete("crawling:" + uuid);
            log.info("비동기 크롤링 결과로 포켓(ID: {}) 업데이트 완료, UUID: {}", pocket.getId(), uuid);
        }
    }

    /**
     * 정해진 시간에 배치 처리로 모든 포켓 업데이트
     */
    @Transactional
    @Async
    public void batchCrawling() {
        List<Pocket> pockets = pocketRepository.findAll();

        for(Pocket pocket : pockets) {
            // 링크가 있는 경우만 업데이트 시도
            String link = pocket.getLink();

            if(link != null) {
                PocketCrawlingResult pocketCrawlingResult = crawling(link);
                pocket.update(null, null, pocketCrawlingResult.getProductName(),
                        pocketCrawlingResult.getProductName(), new Money(pocketCrawlingResult.getProductPrice()),
                        null, link, null, null, null,
                        pocketCrawlingResult.getProductImgUrl());
            }
            log.info("배치 크롤링 결과, 포켓(ID: {}) 업데이트", pocket.getId());
        }

        pocketRepository.saveAll(pockets);
        log.info("배치 크롤링 완료, 전체 포켓 업데이트");
    }

    /**
     * 링크를 받아 필요한 정보를 PocketCrawlingResult에 담아 반환
     */
    private PocketCrawlingResult crawling(String link) {
        // jsoup 크롤링
        Document doc;
        try {
            log.info("크롤링 시작, 링크: {}", link);
            doc = Jsoup.connect(link).get();
        } catch(IOException e) {
            log.error("크롤링 결과 처리 중 오류 발생, 링크: {} / 오류: {}", link, e.getMessage(), e);
            throw new CustomException(PocketErrorCode.CRAWLING_ERROR);
        }

        // 상품 이름, 상품 가격, 사진 url 크롤링
        // TODO: 크롤링 한 번에 안 되면 3번 정도 시도해서 다시 가져올 수 있도록 처리

        // product:price:amount 추출
        Element priceMeta = doc.select("meta[property=product:price:amount]").first();
        String productPriceText = priceMeta != null ? priceMeta.attr("content") : null;
        BigDecimal productPrice = null;

        if(productPriceText != null) {
            try {
                productPrice = new BigDecimal(productPriceText);
            } catch(NumberFormatException e) {
                log.error("상품 가격 파싱 실패, 가격 텍스트: {} / 오류: {}", productPriceText, e.getMessage(), e);
                throw new CustomException(PocketErrorCode.PRICE_PARSING_ERROR);
            }
        }

        // og:title 추출
        Element titleMeta = doc.select("meta#fbOgTitle[property=og:title]").first();
        String productName = titleMeta != null ? titleMeta.attr("content").replace(" - 사이즈 & 후기 | 무신사", "") : null;

        // og:image 추출
        Element imageMeta = doc.select("meta#fbOgImage[property=og:image]").first();
        String productImgUrl = imageMeta != null ? imageMeta.attr("content") : null;

        log.info("크롤링 결과 - 상품 이름: {}, 가격: {}, 이미지 URL: {}", productName, productPrice, productImgUrl);

        // 결과 객체 생성
        return PocketCrawlingResult.builder()
                .productName(productName)
                .productPrice(productPrice)
                .productImgUrl(productImgUrl)
                .link(link)
                .status(CrawlingStatusType.COMPLETED)
                .build();
    }
}
