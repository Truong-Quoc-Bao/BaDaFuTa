select * from category

update merchant
SET time_open = '{
  "monday":    { "open": "06:30", "close": "20:30" },
  "tuesday":   { "open": "06:30", "close": "20:30" },
  "wednesday": { "open": "06:30", "close": "20:30" },
  "thursday":  { "open": "06:30", "close": "20:30" },
  "friday":    { "open": "06:30", "close": "21:00" },
  "saturday":  { "open": "07:00", "close": "21:30" },
  "sunday":    { "open": "07:00", "close": "21:00" }
}'::jsonb
WHERE merchant_name = 'Cà Phê Sài Gòn';
UPDATE merchant
SET time_open = '{
  "monday":    { "open": "10:00", "close": "22:00" },
  "tuesday":   { "open": "10:00", "close": "22:00" },
  "wednesday": { "open": "10:00", "close": "22:00" },
  "thursday":  { "open": "10:00", "close": "22:00" },
  "friday":    { "open": "10:00", "close": "23:00" },
  "saturday":  { "open": "09:30", "close": "23:00" },
  "sunday":    { "open": "09:30", "close": "22:30" }
}'::jsonb
WHERE merchant_name = 'Phở Hà Nội';UPDATE merchant
SET time_open = '{
  "monday":    { "open": "17:00", "close": "01:00" },
  "tuesday":   { "open": "17:00", "close": "01:00" },
  "wednesday": { "open": "17:00", "close": "01:00" },
  "thursday":  { "open": "17:00", "close": "02:00" },
  "friday":    { "open": "17:00", "close": "03:00" },
  "saturday":  { "open": "17:00", "close": "03:00" },
  "sunday":    { "open": "17:00", "close": "00:00" }
}
'::jsonb
WHERE merchant_name = 'Seoul BBQ House';


ALTER TABLE merchant
ADD COLUMN cuisine VARCHAR(255);


CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),      -- Khóa chính UUID tự sinh
  image JSONB,                                        -- Ảnh (JSON linh hoạt)
  full_name VARCHAR(255) NOT NULL,                    -- Họ tên
  role VARCHAR(50),                                   -- Vai trò (có thể để trống)
  birth DATE,                                         -- Ngày sinh
  password VARCHAR(255) NOT NULL,                     -- Mật khẩu (đã hash)
  phone VARCHAR(20) UNIQUE NOT NULL,                  -- Số điện thoại (duy nhất & bắt buộc)
  email VARCHAR(255) UNIQUE NOT NULL,                 -- Email (duy nhất)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- Ngày tạo
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP      -- Ngày cập nhật
);


INSERT INTO users (id, image, full_name, role, birth, password, phone, email, created_at, updated_at)
VALUES
  (
    '20ebce7b-2696-4bf8-a6e5-4f4539a5bfc0',
    null,
    'Thương Đình Minh Hy',
    'merchant',
    '1995-06-15',
    '123456a',
    '0952052025',
    'minhhythuongdinh1506@gmail.com',
    NOW(),
    NOW()
  ),
  (
    'c1d867ed-cedd-439a-83f4-aef2bc019f1b',
    null,
    'Dương Phạm Hoài Thương',
    'merchant',
    '1998-10-05',
    '123456a',
    '0973073037',
    'hoaithuongduongpham0510@gmail.com',
    NOW(),
    NOW()
  ),
  (
    '09275220-7fb7-497d-a866-d3828fa5aa75',
    null,
    'Khưu Thị Diễm Trinh',
    'merchant',
    '1990-03-22',
    '123456a',
    '0953053035',
    'diemtrinhkhuuthi@gmail.com',
    NOW(),
    NOW()
  );
ALTER TABLE merchant
ADD CONSTRAINT fk_merchant_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

select * from users








-- ===========================
-- 🧍 USERS (12 merchants)
-- ===========================
INSERT INTO users (id, image, full_name, role, birth, password, phone, email, created_at, updated_at)
VALUES
  (gen_random_uuid(), NULL, 'Seoul Korean Foof', 'merchant', '1911-12-01', '123456a', '0989001001', 'seoulkoreanfood@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'KFC Vietnam', 'merchant', '1995-01-01', '123456a', '0901001001', 'kfc@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Jollibee Vietnam', 'merchant', '1995-01-01', '123456a', '0901001002', 'jollibee@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'McDonald''s Vietnam', 'merchant', '1995-01-01', '123456a', '0901001003', 'mcdonalds@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Phê La', 'merchant', '1995-01-01', '123456a', '0901001004', 'phela@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Phúc Long', 'merchant', '1995-01-01', '123456a', '0901001005', 'phuclong@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Katinat Saigon Kafe', 'merchant', '1995-01-01', '123456a', '0901001006', 'katinat@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Cơm Tấm Phúc Lộc Thọ', 'merchant', '1995-01-01', '123456a', '0901001007', 'phucloctho@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Bánh Mì Huynh Hoa', 'merchant', '1995-01-01', '123456a', '0901001008', 'huynhhoa@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Busan BBQ', 'merchant', '1995-01-01', '123456a', '0901001009', 'busanbbq@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Seoul Kitchen', 'merchant', '1995-01-01', '123456a', '0901001010', 'seoulkitchen@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Sasin Spicy Noodles', 'merchant', '1995-01-01', '123456a', '0901001011', 'sasin@gmail.com', NOW(), NOW()),
  (gen_random_uuid(), NULL, 'Phở Hà Nội', 'merchant', '1995-01-01', '123456a', '0901001012', 'pho@gmail.com', NOW(), NOW());




