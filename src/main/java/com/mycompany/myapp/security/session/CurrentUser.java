package com.mycompany.myapp.security.session;

import com.mycompany.myapp.domain.User;

public class CurrentUser {

    private static final long serialVersionUID = 1L;
    private SessionUser user;

    public CurrentUser(User user) {
        this.user = SessionUser.mapUserToSessionUser(user);
    }

    public SessionUser getUser() {
        return user;
    }

    public Long getId() {
        return user.getId();
    }

    @Override
    public String toString() {
        return "CurrentUser{" + "user=" + user + "} " + super.toString();
    }
}
