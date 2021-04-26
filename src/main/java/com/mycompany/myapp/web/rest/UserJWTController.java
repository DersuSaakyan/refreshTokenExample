package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.security.session.SessionUser.SESSION_USER_KEY;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mycompany.myapp.security.jwt.JWTFilter;
import com.mycompany.myapp.security.jwt.TokenProvider;
import com.mycompany.myapp.security.session.CurrentUser;
import com.mycompany.myapp.security.session.SessionUser;
import com.mycompany.myapp.service.AuthService;
import com.mycompany.myapp.web.rest.errors.TokenRefreshException;
import com.mycompany.myapp.web.rest.response.TokenRefreshResponse;
import com.mycompany.myapp.web.rest.vm.LoginVM;
import com.mycompany.myapp.web.rest.vm.RefreshTokenVM;
import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;
    private final AuthService authService;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public UserJWTController(
        TokenProvider tokenProvider,
        AuthService authService,
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) {
        this.tokenProvider = tokenProvider;
        this.authService = authService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JWTToken> authorize(@Valid @RequestBody LoginVM loginVM) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
            loginVM.getUsername(),
            loginVM.getPassword()
        );

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        SessionUser sessionUser = authService.getSessionUser();

        String accessToken = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        String refreshToken = authService.createRefreshToken(sessionUser.getId()).getToken();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + accessToken);
        return new ResponseEntity<>(new JWTToken(accessToken, refreshToken), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenVM request) {
        String requestRefreshToken = request.getRefreshToken();
        SessionUser sessionUser = authService.getSessionUser();

        return authService
            .findByToken(requestRefreshToken)
            .map(authService::verifyExpiration)
            .map(
                u -> {
                    String token = tokenProvider.generateTokenFromSessionUser(sessionUser);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                }
            )
            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;
        private String refreshToken;

        JWTToken(String idToken, String refreshToken) {
            this.idToken = idToken;
            this.refreshToken = refreshToken;
        }

        @JsonProperty("access_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("refresh_token")
        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}
