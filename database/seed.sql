-- Seed data for QLHS_DNN_TVU
-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- I. DANH MỤC CHÍNH
-- 1. Mục đích chuyến đi
INSERT INTO dm_muc_dich_chuyen_di (id, ma, ten, mo_ta, trang_thai)
VALUES
(1, 'CONG_TAC', 'Công tác', 'Chuyến đi công tác chính thức', TRUE),
(2, 'HOC_TAP', 'Học tập', 'Chuyến đi học tập, đào tạo', TRUE),
(3, 'NGHIEN_CUU', 'Nghiên cứu', 'Chuyến đi nghiên cứu khoa học', TRUE);

-- 2. Loại chuyến đi
INSERT INTO dm_loai_chuyen_di (loai_chuyen_di_id, ma, ten, mo_ta, trang_thai)
VALUES
(1, 'QUOC_TE', 'Quốc tế', 'Chuyến đi ra nước ngoài', TRUE),
(2, 'TRONG_NUOC', 'Trong nước', 'Chuyến đi trong nước', TRUE);

-- 3. Quốc gia
INSERT INTO dm_quoc_gia (quoc_gia_id, ma, ten, mo_ta, trang_thai)
VALUES
(1, 'VN', 'Việt Nam', 'Nước sở tại', TRUE),
(2, 'US', 'Hoa Kỳ', 'United States', TRUE),
(3, 'JP', 'Nhật Bản', 'Japan', TRUE),
(4, 'KR', 'Hàn Quốc', 'South Korea', TRUE),
(5, 'CN', 'Trung Quốc', 'China', TRUE);

-- 4. Loại tài liệu
INSERT INTO dm_loai_tai_lieu (loai_tai_lieu_id, ma, ten, mo_ta, trang_thai)
VALUES
(1, 'DON_XIN_DI', 'Đơn xin đi', 'Đơn xin phép đi nước ngoài', TRUE),
(2, 'HO_CHIEU', 'Hộ chiếu', 'Bản sao hộ chiếu', TRUE),
(3, 'KE_HOACH', 'Kế hoạch', 'Kế hoạch chuyến đi', TRUE),
(4, 'BAO_CAO', 'Báo cáo', 'Báo cáo sau chuyến đi', TRUE);

-- 5. Trạng thái hồ sơ
INSERT INTO dm_trang_thai_ho_so (trang_thai_id, ma, ten, mo_ta, trang_thai)
VALUES
(1,'DRAFT','Nháp', 'Hồ sơ đang soạn thảo', TRUE),
(2,'CHO_DUYET','Chờ duyệt', 'Hồ sơ đang chờ phê duyệt', TRUE),
(3,'DANG_XU_LY','Đang xử lý', 'Hồ sơ đang được xử lý', TRUE),
(4,'DA_DUYET','Đã duyệt', 'Hồ sơ đã được duyệt', TRUE),
(5,'TU_CHOI','Từ chối', 'Hồ sơ bị từ chối', TRUE),
(6,'HOAN_TAT','Hoàn tất', 'Hồ sơ đã hoàn tất', TRUE);

-- 2. Cấp phê duyệt (theo luồng)
INSERT INTO cap_phe_duyet (cap_phe_duyet_id, ma_cap, ten_cap, thu_tu)
VALUES
(1,'TRUONG_DV','Trưởng đơn vị',1),
(2,'CHI_BO','Chi bộ',2),
(3,'DANG_UY','Đảng ủy',3),
(4,'TCHC','Phòng TCHC',4),
(5,'BGH','Ban Giám hiệu',5);

-- II. ĐƠN VỊ VÀ VIÊN CHỨC
-- 6. Đơn vị
INSERT INTO don_vi (don_vi_id, ma_don_vi, ten_don_vi, cap_don_vi)
VALUES
(uuid_generate_v4(), 'DV001', 'Khoa Công nghệ Thông tin', 'KHOA'),
(uuid_generate_v4(), 'DV002', 'Phòng Tổ chức Hành chính', 'PHONG'),
(uuid_generate_v4(), 'DV003', 'Ban Giám hiệu', 'BAN');

