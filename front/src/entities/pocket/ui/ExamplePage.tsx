import TransactionSuccess from '@/pages/pocket/TransactionSuccess';
import PocketSaveSuccess from '@/pages/pocket/PocketSaveSuccess';
import PaymentComplete from '@/pages/payment/PaymentComplete';

export default function ExampleTransactionSuccessPage() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <PocketSaveSuccess
        productImage="https://nb.scene7.com/is/image/NB/m992gr_nb_02_i?$pdpflexf2$&wid=880&hei=880"
        productName="필리핀 바나나"
        categoryName="과일"
        productLink="https://banana.com"
        percentage={10}
        amountSaved="11,600원"
        goalAmount="116,000원"
        targetDate="2025년 3월 15일"
        linkedAccount="우리은행 저축예금"
      />

      <TransactionSuccess
        merchantName="무신사 스토어"
        amountUsed={89000}
        productImage="https://nb.scene7.com/is/image/NB/m992gr_nb_02_i?$pdpflexf2$&wid=880&hei=880" // 예시 이미지
        productName="마르디 메크르디 스웨트셔츠"
        categoryName="패션/의류"
        productLink="https://store.musinsa.com/app/goods/3774364"
        totalSavedAmount={120000}
        usedDate="2025.04.02"
        accountName="신한은행 통장"
      />
      <PaymentComplete
        merchantName="스타벅스 역삼대로점"
        amount={5800}
        accountName="우리은행 저축예금"
      />
    </div>
  );
}
