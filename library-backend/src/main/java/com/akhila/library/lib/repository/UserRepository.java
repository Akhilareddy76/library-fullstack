package com.akhila.library.lib.repository;

import com.akhila.library.lib.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findFirstByEmail(String email);
    boolean existsByEmail(String email);
}
