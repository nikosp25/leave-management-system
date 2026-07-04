package com.example.leave_management_system.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.NOT_FOUND)
public class LeaveTypeNotFoundException extends RuntimeException {
    public LeaveTypeNotFoundException(String message) { super(message); }
}

