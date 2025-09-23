package com.legal.demo.application.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import org.springframework.web.multipart.MultipartFile;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.util.Arrays;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

public class FileValidator implements ConstraintValidator<FileConstraints, MultipartFile> {
    private long maxSize;
    private String[] allowedTypes;

    @Override
    public void initialize(FileConstraints constraint) {
        this.maxSize = constraint.maxSize();
        this.allowedTypes = constraint.allowedTypes();
    }

    @Override
    public boolean isValid(MultipartFile file, ConstraintValidatorContext context) {
        if (file == null || file.isEmpty()) return false;
        if (file.getSize() > maxSize) return false;
        return Arrays.asList(allowedTypes).contains(file.getContentType());
    }
}
