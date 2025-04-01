// pages/skeleton/PocketCategoryChooseSkeleton.tsx
import React from "react";

const PocketCategoryChooseSkeleton: React.FC = () => {
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
    description: {
      width: "200px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      margin: "0 auto 20px auto",
      animation: "pulse 1.5s infinite",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "30px",
    },
    toggleLabel: {
      width: "80px",
      height: "16px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginRight: "8px",
      animation: "pulse 1.5s infinite",
    },
    toggleTrack: {
      width: "46px",
      height: "24px",
      backgroundColor: "#e0e0e0",
      borderRadius: "12px",
      animation: "pulse 1.5s infinite",
    },
    selectContainer: {
      marginBottom: "16px",
    },
    selectField: {
      width: "100%",
      height: "52px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
    },
    selectFieldText: {
      width: "180px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    selectFieldIcon: {
      width: "20px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    categoryItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 8px",
      marginBottom: "8px",
    },
    categoryIconContainer: {
      width: "36px",
      height: "36px",
      backgroundColor: "#ffeebf",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
    },
    categoryIcon: {
      width: "20px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    categoryInfo: {
      flex: 1,
    },
    categoryTitle: {
      width: "80px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "4px",
      animation: "pulse 1.5s infinite",
    },
    categoryDesc: {
      width: "120px",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      animation: "pulse 1.5s infinite",
    },
    checkIcon: {
      width: "20px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "50%",
      animation: "pulse 1.5s infinite",
    },
    addCategoryButton: {
      width: "100%",
      height: "52px",
      backgroundColor: "white",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
    },
    addCategoryText: {
      width: "140px",
      height: "18px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
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
          <div style={styles.titleContainer}>{/* 회색 네모 요소들 제거 */}</div>
        </div>

        {/* 설명 텍스트 */}
        <div style={styles.description}></div>

        {/* 토글 스위치 */}
        <div style={styles.toggleContainer}>
          <div style={styles.toggleLabel}></div>
          <div style={styles.toggleTrack}></div>
        </div>

        {/* 셀렉트 필드 1 */}
        <div style={styles.selectContainer}>
          <div style={styles.selectField}>
            <div style={styles.selectFieldText}></div>
            <div style={styles.selectFieldIcon}></div>
          </div>
        </div>

        {/* 셀렉트 필드 2 */}
        <div style={styles.selectContainer}>
          <div style={styles.selectField}>
            <div style={styles.selectFieldText}></div>
            <div style={styles.selectFieldIcon}></div>
          </div>
        </div>

        {/* 카테고리 아이템 1 - 선택됨 */}
        <div style={styles.categoryItem}>
          <div style={styles.categoryIconContainer}>
            <div style={styles.categoryIcon}></div>
          </div>
          <div style={styles.categoryInfo}>
            <div style={styles.categoryTitle}></div>
            <div style={styles.categoryDesc}></div>
          </div>
          <div style={styles.checkIcon}></div>
        </div>

        {/* 카테고리 아이템 2 - 선택됨 */}
        <div style={styles.categoryItem}>
          <div style={styles.categoryIconContainer}>
            <div style={styles.categoryIcon}></div>
          </div>
          <div style={styles.categoryInfo}>
            <div style={styles.categoryTitle}></div>
            <div style={styles.categoryDesc}></div>
          </div>
          <div style={styles.checkIcon}></div>
        </div>

        {/* 새 카테고리 추가 버튼 */}
        <div style={styles.addCategoryButton}>
          <div style={styles.addCategoryText}></div>
        </div>

        {/* 하단 버튼 */}
        <div style={styles.submitButton}></div>
      </div>
    </>
  );
};

export default PocketCategoryChooseSkeleton;
