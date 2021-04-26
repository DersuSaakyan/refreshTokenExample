package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.RefreshTokenEntity;
import com.mycompany.myapp.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RefreshTokenEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RefreshTokenEntityRepository extends JpaRepository<RefreshTokenEntity, Long> {
    @Modifying
    Integer deleteByUser(User user);

    Optional<RefreshTokenEntity> findByToken(String token);

    RefreshTokenEntity findOneByUserId(Long id);
}
