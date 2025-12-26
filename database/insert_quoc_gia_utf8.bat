@echo off
chcp 65001 > nul
psql -U postgres -d qlhs_dnn_tvu -c "\encoding UTF8" -c "
INSERT INTO dm_quoc_gia (id, ten, ma_quoc_gia, vung, trang_thai) VALUES
(1, 'Việt Nam', 'VN', 'Đông Nam Á', true),
(2, 'Nhật Bản', 'JP', 'Châu Á', true),
(3, 'Hàn Quốc', 'KR', 'Châu Á', true),
(4, 'Trung Quốc', 'CN', 'Châu Á', true),
(5, 'Singapore', 'SG', 'Đông Nam Á', true);
"