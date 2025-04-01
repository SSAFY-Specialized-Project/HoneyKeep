package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.pocket.type.CrawlingStatusType;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PocketCrawlingResult {
    String productName;
    BigDecimal productPrice;
    String productImgUrl;
    String link;
    CrawlingStatusType status;
}
