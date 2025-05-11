package com.legal.demo.application.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    //Handler all custom base exceptions
    @ExceptionHandler(CustomBaseException.class)
    public ResponseEntity<ErrorResponse> handleCustomExceptions(CustomBaseException exception){
        return ResponseEntity.status(exception.getHttpStatus()).body(exception.getErrorResponse());
    }

    //    @ExceptionHandler(Exception.class)
//    public ResponseEntity<SimpleResponse> handleGeneralExceptions(Exception exception){
//        SimpleResponse response = new SimpleResponse("Something went wrong. Please try again.");
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//    }

}