select * from users

UPDATE users
SET password = crypt('123456a', gen_salt('bf'))
WHERE email = 'seoulkoreanfood@gmail.com';

update users
set full_name = 'Seoul BBQ House'
where phone = '0901001010'

Seoul BBQ House


select * from merchant



-- ========== DỮ LIỆU MẪU CHO BẢNG merchant ==========
-- Tất cả có time_open cùng cấu trúc, giờ mở/đóng giống nhau
-- (copy chạy trực tiếp trong PostgreSQL)

-- 🍜 Phở Hà Nội
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  gen_random_uuid(),
  'Phở Hà Nội',
  '{"address":"120 Nguyễn Trãi, Quận 1, TP.HCM","lat":10.7725,"lng":106.6980}'::jsonb,
  '028-1234-5678',
  'contact@pho-hanoi.vn',
  '{"url":"https://images.unsplash.com/photo-1595215909290-847cb783facf"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1552566626-52f8b828add9"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
)

select * from users


INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'KFC',
  '{"address":"45 Lê Lợi, Quận 1, TP.HCM","lat":10.7742,"lng":106.7003}'::jsonb,
  '028-3822-1111',
  'contact@kfc.vn',
  '{"url":"https://images.unsplash.com/photo-1606756790138-8a9ec9aee41e"}'::jsonb,
  '{"url": "https://static.tnex.com.vn/uploads/2023/06/word-image-15111-1.jpeg"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u
WHERE u.email = 'kfc@gmail.com';




-- 🍔 McDonald's
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'McDonald''s',
  '{"address":"2-6 Lê Duẩn, Quận 1, TP.HCM","lat":10.7793,"lng":106.6991}'::jsonb,
  '028-3823-8888',
  'info@mcdonalds.vn',
  '{"url":"https://images.unsplash.com/photo-1571091718767-18b5b1457add"}'::jsonb,
  '{"url": "https://gigamall.com.vn/data/2019/09/20/11491513_LOGO-McDonald_s.jpg"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'mcdonalds@gmail.com';


-- 🍟 Jollibee
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Jollibee',
  '{"address":"55 Nguyễn Huệ, Quận 1, TP.HCM","lat":10.7749,"lng":106.7045}'::jsonb,
  '028-3914-0000',
  'support@jollibee.vn',
  '{"url":"https://images.unsplash.com/photo-1601924579440-18a1b3e3a1e3"}'::jsonb,
  '{"url": "https://aeonmall-review-rikkei.cdn.vccloud.vn/public/wp/8/tenants/CgGzPdh5ue7sLVfpju6SFJb3I3swnSXTReXEiwOd.png"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'jollibee@gmail.com';


-- ☕ Phê La
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Phê La',
  '{"address":"42 Nguyễn Huệ, Quận 1, TP.HCM","lat":10.7740,"lng":106.7042}'::jsonb,
  '028-3829-6677',
  'info@phela.vn',
  '{"url":"https://images.unsplash.com/photo-1511920170033-f8396924c348"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1509042239860-f550ce710b93"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'phela@gmail.com';


-- 🍃 Phúc Long
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Phúc Long',
  '{"address":"97 Nguyễn Trãi, Quận 5, TP.HCM","lat":10.7564,"lng":106.6678}'::jsonb,
  '028-3923-2323',
  'contact@phuclong.vn',
  '{"url":"https://images.unsplash.com/photo-1532009324734-20a7a5813719"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1509042239860-f550ce710b93"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'phuclong@gmail.com';


-- 🧋 Katinat
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Katinat',
  '{"address":"60 Pasteur, Quận 1, TP.HCM","lat":10.7772,"lng":106.7009}'::jsonb,
  '028-3910-9999',
  'info@katinat.vn',
  '{"url":"https://images.unsplash.com/photo-1600271886401-4fa46a6c4d88"}'::jsonb,
  '{"url": "https://katinat.vn/wp-content/uploads/2024/03/image.png"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'katinat@gmail.com';


