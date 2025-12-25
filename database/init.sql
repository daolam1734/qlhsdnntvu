CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- I. Tá»” CHá»¨C  NHÃ‚N Sá»° (7 báº£ng)

CREATE TABLE IF NOT EXISTS don_vi (
    don_vi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_don_vi VARCHAR(20),
    ten_don_vi VARCHAR(255) NOT NULL,
    cap_don_vi VARCHAR(50),
    don_vi_cha_id UUID,
    trang_thai BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (don_vi_cha_id) REFERENCES don_vi(don_vi_id)
);

CREATE TABLE IF NOT EXISTS vien_chuc (
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

CREATE TABLE IF NOT EXISTS nguoi_dung (
    nguoi_dung_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vien_chuc_id UUID UNIQUE,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    trang_thai BOOLEAN DEFAULT TRUE,
    lan_dang_nhap_cuoi TIMESTAMP,
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id)
);

CREATE TABLE IF NOT EXISTS vai_tro (
    vai_tro_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_vai_tro VARCHAR(50),
    ten_vai_tro VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS phan_quyen (
    phan_quyen_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_quyen VARCHAR(50),
    ten_quyen VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS nguoi_dung_vai_tro (
    nguoi_dung_id UUID,
    vai_tro_id UUID,
    ngay_gan TIMESTAMP,
    PRIMARY KEY (nguoi_dung_id, vai_tro_id),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id)
);

CREATE TABLE IF NOT EXISTS vai_tro_phan_quyen (
    vai_tro_id UUID,
    phan_quyen_id UUID,
    PRIMARY KEY (vai_tro_id, phan_quyen_id),
    FOREIGN KEY (vai_tro_id) REFERENCES vai_tro(vai_tro_id),
    FOREIGN KEY (phan_quyen_id) REFERENCES phan_quyen(phan_quyen_id)
);

-- II. Há»’ SÆ  ÄI NÆ¯á»šC NGOÃ€I (3 báº£ng)

CREATE TABLE IF NOT EXISTS ho_so_di_nuoc_ngoai (
    ho_so_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ma_ho_so VARCHAR(30),
    vien_chuc_id UUID,
    muc_dich_id INT,
    loai_chuyen_di_id INT,
    quoc_gia_id INT,
    tu_ngay DATE,
    den_ngay DATE,
    kinh_phi_du_kien DECIMAL(15,2),
    trang_thai_id INT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ghi_chu TEXT,
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id)
);

CREATE TABLE IF NOT EXISTS tai_lieu_dinh_kem (
    tai_lieu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    loai_tai_lieu_id INT,
    ten_file VARCHAR(255),
    duong_dan_file VARCHAR(500),
    kich_thuoc BIGINT,
    ngay_tai_len TIMESTAMP,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id)
);

CREATE TABLE IF NOT EXISTS bao_cao_sau_chuyen_di (
    bao_cao_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID UNIQUE,
    ngay_nop DATE,
    noi_dung TEXT,
    ket_qua_chuyen_di TEXT,
    de_xuat_kien_nghi TEXT,
    nop_cho_chi_bo BOOLEAN,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id)
);

-- III. PHÃŠ DUYá»†T  WORKFLOW (6 báº£ng)

CREATE TABLE IF NOT EXISTS cap_phe_duyet (
    cap_phe_duyet_id INT PRIMARY KEY,
    ma_cap VARCHAR(20),
    ten_cap VARCHAR(100),
    thu_tu INT
);

