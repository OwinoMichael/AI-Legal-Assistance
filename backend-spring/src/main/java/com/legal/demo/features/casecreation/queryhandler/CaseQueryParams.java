package com.legal.demo.features.casecreation.queryhandler;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Sort;

// Supporting class
public class CaseQueryParams {
    @Min(0)
    private int page = 0;

    @Min(1) @Max(100)
    private int size = 10;

    private String sortBy = "createdAt";

    private Sort.Direction sortDirection = Sort.Direction.DESC;

    public CaseQueryParams() {
    }

    public CaseQueryParams(int page, int size, String sortBy, Sort.Direction sortDirection) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public Sort.Direction getSortDirection() {
        return sortDirection;
    }

    public void setSortDirection(Sort.Direction sortDirection) {
        this.sortDirection = sortDirection;
    }
}
