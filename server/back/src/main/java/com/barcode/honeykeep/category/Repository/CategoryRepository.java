package com.barcode.honeykeep.category.repository;

import com.barcode.honeykeep.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * 삭제되지 않은 카테고리 ID로 조회
     */
    Optional<Category> findByIdAndIsDeletedFalse(Long categoryId);
    
    /**
     * 모든 삭제되지 않은 카테고리 조회
     */
    List<Category> findByIsDeletedFalse();
}