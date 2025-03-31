// pages/skeleton/HoneyPaySkeleton.tsx
import React from "react";

const HoneyPaySkeleton: React.FC = () => {
  // 스켈레톤 UI에 사용할 스타일
  const styles = {
    container: {
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#fff8f8",
    },
    header: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      marginBottom: "32px",
      height: "76px",
    },
    title: {
      width: "80px",
      height: "28px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "16px",
      animation: "pulse 1.5s infinite",
    },
    amount: {
      width: "120px",
      height: "32px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    sectionHeader: {
      width: "100%",
      height: "1px",
      backgroundColor: "#f0f0f0",
      marginBottom: "16px",
      position: "relative" as const,
    },
    sectionTitle: {
      width: "80px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      position: "absolute" as const,
      top: "-10px",
      left: "0",
      animation: "pulse 1.5s infinite",
    },
    accountSection: {
      marginBottom: "48px",
    },
    accountItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #f5f5f5",
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
    accountNumber: {
      width: "140px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    accountBalance: {
      width: "120px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    checkIcon: {
      width: "24px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      animation: "pulse 1.5s infinite",
    },
    pocketSection: {
      marginBottom: "32px",
    },
    optionItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #f5f5f5",
    },
    optionText: {
      width: "100px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f5f5f5",
    },
    pocketLeft: {
      display: "flex",
      alignItems: "center",
    },
    pocketIconContainer: {
      width: "48px",
      height: "48px",
      backgroundColor: "#ffeebf",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
    },
    pocketIcon: {
      width: "24px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketInfo: {
      display: "flex",
      flexDirection: "column" as const,
    },
    pocketTitle: {
      width: "120px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketAmount: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    notice: {
      width: "280px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "24px",
      margin: "0 auto",
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

        {/* 계좌 선택 섹션 */}
        <div style={styles.accountSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}></div>
          </div>

          {/* 계좌 아이템 1 - 선택됨 */}
          <div style={styles.accountItem}>
            <div style={styles.accountLeft}>
              <div style={styles.bankIcon}></div>
              <div style={styles.accountInfo}>
                <div style={styles.accountNumber}></div>
                <div style={styles.accountBalance}></div>
              </div>
            </div>
            <div style={styles.checkIcon}></div>
          </div>

          {/* 계좌 아이템 2 - 선택 안됨 */}
          <div style={styles.accountItem}>
            <div style={styles.accountLeft}>
              <div style={styles.bankIcon}></div>
              <div style={styles.accountInfo}>
                <div style={styles.accountNumber}></div>
                <div style={styles.accountBalance}></div>
              </div>
            </div>
            <div style={styles.checkIcon}></div>
          </div>
        </div>

        {/* 포켓 선택 섹션 */}
        <div style={styles.pocketSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}></div>
          </div>

          {/* 선택 안함 옵션 */}
          <div style={styles.optionItem}>
            <div style={styles.optionText}></div>
            <div style={styles.checkIcon}></div>
          </div>

          {/* 포켓 아이템 1 - 선택됨 */}
          <div style={styles.pocketItem}>
            <div style={styles.pocketLeft}>
              <div style={styles.pocketIconContainer}>
                <div style={styles.pocketIcon}></div>
              </div>
              <div style={styles.pocketInfo}>
                <div style={styles.pocketTitle}></div>
                <div style={styles.pocketAmount}></div>
              </div>
            </div>
            <div style={styles.checkIcon}></div>
          </div>

          {/* 포켓 아이템 2 - 선택 안됨 */}
          <div style={styles.pocketItem}>
            <div style={styles.pocketLeft}>
              <div style={styles.pocketIconContainer}>
                <div style={styles.pocketIcon}></div>
              </div>
              <div style={styles.pocketInfo}>
                <div style={styles.pocketTitle}></div>
                <div style={styles.pocketAmount}></div>
              </div>
            </div>
            <div style={styles.checkIcon}></div>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <div style={styles.submitButton}></div>
      </div>
    </>
  );
};

export default HoneyPaySkeleton;
