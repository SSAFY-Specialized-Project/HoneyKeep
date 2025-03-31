// pages/skeleton/FixedExpenseFoundSkeleton.tsx
import React from "react";

const FixedExpenseFoundSkeleton: React.FC = () => {
  // 스켈레톤 UI에 사용할 스타일
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
      backgroundColor: "#fff9f5",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      height: "56px",
    },
    backButton: {
      width: "24px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginRight: "12px",
      animation: "pulse 1.5s infinite",
    },
    title: {
      width: "120px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      margin: "0 auto",
      animation: "pulse 1.5s infinite",
    },
    summaryCard: {
      display: "flex",
      flexDirection: "column" as const,
      backgroundColor: "white",
      padding: "16px",
      margin: "0",
      borderBottom: "1px solid #f0f0f0",
    },
    summaryItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    },
    summaryLabel: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    summaryValue: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
      textAlign: "right" as const,
    },
    tabsContainer: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
    },
    tab: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      paddingTop: "12px",
      paddingBottom: "12px",
    },
    activeTab: {
      borderBottom: "2px solid #ffa726",
    },
    tabText: {
      width: "100px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    expensesList: {
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
      marginBottom: "80px",
    },
    expenseItem: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    },
    expenseHeader: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    expenseTitle: {
      width: "150px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    expenseAmount: {
      width: "90px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    expenseDate: {
      width: "120px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
      animation: "pulse 1.5s infinite",
    },
    expenseStatus: {
      width: "140px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
      justifyContent: "flex-end",
    },
    actionButton: {
      width: "48px",
      height: "32px",
      borderRadius: "16px",
      backgroundColor: "#e0e0e0",
      animation: "pulse 1.5s infinite",
      flex: "none",
    },
    bottomNavigation: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 16px",
      position: "fixed" as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      borderTop: "1px solid #e0e0e0",
    },
    navItem: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "4px",
    },
    navIcon: {
      width: "24px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    navText: {
      width: "40px",
      height: "12px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    activeNavItem: {
      color: "#ffa726",
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

        {/* 요약 정보 카드 */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}></div>
            <div style={styles.summaryValue}></div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryLabel}></div>
            <div style={styles.summaryValue}></div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div style={styles.tabsContainer}>
          <div style={styles.tab}>
            <div style={styles.tabText}></div>
          </div>
          <div style={{ ...styles.tab, ...styles.activeTab }}>
            <div style={styles.tabText}></div>
          </div>
        </div>

        {/* 고정지출 목록 - 3개 반복 */}
        <div style={styles.expensesList}>
          {/* 고정지출 항목 1 */}
          <div style={styles.expenseItem}>
            <div style={styles.expenseHeader}>
              <div style={styles.expenseTitle}></div>
              <div style={styles.expenseAmount}></div>
            </div>
            <div style={styles.expenseDate}></div>
            <div style={styles.expenseStatus}></div>
            <div style={styles.actionButtons}>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
            </div>
          </div>

          {/* 고정지출 항목 2 */}
          <div style={styles.expenseItem}>
            <div style={styles.expenseHeader}>
              <div style={styles.expenseTitle}></div>
              <div style={styles.expenseAmount}></div>
            </div>
            <div style={styles.expenseDate}></div>
            <div style={styles.expenseStatus}></div>
            <div style={styles.actionButtons}>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
            </div>
          </div>

          {/* 고정지출 항목 3 */}
          <div style={styles.expenseItem}>
            <div style={styles.expenseHeader}>
              <div style={styles.expenseTitle}></div>
              <div style={styles.expenseAmount}></div>
            </div>
            <div style={styles.expenseDate}></div>
            <div style={styles.expenseStatus}></div>
            <div style={styles.actionButtons}>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
              <div style={styles.actionButton}></div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div style={styles.bottomNavigation}>
          <div style={styles.navItem}>
            <div style={styles.navIcon}></div>
            <div style={styles.navText}></div>
          </div>
          <div style={styles.navItem}>
            <div style={styles.navIcon}></div>
            <div style={styles.navText}></div>
          </div>
          <div style={styles.navItem}>
            <div style={styles.navIcon}></div>
            <div style={styles.navText}></div>
          </div>
          <div style={{ ...styles.navItem, ...styles.activeNavItem }}>
            <div style={styles.navIcon}></div>
            <div style={styles.navText}></div>
          </div>
          <div style={styles.navItem}>
            <div style={styles.navIcon}></div>
            <div style={styles.navText}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FixedExpenseFoundSkeleton;
