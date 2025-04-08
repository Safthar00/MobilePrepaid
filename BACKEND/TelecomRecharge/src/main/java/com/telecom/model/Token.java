package com.telecom.model;

public class Token {
    private final String token;
    private final String refreshToken;
    private final String type;

    public Token(String token, String refreshToken, String type) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.type = type;
    }

    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public String getType() { return type; }
}
