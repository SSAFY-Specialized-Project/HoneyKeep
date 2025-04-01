package com.barcode.honeykeep.pocket.service;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.dto.PocketCrawlingResult;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.pocket.type.CrawlingStatusType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CrawlingService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final PocketRepository pocketRepository;

    @Async
    public void asyncCrawling(String uuid, String link) {
        try {
            // jsoup 크롤링
            Document doc = Jsoup.connect(link).get();

            // 상품 이름, 상품 가격, 사진 url 크롤링
            // TODO: 크롤링 한 번에 안 되면 3번 정도 시도해서 다시 가져올 수 있도록 처리
            String productName = doc.select("span.sc-1omefes-1").text();
            BigDecimal productPrice = new BigDecimal(doc.select("span.sc-1hw5bl8-7").text().replaceAll("[^\\d.]", "").replace("원", ""));
            String productImgUrl = doc.select("img.sc-uxvjgl-8").attr("src");

            // 결과 객체 생성
            PocketCrawlingResult pocketCrawlingResult = PocketCrawlingResult.builder()
                    .productName(productName)
                    .productPrice(productPrice)
                    .productImgUrl(productImgUrl)
                    .link(link)
                    .status(CrawlingStatusType.COMPLETED)
                    .build();

            // Redis에 크롤링 결과 업데이트
            redisTemplate.opsForValue().set("crawling:" + uuid, pocketCrawlingResult);

            // 크롤링 완료 후, 같은 UUID를 가진 데이터가 postgresql에 있다면 update
            Optional<Pocket> existPocket = pocketRepository.findByCrawlingUuid(uuid);
            if (existPocket.isPresent()) {
                Pocket pocket = existPocket.get();

                // 수기 입력된 정보는 그대로 두고, 크롤링 된 값만 새로 업데이트
                pocket.update(null, null, productName, productName, null, null, link, null, null, null, productImgUrl);
                pocketRepository.save(pocket);
            }
        } catch (Exception e) {
            throw new CustomException(null);
        }
    }
}
