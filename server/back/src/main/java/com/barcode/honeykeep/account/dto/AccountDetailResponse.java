package com.barcode.honeykeep.account.dto;

import com.barcode.honeykeep.pocket.entity.Pocket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailResponse {

    // 계좌 번호
    private String accountNumber;
    // 계좌 잔액 (Money 임베디드 객체에서 추출한 값)
    private BigDecimal accountBalance;

    //은행 이름
    private String bankName;

    //계좌 이름
    private String accountName;

    // 계좌에 연결된 모든 포켓들의 총 금액 (포켓의 totalAmount 합산)
    private BigDecimal totalPocketAmount;
    // 연동된 포켓들의 개수
    private int pocketCount;

    //연동된 포켓 목록
    private List<Pocket> pocketList;
}
