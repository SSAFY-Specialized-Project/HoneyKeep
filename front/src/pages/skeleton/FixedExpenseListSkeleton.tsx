// pages/skeleton/FixedExpenseListSkeleton.tsx
import React from "react";

const FixedExpenseListSkeleton: React.FC = () => {
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
      justifyContent: "space-between",
      padding: "16px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      height: "56px",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      height: "24px",
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
      animation: "pulse 1.5s infinite",
    },
    editButton: {
      width: "48px",
      height: "32px",
      backgroundColor: "#e0e0e0",
      borderRadius: "16px",
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
      gap: "16px",
      marginBottom: "80px",
    },
    expenseItem: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    },
    expenseTitle: {
      width: "150px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    expenseStatusText: {
      width: "120px",
      height: "16px",
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
    statusBadge: {
      width: "40px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "12px",
      animation: "pulse 1.5s infinite",
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
        <div style={styles.header}>
          <div style={styles.headerLeft}></div>
        </div>

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
          <div style={{ ...styles.tab, ...styles.activeTab }}>
            <div style={styles.tabText}></div>
          </div>
          <div style={styles.tab}>
            <div style={styles.tabText}></div>
          </div>
        </div>

        {/* 고정지출 목록 - 4개 반복 */}
        <div style={styles.expensesList}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.expenseItem}>
                <div style={styles.expenseTitle}></div>
                <div style={styles.expenseDate}></div>
                <div style={styles.expenseStatus}>
                  <div style={styles.expenseStatusText}></div>
                  <div style={styles.expenseAmount}></div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <div style={styles.statusBadge}></div>
                </div>
              </div>
            ))}
        </div>

        {/* 하단 네비게이션 */}
        <div style={styles.bottomNavigation}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.navItem}>
                <div style={styles.navIcon}></div>
                <div style={styles.navText}></div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default FixedExpenseListSkeleton;
