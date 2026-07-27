package com.example.leave_management_system.exceptions;

public class SelfDeletionNotAllowedException extends RuntimeException {
    public SelfDeletionNotAllowedException(String message) {
        super(message);
    }
}
