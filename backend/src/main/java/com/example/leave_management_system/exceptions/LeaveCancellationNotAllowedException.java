package com.example.leave_management_system.exceptions;

public class LeaveCancellationNotAllowedException extends RuntimeException {
    public LeaveCancellationNotAllowedException(String message) {
        super(message);
    }
}
