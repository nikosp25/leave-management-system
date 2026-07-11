INSERT INTO leave_statuses (
    name,
    created_at,
    updated_at,
    deleted,
    deleted_at
)
VALUES (
    'CANCELLED',
    UTC_TIMESTAMP(),
    UTC_TIMESTAMP(),
    FALSE,
    NULL
);