-- 7. Viên chức
INSERT INTO vien_chuc (vien_chuc_id, ma_vien_chuc, ho_ten, ngay_sinh, gioi_tinh, don_vi_id, chuc_vu)
VALUES
(uuid_generate_v4(), 'VC001', 'Nguyễn Văn Lâm', '1980-01-01', 'Nam', (SELECT don_vi_id FROM don_vi WHERE ma_don_vi='DV001'), 'Trưởng khoa'),
(uuid_generate_v4(), 'VC006', 'Phước Miên', '1985-05-05', 'Nam', (SELECT don_vi_id FROM don_vi WHERE ma_don_vi='DV001'), 'Giảng viên');

-- 8. Vai trò hệ thống
INSERT INTO vai_tro (vai_tro_id, ma_vai_tro, ten_vai_tro, mo_ta)
VALUES
(uuid_generate_v4(),'VIEN_CHUC','Viên chức', 'Người dùng thông thường'),
(uuid_generate_v4(),'TRUONG_DON_VI','Trưởng đơn vị', 'Người phê duyệt cấp đơn vị'),
(uuid_generate_v4(),'CHI_BO','Chi bộ', 'Người phê duyệt Đảng cấp chi bộ'),
(uuid_generate_v4(),'DANG_UY','Đảng ủy', 'Người phê duyệt Đảng cấp đảng ủy'),
(uuid_generate_v4(),'TCHC','Phòng Tổ chức Hành chính', 'Người phê duyệt hành chính'),
(uuid_generate_v4(),'BGH','Ban Giám hiệu', 'Người phê duyệt cấp cao nhất');

-- II. TẠO ĐƠN VỊ ĐẢNG & GẮN ĐẢNG VIÊN
-- 4. Đơn vị Đảng
INSERT INTO don_vi_dang (don_vi_dang_id, ten_don_vi, cap_do)
VALUES
(uuid_generate_v4(),'Chi bộ Khoa CNTT','CHI_BO'),
(uuid_generate_v4(),'Đảng ủy Trường CET','DANG_UY');

-- 9. Gán thông tin Đảng viên (ví dụ: Trưởng khoa)
INSERT INTO thong_tin_dang_vien (thong_tin_dang_vien_id, vien_chuc_id, don_vi_dang_id, ngay_vao_dang, loai_dang_vien)
SELECT
    uuid_generate_v4(),
    vien_chuc_id,
    (SELECT don_vi_dang_id FROM don_vi_dang WHERE cap_do='CHI_BO'),
    '2000-01-01',
    'CHINH_THUC'
FROM vien_chuc
WHERE ma_vien_chuc = 'VC001';

-- III. TẠO TÀI KHOẢN & PHÂN QUYỀN (ĐỂ DUYỆT)
-- 10. Tài khoản người dùng (ví dụ 4 vai trò chính)
INSERT INTO nguoi_dung (nguoi_dung_id, vien_chuc_id, ten_dang_nhap, mat_khau_hash, email, trang_thai)
SELECT uuid_generate_v4(), vien_chuc_id, 'vc001','hash123','lamnn@tvu.edu.vn', TRUE
FROM vien_chuc WHERE ma_vien_chuc='VC001';

INSERT INTO nguoi_dung (nguoi_dung_id, vien_chuc_id, ten_dang_nhap, mat_khau_hash, email, trang_thai)
SELECT uuid_generate_v4(), vien_chuc_id, 'vc006','hash123','phuocmien@tvu.edu.vn', TRUE
FROM vien_chuc WHERE ma_vien_chuc='VC006';

-- (Các vai trò TCHC, BGH có thể tạo tương tự – tôi giữ gọn để demo)

-- IV. DEMO LẬP HỒ SƠ ĐI NƯỚC NGOÀI
-- 11. Viên chức lập hồ sơ
INSERT INTO ho_so_di_nuoc_ngoai (
    ho_so_id, ma_ho_so, vien_chuc_id, muc_dich_id,
    loai_chuyen_di_id, quoc_gia_id,
    tu_ngay, den_ngay, kinh_phi_du_kien, trang_thai_id, ghi_chu
)
SELECT
    uuid_generate_v4(),
    'HS001',
    vien_chuc_id,
    1, 1, 2,
    '2025-03-01','2025-03-10', 50000.00, 2, 'Chuyến công tác quan trọng'
