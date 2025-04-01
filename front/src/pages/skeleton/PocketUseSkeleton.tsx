// pages/skeleton/PocketUseSkeleton.tsx
import React from "react";

const PocketUseSkeleton: React.FC = () => {
  // 스켈레톤 UI에 사용할 스타일
  const styles = {
    container: {
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#f5f9ff",
    },
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      position: "relative" as const,
      height: "24px",
    },
    accountCard: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    accountLeft: {
      display: "flex",
      alignItems: "center",
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
      display: "flex",
      flexDirection: "column" as const,
    },
    accountName: {
      width: "120px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
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
      animation: "pulse 1.5s infinite",
    },
    transactionList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      marginBottom: "20px",
    },
    transactionItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #f0f0f0",
      paddingBottom: "12px",
    },
    transactionLeft: {
      display: "flex",
      flexDirection: "column" as const,
    },
    transactionDate: {
      width: "80px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
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
      animation: "pulse 1.5s infinite",
      textAlign: "right" as const,
    },
    checkIcon: {
      width: "20px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      marginLeft: "8px",
      animation: "pulse 1.5s infinite",
    },
    emptySpace: {
      flex: 1,
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
          <div style={styles.accountLeft}>
            <div style={styles.bankIcon}></div>
            <div style={styles.accountInfo}>
              <div style={styles.accountName}></div>
              <div style={styles.accountNumber}></div>
            </div>
          </div>
          <div style={styles.accountBalance}></div>
        </div>

        {/* 거래 내역 리스트 - 5개로 증가 */}
        <div style={styles.transactionList}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.transactionItem}>
                <div style={styles.transactionLeft}>
                  <div style={styles.transactionDate}></div>
                  <div style={styles.transactionTitle}></div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={styles.transactionAmount}></div>
                  <div style={styles.checkIcon}></div>
                </div>
              </div>
            ))}
        </div>

        {/* 빈 공간 */}
        <div style={styles.emptySpace}></div>

        {/* 하단 버튼 */}
        <div style={styles.submitButton}></div>
      </div>
    </>
  );
};

export default PocketUseSkeleton;
