package com.legal.demo.application.validation;

import com.legal.demo.application.exceptions.FieldValidationException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ValidationUtils {

    public static void validate(Object object) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Object>> violations = validator.validate(object);

        if (!violations.isEmpty()) {
            Map<String, String> errors = violations.stream()
                    .collect(Collectors.toMap(
                            violation -> violation.getPropertyPath().toString(),
                            ConstraintViolation::getMessage
                    ));
            throw new FieldValidationException(errors);
        }
    }
}
