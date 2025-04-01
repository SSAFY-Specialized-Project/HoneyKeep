// pages/skeleton/AccountTransactionSkeleton.tsx
import React from "react";

const AccountTransactionSkeleton: React.FC = () => {
  // 스켈레톤 UI에 사용할 스타일
  const styles = {
    container: {
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#f7f7f7",
      position: "relative" as const,
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      position: "relative" as const,
      height: "24px",
    },
    accountCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    accountHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    bankIcon: {
      width: "36px",
      height: "36px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      marginRight: "12px",
      animation: "pulse 1.5s infinite",
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      width: "120px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
      animation: "pulse 1.5s infinite",
    },
    accountNumber: {
      width: "160px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    accountBalance: {
      width: "100px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginLeft: "auto",
      animation: "pulse 1.5s infinite",
    },
    accountDetail: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailLabel: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    detailValue: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      color: "#2196f3",
      animation: "pulse 1.5s infinite",
    },
    detailCount: {
      width: "24px",
      height: "16px",
      marginLeft: "4px",
      animation: "pulse 1.5s infinite",
    },
    tabHeader: {
      display: "flex",
      justifyContent: "space-between",
      borderBottom: "1px solid #e0e0e0",
      marginBottom: "16px",
    },
    tabLeft: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
      animation: "pulse 1.5s infinite",
    },
    tabRight: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
      animation: "pulse 1.5s infinite",
    },
    transactionItem: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    transactionDate: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    transactionTitle: {
      width: "140px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    transactionAmount: {
      width: "100px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    transactionFee: {
      width: "80px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginLeft: "auto",
      animation: "pulse 1.5s infinite",
    },
    submitButton: {
      height: "56px",
      borderRadius: "8px",
      backgroundColor: "#ffa726",
      marginTop: "auto",
      marginBottom: "16px",
      animation: "pulse 1.5s infinite",
    },
  };

  // CSS 애니메이션을 위한 스타일 태그
  const animationStyle = `
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.8; }
      100% { opacity: 0.6; }
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div style={styles.container}>
        {/* 헤더 부분 */}
        <div style={styles.header}>{/* 회색 네모 요소들 제거 */}</div>

        {/* 계좌 카드 */}
        <div style={styles.accountCard}>
          <div style={styles.accountHeader}>
            <div style={styles.bankIcon}></div>
            <div style={styles.accountInfo}>
              <div style={styles.accountName}></div>
              <div style={styles.accountNumber}></div>
            </div>
            <div style={styles.accountBalance}></div>
          </div>
          <div style={styles.accountDetail}>
            <div style={styles.detailLabel}></div>
            <div style={styles.detailValue}></div>
            <div style={styles.detailCount}></div>
          </div>
        </div>

        {/* 거래내역 탭 헤더 */}
        <div style={styles.tabHeader}>
          <div style={styles.tabLeft}></div>
          <div style={styles.tabRight}></div>
        </div>

        {/* 거래내역 목록 - 7개 반복 */}
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <div key={index} style={styles.transactionItem}>
              <div>
                <div style={styles.transactionDate}></div>
                <div style={styles.transactionTitle}></div>
              </div>
              <div style={{ textAlign: "right" as const }}>
                <div style={styles.transactionAmount}></div>
                <div style={styles.transactionFee}></div>
              </div>
            </div>
          ))}

        {/* 하단 버튼 */}
        <div style={styles.submitButton}></div>
      </div>
    </>
  );
};

export default AccountTransactionSkeleton;
