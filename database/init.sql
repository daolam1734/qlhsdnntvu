-- PostgreSQL setup script for QLHS_DNN_TVU with login only
-- Set UTF-8 encoding

-- Create database
CREATE DATABASE qlhs_dnn_tvu WITH ENCODING 'UTF8' TEMPLATE template0;

-- Connect to the database
\c qlhs_dnn_tvu;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE nguoi_dung (
    nguoi_dung_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    trang_thai BOOLEAN DEFAULT TRUE,
    lan_dang_nhap_cuoi TIMESTAMP
);

-- Roles table
CREATE TABLE vai_tro (
    vai_tro_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_vai_tro VARCHAR(50),
    ten_vai_tro VARCHAR(100),
    mo_ta TEXT
);

-- Permissions table
CREATE TABLE phan_quyen (
    phan_quyen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_quyen VARCHAR(50),
    ten_quyen VARCHAR(100),
    mo_ta TEXT
);

-- User-Role association
CREATE TABLE nguoi_dung_vai_tro (
    nguoi_dung_id UUID,
    vai_tro_id UUID,
    ngay_gan TIMESTAMP,
    PRIMARY KEY (nguoi_dung_id, vai_tro_id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id)
);

-- Role-Permission association
CREATE TABLE vai_tro_phan_quyen (
    vai_tro_id UUID,
    phan_quyen_id UUID,
    PRIMARY KEY (vai_tro_id, phan_quyen_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id),
    FOREIGN KEY (phan_quyen_id) REFERENCES phan_quyen(phan_quyen_id)
);
