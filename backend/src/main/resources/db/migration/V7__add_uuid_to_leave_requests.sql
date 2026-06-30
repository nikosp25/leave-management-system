ALTER TABLE leave_requests ADD COLUMN uuid BINARY(16) NOT NULL;
ALTER TABLE leave_requests ADD UNIQUE (uuid);