-- 🍱 Cơm Tấm Phúc Lộc Thọ
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Cơm Tấm Phúc Lộc Thọ',
  '{"address":"150 Nguyễn Tri Phương, Quận 10, TP.HCM","lat":10.7669,"lng":106.6692}'::jsonb,
  '028-3857-2345',
  'contact@phucloctho.vn',
  '{"url":"https://images.unsplash.com/photo-1598514982586-7913c5b3a6b6"}'::jsonb,
  '{"url": "https://product.hstatic.net/200000043306/product/com_suon_canh_nuoc_6952d9bdf5da4ff9ab796f0e088d913a_large.png"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'phucloctho@gmail.com';


-- 🥖 Bánh Mì Huynh Hoa
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Bánh Mì Huynh Hoa',
  '{"address":"26 Lê Thị Riêng, Quận 1, TP.HCM","lat":10.7731,"lng":106.6925}'::jsonb,
  '028-3925-0888',
  'banhmi@huynhhoa.vn',
  '{"url":"https://images.unsplash.com/photo-1576065435498-6e83e6ecb42f"}'::jsonb,
  '{"url": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/f6/ba/f0/v-i-tu-i-d-i-35-nam-g.jpg?w=900&h=500&s=1"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'huynhhoa@gmail.com';


-- 🍢 Busan Korean Street Food
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Busan Korean Street Food',
  '{"address":"45 Nguyễn Gia Trí, Bình Thạnh, TP.HCM","lat":10.8024,"lng":106.7143}'::jsonb,
  '028-3841-5678',
  'busan@kfood.vn',
  '{"url":"https://images.unsplash.com/photo-1604156788870-06aef7abf0a3"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1575932444877-5106bee2a599"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'busanbbq@gmail.com';


-- 🍜 Seoul Tofu & BBQ
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Seoul Korean Food',
  '{"address":"72 Lê Lai, Quận 1, TP.HCM","lat":10.7712,"lng":106.6947}'::jsonb,
  '028-3811-4321',
  'info@seoulbbq.vn',
  '{"url":"https://images.unsplash.com/photo-1604156788870-06aef7abf0a3"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1541544741938-0af808871cc0"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'seoulkoreanfood@gmail.com';


-- 🍗 Sasin
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT 
  u.id,
  'Sasin',
  '{"address":"102 Võ Văn Tần, Quận 3, TP.HCM","lat":10.7777,"lng":106.6901}'::jsonb,
  '028-3830-7777',
  'contact@sasin.vn',
  '{"url":"https://images.unsplash.com/photo-1606756790138-8a9ec9aee41e"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1586190848861-99aa4a171e90"}'::jsonb,
  '{
    "friday": { "open": "06:30", "close": "21:00" },
    "monday": { "open": "06:30", "close": "20:30" },
    "sunday": { "open": "07:00", "close": "21:00" },
    "tuesday": { "open": "06:30", "close": "20:30" },
    "saturday": { "open": "07:00", "close": "21:30" },
    "thursday": { "open": "06:30", "close": "20:30" },
    "wednesday": { "open": "06:30", "close": "20:30" }
  }'::jsonb
FROM users u WHERE u.email = 'sasin@gmail.com';




