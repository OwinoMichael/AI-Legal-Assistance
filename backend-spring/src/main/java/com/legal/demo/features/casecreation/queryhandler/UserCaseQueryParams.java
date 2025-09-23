package com.legal.demo.features.casecreation.queryhandler;

public class UserCaseQueryParams {
    private final CaseQueryParams queryParams;
    private final String userId;

    public UserCaseQueryParams(CaseQueryParams queryParams, String userId) {
        this.queryParams = queryParams;
        this.userId = userId;
    }

    public CaseQueryParams getQueryParams() {
        return queryParams;
    }

    public String getUserId() {
        return userId;
    }
}
