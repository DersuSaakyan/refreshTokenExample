package com.mycompany.myapp.service;

import static com.mycompany.myapp.security.session.SessionUser.SESSION_USER_KEY;

import com.mycompany.myapp.domain.RefreshToken;
import com.mycompany.myapp.repository.RefreshTokenRepository;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.security.session.SessionUser;
import com.mycompany.myapp.web.rest.errors.TokenRefreshException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import tech.jhipster.config.JHipsterProperties;

@Service
public class AuthService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @Value("${spring.token-validity-in-seconds-for-refresh}")
    private String refreshTokenDurationMs;

    public AuthService(
        RefreshTokenRepository refreshTokenRepository,
        UserRepository userRepository,
        JHipsterProperties jHipsterProperties,
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = refreshTokenRepository.findOneByUserId(userId);
        if (refreshToken == null) {
            refreshToken = new RefreshToken();
        }
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(Long.parseLong(refreshTokenDurationMs)));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public SessionUser getSessionUser() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return (SessionUser) servletRequestAttributes.getRequest().getSession().getAttribute(SESSION_USER_KEY);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}
