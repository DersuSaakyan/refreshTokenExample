package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RefreshToken;
import com.mycompany.myapp.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Modifying
    Integer deleteByUser(User user);

    Optional<RefreshToken> findByToken(String token);
}
