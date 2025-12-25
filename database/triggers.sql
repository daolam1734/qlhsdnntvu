-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

CREATE OR REPLACE FUNCTION fn_chk_quyet_dinh_phe_duyet()
RETURNS TRIGGER AS $$
DECLARE
    v_is_dang_vien BOOLEAN;
    v_count_phe_duyet INT;
BEGIN
    -- Kiểm tra hồ sơ có phải Đảng viên không
    SELECT la_dang_vien
    INTO v_is_dang_vien
    FROM vien_chuc vc
    JOIN ho_so_di_nuoc_ngoai hs ON hs.vien_chuc_id = vc.vien_chuc_id
    WHERE hs.ho_so_id = NEW.ho_so_id;

    -- Kiểm tra đủ các cấp phê duyệt hành chính
    SELECT COUNT(DISTINCT cap_phe_duyet_id)
    INTO v_count_phe_duyet
    FROM phe_duyet
    WHERE ho_so_id = NEW.ho_so_id
      AND ket_qua = TRUE
      AND cap_phe_duyet_id IN (1,4,5); -- Trưởng DV, TCHC, BGH

    IF v_count_phe_duyet < 3 THEN
        RAISE EXCEPTION 'Hồ sơ chưa đủ phê duyệt hành chính';
    END IF;

    -- Nếu là Đảng viên -> bắt buộc có phê duyệt Đảng
    IF v_is_dang_vien THEN
        IF NOT EXISTS (
            SELECT 1 FROM phe_duyet_dang
            WHERE ho_so_id = NEW.ho_so_id AND ket_qua = TRUE
        ) THEN
            RAISE EXCEPTION 'Hồ sơ Đảng viên chưa được phê duyệt Đảng';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_quyet_dinh_phe_duyet
BEFORE INSERT ON quyet_dinh
FOR EACH ROW
EXECUTE FUNCTION fn_chk_quyet_dinh_phe_duyet();

CREATE OR REPLACE FUNCTION fn_chk_hoan_tat_co_bao_cao()
RETURNS TRIGGER AS $$
BEGIN
    -- Nếu chuyển trạng thái sang HOAN_TAT (id = 6)
    IF NEW.trang_thai_id = 6 THEN
        IF NOT EXISTS (
            SELECT 1 FROM bao_cao_sau_chuyen_di
            WHERE ho_so_id = NEW.ho_so_id
        ) THEN
            RAISE EXCEPTION 'Không thể hoàn tất hồ sơ khi chưa có báo cáo sau chuyến đi';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_hoan_tat
BEFORE UPDATE OF trang_thai_id ON ho_so_di_nuoc_ngoai
FOR EACH ROW
EXECUTE FUNCTION fn_chk_hoan_tat_co_bao_cao();

CREATE OR REPLACE FUNCTION fn_chk_thu_tu_phe_duyet()
RETURNS TRIGGER AS $$
DECLARE
    v_min_thu_tu INT;
BEGIN
    -- Lấy thứ tự cấp hiện tại
    SELECT thu_tu
    INTO v_min_thu_tu
    FROM cap_phe_duyet
    WHERE cap_phe_duyet_id = NEW.cap_phe_duyet_id;

    -- Kiểm tra các cấp trước đó đã duyệt chưa
    IF EXISTS (
        SELECT 1
        FROM cap_phe_duyet c
        WHERE c.thu_tu < v_min_thu_tu
        AND NOT EXISTS (
            SELECT 1 FROM phe_duyet p
            WHERE p.cap_phe_duyet_id = c.cap_phe_duyet_id
              AND p.ho_so_id = NEW.ho_so_id
              AND p.ket_qua = TRUE
        )
    ) THEN
        RAISE EXCEPTION 'Chưa duyệt đủ các cấp trước đó';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_thu_tu_phe_duyet
BEFORE INSERT ON phe_duyet
FOR EACH ROW
EXECUTE FUNCTION fn_chk_thu_tu_phe_duyet();

CREATE OR REPLACE FUNCTION fn_log_lich_su_trang_thai()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO lich_su_trang_thai (
        lich_su_id,
        ho_so_id,
        trang_thai_id,
        thoi_diem,
        nguoi_thuc_hien_id
    )
    VALUES (
        uuid_generate_v4(),
        NEW.ho_so_id,
        NEW.trang_thai_id,
        CURRENT_TIMESTAMP,
        NULL
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_trang_thai
AFTER UPDATE OF trang_thai_id ON ho_so_di_nuoc_ngoai
FOR EACH ROW
EXECUTE FUNCTION fn_log_lich_su_trang_thai();

CREATE OR REPLACE FUNCTION fn_lock_quyet_dinh()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Không được chỉnh sửa quyết định đã ban hành';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lock_quyet_dinh
BEFORE UPDATE OR DELETE ON quyet_dinh
FOR EACH ROW
EXECUTE FUNCTION fn_lock_quyet_dinh();