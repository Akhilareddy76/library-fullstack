package com.akhila.library.lib.controller;

import com.akhila.library.lib.model.Wishlist;
import com.akhila.library.lib.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add")
    public List<Wishlist> addToWishlist(@RequestBody Wishlist wishlist) {
        return wishlistService.addToWishlist(wishlist);
    }

    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(@PathVariable Long userId) {
        return wishlistService.getWishlistByUser(userId);
    }

    @DeleteMapping("/{userId}/{bookId}")
    public List<Wishlist> removeFromWishlist(@PathVariable Long userId, @PathVariable String bookId) {
        return wishlistService.removeFromWishlist(userId, bookId);
    }
}
