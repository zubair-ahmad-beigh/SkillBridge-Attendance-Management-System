-- SkillBridge MySQL Schema
-- Hibernate ddl-auto=update will create tables automatically.
-- Run this manually ONLY if you want to reset/recreate tables.

CREATE TABLE IF NOT EXISTS institutions (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    institution_id CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT chk_role CHECK (role IN ('STUDENT','TRAINER','INSTITUTION','PROGRAMME_MANAGER','MONITORING_OFFICER'))
);

CREATE TABLE IF NOT EXISTS batches (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    institution_id CHAR(36) NOT NULL,
    invite_token VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_batch_institution FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS batch_trainers (
    batch_id CHAR(36) NOT NULL,
    trainer_id CHAR(36) NOT NULL,
    PRIMARY KEY (batch_id, trainer_id),
    CONSTRAINT fk_bt_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    CONSTRAINT fk_bt_trainer FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS batch_students (
    batch_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    PRIMARY KEY (batch_id, student_id),
    CONSTRAINT fk_bs_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(36) PRIMARY KEY,
    batch_id CHAR(36) NOT NULL,
    trainer_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
    CONSTRAINT fk_session_trainer FOREIGN KEY (trainer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id CHAR(36) PRIMARY KEY,
    session_id CHAR(36) NOT NULL,
    student_id CHAR(36) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABSENT',
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_attendance (session_id, student_id),
    CONSTRAINT fk_att_session FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('PRESENT','ABSENT','LATE'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_batches_inst ON batches(institution_id);
CREATE INDEX IF NOT EXISTS idx_sessions_batch ON sessions(batch_id);
CREATE INDEX IF NOT EXISTS idx_att_session ON attendance(session_id);
