package com.example.leave_management_system.exceptions;

public class LeaveStatusChangeNotAllowedException extends RuntimeException {
    public LeaveStatusChangeNotAllowedException(String message) {
        super(message);
    }
}
