// pages/skeleton/PocketIsFavoriteSkeleton.tsx
import React from "react";

const PocketIsFavoriteSkeleton: React.FC = () => {
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
    titleContainer: {
      display: "flex",
      alignItems: "center",
      margin: "0 auto",
      height: "32px",
    },
    iconContainer: {
      width: "32px",
      height: "32px",
      backgroundColor: "#ffeebf",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "8px",
    },
    icon: {
      width: "20px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    title: {
      width: "100px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    description: {
      width: "200px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      margin: "0 auto 30px auto",
      animation: "pulse 1.5s infinite",
    },
    tabs: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
      marginBottom: "16px",
    },
    tab: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      paddingBottom: "12px",
    },
    tabText: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    activeTab: {
      borderBottom: "2px solid #ffa726",
    },
    pocketList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    },
    pocketItem: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#ffeebf",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "8px",
    },
    pocketIconContainer: {
      width: "48px",
      height: "48px",
      backgroundColor: "#f9e1c3",
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
      flex: 1,
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
      width: "60px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    pocketAmount: {
      width: "90px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginLeft: "auto",
      animation: "pulse 1.5s infinite",
    },
    usageInfo: {
      width: "60px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginLeft: "auto",
      marginTop: "4px",
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
        <div style={styles.header}>
          <div style={styles.titleContainer}>{/* 회색 박스 요소들 제거 */}</div>
        </div>

        {/* 설명 텍스트 */}
        <div style={styles.description}></div>

        {/* 탭 메뉴 */}
        <div style={styles.tabs}>
          <div style={styles.tab}>
            <div style={styles.tabText}></div>
          </div>
          <div style={{ ...styles.tab, ...styles.activeTab }}>
            <div style={styles.tabText}></div>
          </div>
          <div style={styles.tab}>
            <div style={styles.tabText}></div>
          </div>
        </div>

        {/* 포켓 목록 - 8개 반복 */}
        <div style={styles.pocketList}>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} style={styles.pocketItem}>
                <div style={styles.pocketIconContainer}>
                  <div style={styles.pocketIcon}></div>
                </div>
                <div style={styles.pocketInfo}>
                  <div style={styles.pocketTitle}></div>
                  <div style={styles.pocketDesc}></div>
                </div>
                <div>
                  <div style={styles.pocketAmount}></div>
                  <div style={styles.usageInfo}></div>
                </div>
              </div>
            ))}
        </div>

        {/* 하단 버튼 */}
        <div style={styles.submitButton}></div>
      </div>
    </>
  );
};

export default PocketIsFavoriteSkeleton;
