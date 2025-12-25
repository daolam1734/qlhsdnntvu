-- Seed data for QLHS_DNN_TVU
-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- I. DANH MỤC CHÍNH
-- 1. Trạng thái hồ sơ
INSERT INTO dm_trang_thai_ho_so (trang_thai_id, ma, ten)
VALUES
(1,'DRAFT','Nháp'),
(2,'CHO_DUYET','Chờ duyệt'),
(3,'DANG_XU_LY','Đang xử lý'),
(4,'DA_DUYET','Đã duyệt'),
(5,'TU_CHOI','Từ chối'),
(6,'HOAN_TAT','Hoàn tất');

-- 2. Cấp phê duyệt (theo luồng)
INSERT INTO cap_phe_duyet (cap_phe_duyet_id, ma_cap, ten_cap, thu_tu)
VALUES
(1,'TRUONG_DV','Trưởng đơn vị',1),
(2,'CHI_BO','Chi bộ',2),
(3,'DANG_UY','Đảng ủy',3),
(4,'TCHC','Phòng TCHC',4),
(5,'BGH','Ban Giám hiệu',5);

-- 3. Vai trò hệ thống
INSERT INTO vai_tro (vai_tro_id, ma_vai_tro, ten_vai_tro)
VALUES
(uuid_generate_v4(),'VIEN_CHUC','Viên chức'),
(uuid_generate_v4(),'TRUONG_DON_VI','Trưởng đơn vị'),
(uuid_generate_v4(),'CHI_BO','Chi bộ'),
(uuid_generate_v4(),'DANG_UY','Đảng ủy'),
(uuid_generate_v4(),'TCHC','Phòng Tổ chức Hành chính'),
(uuid_generate_v4(),'BGH','Ban Giám hiệu');

-- II. TẠO ĐƠN VỊ ĐẢNG & GẮN ĐẢNG VIÊN
-- 4. Đơn vị Đảng
INSERT INTO don_vi_dang (don_vi_dang_id, ten_don_vi, cap_do)
VALUES
(uuid_generate_v4(),'Chi bộ Khoa CNTT','CHI_BO'),
(uuid_generate_v4(),'Đảng ủy Trường CET','DANG_UY');

-- 5. Gán thông tin Đảng viên (ví dụ: Trưởng khoa)
INSERT INTO thong_tin_dang_vien (thong_tin_dang_vien_id, vien_chuc_id, don_vi_dang_id)
SELECT
    uuid_generate_v4(),
    vien_chuc_id,
    (SELECT don_vi_dang_id FROM don_vi_dang WHERE cap_do='CHI_BO')
FROM vien_chuc
WHERE ma_vien_chuc = 'VC001';

-- III. TẠO TÀI KHOẢN & PHÂN QUYỀN (ĐỂ DUYỆT)
-- 6. Tài khoản người dùng (ví dụ 4 vai trò chính)
INSERT INTO nguoi_dung (nguoi_dung_id, vien_chuc_id, ten_dang_nhap, mat_khau_hash, email)
SELECT uuid_generate_v4(), vien_chuc_id, 'vc001','hash123','lamnn@tvu.edu.vn'
FROM vien_chuc WHERE ma_vien_chuc='VC001';

INSERT INTO nguoi_dung (nguoi_dung_id, vien_chuc_id, ten_dang_nhap, mat_khau_hash, email)
SELECT uuid_generate_v4(), vien_chuc_id, 'vc006','hash123','phuocmien@tvu.edu.vn'
FROM vien_chuc WHERE ma_vien_chuc='VC006';

-- (Các vai trò TCHC, BGH có thể tạo tương tự – tôi giữ gọn để demo)

-- IV. DEMO LẬP HỒ SƠ ĐI NƯỚC NGOÀI
-- 7. Viên chức lập hồ sơ
INSERT INTO ho_so_di_nuoc_ngoai (
    ho_so_id, ma_ho_so, vien_chuc_id,
    loai_chuyen_di_id, quoc_gia_id,
    tu_ngay, den_ngay, trang_thai_id
)
SELECT
    uuid_generate_v4(),
    'HS001',
    vien_chuc_id,
    1, 1,
    '2025-03-01','2025-03-10',
    2
FROM vien_chuc
WHERE ma_vien_chuc='VC006';

-- V. PHÊ DUYỆT THEO ĐÚNG LUỒNG
-- 8. Trưởng đơn vị duyệt
INSERT INTO phe_duyet (
    phe_duyet_id, ho_so_id, cap_phe_duyet_id, nguoi_duyet_id, ket_qua
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    1,
    (SELECT nguoi_dung_id FROM nguoi_dung WHERE ten_dang_nhap='vc001'),
    TRUE
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- 9. Phê duyệt Đảng (Chi bộ → Đảng ủy)
INSERT INTO phe_duyet_dang (
    phe_duyet_dang_id, ho_so_id, don_vi_dang_id, nguoi_duyet, ket_qua
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    (SELECT don_vi_dang_id FROM don_vi_dang WHERE cap_do='CHI_BO'),
    'Bí thư Chi bộ',
    TRUE
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- 10. Phòng TCHC & BGH duyệt
INSERT INTO phe_duyet (phe_duyet_id, ho_so_id, cap_phe_duyet_id, ket_qua)
SELECT uuid_generate_v4(), ho_so_id, 4, TRUE
FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so='HS001';

INSERT INTO phe_duyet (phe_duyet_id, ho_so_id, cap_phe_duyet_id, ket_qua)
SELECT uuid_generate_v4(), ho_so_id, 5, TRUE
FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so='HS001';

-- VI. BAN HÀNH QUYẾT ĐỊNH
INSERT INTO loai_quyet_dinh (loai_quyet_dinh_id, ten_loai)
VALUES (1,'Cử đi công tác nước ngoài');

INSERT INTO quyet_dinh (
    quyet_dinh_id, ho_so_id, so_quyet_dinh, ngay_ky, nguoi_ky, loai_quyet_dinh_id
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    'QD-001/2025',
    CURRENT_DATE,
    'Hiệu trưởng',
    1
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- VII. BÁO CÁO SAU CHUYẾN ĐI
INSERT INTO bao_cao_sau_chuyen_di (
    bao_cao_id, ho_so_id, ngay_nop, noi_dung
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    CURRENT_DATE,
    'Hoàn thành chuyến công tác, đạt mục tiêu đề ra.'
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- VIII. LƯU TRỮ – TRUY VẾT
INSERT INTO audit_log (
    audit_log_id, nguoi_dung_id, hanh_dong, bang_tac_dong, ban_ghi_id
)
SELECT
    uuid_generate_v4(),
    nguoi_dung_id,
    'CREATE_HO_SO',
    'ho_so_di_nuoc_ngoai',
    ho_so_id
FROM nguoi_dung, ho_so_di_nuoc_ngoai
WHERE ten_dang_nhap='vc006' AND ma_ho_so='HS001';