FROM vien_chuc
WHERE ma_vien_chuc='VC006';

-- V. PHÊ DUYỆT THEO ĐÚNG LUỒNG
-- 12. Trưởng đơn vị duyệt
INSERT INTO phe_duyet (
    phe_duyet_id, ho_so_id, cap_phe_duyet_id, nguoi_duyet_id, ket_qua, thoi_diem_duyet, y_kien
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    1,
    (SELECT nguoi_dung_id FROM nguoi_dung WHERE ten_dang_nhap='vc001'),
    TRUE, CURRENT_TIMESTAMP, 'Đồng ý phê duyệt'
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- 13. Phê duyệt Đảng (Chi bộ → Đảng ủy)
INSERT INTO phe_duyet_dang (
    phe_duyet_dang_id, ho_so_id, don_vi_dang_id, nguoi_duyet, ket_qua, ngay_duyet, y_kien
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    (SELECT don_vi_dang_id FROM don_vi_dang WHERE cap_do='CHI_BO'),
    'Bí thư Chi bộ',
    TRUE, CURRENT_DATE, 'Đồng ý phê duyệt Đảng'
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- 14. Phòng TCHC & BGH duyệt
INSERT INTO phe_duyet (phe_duyet_id, ho_so_id, cap_phe_duyet_id, ket_qua, thoi_diem_duyet, y_kien)
SELECT uuid_generate_v4(), ho_so_id, 4, TRUE, CURRENT_TIMESTAMP, 'Phê duyệt hành chính'
FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so='HS001';

INSERT INTO phe_duyet (phe_duyet_id, ho_so_id, cap_phe_duyet_id, ket_qua, thoi_diem_duyet, y_kien)
SELECT uuid_generate_v4(), ho_so_id, 5, TRUE, CURRENT_TIMESTAMP, 'Phê duyệt cấp cao'
FROM ho_so_di_nuoc_ngoai WHERE ma_ho_so='HS001';

-- VI. BAN HÀNH QUYẾT ĐỊNH
INSERT INTO loai_quyet_dinh (loai_quyet_dinh_id, ten_loai, mo_ta)
VALUES (1,'Cử đi công tác nước ngoài', 'Quyết định cử viên chức đi công tác tại nước ngoài');

INSERT INTO so_van_ban (so_van_ban_id, nam, so_hien_tai, loai_quyet_dinh_id)
VALUES (uuid_generate_v4(), 2025, 1, 1);

INSERT INTO quyet_dinh (
    quyet_dinh_id, ho_so_id, so_quyet_dinh, ngay_ky, nguoi_ky, loai_quyet_dinh_id, so_van_ban_id, trang_thai
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    'QD-001/2025',
    CURRENT_DATE,
    'Hiệu trưởng',
    1,
    (SELECT so_van_ban_id FROM so_van_ban WHERE nam=2025 AND loai_quyet_dinh_id=1),
    'BAN_HANH'
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- VII. BÁO CÁO SAU CHUYẾN ĐI
INSERT INTO bao_cao_sau_chuyen_di (
    bao_cao_id, ho_so_id, ngay_nop, noi_dung, ket_qua_chuyen_di, de_xuat_kien_nghi, nop_cho_chi_bo
)
SELECT
    uuid_generate_v4(),
    ho_so_id,
    CURRENT_DATE,
    'Hoàn thành chuyến công tác, đạt mục tiêu đề ra.',
    'Thành công tốt đẹp',
    'Tăng cường hợp tác quốc tế',
    TRUE
FROM ho_so_di_nuoc_ngoai
WHERE ma_ho_so='HS001';

-- VIII. LƯU TRỮ – TRUY VẾT
INSERT INTO audit_log (
    audit_log_id, nguoi_dung_id, hanh_dong, bang_tac_dong, ban_ghi_id, thoi_diem, dia_chi_ip
)
SELECT
    uuid_generate_v4(),
    nguoi_dung_id,
    'CREATE_HO_SO',
    'ho_so_di_nuoc_ngoai',
    ho_so_id,
    CURRENT_TIMESTAMP,
    '192.168.1.1'
FROM nguoi_dung, ho_so_di_nuoc_ngoai
WHERE ten_dang_nhap='vc006' AND ma_ho_so='HS001';