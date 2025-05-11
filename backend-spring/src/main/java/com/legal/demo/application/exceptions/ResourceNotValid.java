package com.legal.demo.application.exceptions;

import org.springframework.http.HttpStatus;

public class ResourceNotValid extends CustomBaseException{


    public ResourceNotValid(String resourceName){
        super(HttpStatus.BAD_REQUEST, new ErrorResponse("Invalid" + resourceName, HttpStatus.BAD_REQUEST.toString()));
    }
}
