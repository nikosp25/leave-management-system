package com.example.leave_management_system.exceptions;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.security.authorization.AuthorizationDeniedException;


import java.time.Instant;
import java.util.stream.Collectors;

/**
 * Handles exceptions across all REST controllers and returns
 * consistent JSON error responses with the correct HTTP status.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // --- 1. Catch All "404 Not Found" Exceptions ---
    @ExceptionHandler({
            UserNotFoundException.class,
            RoleNotFoundException.class,
            LeaveRequestNotFoundException.class,
            LeaveTypeNotFoundException.class,
            LeaveStatusNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleNotFoundExceptions(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // --- 2. Catch All "400 Bad Request" Exceptions ---
    @ExceptionHandler({
            InvalidDateRangeException.class,
            InsufficientLeaveBalanceException.class,
            MethodArgumentTypeMismatchException.class,
            LeaveCancellationNotAllowedException.class,
            LeaveStatusChangeNotAllowedException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequestExceptions(Exception ex, HttpServletRequest request) {

        String message = ex.getMessage();

        // Custom message logic for type mismatches (e.g., sending a string as a UUID)
        if (ex instanceof MethodArgumentTypeMismatchException) {
            MethodArgumentTypeMismatchException typeEx = (MethodArgumentTypeMismatchException) ex;
            String requiredType = typeEx.getRequiredType() != null ? typeEx.getRequiredType().getSimpleName() : "unknown";

            message = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                    typeEx.getValue(), typeEx.getName(), requiredType);
        }

        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                message,
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // --- 2b. Catch Missing Required Request Parameters ---
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingRequestParameter(
            MissingServletRequestParameterException ex,
            HttpServletRequest request) {

        String message = String.format(
                "Required request parameter '%s' is missing.",
                ex.getParameterName()
        );

        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                message,
                request.getRequestURI()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }


    // --- 3. Catch All "409 Conflict" Exceptions ---
    @ExceptionHandler({
            EmailAlreadyExistsException.class,
            OverlappingLeaveException.class
    })
    public ResponseEntity<ErrorResponse> handleConflictExceptions(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // --- 4. Catch Spring Validation Errors (@Valid) ---
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        // Grabs every validation error (like "email: must be well-formed") and joins them together
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                errorMessage,
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // --- 5. Catch Malformed JSON or Missing Request Body ---
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Malformed JSON request or invalid data types provided.",
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // --- 5b. Catch "401 Unauthorized" (Bad Login) ---
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }


    // --- 5c. Catch "403 Forbidden" Operations ---
    @ExceptionHandler({
            ForbiddenOperationException.class,
            AuthorizationDeniedException.class})

    public ResponseEntity<ErrorResponse> handleForbiddenOperation(RuntimeException ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    // --- 6. (Catches generic / unexpected system errors) ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        // Log the actual error to your console so you can debug it internally
        System.err.println("CRITICAL UNHANDLED ERROR: " + ex.getMessage());
        ex.printStackTrace();

        // Send a clean, vague message back to the frontend for security
        ErrorResponse errorResponse = new ErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected system error occurred. Please contact IT support.",
                request.getRequestURI()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}