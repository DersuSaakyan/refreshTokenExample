package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RefreshTokenEntity.
 */
@Entity
@Table(name = "refresh_token_entity")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RefreshTokenEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "expiry_date")
    private Instant expiryDate;

    @Column(name = "token")
    private String token;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RefreshTokenEntity id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getExpiryDate() {
        return this.expiryDate;
    }

    public RefreshTokenEntity expiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
        return this;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getToken() {
        return this.token;
    }

    public RefreshTokenEntity token(String token) {
        this.token = token;
        return this;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return this.user;
    }

    public RefreshTokenEntity user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RefreshTokenEntity)) {
            return false;
        }
        return id != null && id.equals(((RefreshTokenEntity) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RefreshTokenEntity{" +
            "id=" + getId() +
            ", expiryDate='" + getExpiryDate() + "'" +
            ", token='" + getToken() + "'" +
            "}";
    }
}
