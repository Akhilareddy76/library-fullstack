package com.akhila.library.lib.service;

import com.akhila.library.lib.model.Wishlist;
import com.akhila.library.lib.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepo;

    private String normalizeBookId(String bookId) {
        if (bookId == null) return null;

        if (bookId.startsWith("/works/")) {
            return bookId.replace("/works/", "");
        }
        return bookId;
    }

    @Override
    public List<Wishlist> getWishlistByUser(Long userId) {
        return wishlistRepo.findByUserId(userId);
    }

    @Override
    public List<Wishlist> addToWishlist(Wishlist wishlist) {


        String cleanBookId = normalizeBookId(wishlist.getBookId());
        wishlist.setBookId(cleanBookId);

        boolean exists = wishlistRepo.existsByUserIdAndBookId(
                wishlist.getUserId(),
                cleanBookId
        );

        if (!exists) {
            wishlistRepo.save(wishlist);
        }

        return wishlistRepo.findByUserId(wishlist.getUserId());
    }

    @Override
    public List<Wishlist> removeFromWishlist(Long userId, String bookId) {

        String cleanBookId = normalizeBookId(bookId);

        wishlistRepo.deleteByUserIdAndBookId(userId, cleanBookId);

        return wishlistRepo.findByUserId(userId);
    }
}
