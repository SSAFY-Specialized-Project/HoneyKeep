import {Button} from "@/shared/ui";
import {useState} from "react";
import {FixedChoiceTab, FixedExpenseFound, FixedExpenseInfo, FixedExpenseTotal} from "@/entities/fixedExpense/ui";

const FixedPayList = () => {
    const [activeTab, setActiveTab] = useState("목록");

    // 더미 데이터
    const fixedPayItems = [
        {
            id: 1,
            title: "유튜브 프리미엄",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        },
        {
            id: 2,
            title: "유튜브 프리미엄",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        },
        {
            id: 3,
            title: "유튜브 프리미엄",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        }
    ];
    const detectedFixedPayItems = [
        {
            id: 1,
            title: "어 감지1번",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        },
        {
            id: 2,
            title: "어 감지2번",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        },
        {
            id: 3,
            title: "어 감지3번",
            paymentDate: "23",
            amount: 10900,
            monthCount: 4
        }
    ];

    const totalAmount = fixedPayItems.reduce((sum, item) => sum + item.amount, 0);

    const handleFixedPayDetail = () => {
        console.log("어 고정지출 상세야");
    }

    const handleFixedPayModify = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("어 고정지출 수정이야");
        event.stopPropagation(); // 이벤트 전파 중단
    }

    const handleFixedPayDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("어 고정지출 삭제야");
        event.stopPropagation(); // 이벤트 전파 중단
    }

    const handleDetectedFixedPayModify = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("어 발견된 고정지출 수정이야");
        event.stopPropagation(); // 이벤트 전파 중단
    }

    const handleDetectedFixedPayDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("어 발견된 고정지출 삭제야");
        event.stopPropagation(); // 이벤트 전파 중단
    }

    const handleDetectedFixedPayRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("어 발견된 고정지출 등록이야");
        event.stopPropagation(); // 이벤트 전파 중단
    }

    return (
        <div className="flex flex-col h-full bg-brand-background gap-5">
            {/* 내 고정지출 요약 */}
            <FixedExpenseTotal
                totalAmount={totalAmount}
                count={totalAmount}
            />

            {/* 탭 */}
            <FixedChoiceTab 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* 목록 내용 */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
                {activeTab === "목록" && fixedPayItems.map(item => (
                    <FixedExpenseInfo
                        key={item.id}
                        title={item.title}
                        paymentDate={item.paymentDate}
                        amount={item.amount}
                        monthCount={item.monthCount}
                        onClick={handleFixedPayDetail}
                        onModify={handleFixedPayModify}
                        onDelete={handleFixedPayDelete}
                    />
                ))}
                {activeTab === "발견" && detectedFixedPayItems.map(item => (
                    <FixedExpenseFound
                        key={item.id}
                        title={item.title}
                        paymentDate={item.paymentDate}
                        amount={item.amount}
                        monthCount={item.monthCount}
                        selectedAction={"register"}
                        onRegister={handleDetectedFixedPayRegister}
                        onModify={handleDetectedFixedPayModify}
                        onDelete={handleDetectedFixedPayDelete}
                    />
                ))}
            </div>

            {/* 추가 버튼 */}
            <div className="p-4">
                <Button
                    text="고정지출 추가하기"
                    disabled={false}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                />
            </div>
        </div>
    );
};

export default FixedPayList;
