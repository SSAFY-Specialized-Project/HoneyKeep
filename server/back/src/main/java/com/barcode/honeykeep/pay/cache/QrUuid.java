package com.barcode.honeykeep.pay.cache;

import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QrUuid {
    String uuid;
    Date createdAt;
    boolean isUsed;
}
