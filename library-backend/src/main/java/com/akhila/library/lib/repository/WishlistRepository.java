package com.akhila.library.lib.repository;

import com.akhila.library.lib.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserId(Long userId);

    boolean existsByUserIdAndBookId(Long userId, String bookId);

    @Modifying
    @Transactional
    void deleteByUserIdAndBookId(Long userId, String bookId);
}