-- === CATEGORY ===
INSERT INTO category (merchant_id, category_name)
SELECT id, cat_name
FROM merchant, (VALUES
  ('PHIN'),
  ('MOKA POT'),
  ('SPHON'),
  ('FRENCH PRESS'),
  ('Ô LONG MATCHA')
) AS c(cat_name)
WHERE merchant_name = 'Phê La';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item) VALUES
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'PHIN' ), 'TRUFFLE / Truffle coffee', 50000, 'Kem Nấm Truffle, Arabica Cầu Đất, Robusta Gia Lia, Sữa Dừa)', '{"url":"https://phela.vn/wp-content/uploads/2023/06/cover-web.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'PHIN' ), 'THĂNG # / Tropical cold drew coffe # ', 65000, 'Cà đặc sản Colombia + Ethiopia ủ lạnh, hoa quả nhiệt đới', '{"url": "https://channel.mediacdn.vn/428462621602512896/2024/5/25/photo-1-17166074582551866939958.png"}'),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'PHIN' ), 'NÂU TRUFFLE / Truffle brown coffee', 45000, 'Nấm Truffle, Arabica Cầu Đất, Robusta Gia Lia, Sữa Đặc)', '{"url":"https://ipos.vn/wp-content/uploads/2023/07/ca-phe-phe-la.png"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'PHIN' ), 'NÂU / Brown coffee', 39000, 'Arabica Cầu Đất, Robusta Gia Lia, Sữa Đặc', '{"url": "https://phela.vn/wp-content/uploads/2023/07/size-vuong-03.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'PHIN' ), 'ĐEN / Black coffee', 39000, 'Arabica Cầu Đất, Robusta Gia Lia', '{"url": "https://phela.vn/wp-content/uploads/2023/07/size-vuong-01.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'MOKA POT' ), 'TẤM / Roasted Rice Milk Oolong', 55000, 'Gạo rang, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/7.-Plus-Tam.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'MOKA POT' ), 'KHÓI B`LAO / B`Lao Smoke', 55000, 'Khói, Hoa Ngọc Lan, Sữa, Trà Ô Long', '{"url":"https://ipos.vn/wp-content/uploads/2022/07/phe-la-6.png"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'SYPHON'), 'Ô LONG SỮA / Phê Le Milk Oolong', 55000, 'Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/5.-Plus-O-Long-Sua-Phe-La.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'SYPHON'), 'Ô LONG NHÀI SỮA / Jasmine Milk Oolong', 55000, 'Hoa Nhài, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/4.-Plus-O-Long-Nhai-Sua.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'SYPHON'), 'PHONG LAN / Vanilla Milk Oolong', 55000, 'Vani Tự Nhiên, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2023/11/PHONG-LAN-PLUS.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'SYPHON'), 'PHAN XI PĂNG / Fansipan', 55000, 'Cốt Dừa Đá Xay, Trà Ô Long', '{"url":"https://cafefcdn.com/203337114487263232/2025/7/10/14853-17521288028691225416503-1752136816858-1752136817451217788465.jpg"}'::jsonb),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', (SELECT id FROM category WHERE category_name= 'SYPHON'), 'PHÙ VÂN / Phu Van', 45000, 'Whipping Cream, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/3.-Plus-Dinh-Phu-Van.jpg"}'::jsonb);


-- === MENU_ITEM ===
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 
  m.id,
  c.id,
  i.name_item,
  i.price,
  i.description,
  i.image_item::jsonb
FROM merchant m
JOIN category c 
  ON c.merchant_id = m.id
JOIN (
  SELECT *
  FROM (VALUES
  	('PHIN', 'TRUFFLE / Truffle coffee', 50000, 'Kem Nấm Truffle, Arabica Cầu Đất, Robusta Gia Lia, Sữa Dừa)', '{"url":"https://phela.vn/wp-content/uploads/2023/06/cover-web.jpg"}'::jsonb),
	('PHIN', 'THĂNG # / Tropical cold drew coffe # ', 65000, 'Cà đặc sản Colombia + Ethiopia ủ lạnh, hoa quả nhiệt đới', '{"url": "https://channel.mediacdn.vn/428462621602512896/2024/5/25/photo-1-17166074582551866939958.png"}'),
	('PHIN', 'NÂU TRUFFLE / Truffle brown coffee', 45000, 'Nấm Truffle, Arabica Cầu Đất, Robusta Gia Lia, Sữa Đặc)', '{"url":"https://ipos.vn/wp-content/uploads/2023/07/ca-phe-phe-la.png"}'::jsonb),
	('PHIN', 'NÂU / Brown coffee', 39000, 'Arabica Cầu Đất, Robusta Gia Lia, Sữa Đặc', '{"url": "https://phela.vn/wp-content/uploads/2023/07/size-vuong-03.jpg"}'::jsonb),
	('PHIN', 'ĐEN / Black coffee', 39000, 'Arabica Cầu Đất, Robusta Gia Lia', '{"url": "https://phela.vn/wp-content/uploads/2023/07/size-vuong-01.jpg"}'::jsonb),
	('MOKA POT', 'TẤM / Roasted Rice Milk Oolong', 55000, 'Gạo rang, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/7.-Plus-Tam.jpg"}'::jsonb),
	('MOKA POT', 'KHÓI B`LAO / B`Lao Smoke', 55000, 'Khói, Hoa Ngọc Lan, Sữa, Trà Ô Long', '{"url":"https://ipos.vn/wp-content/uploads/2022/07/phe-la-6.png"}'::jsonb),
	('SYPHON', 'Ô LONG SỮA / Phê La Milk Oolong', 55000, 'Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/5.-Plus-O-Long-Sua-Phe-La.jpg"}'),
    ('SYPHON', 'Ô LONG NHÀI SỮA / Jasmine Milk Oolong', 55000, 'Hoa Nhài, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/4.-Plus-O-Long-Nhai-Sua.jpg"}'),
    ('SYPHON', 'PHONG LAN / Vanilla Milk Oolong', 55000, 'Vani Tự Nhiên, Sữa, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2023/11/PHONG-LAN-PLUS.jpg"}'),
    ('SYPHON', 'PHAN XI PĂNG / Fansipan', 55000, 'Cốt Dừa Đá Xay, Trà Ô Long', '{"url":"https://cafefcdn.com/203337114487263232/2025/7/10/14853-17521288028691225416503-1752136816858-1752136817451217788465.jpg"}'),
    ('SYPHON', 'PHÙ VÂN / Phu Van', 45000, 'Whipping Cream, Trà Ô Long', '{"url":"https://phela.vn/wp-content/uploads/2021/08/3.-Plus-Dinh-Phu-Van.jpg"}')

     ) AS v(category_name, name_item, price, description, image_item)
) AS i
  ON i.category_name = c.category_name
