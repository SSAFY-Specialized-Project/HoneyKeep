// pages/skeleton/PocketListSkeleton.tsx
import React from "react";

const PocketListSkeleton: React.FC = () => {
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
      marginBottom: "20px",
      position: "relative" as const,
      height: "24px",
    },
    filterBar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    filterButton: {
      width: "90px",
      height: "36px",
      backgroundColor: "#e0e0e0",
      borderRadius: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pulse 1.5s infinite",
    },
    searchIcon: {
      width: "36px",
      height: "36px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      animation: "pulse 1.5s infinite",
    },
    pocketList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      marginBottom: "80px",
    },
    pocketItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
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
      width: "100px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketDesc: {
      width: "50px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketRight: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "flex-end",
    },
    pocketAmount: {
      width: "90px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketUsage: {
      width: "120px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
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
        <div style={styles.header}>{/* 회색 네모 요소들 제거 */}</div>

        {/* 필터 바 */}
        <div style={styles.filterBar}>
          <div style={styles.filterButton}></div>
          <div style={styles.filterButton}></div>
          <div style={styles.filterButton}></div>
          <div style={styles.filterButton}></div>
          <div style={styles.searchIcon}></div>
        </div>

        {/* 포켓 목록 - 4개 반복 */}
        <div style={styles.pocketList}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.pocketItem}>
                <div style={styles.pocketLeft}>
                  <div style={styles.pocketIconContainer}>
                    <div style={styles.pocketIcon}></div>
                  </div>
                  <div style={styles.pocketInfo}>
                    <div style={styles.pocketTitle}></div>
                    <div style={styles.pocketDesc}></div>
                  </div>
                </div>
                <div style={styles.pocketRight}>
                  <div style={styles.pocketAmount}></div>
                  <div style={styles.pocketUsage}></div>
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

export default PocketListSkeleton;
