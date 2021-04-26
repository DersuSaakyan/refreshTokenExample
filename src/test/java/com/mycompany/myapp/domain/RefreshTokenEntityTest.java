package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RefreshTokenEntityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RefreshTokenEntity.class);
        RefreshTokenEntity refreshTokenEntity1 = new RefreshTokenEntity();
        refreshTokenEntity1.setId(1L);
        RefreshTokenEntity refreshTokenEntity2 = new RefreshTokenEntity();
        refreshTokenEntity2.setId(refreshTokenEntity1.getId());
        assertThat(refreshTokenEntity1).isEqualTo(refreshTokenEntity2);
        refreshTokenEntity2.setId(2L);
        assertThat(refreshTokenEntity1).isNotEqualTo(refreshTokenEntity2);
        refreshTokenEntity1.setId(null);
        assertThat(refreshTokenEntity1).isNotEqualTo(refreshTokenEntity2);
    }
}
