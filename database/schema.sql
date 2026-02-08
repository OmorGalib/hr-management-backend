-- HR Management System Database Schema
-- PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS hr_users CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- HR Users table
CREATE TABLE hr_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table with soft delete
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
    designation VARCHAR(255) NOT NULL,
    hiring_date DATE NOT NULL,
    date_of_birth DATE NOT NULL,
    salary DECIMAL(12, 2) NOT NULL CHECK (salary > 0),
    photo_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, date)
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_hr_users_updated_at
    BEFORE UPDATE ON hr_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_employees_deleted_at ON employees(deleted_at);
CREATE INDEX idx_employees_name ON employees(name);
CREATE INDEX idx_employees_designation ON employees(designation);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_attendance_check_in_time ON attendance(check_in_time);

-- View for monthly attendance report
CREATE OR REPLACE VIEW monthly_attendance_report AS
SELECT 
    e.id as employee_id,
    e.name,
    EXTRACT(YEAR FROM a.date) as year,
    EXTRACT(MONTH FROM a.date) as month,
    COUNT(a.id) as days_present,
    SUM(CASE WHEN a.check_in_time > '09:45:00' THEN 1 ELSE 0 END) as times_late
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.name, EXTRACT(YEAR FROM a.date), EXTRACT(MONTH FROM a.date)
ORDER BY e.id;