CREATE TABLE IF NOT EXISTS phe_duyet (
    phe_duyet_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    cap_phe_duyet_id INT,
    nguoi_duyet_id UUID,
    ket_qua BOOLEAN,
    thoi_diem_duyet TIMESTAMP,
    y_kien TEXT,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (cap_phe_duyet_id) REFERENCES cap_phe_duyet(cap_phe_duyet_id),
    FOREIGN KEY (nguoi_duyet_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

CREATE TABLE IF NOT EXISTS luong_xu_ly (
    luong_xu_ly_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ten_luong VARCHAR(100),
    loai_ap_dung VARCHAR(50),
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS buoc_xu_ly (
    buoc_xu_ly_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    luong_xu_ly_id UUID,
    ten_buoc VARCHAR(100),
    thu_tu INT,
    vai_tro_xu_ly VARCHAR(100),
    FOREIGN KEY (luong_xu_ly_id) REFERENCES luong_xu_ly(luong_xu_ly_id)
);

CREATE TABLE IF NOT EXISTS ho_so_buoc_xu_ly (
    ho_so_id UUID,
    buoc_xu_ly_id UUID,
    trang_thai VARCHAR(50),
    thoi_diem_bat_dau TIMESTAMP,
    thoi_diem_ket_thuc TIMESTAMP,
    PRIMARY KEY (ho_so_id, buoc_xu_ly_id),
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (buoc_xu_ly_id) REFERENCES buoc_xu_ly(buoc_xu_ly_id)
);

CREATE TABLE IF NOT EXISTS lich_su_trang_thai (
    lich_su_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    trang_thai_id INT,
    thoi_diem TIMESTAMP,
    nguoi_thuc_hien_id UUID,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (nguoi_thuc_hien_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

-- IV. Äáº¢NG VIÃŠN (3 báº£ng)

CREATE TABLE IF NOT EXISTS don_vi_dang (
    don_vi_dang_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ten_don_vi VARCHAR(255),
    cap_do VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS thong_tin_dang_vien (
    thong_tin_dang_vien_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vien_chuc_id UUID UNIQUE,
    don_vi_dang_id UUID,
    ngay_vao_dang DATE,
    loai_dang_vien VARCHAR(50),
    FOREIGN KEY (vien_chuc_id) REFERENCES vien_chuc(vien_chuc_id),
    FOREIGN KEY (don_vi_dang_id) REFERENCES don_vi_dang(don_vi_dang_id)
);

CREATE TABLE IF NOT EXISTS phe_duyet_dang (
    phe_duyet_dang_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID,
    don_vi_dang_id UUID,
    nguoi_duyet VARCHAR(255),
    ket_qua BOOLEAN,
    ngay_duyet DATE,
    y_kien TEXT,
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (don_vi_dang_id) REFERENCES don_vi_dang(don_vi_dang_id)
);

-- V. QUYáº¾T Äá»ŠNH  VÄ‚N THÆ¯ (4 báº£ng)

CREATE TABLE IF NOT EXISTS loai_quyet_dinh (
    loai_quyet_dinh_id INT PRIMARY KEY,
    ten_loai VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS so_van_ban (
    so_van_ban_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nam INT,
    so_hien_tai INT,
    loai_quyet_dinh_id INT,
    FOREIGN KEY (loai_quyet_dinh_id) REFERENCES loai_quyet_dinh(loai_quyet_dinh_id)
);

CREATE TABLE IF NOT EXISTS quyet_dinh (
    quyet_dinh_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ho_so_id UUID UNIQUE,
    so_quyet_dinh VARCHAR(50),
    ngay_ky DATE,
    nguoi_ky VARCHAR(255),
    loai_quyet_dinh_id INT,
    so_van_ban_id UUID,
    trang_thai VARCHAR(50),
    FOREIGN KEY (ho_so_id) REFERENCES ho_so_di_nuoc_ngoai(ho_so_id),
    FOREIGN KEY (loai_quyet_dinh_id) REFERENCES loai_quyet_dinh(loai_quyet_dinh_id),
    FOREIGN KEY (so_van_ban_id) REFERENCES so_van_ban(so_van_ban_id)
);

CREATE TABLE IF NOT EXISTS tep_van_ban (
    tep_van_ban_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quyet_dinh_id UUID,
    ten_file VARCHAR(255),
    duong_dan VARCHAR(500),
    ngay_tai_len TIMESTAMP,
    FOREIGN KEY (quyet_dinh_id) REFERENCES quyet_dinh(quyet_dinh_id)
);

-- VI. DANH Má»¤C (5 báº£ng)

CREATE TABLE IF NOT EXISTS dm_muc_dich_chuyen_di (
    id INT PRIMARY KEY,
    ma VARCHAR(20),
    ten VARCHAR(255),
    mo_ta TEXT,
    trang_thai BOOLEAN
);

CREATE TABLE IF NOT EXISTS dm_loai_chuyen_di (
    loai_chuyen_di_id INT PRIMARY KEY,
    ma VARCHAR(20),
    ten VARCHAR(255),
    mo_ta TEXT,
    trang_thai BOOLEAN
);

CREATE TABLE IF NOT EXISTS dm_quoc_gia (
    quoc_gia_id INT PRIMARY KEY,
    ma VARCHAR(10),
    ten VARCHAR(255),
    mo_ta TEXT,
    trang_thai BOOLEAN
);

CREATE TABLE IF NOT EXISTS dm_loai_tai_lieu (
    loai_tai_lieu_id INT PRIMARY KEY,
    ma VARCHAR(30),
    ten VARCHAR(255),
    mo_ta TEXT,
    trang_thai BOOLEAN
);

CREATE TABLE IF NOT EXISTS dm_trang_thai_ho_so (
    trang_thai_id INT PRIMARY KEY,
    ma VARCHAR(30),
    ten VARCHAR(255),
    mo_ta TEXT,
    trang_thai BOOLEAN
);

-- VII. Báº¢O Máº¬T  Há»† THá»NG (8 báº£ng)

CREATE TABLE IF NOT EXISTS audit_log (
    audit_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nguoi_dung_id UUID,
    hanh_dong VARCHAR(100),
    bang_tac_dong VARCHAR(100),
    ban_ghi_id UUID,
    thoi_diem TIMESTAMP,
    dia_chi_ip VARCHAR(45),
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

CREATE TABLE IF NOT EXISTS lich_su_dang_nhap (
    lich_su_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nguoi_dung_id UUID,
    thoi_diem TIMESTAMP,
    dia_chi_ip VARCHAR(45),
    ket_qua BOOLEAN,
    FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

CREATE TABLE IF NOT EXISTS cau_hinh_he_thong (
    cau_hinh_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    khoa VARCHAR(100),
    gia_tri TEXT,
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS thong_bao (
    thong_bao_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nguoi_nhan_id UUID,
    noi_dung TEXT,
    da_doc BOOLEAN,
    thoi_diem TIMESTAMP,
    FOREIGN KEY (nguoi_nhan_id) REFERENCES nguoi_dung(nguoi_dung_id)
);

CREATE TABLE IF NOT EXISTS hang_doi_xu_ly (
    hang_doi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loai_tac_vu VARCHAR(100),
    du_lieu JSON,
    trang_thai VARCHAR(50),
    thoi_diem_tao TIMESTAMP
);

CREATE TABLE IF NOT EXISTS thoi_han_nghiep_vu (
    thoi_han_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loai_nghiep_vu VARCHAR(100),
    so_ngay INT,
    mo_ta TEXT
);

CREATE TABLE IF NOT EXISTS bao_tri_he_thong (
    bao_tri_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thoi_diem TIMESTAMP,
    noi_dung TEXT,
    nguoi_thuc_hien VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tep_dinh_kem (
    tep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    duong_dan VARCHAR(500),
    loai_tep VARCHAR(50),
    kich_thuoc BIGINT,
    ngay_tao TIMESTAMP
);

