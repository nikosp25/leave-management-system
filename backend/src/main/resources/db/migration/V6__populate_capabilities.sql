-- 1. Populate Capabilities
INSERT INTO capabilities (name, created_at, updated_at, deleted) VALUES
('READ_OWN_LEAVE', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('CREATE_LEAVE', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('CANCEL_OWN_LEAVE', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('READ_ALL_LEAVE', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('APPROVE_REJECT_LEAVE', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('READ_EMPLOYEES', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('READ_MANAGERS', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('READ_DELETED_USERS', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false),
('MANAGE_USERS', UTC_TIMESTAMP(), UTC_TIMESTAMP(), false);

-- 2. Map Capabilities to Existing Roles (Join Table)

-- Assign EMPLOYEE capabilities
INSERT INTO roles_capabilities (role_id, capability_id)
SELECT r.id, c.id FROM roles r, capabilities c
WHERE r.name = 'EMPLOYEE'
AND c.name IN (
    'READ_OWN_LEAVE',
    'CREATE_LEAVE',
    'CANCEL_OWN_LEAVE'
);

-- Assign MANAGER capabilities
INSERT INTO roles_capabilities (role_id, capability_id)
SELECT r.id, c.id FROM roles r, capabilities c
WHERE r.name = 'MANAGER'
AND c.name IN (
    'READ_OWN_LEAVE',
    'CREATE_LEAVE',
    'CANCEL_OWN_LEAVE',
    'READ_ALL_LEAVE',
    'APPROVE_REJECT_LEAVE',
    'READ_EMPLOYEES'
);

-- Assign ADMIN capabilities
INSERT INTO roles_capabilities (role_id, capability_id)
SELECT r.id, c.id FROM roles r, capabilities c
WHERE r.name = 'ADMIN';