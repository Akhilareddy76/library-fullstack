package com.akhila.library.lib.service;

import com.akhila.library.lib.model.Wishlist;
import java.util.List;

public interface WishlistService {

    List<Wishlist> getWishlistByUser(Long userId);

    List<Wishlist> addToWishlist(Wishlist wishlist);

    List<Wishlist> removeFromWishlist(Long userId, String bookId);
}
