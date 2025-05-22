package com.legal.demo.application.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = FileValidator.class)
public @interface FileConstraints {
    String message() default "Invalid file";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    long maxSize() default 1024 * 1024 * 5; // 5MB
    String[] allowedTypes() default {"application/pdf", "image/jpeg", "image/png"};
}