WHERE m.merchant_name = 'Phê La';


select * from merchant


-- ============
-- KFC
-- ============
-- (optional) reset cũ
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'KFC');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'KFC');

-- categories
INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('COMBO GÀ'),
  ('BURGER'),
  ('ĐỒ UỐNG')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'KFC';

-- menu items
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('COMBO GÀ','Combo Gà Rán 3 Miếng',89000,'3 miếng gà rán giòn cay kèm khoai tây','{"url":"https://kfcvietnam.com.vn/uploads/product/ga-ran.jpg"}'),
  ('BURGER','Burger Gà Quay',69000,'Burger gà quay phô mai','{"url":"https://kfcvietnam.com.vn/uploads/product/burger.jpg"}'),
  ('BURGER','Burger Tôm',72000,'Burger nhân tôm chiên','{"url":"https://kfcvietnam.com.vn/uploads/product/burger-tom.jpg"}'),
  ('ĐỒ UỐNG','Pepsi',19000,'Pepsi tươi mát','{"url":"https://kfcvietnam.com.vn/uploads/product/pepsi.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'KFC';

-- ============
-- JOLLIBEE
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Jollibee');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Jollibee');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('GÀ RÁN'),
  ('MỲ Ý'),
  ('TRÁNG MIỆNG')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Jollibee';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('GÀ RÁN','Gà Rán Giòn Cay',59000,'Gà rán cay giòn đặc trưng','{"url":"https://jollibee.com.vn/uploads/product/ga-ran.jpg"}'),
  ('MỲ Ý','Mỳ Ý Sốt Bò Bằm',55000,'Mỳ Ý sốt bò bằm thơm ngon','{"url":"https://jollibee.com.vn/uploads/product/my-y.jpg"}'),
  ('TRÁNG MIỆNG','Kem Ly Jollibee',19000,'Kem vani mềm mịn','{"url":"https://jollibee.com.vn/uploads/product/kem.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Jollibee';

-- ============
-- McDonald's
-- ============
DELETE FROM menu_item
WHERE merchant_id = (
  SELECT id FROM merchant WHERE merchant_name = 'McDonald''s'
);

DELETE FROM category
WHERE merchant_id = (
  SELECT id FROM merchant WHERE merchant_name = 'McDonald''s'
);

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('BURGER'),
  ('KHOAI & ĂN NHẸ'),
  ('ĐỒ UỐNG')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'McDonald''s';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('BURGER','Big Mac',89000,'Burger bò đặc trưng McDonald’s','{"url":"https://mcdonalds.vn/uploads/product/bigmac.jpg"}'),
  ('BURGER','Cheeseburger',79000,'Burger bò phô mai','{"url":"https://mcdonalds.vn/uploads/product/cheeseburger.jpg"}'),
  ('KHOAI & ĂN NHẸ','Khoai Tây Chiên',39000,'Khoai tây chiên giòn vàng','{"url":"https://mcdonalds.vn/uploads/product/fries.jpg"}'),
  ('ĐỒ UỐNG','Coca-Cola',19000,'Coca tươi mát','{"url":"https://mcdonalds.vn/uploads/product/coke.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'McDonald''s';


-- ============
-- PHÚC LONG
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Phúc Long');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Phúc Long');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('TRÀ'),
  ('TRÀ SỮA'),
  ('ĐÁ XAY')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Phúc Long';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('TRÀ','Trà Oolong',45000,'Trà ô long đậm vị','{"url":"https://phuclong.com.vn/uploads/product/oolong.jpg"}'),
  ('TRÀ SỮA','Trà Sữa Truyền Thống',49000,'Trà sữa thơm béo','{"url":"https://phuclong.com.vn/uploads/product/milk-tea.jpg"}'),
  ('ĐÁ XAY','Matcha Đá Xay',59000,'Matcha xay với kem tươi','{"url":"https://phuclong.com.vn/uploads/product/matcha.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Phúc Long';

-- ============
-- BUSAN KOREAN STREET FOOD
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Busan Korean Street Food');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Busan Korean Street Food');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('TOKBOKKI'),
  ('KIMBAP'),
  ('MÌ LẠNH')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Busan Korean Street Food';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('TOKBOKKI','Tokbokki Phô Mai',65000,'Bánh gạo cay phủ phô mai Hàn Quốc','{"url":"https://busanfood.vn/uploads/tokbokki.jpg"}'),
  ('KIMBAP','Kimbap Truyền Thống',49000,'Cơm cuộn Hàn Quốc nhân trứng, rau, thịt nguội','{"url":"https://busanfood.vn/uploads/kimbap.jpg"}'),
  ('MÌ LẠNH','Mì Lạnh Hàn Quốc',75000,'Mì lạnh thanh mát kiểu Busan','{"url":"https://busanfood.vn/uploads/milanh.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Busan Korean Street Food';

-- ============
-- SEOUL BBQ HOUSE
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Seoul Korean Food');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Seoul Korean Food');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('THỊT NƯỚNG'),
  ('CƠM TRỘN'),
  ('LẨU HÀN'),
  ('ĐẬU HŨ HẦM'),
  ('BBQ'),
  ('CƠM TRỘN')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Seoul Korean Food';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('THỊT NƯỚNG','Ba Chỉ Nướng',120000,'Ba chỉ heo nướng Hàn Quốc','{"url":"https://seoulbbq.vn/uploads/bachi.jpg"}'),
  ('CƠM TRỘN','Bibimbap',89000,'Cơm trộn Hàn Quốc truyền thống','{"url":"https://seoulbbq.vn/uploads/bibimbap.jpg"}'),
  ('LẨU HÀN','Lẩu Kimchi',159000,'Lẩu kimchi cay cay, đậm vị','{"url":"https://seoulbbq.vn/uploads/laukimchi.jpg"}'),
  ('ĐẬU HŨ HẦM','Đậu Hũ Hầm Hải Sản',139000,'Đậu hũ non hầm hải sản cay','{"url":"https://seoultofu.vn/uploads/tofu.jpg"}'),
  ('BBQ','Ba Chỉ Bò Nướng',179000,'Ba chỉ bò Mỹ nướng than hoa','{"url":"https://seoultofu.vn/uploads/bbq.jpg"}'),
  ('CƠM TRỘN','Bibimbap Truyền Thống',89000,'Cơm trộn rau củ, trứng và sốt gochujang','{"url":"https://seoultofu.vn/uploads/bibimbap.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Seoul Korean Food';

-- ============
-- SASIN
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Sasin');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Sasin');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('MÌ CAY'),
  ('LẨU MINI'),
  ('ĐỒ ĂN VẶT')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Sasin';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('MÌ CAY','Mì Cay Cấp 1',55000,'Mì cay hải sản cấp độ nhẹ','{"url":"https://sasin.vn/uploads/micay1.jpg"}'),
  ('MÌ CAY','Mì Cay Cấp 7',69000,'Mì cay cực mạnh cho người mê thử thách','{"url":"https://sasin.vn/uploads/micay7.jpg"}'),
  ('LẨU MINI','Lẩu Mini Bò Mỹ',129000,'Lẩu mini dành cho 1-2 người','{"url":"https://sasin.vn/uploads/lau-mini.jpg"}'),
  ('ĐỒ ĂN VẶT','Khoai Tây Lắc Phô Mai',39000,'Khoai chiên giòn phủ phô mai','{"url":"https://sasin.vn/uploads/khoai-lac.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Sasin';

-- ============
-- BÁNH MÌ HUYNH HOA
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Bánh Mì Huynh Hoa');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Bánh Mì Huynh Hoa');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('BÁNH MÌ'),
  ('NƯỚC GIẢI KHÁT'),
  ('COMBO')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Bánh Mì Huynh Hoa';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('BÁNH MÌ','Bánh Mì Đặc Biệt',55000,'Bánh mì đầy đủ chả, thịt, pate, đồ chua','{"url":"https://banhmi.vn/uploads/dacbiet.jpg"}'),
  ('BÁNH MÌ','Bánh Mì Thịt Nguội',49000,'Bánh mì thịt nguội và pate','{"url":"https://banhmi.vn/uploads/thitnguoi.jpg"}'),
  ('NƯỚC GIẢI KHÁT','Trà Đá',5000,'Trà đá miễn phí','{"url":"https://banhmi.vn/uploads/trada.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Bánh Mì Huynh Hoa';

-- ============
-- CƠM TẤM PHÚC LỘC THỌ
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Cơm Tấm Phúc Lộc Thọ');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Cơm Tấm Phúc Lộc Thọ');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('CƠM TẤM'),
  ('CANH'),
  ('NƯỚC GIẢI KHÁT')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Cơm Tấm Phúc Lộc Thọ';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('CƠM TẤM','Cơm Tấm Sườn Bì Chả',69000,'Cơm tấm truyền thống miền Nam','{"url":"https://comtam.vn/uploads/suombicha.jpg"}'),
  ('CƠM TẤM','Cơm Tấm Sườn Trứng',65000,'Cơm sườn nướng trứng ốp la','{"url":"https://comtam.vn/uploads/suontrung.jpg"}'),
  ('CANH','Canh Chua Cá Lóc',35000,'Canh chua chuẩn vị miền Tây','{"url":"https://comtam.vn/uploads/canhchua.jpg"}'),
  ('NƯỚC GIẢI KHÁT','Nước Sâm',15000,'Nước sâm mát lạnh','{"url":"https://comtam.vn/uploads/nocsam.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Cơm Tấm Phúc Lộc Thọ';

-- ============
-- KATINAT
-- ============
DELETE FROM menu_item  WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Katinat');
DELETE FROM category   WHERE merchant_id = (SELECT id FROM merchant WHERE merchant_name = 'Katinat');

INSERT INTO category (merchant_id, category_name)
SELECT m.id, c.cat_name
FROM merchant m
JOIN (VALUES
  ('CÀ PHÊ'),
  ('TRÀ'),
  ('ĐÁ XAY')
) AS c(cat_name) ON TRUE
WHERE m.merchant_name = 'Katinat';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, mi.name_item, mi.price, mi.description, mi.image_item::jsonb
FROM merchant m
JOIN category c ON c.merchant_id = m.id
JOIN (VALUES
  ('CÀ PHÊ','Cold Brew',55000,'Cold brew nguyên chất 24h','{"url":"https://katinat.vn/uploads/coldbrew.jpg"}'),
  ('TRÀ','Trà Nhài Sữa',49000,'Trà nhài hương nhẹ, sữa tươi','{"url":"https://katinat.vn/uploads/tranhai.jpg"}'),
  ('ĐÁ XAY','Matcha Latte Đá Xay',59000,'Matcha blend đá xay','{"url":"https://katinat.vn/uploads/matcha.jpg"}')
) AS mi(category_name,name_item,price,description,image_item)
  ON c.category_name = mi.category_name
WHERE m.merchant_name = 'Katinat';


select * from "order"
select * from order_item
select * from payment_transaction
select * from menu_item where merchant_id = '86a8e225-bae4-4361-bc3f-2a6fb94b4649'

ALTER TABLE payment_transaction DROP COLUMN IF EXISTS order_temp_data;

ALTER TABLE payment_transaction
ALTER COLUMN order_id DROP NOT NULL;

 -- ✅ ENUM trạng thái rõ ràng
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS payment_transaction (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
  order_id    UUID  REFERENCES "order"(id) ON DELETE CASCADE,
  
  -- Lưu ý: VNPay trả vnp_Amount = số tiền * 100 (đơn vị đồng)
  amount BIGINT NOT NULL CHECK (amount > 0),
  currency          VARCHAR(10) NOT NULL DEFAULT 'VND',

  -- Định danh giao dịch - nên tách 2 phần:
  -- Mã mình tạo khi init thanh toán (txn_ref) + mã giao dịch của VNPay (transaction_no)
  txn_ref           VARCHAR(64) NOT NULL,    -- vnp_TxnRef (mã đơn/phiên do hệ thống sinh)
  transaction_no    VARCHAR(64),             -- vnp_TransactionNo (do VNPay cấp sau khi thanh toán)
  payment_method    VARCHAR(32) NOT NULL,    -- 'VNPAY' | 'MOMO' | 'CASH' ...

  status payment_status NOT NULL DEFAULT 'PENDING',
  response_code     VARCHAR(8),              -- vnp_ResponseCode
  bank_code         VARCHAR(32),             -- vnp_BankCode
  pay_date          VARCHAR(14),             -- vnp_PayDate (yyyyMMddHHmmss)
  tmn_code          VARCHAR(32),             -- vnp_TmnCode

  -- để debug / đối soát
  raw_payload       JSONB,                   -- lưu nguyên query/notify

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ✅ Không cho trùng một txn_ref trong cùng 1 order (idempotent khi retry)
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_txn_ref
  ON payment_transaction (order_id, txn_ref);

-- ✅ Một transaction_no (của VNPay) chỉ map 1 payment trong hệ thống
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_transaction_no
  ON payment_transaction (transaction_no) WHERE transaction_no IS NOT NULL;

-- Index truy vấn thường dùng
CREATE INDEX IF NOT EXISTS idx_payment_order   ON payment_transaction(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_user    ON payment_transaction(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status  ON payment_transaction(status);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_payment_updated_at ON payment_transaction;
CREATE TRIGGER trg_payment_updated_at
BEFORE UPDATE ON payment_transaction
FOR EACH ROW EXECUTE FUNCTION set_updated_at();



SELECT unnest(enum_range(NULL::payment_status));

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED',
  'CANCELED',
  'REFUNDED'
);

ALTER TABLE orders
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'COD',

DROP TYPE IF EXISTS payment_status CASCADE;

select * from payment_transaction

-- =======================
-- BẢNG ORDER
-- =======================
CREATE TABLE "order" (
  id UUID PRIMARY KEY,
  merchant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  delivery_address TEXT,
  delivery_fee BIGINT DEFAULT 0,
  note TEXT,
  total_amount BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  status_payment VARCHAR(50) DEFAULT 'unpaid',

  -- RÀNG BUỘC KHÓA NGOẠI
  CONSTRAINT fk_order_merchant
    FOREIGN KEY (merchant_id) REFERENCES merchant(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_order_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

select * from users

select * from merchant
-- =======================
-- BẢNG ORDER_ITEM
-- =======================
CREATE TABLE order_item (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  menu_item_id UUID NOT NULL,
  note TEXT,
  quantity BIGINT NOT NULL,
  price BIGINT NOT NULL,

  -- RÀNG BUỘC KHÓA NGOẠI
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES "order"(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_order_item_menu
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id)
    ON DELETE CASCADE
);

-- =======================
-- BẢNG ORDER_ITEM_OPTION
-- =======================
CREATE TABLE order_item_option (
  order_item_id UUID NOT NULL,
  option_item_id UUID NOT NULL,
  PRIMARY KEY (order_item_id, option_item_id),

  -- RÀNG BUỘC KHÓA NGOẠI
  CONSTRAINT fk_order_item_option_order_item
    FOREIGN KEY (order_item_id) REFERENCES order_item(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_order_item_option_option_item
    FOREIGN KEY (option_item_id) REFERENCES option_item(id)
    ON DELETE CASCADE
);

select * from merchant

SELECT id, full_name, email FROM users LIMIT 5;
SELECT id, merchant_name FROM merchant LIMIT 5;
SELECT id, name_item, price FROM menu_item LIMIT 5;



-- ==========================================
-- 🧍 USER: Trần Thiện Tâm (đã có)
-- MERCHANT: Cà Phê Sài Gòn (đã có)
-- ==========================================

-- 1️⃣ Tạo đơn hàng mới
INSERT INTO "order" (
  id,
  merchant_id,
  user_id,
  full_name,
  phone,
  delivery_address,
  delivery_fee,
  note,
  total_amount,
  status,
  status_payment
)
VALUES (
  '7e1d52d2-4e3a-4d61-b6ee-c2f4e1aa0af9',          -- order_id
  '9c41a728-f5ef-4432-8cc5-3b3e35028a3d',          -- merchant_id (Cà Phê Sài Gòn)
  '6cebd483-24b4-4f93-84d5-e359b42bacf1',          -- user_id (Trần Thiện Tâm)
  'Trần Thiện Tâm',
  '0909009009',
  '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
  15000,                                           -- phí giao hàng
  'Giao buổi sáng, nhớ thêm đá nhé',
  153000,                                          -- tổng tiền
  'pending',
  'unpaid'
);

-- 2️⃣ Thêm 2 món vào order_item
INSERT INTO order_item (
  id,
  order_id,
  menu_item_id,
  note,
  quantity,
  price
)
VALUES
  (
    'abf12345-6789-4abc-bdef-111122223333',        -- item 1
    '7e1d52d2-4e3a-4d61-b6ee-c2f4e1aa0af9',
    '5792f01c-58b0-42d2-aa98-07280fcd5084',        -- Phở Bò Đặc Biệt
    'ít hành, nhiều thịt',
    1,
    68000
  ),
  (
    'bbc23456-789a-4abc-cdef-222233334444',        -- item 2
    '7e1d52d2-4e3a-4d61-b6ee-c2f4e1aa0af9',
    'f842e3a7-f1ed-4080-8a9e-be91a86c4884',        -- Phở Gà
    'ít nước',
    1,
    70000
  );

  select * from "order"
SELECT * FROM users WHERE id = '6cebd483-24b4-4f93-84d5-e359b42bacf1';
SELECT * FROM merchant WHERE id = '9c41a728-f5ef-4432-8cc5-3b3e35028a3d';
SELECT * FROM "order" WHERE id = '7e1d52d2-4e3a-4d61-b6ee-c2f4e1aa0af9';