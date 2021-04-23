package com.mycompany.myapp.web.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mycompany.myapp.security.jwt.JWTFilter;
import com.mycompany.myapp.security.jwt.TokenProvider;
import com.mycompany.myapp.service.RefreshTokenService;
import com.mycompany.myapp.web.rest.vm.LoginVM;
import javax.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {

    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public UserJWTController(
        TokenProvider tokenProvider,
        RefreshTokenService refreshTokenService,
        AuthenticationManagerBuilder authenticationManagerBuilder
    ) {
        this.tokenProvider = tokenProvider;
        this.refreshTokenService = refreshTokenService;
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

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String jwt = tokenProvider.createToken(authentication, loginVM.isRememberMe());
        //generate refresh token
        //        String refreshToken = refreshTokenService.generateRefreshToken()

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    //    @GetMapping("/refresh-token")
    //    public ResponseEntity<?> refreshtoken(HttpServletRequest request) throws Exception {
    //        // From the HttpRequest get the claims
    //        DefaultClaims claims = (io.jsonwebtoken.impl.DefaultClaims) request.getAttribute("claims");
    //
    //        Map<String, Object> expectedMap = tokenProvider.getMapFromIoJsonwebtokenClaims(claims);
    //        String token = tokenProvider.doGenerateRefreshToken(expectedMap, expectedMap.get("sub").toString());
    //        return ResponseEntity.ok(new JWTToken(token));
    //    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;
        private String refreshToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}
