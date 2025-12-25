-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- I. TỔ CHỨC – NHÂN SỰ
CREATE TABLE don_vi (
    don_vi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_don_vi VARCHAR(20),
    ten_don_vi VARCHAR(255) NOT NULL,
    cap_don_vi VARCHAR(50),
    don_vi_cha_id UUID,
    trang_thai BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (don_vi_cha_id) REFERENCES don_vi(don_vi_id)
);

CREATE TABLE vien_chuc (
    vien_chuc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_vien_chuc VARCHAR(20),
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10),
    don_vi_id UUID,
    chuc_vu VARCHAR(100),
    la_dang_vien BOOLEAN DEFAULT FALSE,
    trang_thai BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (don_vi_id) REFERENCES don_vi(don_vi_id)
);

CREATE TABLE nguoi_dung (
    nguoi_dung_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vien_chuc_id UUID UNIQUE,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    trang_thai BOOLEAN DEFAULT TRUE,
    lan_dang_nhap_cuoi TIMESTAMP,
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id)
);

-- II. PHÂN QUYỀN
CREATE TABLE vai_tro (
    vai_tro_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_vai_tro VARCHAR(50),
    ten_vai_tro VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE phan_quyen (
    phan_quyen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_quyen VARCHAR(50),
    ten_quyen VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE nguoi_dung_vai_tro (
    nguoi_dung_id UUID,
    vai_tro_id UUID,
    ngay_gan TIMESTAMP,
    PRIMARY KEY (nguoi_dung_id, vai_tro_id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id)
);

CREATE TABLE vai_tro_phan_quyen (
    vai_tro_id UUID,
    phan_quyen_id UUID,
    PRIMARY KEY (vai_tro_id, phan_quyen_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id),
    FOREIGN KEY (phan_quyen_id) REFERENCES phan_quyen(phan_quyen_id)
);

-- III. DANH MỤC CHUNG
CREATE TABLE dm_trang_thai_ho_so (
    trang_thai_id INT PRIMARY KEY,
    ma VARCHAR(20),
    ten VARCHAR(100)
);

CREATE TABLE cap_phe_duyet (
    cap_phe_duyet_id INT PRIMARY KEY,
    ma_cap VARCHAR(20),
    ten_cap VARCHAR(100),
    thu_tu INT
);

-- IV. ĐẢNG VIÊN
CREATE TABLE don_vi_dang (
    don_vi_dang_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ten_don_vi VARCHAR(255),
    cap_do VARCHAR(20)
);

CREATE TABLE thong_tin_dang_vien (
    thong_tin_dang_vien_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vien_chuc_id UUID,
    don_vi_dang_id UUID,
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id),
    FOREIGN KEY (don_vi_dang_id) REFERENCES don_vi_dang(don_vi_dang_id)
);

-- V. HỒ SƠ ĐI NƯỚC NGOÀI
CREATE TABLE ho_so_di_nuoc_ngoai (
    ho_so_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_ho_so VARCHAR(30),
    vien_chuc_id UUID,
    loai_chuyen_di_id INT,
    quoc_gia_id INT,
    tu_ngay DATE,
    den_ngay DATE,
    kinh_phi_du_kien DECIMAL(15,2),
    trang_thai_id INT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ghi_chu TEXT,
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id),
    FOREIGN KEY (trang_thai_id) REFERENCES dm_trang_thai_ho_so(trang_thai_id)
);

CREATE TABLE phe_duyet (
    phe_duyet_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    cap_phe_duyet_id INT,
    nguoi_duyet_id UUID,
    ket_qua BOOLEAN,
    ngay_duyet TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (cap_phe_duyet_id) REFERENCES cap_phe_duyet(cap_phe_duyet_id),
    FOREIGN KEY (nguoi_duyet_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

CREATE TABLE phe_duyet_dang (
    phe_duyet_dang_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    don_vi_dang_id UUID,
    nguoi_duyet VARCHAR(100),
    ket_qua BOOLEAN,
    ngay_duyet TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (don_vi_dang_id) REFERENCES don_vi_dang(don_vi_dang_id)
);

-- VI. QUYẾT ĐỊNH
CREATE TABLE loai_quyet_dinh (
    loai_quyet_dinh_id INT PRIMARY KEY,
    ten_loai VARCHAR(100)
);

CREATE TABLE quyet_dinh (
    quyet_dinh_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    so_quyet_dinh VARCHAR(50),
    ngay_ky DATE,
    nguoi_ky VARCHAR(100),
    loai_quyet_dinh_id INT,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (loai_quyet_dinh_id) REFERENCES loai_quyet_dinh(loai_quyet_dinh_id)
);

-- VII. BÁO CÁO SAU CHUYẾN ĐI
CREATE TABLE bao_cao_sau_chuyen_di (
    bao_cao_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    ngay_nop DATE,
    noi_dung TEXT,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id)
);

-- VIII. TÀI LIỆU ĐÍNH KÈM
CREATE TABLE tai_lieu_dinh_kem (
    tai_lieu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    ten_tai_lieu VARCHAR(255),
    duong_dan VARCHAR(500),
    loai_tai_lieu VARCHAR(50),
    kich_thuoc BIGINT,
    ngay_tai_len TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id)
);

CREATE TABLE tep_dinh_kem (
    tep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    duong_dan VARCHAR(500),
    loai_tep VARCHAR(50),
    kich_thuoc BIGINT,
    ngay_tao TIMESTAMP
);

-- IX. AUDIT LOG
CREATE TABLE audit_log (
    audit_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nguoi_dung_id UUID,
    hanh_dong VARCHAR(50),
    bang_tac_dong VARCHAR(50),
    ban_ghi_id UUID,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
);