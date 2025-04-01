package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.pocket.type.CrawlingStatusType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PocketCrawlingResult {
    String productName;
    BigDecimal productPrice;
    String productImgUrl;
    String link;
    CrawlingStatusType status;
}
