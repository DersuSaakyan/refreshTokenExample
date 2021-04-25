package com.mycompany.myapp.web.rest.vm;

import javax.validation.constraints.NotBlank;

public class RefreshTokenVM {

    @NotBlank
    private String refreshToken;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
