package com.mycompany.myapp.security.session;

import com.mycompany.myapp.domain.Authority;
import com.mycompany.myapp.domain.User;
import java.io.Serializable;
import java.util.Set;
import java.util.stream.Collectors;

public class SessionUser implements Serializable {

    public static final String SESSION_USER_KEY = "SESSION_USER";

    private static final long serialVersionUID = 1L;

    private Long id;
    private String login;
    private String firstName;
    private String lastName;
    private Set<String> authority;

    public Set<String> getAuthority() {
        return authority;
    }

    public void setAuthority(Set<String> authority) {
        this.authority = authority;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public static SessionUser mapUserToSessionUser(User user) {
        if (user == null) {
            return null;
        }
        SessionUser sessionUser = new SessionUser();
        sessionUser.setId(user.getId());
        sessionUser.setFirstName(user.getFirstName());
        sessionUser.setLastName(user.getLastName());
        sessionUser.setLogin(user.getLogin());
        sessionUser.setAuthority(user.getAuthorities().stream().map(Authority::getName).collect(Collectors.toSet()));

        return sessionUser;
    }

    @Override
    public String toString() {
        return (
            "SessionUser{" +
            "id=" +
            id +
            ", login='" +
            login +
            '\'' +
            ", firstName='" +
            firstName +
            '\'' +
            ", lastName='" +
            lastName +
            '\'' +
            ", authority=" +
            authority +
            '}'
        );
    }
}
