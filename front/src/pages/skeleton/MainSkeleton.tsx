// pages/skeleton/MainSkeleton.tsx
import React from "react";

const MainSkeleton: React.FC = () => {
  // 스켈레톤 UI에 사용할 스타일
  const styles = {
    container: {
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#fff8f8",
      position: "relative" as const,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      height: "24px",
    },
    title: {
      width: "120px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    headerActions: {
      display: "flex",
      gap: "12px",
    },
    icon: {
      width: "24px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    editButton: {
      width: "48px",
      height: "32px",
      backgroundColor: "#e0e0e0",
      borderRadius: "16px",
      animation: "pulse 1.5s infinite",
    },
    accountSection: {
      marginBottom: "24px",
    },
    accountItem: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "16px",
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
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    accountType: {
      width: "160px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    balanceContainer: {
      marginTop: "8px",
    },
    balanceLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "4px",
    },
    balanceLabelText: {
      width: "80px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    balanceValue: {
      width: "100px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginLeft: "auto",
      animation: "pulse 1.5s infinite",
    },
    transferRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    transferInfo: {
      display: "flex",
      alignItems: "center",
    },
    infoIcon: {
      width: "16px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      marginRight: "8px",
      animation: "pulse 1.5s infinite",
    },
    transferText: {
      width: "100px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    transferAmount: {
      width: "80px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    transferButton: {
      width: "80px",
      height: "32px",
      backgroundColor: "#e0e0e0",
      borderRadius: "16px",
      animation: "pulse 1.5s infinite",
    },
    pocketSection: {
      marginBottom: "24px",
    },
    sectionTitle: {
      width: "100px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "16px",
      animation: "pulse 1.5s infinite",
    },
    pocketItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    },
    pocketExpanded: {
      height: "80px",
    },
    pocketCollapsed: {
      height: "50px",
    },
    pocketIconContainer: {
      width: "36px",
      height: "36px",
      backgroundColor: "#e0e0e0",
      borderRadius: "8px",
      marginRight: "12px",
      animation: "pulse 1.5s infinite",
    },
    pocketInfo: {
      flex: 1,
    },
    pocketTitle: {
      width: "80px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketBalance: {
      width: "100px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    arrowIcon: {
      width: "16px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    futureItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #f0f0f0",
    },
    futureDate: {
      width: "100px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    futureTitle: {
      width: "180px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    futureAmount: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    viewMoreButton: {
      width: "80px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      margin: "12px auto",
      animation: "pulse 1.5s infinite",
    },
    createPocketButton: {
      height: "56px",
      borderRadius: "8px",
      backgroundColor: "#ffa726",
      marginTop: "auto",
      marginBottom: "56px",
      animation: "pulse 1.5s infinite",
    },
    bottomNavigation: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 16px",
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      borderTop: "1px solid #e0e0e0",
      height: "56px",
    },
    navItem: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "4px",
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
        {/* 헤더 */}
        <div style={styles.header}>{/* 회색 네모 요소들 제거 */}</div>

        {/* 계좌 섹션 */}
        <div style={styles.accountSection}>
          {/* 계좌 아이템 1 */}
          <div style={styles.accountItem}>
            <div style={styles.accountHeader}>
              <div style={styles.bankIcon}></div>
              <div style={styles.accountInfo}>
                <div style={styles.accountName}></div>
                <div style={styles.accountType}></div>
              </div>
            </div>
            <div style={styles.balanceContainer}>
              <div style={styles.balanceLabel}>
                <div style={styles.balanceLabelText}></div>
                <div style={styles.balanceValue}></div>
              </div>
              <div style={styles.transferRow}>
                <div style={styles.transferInfo}>
                  <div style={styles.infoIcon}></div>
                  <div style={styles.transferText}></div>
                </div>
                <div style={styles.transferAmount}></div>
                <div style={styles.transferButton}></div>
              </div>
            </div>
          </div>

          {/* 계좌 아이템 2 */}
          <div style={styles.accountItem}>
            <div style={styles.accountHeader}>
              <div style={styles.bankIcon}></div>
              <div style={styles.accountInfo}>
                <div style={styles.accountName}></div>
                <div style={styles.accountType}></div>
              </div>
            </div>
            <div style={styles.balanceContainer}>
              <div style={styles.balanceLabel}>
                <div style={styles.balanceLabelText}></div>
                <div style={styles.balanceValue}></div>
              </div>
              <div style={styles.transferRow}>
                <div style={styles.transferInfo}>
                  <div style={styles.infoIcon}></div>
                  <div style={styles.transferText}></div>
                </div>
                <div style={styles.transferAmount}></div>
                <div style={styles.transferButton}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 포켓 섹션 */}
        <div style={styles.pocketSection}>
          <div style={styles.sectionTitle}></div>

          {/* 포켓 아이템 1 (펼쳐진 상태) */}
          <div style={{ ...styles.pocketItem, ...styles.pocketExpanded }}>
            <div style={styles.pocketIconContainer}></div>
            <div style={styles.pocketInfo}>
              <div style={styles.pocketTitle}></div>
              <div style={styles.pocketBalance}></div>
            </div>
            <div style={styles.arrowIcon}></div>
          </div>

          {/* 포켓 아이템 2 (접힌 상태) */}
          <div style={{ ...styles.pocketItem, ...styles.pocketCollapsed }}>
            <div style={styles.pocketIconContainer}></div>
            <div style={styles.pocketInfo}>
              <div style={styles.pocketTitle}></div>
              <div style={styles.pocketBalance}></div>
            </div>
            <div style={styles.arrowIcon}></div>
          </div>

          {/* 미래 항목들 */}
          <div style={styles.futureItem}>
            <div>
              <div style={styles.futureDate}></div>
              <div style={styles.futureTitle}></div>
            </div>
            <div style={styles.futureAmount}></div>
            <div style={styles.transferButton}></div>
          </div>

          <div style={styles.futureItem}>
            <div>
              <div style={styles.futureDate}></div>
              <div style={styles.futureTitle}></div>
            </div>
            <div style={styles.futureAmount}></div>
            <div style={styles.transferButton}></div>
          </div>

          <div style={styles.futureItem}>
            <div>
              <div style={styles.futureDate}></div>
              <div style={styles.futureTitle}></div>
            </div>
            <div style={styles.futureAmount}></div>
            <div style={styles.transferButton}></div>
          </div>

          {/* 더 보기 버튼 */}
          <div style={styles.viewMoreButton}></div>
        </div>

        {/* 포켓 만들기 버튼 */}
        <div style={styles.createPocketButton}></div>

        {/* 하단 탭 네비게이션 */}
        <div style={styles.bottomNavigation}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.navItem}>
                {/* 회색 네모 요소들 제거 */}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MainSkeleton;
