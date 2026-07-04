package com.example.leave_management_system.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LeaveStatusNotFoundException extends RuntimeException {
    public LeaveStatusNotFoundException(String message) { super(message); }
}


