package com.legal.demo.application.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotFound extends CustomBaseException{

    public ResourceNotFound(String resourceName) {
        super(HttpStatus.NOT_FOUND, new ErrorResponse(resourceName + " not found", HttpStatus.NOT_FOUND.toString()));
    }
}
