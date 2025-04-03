package com.barcode.honeykeep.pay.repository;

import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.dto.PayDto;
import com.barcode.honeykeep.pay.dto.PayRequest;

public interface PayRepository {

    boolean payment(UserId userId, PayDto payDto);
}
