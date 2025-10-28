CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE merchant   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE category   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE menu_item  ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "option"   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE option_item ALTER COLUMN id SET DEFAULT gen_random_uuid();

BEGIN;

-- =========================================================
-- 1) MERCHANTS (đặt địa chỉ ở TP.HCM) - tránh trùng theo tên
-- =========================================================
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT gen_random_uuid(),
       'Phở Hà Nội',
       '{"address":"120 Nguyễn Trãi, Quận 1, TP.HCM","lat":10.7725,"lng":106.6980}'::jsonb,
       '028-1234-5678',
       'contact@pho-hanoi.vn',
       '{"url":"https://images.unsplash.com/photo-1595215909290-847cb783facf"}'::jsonb,
       '{"url":"https://images.unsplash.com/photo-1552566626-52f8b828add9"}'::jsonb,
       '{"mon-sun":{"open":"06:00","close":"22:00"}}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM merchant WHERE merchant_name='Phở Hà Nội');

INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
SELECT gen_random_uuid(),
       'Cà Phê Sài Gòn',
       '{"address":"45 Lê Lợi, Quận 1, TP.HCM","lat":10.7730,"lng":106.7000}'::jsonb,
       '028-9876-5432',
       'hello@caphe-saigon.vn',
       '{"url":"https://images.unsplash.com/photo-1648451142763-6fb6244cb8a5"}'::jsonb,
       '{"url":"https://images.unsplash.com/photo-1517701604599-bb29b565090c"}'::jsonb,
       '{"mon-sun":{"open":"07:00","close":"23:00"}}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM merchant WHERE merchant_name='Cà Phê Sài Gòn');

INSERT INTO merchant (user_id, merchant_name, location, profile_image, cover_image, time_open)
SELECT gen_random_uuid(),
       'Seoul BBQ House',
       '{"address":"88 Nguyễn Huệ, Quận 1, TP.HCM","lat":10.7755,"lng":106.7031}'::jsonb,
       '{"url":"https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}'::jsonb,
       '{"url":"https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}'::jsonb,
       '{"mon-sun":{"open":"10:00","close":"23:00"}}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM merchant WHERE merchant_name='Seoul BBQ House');

-- =========================================================
-- 2) CATEGORIES (đảm bảo có trước khi insert món)
-- =========================================================

-- Phở Hà Nội: Phở / Bánh Mì / Bún / Đồ Uống
INSERT INTO category (merchant_id, category_name)
SELECT m.id, v.category_name
FROM merchant m
JOIN (VALUES ('Phở'),('Bánh Mì'),('Bún'),('Đồ Uống')) AS v(category_name) ON TRUE
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM category c WHERE c.merchant_id=m.id AND c.category_name=v.category_name
);

-- Cà Phê Sài Gòn: Đồ uống - Cà phê
INSERT INTO category (merchant_id, category_name)
SELECT m.id, 'Đồ uống - Cà phê'
FROM merchant m
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (
  SELECT 1 FROM category c WHERE c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
);

-- Seoul BBQ House: BBQ / Soup / Đồ Uống
INSERT INTO category (merchant_id, category_name)
SELECT m.id, v.category_name
FROM merchant m
JOIN (VALUES ('BBQ'),('Soup'),('Đồ Uống')) AS v(category_name) ON TRUE
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (
  SELECT 1 FROM category c WHERE c.merchant_id=m.id AND c.category_name=v.category_name
);

-- =========================================================
-- 3) MENU ITEMS — PHỞ HÀ NỘI (các danh mục đã có)
-- =========================================================

-- Phở
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Bò Đặc Biệt', 68000,
'Phở bò thượng hạng với đầy đủ topping: thịt chín mềm, tái mỏng, gầu dai ngon, gân giòn và sách bò. Nước dùng trong vắt, thơm lừng ninh từ xương bò suốt 12 tiếng. Kèm rau thơm, chanh, ớt tươi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Phở Bò Đặc Biệt'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Gà', 70000,
'Phở gà thơm ngon với thịt gà tươi, nước dùng trong ngọt từ xương gà ta. Bánh phở mềm dai, kèm đầy đủ rau thơm và nước chấm đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1636474498689-27e2d3ecf8d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Phở Gà'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Tái', 75000,
'Phở bò tái với thịt bò tái mỏng như giấy, tươi ngon, nước dùng trong vắt ninh từ xương bò. Ăn kèm rau thơm và chanh tươi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1597577652129-7ffad9d37ad4')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Phở Tái'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Chín', 70000,
'Phở bò chín truyền thống với thịt bò chín mềm ngon, nước dùng đậm đà thơm lừng. Món phở an toàn cho mọi lứa tuổi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Phở Chín'
);

-- Bánh Mì
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Thịt Nướng', 35000,
'Bánh mì Việt Nam truyền thống với vỏ giòn rụm, ruột mềm. Thịt heo nướng than hoa thơm lừng, pate gan tự làm, rau cải, cà rót, đồ chua và tương ớt đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1524062008239-962eb6d3383d')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bánh Mì Thịt Nướng'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Pâté', 25000,
'Bánh mì pâté truyền thống với pâté gan tự làm thơm ngon, rau thơm tươi mát, đồ chua giòn giòn và tương ớt đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1599461143300-67b5d7ffe42c')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bánh Mì Pâté'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Chả Cá', 40000,
'Bánh mì chả cá Hà Nội với chả cá thơm lừng, thêm thì là, rau thơm và bún tươi. Hương vị đặc trưng khó quên.',
jsonb_build_object('url','https://images.unsplash.com/photo-1526551800-4c06b10ee6ee')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bánh Mì Chả Cá'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Xíu Mại', 35000,
'Bánh mì xíu mại với những viên xíu mại mềm thơm, nước sốt đậm đà, rau sống tươi và đồ chua chua ngọt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1524062008239-962eb6d3383d')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bánh Mì Xíu Mại'
);

-- Bún
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Chả Hà Nội', 75000,
'Món bún chả Hà Nội chính gốc với thịt nướng than hoa thơm ngon, chả viên đặc biệt, bún tươi. Nước chấm chua ngọt đậm đà, rau sống tươi mát và nem cua bể giòn tan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bún Chả Hà Nội'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Bò Nam Bộ', 65000,
'Bún bò Nam Bộ đặc biệt với thịt bò nướng thơm ngon, rau thơm đa dạng, đậu phộng rang và nước mắm chua ngọt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bún Bò Nam Bộ'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Riêu', 55000,
'Bún riêu cua đồng với nước dùng chua ngọt từ cua đồng, cà chua, đậu hũ và rau muống. Thơm ngon đậm đà.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bún Riêu'
);

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Chả Cá', 70000,
'Bún chả cá Hà Nội với chả cá thơm lừng, thì là tươi, bún tươi và nước mắm chấm đậm đà. Món ăn đặc trưng của thủ đô.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bún Chả Cá'
);

-- Đồ Uống (của Phở Hà Nội)
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Nước Lọc', 8000,
'Nước lọc tinh khiết chai 500ml, mát lạnh.',
jsonb_build_object('url','https://images.unsplash.com/photo-1757332051114-ae8c79214cef')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Nước Lọc');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Nước Dừa Tươi', 25000,
'Nước dừa tươi ngọt mát, giải khát tuyệt vời. Dừa xiêm xanh tươi hái trong ngày.',
jsonb_build_object('url','https://images.unsplash.com/photo-1757332051114-ae8c79214cef')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Nước Dừa Tươi');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Trà Đá', 5000,
'Trà đá truyền thống Việt Nam, thơm mát, giá phải chăng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Trà Đá');

-- =========================================================
-- 4) MENU ITEMS — CÀ PHÊ SÀI GÒN
-- =========================================================
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Đen Đá', 20000,
'Cà phê đen Robusta Buôn Ma Thuột rang mộc, pha phin truyền thống, đậm đà, thơm lừng. Uống kèm đá lạnh giải nhiệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1644204010193-a35de7b0d702')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Cà Phê Đen Đá');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Sữa Đá', 30000,
'Cà phê phin Việt Nam kết hợp sữa đặc ngọt ngào, tạo nên hương vị đặc trưng không thể nhầm lẫn của Sài Gòn.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Cà Phê Sữa Đá');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Bạc Xỉu', 28000,
'Cà phê bạc xỉu với nhiều sữa, ít cà phê, ngọt ngào dễ uống. Phù hợp cho người không thích đắng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Cà Phê Bạc Xỉu');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Espresso', 22000,
'Espresso Việt Nam đậm đà, pha theo style Italy nhưng dùng hạt Robusta Buôn Ma Thuột. Đắng ngọt hậu vị.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Cà Phê Espresso');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Cappuccino', 35000,
'Cappuccino Việt Nam với espresso đậm, sữa tươi và bọt sữa mịn. Rắc bột cacao, phong cách Âu - Á.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Cà Phê Cappuccino');

-- =========================================================
-- 5) MENU ITEMS — SEOUL BBQ HOUSE
-- =========================================================
-- BBQ
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bulgogi Beef', 450000,
'Thịt bò Wagyu A5 thái lát mỏng, ướp sốt bulgogi truyền thống với lê, nước tương, mắm tôm. Nướng than hoa, ăn kèm kimchi và banchan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Bulgogi Beef');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Galbi Beef', 580000,
'Sườn bò Galbi cao cấp ướp sốt truyền thống, nướng than hoa. Thịt mềm ngọt, ăn kèm kimchi và banchan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Galbi Beef');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Samgyeopsal', 380000,
'Thịt ba chỉ heo Hàn Quốc nướng giòn, ăn với rau sống, tỏi và các loại banchan. Đậm đà hương vị truyền thống.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Samgyeopsal');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Korean Fried Chicken', 280000,
'Gà rán Hàn Quốc giòn tan với sốt gochujang cay ngọt. Da giòn, thịt mềm, vị cay đậm đà khó cưỡng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Korean Fried Chicken');

-- Soup
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Kimchi Jjigae', 180000,
'Canh kimchi chua cay đặc trưng với kimchi lên men 3 tháng, thịt heo ba chỉ, đậu phụ và rau củ. Nước dùng đậm đà, ấm nóng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Kimchi Jjigae');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Sundubu Jjigae', 160000,
'Canh đậu hũ non cay với hải sản, trứng và kimchi. Nước dùng đỏ đậm đà, ấm nóng, tốt cho sức khỏe.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Sundubu Jjigae');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Doenjang Jjigae', 140000,
'Canh tương đậu truyền thống với đậu hũ, khoai tây, hành lá và rau củ. Vị đậm đà, bổ dưỡng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Doenjang Jjigae');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Miyeok Guk', 120000,
'Canh rong biển truyền thống Hàn Quốc với thịt bò, bổ dưỡng cho phụ nữ sau sinh. Trong vắt, ngọt thanh.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Miyeok Guk');

-- Đồ Uống
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Soju Original', 120000,
'Soju truyền thống Hàn Quốc 20.1% độ cồn, vị ngọt nhẹ, uống lạnh cùng BBQ.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM menu_item mi WHERE mi.merchant_id=m.id AND mi.name_item='Soju Original');

-- =========================================================
-- 6) OPTIONS — CÀ PHÊ SÀI GÒN (Size/Đường/Đá) + gắn vào Đen Đá
-- =========================================================
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Chọn Size', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Chọn Size');

INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Đường', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Mức Đường');

INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Đá', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Mức Đá');

-- Items cho 3 option
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='M')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('S'),('M'),('L')) AS v(val) ON TRUE
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Chọn Size'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Không'),('Ít'),('Vừa'),('Nhiều')) AS v(val) ON TRUE
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đường'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Không'),('Ít'),('Vừa'),('Nhiều')) AS v(val) ON TRUE
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đá'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Gắn vào 'Cà Phê Đen Đá'
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN "option" o ON o.merchant_id=m.id AND o.option_name IN ('Chọn Size','Mức Đường','Mức Đá')
JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id AND mi.name_item='Cà Phê Đen Đá'
WHERE m.merchant_name='Cà Phê Sài Gòn'
AND NOT EXISTS (
  SELECT 1 FROM menu_item_option x WHERE x.option_id=o.id AND x.menu_item_id=mi.id
);

-- =========================================================
-- 7) OPTIONS — SEOUL BBQ HOUSE + gắn vào món BBQ
-- =========================================================
-- Tạo 4 option
INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Phần Thịt', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Phần Thịt');

INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Cay', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Mức Cay');

INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Ăn Kèm', TRUE, FALSE, 2 FROM merchant m
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Ăn Kèm');

INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Loại Sốt', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Loại Sốt');

-- Items cho các option
-- Phần Thịt
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='300g')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('200g'),('300g'),('500g')) AS v(val) ON TRUE
WHERE m.merchant_name='Seoul BBQ House' AND o.option_name='Phần Thịt'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Mức Cay
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Không'),('Vừa'),('Cay')) AS v(val) ON TRUE
WHERE m.merchant_name='Seoul BBQ House' AND o.option_name='Mức Cay'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Ăn Kèm
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, FALSE
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Rau cuốn'),('Kimchi'),('Cơm trắng')) AS v(val) ON TRUE
WHERE m.merchant_name='Seoul BBQ House' AND o.option_name='Ăn Kèm'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Loại Sốt
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Original')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Original'),('Soy Garlic'),('Gochujang')) AS v(val) ON TRUE
WHERE m.merchant_name='Seoul BBQ House' AND o.option_name='Loại Sốt'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Gắn option vào các món
-- 3 món thịt nướng: Phần Thịt + Mức Cay + Ăn Kèm
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id 
                  AND mi.name_item IN ('Bulgogi Beef','Galbi Beef','Samgyeopsal')
JOIN "option" o ON o.merchant_id=m.id AND o.option_name IN ('Phần Thịt','Mức Cay','Ăn Kèm')
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (
  SELECT 1 FROM menu_item_option x WHERE x.option_id=o.id AND x.menu_item_id=mi.id
);

-- Gà rán: thêm Loại Sốt
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id 
                  AND mi.name_item='Korean Fried Chicken'
JOIN "option" o ON o.merchant_id=m.id 
               AND o.option_name IN ('Phần Thịt','Mức Cay','Ăn Kèm','Loại Sốt')
WHERE m.merchant_name='Seoul BBQ House'
AND NOT EXISTS (
  SELECT 1 FROM menu_item_option x WHERE x.option_id=o.id AND x.menu_item_id=mi.id
);

-- =========================================================
-- 8) OPTIONS — PHỞ HÀ NỘI + gắn vào tất cả món thuộc category "Phở"
-- =========================================================
-- Tạo 3 option: Chọn Tô / Mức Hành / Mức Cay
INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Chọn Tô', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Chọn Tô');

INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Hành', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Mức Hành');

INSERT INTO "option"(merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Cay', FALSE, TRUE, 1 FROM merchant m
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (SELECT 1 FROM "option" o WHERE o.merchant_id=m.id AND o.option_name='Mức Cay');

-- Items cho 3 option
-- Chọn Tô
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Nhỏ'),('Vừa'),('Lớn')) AS v(val) ON TRUE
WHERE m.merchant_name='Phở Hà Nội' AND o.option_name='Chọn Tô'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Mức Hành
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Không'),('Vừa'),('Nhiều')) AS v(val) ON TRUE
WHERE m.merchant_name='Phở Hà Nội' AND o.option_name='Mức Hành'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Mức Cay
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.val, TRUE, (v.val='Vừa')
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id
JOIN (VALUES ('Không'),('Vừa'),('Cay')) AS v(val) ON TRUE
WHERE m.merchant_name='Phở Hà Nội' AND o.option_name='Mức Cay'
AND NOT EXISTS (SELECT 1 FROM option_item oi WHERE oi.option_id=o.id AND oi.option_item_name=v.val);

-- Gắn 3 option vào TẤT CẢ món thuộc category 'Phở'
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id
JOIN "option" o ON o.merchant_id=m.id AND o.option_name IN ('Chọn Tô','Mức Hành','Mức Cay')
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM menu_item_option x WHERE x.option_id=o.id AND x.menu_item_id=mi.id
);

COMMIT;

-- (Tuỳ chọn) Kiểm tra nhanh
-- SELECT merchant_name, id FROM merchant;
-- SELECT m.merchant_name, c.category_name, c.id FROM category c JOIN merchant m ON m.id=c.merchant_id ORDER BY 1,2;
-- SELECT m.merchant_name, mi.name_item, mi.price FROM menu_item mi JOIN merchant m ON m.id=mi.merchant_id ORDER BY 1,2;





select * from category


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

-- 🍗 KFC
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '6c118818-44d5-4463-929a-1e79069cf223',
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
);




-- 🍔 McDonald's
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  'b62277ac-d3a6-4044-b224-d8e6169dd49b',
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
);



-- 🍟 Jollibee
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  'b8fa983c-3d7a-4fa0-8ea9-307bb867d195',
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
);



-- ☕ Phê La
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '2b368ff5-6a8e-4491-8557-2e9b37ee6362',
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
);

-- 🍃 Phúc Long
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  'cbd580cc-7a07-4457-b666-b10d663236b1',
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
);

-- 🧋 Katinat
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  'ad723f17-32f6-4c75-b4e0-69e92b6a4499',
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
);


-- 🍱 Cơm Tấm Phúc Lộc Thọ
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '1628d262-631f-47c1-80ce-c2f915a4e4ec',
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
);


-- 🥖 Bánh Mì Huynh Hoa
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '0de9aff0-55c8-4a30-b446-f34384418850',
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
);



-- 🍢 Busan Korean Street Food
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '1d58cc03-c692-4a50-b74f-ba5b51bbb727',
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
);

-- 🍜 Seoul Tofu & BBQ
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  '74f62399-f357-42ad-afb6-36aca48828d6',
  'Seoul Tofu & BBQ',
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
);

-- 🍗 Sasin
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES (
  'f42755d0-a880-48fe-85ef-524677d86e62',
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
);

SELECT id, merchant_name FROM merchant;

-- === CATEGORY ===
INSERT INTO category (merchant_id, category_name) VALUES
('d3ab533a-fd35-49a5-a66c-02a9345620c8', 'PHIN'),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', 'MOKA POT'),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', 'SYPHON'),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', 'FRENCH FRESS'),
('d3ab533a-fd35-49a5-a66c-02a9345620c8', 'Ô LONG MATCHA');





-- === MENU_ITEM ===
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








INSERT INTO category (merchant_id, category_name) VALUES
('590fb5ad-f4b9-4bd3-8851-0777994751d9','COMBO GÀ'),
('590fb5ad-f4b9-4bd3-8851-0777994751d9','BURGER'),
('590fb5ad-f4b9-4bd3-8851-0777994751d9','ĐỒ UỐNG');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT '590fb5ad-f4b9-4bd3-8851-0777994751d9', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('COMBO GÀ','Combo Gà Rán 3 Miếng',89000,'3 miếng gà rán giòn cay kèm khoai tây','{"url":"https://kfcvietnam.com.vn/uploads/product/ga-ran.jpg"}'),
('BURGER','Burger Gà Quay',69000,'Burger gà quay phô mai','{"url":"https://kfcvietnam.com.vn/uploads/product/burger.jpg"}'),
('BURGER','Burger Tôm',72000,'Burger nhân tôm chiên','{"url":"https://kfcvietnam.com.vn/uploads/product/burger-tom.jpg"}'),
('ĐỒ UỐNG','Pepsi',19000,'Pepsi tươi mát','{"url":"https://kfcvietnam.com.vn/uploads/product/pepsi.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='590fb5ad-f4b9-4bd3-8851-0777994751d9';



INSERT INTO category (merchant_id, category_name) VALUES
('398fdf20-5dfe-4e70-a7df-7ae86775b873','GÀ RÁN'),
('398fdf20-5dfe-4e70-a7df-7ae86775b873','MỲ Ý'),
('398fdf20-5dfe-4e70-a7df-7ae86775b873','TRÁNG MIỆNG');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT '398fdf20-5dfe-4e70-a7df-7ae86775b873', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('GÀ RÁN','Gà Rán Giòn Cay',59000,'Gà rán cay giòn đặc trưng','{"url":"https://jollibee.com.vn/uploads/product/ga-ran.jpg"}'),
('MỲ Ý','Mỳ Ý Sốt Bò Bằm',55000,'Mỳ Ý sốt bò bằm thơm ngon','{"url":"https://jollibee.com.vn/uploads/product/my-y.jpg"}'),
('TRÁNG MIỆNG','Kem Ly Jollibee',19000,'Kem vani mềm mịn','{"url":"https://jollibee.com.vn/uploads/product/kem.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='398fdf20-5dfe-4e70-a7df-7ae86775b873';


INSERT INTO category (merchant_id, category_name) VALUES
('f1f0d511-ef21-4ee3-b2d1-8ed527375722','BURGER'),
('f1f0d511-ef21-4ee3-b2d1-8ed527375722','KHOAI & ĂN NHẸ'),
('f1f0d511-ef21-4ee3-b2d1-8ed527375722','ĐỒ UỐNG');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'f1f0d511-ef21-4ee3-b2d1-8ed527375722', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('BURGER','Big Mac',89000,'Burger bò đặc trưng McDonald’s','{"url":"https://mcdonalds.vn/uploads/product/bigmac.jpg"}'),
('BURGER','Cheeseburger',79000,'Burger bò phô mai','{"url":"https://mcdonalds.vn/uploads/product/cheeseburger.jpg"}'),
('KHOAI & ĂN NHẸ','Khoai Tây Chiên',39000,'Khoai tây chiên giòn vàng','{"url":"https://mcdonalds.vn/uploads/product/fries.jpg"}'),
('ĐỒ UỐNG','Coca-Cola',19000,'Coca tươi mát','{"url":"https://mcdonalds.vn/uploads/product/coke.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='f1f0d511-ef21-4ee3-b2d1-8ed527375722';

-- ============================
-- 🔹 PHÚC LONG
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('f34d367a-3736-4f71-9857-ee71de7f02bb','TRÀ'),
('f34d367a-3736-4f71-9857-ee71de7f02bb','TRÀ SỮA'),
('f34d367a-3736-4f71-9857-ee71de7f02bb','ĐÁ XAY');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'f34d367a-3736-4f71-9857-ee71de7f02bb', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('TRÀ','Trà Oolong',45000,'Trà ô long đậm vị','{"url":"https://phuclong.com.vn/uploads/product/oolong.jpg"}'),
('TRÀ SỮA','Trà Sữa Truyền Thống',49000,'Trà sữa thơm béo','{"url":"https://phuclong.com.vn/uploads/product/milk-tea.jpg"}'),
('ĐÁ XAY','Matcha Đá Xay',59000,'Matcha xay với kem tươi','{"url":"https://phuclong.com.vn/uploads/product/matcha.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='f34d367a-3736-4f71-9857-ee71de7f02bb';



-- ============================
-- 🔹 BUSAN KOREAN STREET FOOD
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('8e78d57a-2b07-48eb-99ec-9035185156cf','TOKBOKKI'),
('8e78d57a-2b07-48eb-99ec-9035185156cf','KIMBAP'),
('8e78d57a-2b07-48eb-99ec-9035185156cf','MÌ LẠNH');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT '8e78d57a-2b07-48eb-99ec-9035185156cf', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('TOKBOKKI','Tokbokki Phô Mai',65000,'Bánh gạo cay phủ phô mai Hàn Quốc','{"url":"https://busanfood.vn/uploads/tokbokki.jpg"}'),
('KIMBAP','Kimbap Truyền Thống',49000,'Cơm cuộn Hàn Quốc nhân trứng, rau, thịt nguội','{"url":"https://busanfood.vn/uploads/kimbap.jpg"}'),
('MÌ LẠNH','Mì Lạnh Hàn Quốc',75000,'Mì lạnh thanh mát kiểu Busan','{"url":"https://busanfood.vn/uploads/milanh.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='8e78d57a-2b07-48eb-99ec-9035185156cf';

-- ============================
-- 🔹 SEOUL BBQ HOUSE
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('f4b77280-dff5-44c8-8b4f-e731d41196ae','THỊT NƯỚNG'),
('f4b77280-dff5-44c8-8b4f-e731d41196ae','CƠM TRỘN'),
('f4b77280-dff5-44c8-8b4f-e731d41196ae','LẨU HÀN');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'f4b77280-dff5-44c8-8b4f-e731d41196ae', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('THỊT NƯỚNG','Ba Chỉ Nướng',120000,'Ba chỉ heo nướng Hàn Quốc','{"url":"https://seoulbbq.vn/uploads/bachi.jpg"}'),
('CƠM TRỘN','Bibimbap',89000,'Cơm trộn Hàn Quốc truyền thống','{"url":"https://seoulbbq.vn/uploads/bibimbap.jpg"}'),
('LẨU HÀN','Lẩu Kimchi',159000,'Lẩu kimchi cay cay, đậm vị','{"url":"https://seoulbbq.vn/uploads/laukimchi.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='f4b77280-dff5-44c8-8b4f-e731d41196ae';

-- ============================
-- 🔹 SEOUL TOFU & BBQ
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('f924732b-e6eb-4950-9ae2-56b7a565da03','ĐẬU HŨ HẦM'),
('f924732b-e6eb-4950-9ae2-56b7a565da03','BBQ'),
('f924732b-e6eb-4950-9ae2-56b7a565da03','CƠM TRỘN');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'f924732b-e6eb-4950-9ae2-56b7a565da03', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('ĐẬU HŨ HẦM','Đậu Hũ Hầm Hải Sản',139000,'Đậu hũ non hầm hải sản cay','{"url":"https://seoultofu.vn/uploads/tofu.jpg"}'),
('BBQ','Ba Chỉ Bò Nướng',179000,'Ba chỉ bò Mỹ nướng than hoa','{"url":"https://seoultofu.vn/uploads/bbq.jpg"}'),
('CƠM TRỘN','Bibimbap Truyền Thống',89000,'Cơm trộn rau củ, trứng và sốt gochujang','{"url":"https://seoultofu.vn/uploads/bibimbap.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='f924732b-e6eb-4950-9ae2-56b7a565da03';

-- ============================
-- 🔹 SASIN
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('fdbff547-e0fb-452d-8dd4-d3b1cdf88a22','MÌ CAY'),
('fdbff547-e0fb-452d-8dd4-d3b1cdf88a22','LẨU MINI'),
('fdbff547-e0fb-452d-8dd4-d3b1cdf88a22','ĐỒ ĂN VẶT');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'fdbff547-e0fb-452d-8dd4-d3b1cdf88a22', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('MÌ CAY','Mì Cay Cấp 1',55000,'Mì cay hải sản cấp độ nhẹ','{"url":"https://sasin.vn/uploads/micay1.jpg"}'),
('MÌ CAY','Mì Cay Cấp 7',69000,'Mì cay cực mạnh cho người mê thử thách','{"url":"https://sasin.vn/uploads/micay7.jpg"}'),
('LẨU MINI','Lẩu Mini Bò Mỹ',129000,'Lẩu mini dành cho 1-2 người','{"url":"https://sasin.vn/uploads/lau-mini.jpg"}'),
('ĐỒ ĂN VẶT','Khoai Tây Lắc Phô Mai',39000,'Khoai chiên giòn phủ phô mai','{"url":"https://sasin.vn/uploads/khoai-lac.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='fdbff547-e0fb-452d-8dd4-d3b1cdf88a22';

-- ============================
-- 🔹 BÁNH MÌ HUYNH HOA
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('db986182-9e3d-49fc-92ce-f354c8ab3723','BÁNH MÌ'),
('db986182-9e3d-49fc-92ce-f354c8ab3723','NƯỚC GIẢI KHÁT'),
('db986182-9e3d-49fc-92ce-f354c8ab3723','COMBO');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT 'db986182-9e3d-49fc-92ce-f354c8ab3723', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('BÁNH MÌ','Bánh Mì Đặc Biệt',55000,'Bánh mì đầy đủ chả, thịt, pate, đồ chua','{"url":"https://banhmi.vn/uploads/dacbiet.jpg"}'),
('BÁNH MÌ','Bánh Mì Thịt Nguội',49000,'Bánh mì thịt nguội và pate','{"url":"https://banhmi.vn/uploads/thitnguoi.jpg"}'),
('NƯỚC GIẢI KHÁT','Trà Đá',5000,'Trà đá miễn phí','{"url":"https://banhmi.vn/uploads/trada.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='db986182-9e3d-49fc-92ce-f354c8ab3723';

-- ============================
-- 🔹 CƠM TẤM PHÚC LỘC THỌ
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('3e41b718-3c0a-433a-a330-41ad735a57dd','CƠM TẤM'),
('3e41b718-3c0a-433a-a330-41ad735a57dd','CANH'),
('3e41b718-3c0a-433a-a330-41ad735a57dd','NƯỚC GIẢI KHÁT');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT '3e41b718-3c0a-433a-a330-41ad735a57dd', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('CƠM TẤM','Cơm Tấm Sườn Bì Chả',69000,'Cơm tấm truyền thống miền Nam','{"url":"https://comtam.vn/uploads/suombicha.jpg"}'),
('CƠM TẤM','Cơm Tấm Sườn Trứng',65000,'Cơm sườn nướng trứng ốp la','{"url":"https://comtam.vn/uploads/suontrung.jpg"}'),
('CANH','Canh Chua Cá Lóc',35000,'Canh chua chuẩn vị miền Tây','{"url":"https://comtam.vn/uploads/canhchua.jpg"}'),
('NƯỚC GIẢI KHÁT','Nước Sâm',15000,'Nước sâm mát lạnh','{"url":"https://comtam.vn/uploads/nocsam.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='3e41b718-3c0a-433a-a330-41ad735a57dd';

-- ============================
-- 🔹 KATINAT
-- ============================
INSERT INTO category (merchant_id, category_name) VALUES
('0ae2fe9e-b88a-4923-a48c-f485a6614db4','CÀ PHÊ'),
('0ae2fe9e-b88a-4923-a48c-f485a6614db4','TRÀ'),
('0ae2fe9e-b88a-4923-a48c-f485a6614db4','ĐÁ XAY');

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT '0ae2fe9e-b88a-4923-a48c-f485a6614db4', c.id, m.name_item, m.price, m.description, m.image_item::jsonb
FROM category c
JOIN (VALUES
('CÀ PHÊ','Cold Brew',55000,'Cold brew nguyên chất 24h','{"url":"https://katinat.vn/uploads/coldbrew.jpg"}'),
('TRÀ','Trà Nhài Sữa',49000,'Trà nhài hương nhẹ, sữa tươi','{"url":"https://katinat.vn/uploads/tranhai.jpg"}'),
('ĐÁ XAY','Matcha Latte Đá Xay',59000,'Matcha blend đá xay','{"url":"https://katinat.vn/uploads/matcha.jpg"}')
) AS m(category_name,name_item,price,description,image_item)
ON c.category_name = m.category_name AND c.merchant_id='0ae2fe9e-b88a-4923-a48c-f485a6614db4';


































-- =========================
-- Enums cho trạng thái
-- =========================
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'PENDING','CONFIRMED','PREPARING','DELIVERING','COMPLETED','CANCELED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID','PAID','REFUNDED','FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('COD','VNPAY','MOMO','STRIPE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =========================
-- Hàm & trigger auto-update updated_at
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- Bảng chính: customer_orders
-- =========================
CREATE TABLE IF NOT EXISTS customer_orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id       uuid NOT NULL REFERENCES merchant(id) ON DELETE RESTRICT,
  user_id           uuid NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,

  full_name         varchar(255) NOT NULL,
  phone             varchar(20)  NOT NULL,
  delivery_address  text         NOT NULL,
  

  delivery_fee      bigint  NOT NULL DEFAULT 0,         -- tiền tính theo đơn vị nhỏ nhất (đồng)
  subtotal          bigint  NOT NULL DEFAULT 0,
  discount          bigint  NOT NULL DEFAULT 0,
  tax               bigint  NOT NULL DEFAULT 0,
  total_amount      bigint  NOT NULL DEFAULT 0,

  note              text,

  status            order_status   NOT NULL DEFAULT 'PENDING',
  payment_status    payment_status NOT NULL DEFAULT 'UNPAID',
  payment_method    payment_method,
  transaction_id    varchar(100),
  paid_at           timestamptz,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_orders_user     ON customer_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_merchant ON customer_orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_status   ON customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_customer_orders_created  ON customer_orders(created_at);

DROP TRIGGER IF EXISTS trg_customer_orders_updated ON customer_orders;
CREATE TRIGGER trg_customer_orders_updated
BEFORE UPDATE ON customer_orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- Bảng con: order_item (snapshot giá & tên món tại thời điểm mua)
-- =========================
CREATE TABLE IF NOT EXISTS order_item (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
  menu_item_id  uuid NOT NULL REFERENCES menu_item(id)       ON DELETE RESTRICT,

  item_name     varchar(255) NOT NULL,   -- snapshot để không lệ thuộc tên hiện tại
  item_image    jsonb,                   -- snapshot ảnh (nếu dùng)

  quantity      bigint NOT NULL DEFAULT 1,
  price         bigint NOT NULL,         -- đơn giá tại thời điểm mua (đồng)
  note          text,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_item_order      ON order_item(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_menu_item  ON order_item(menu_item_id);

DROP TRIGGER IF EXISTS trg_order_item_updated ON order_item;
CREATE TRIGGER trg_order_item_updated
BEFORE UPDATE ON order_item
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- Bảng N-N: order_item_option
-- =========================
CREATE TABLE IF NOT EXISTS order_item_option (
  order_item_id  uuid NOT NULL REFERENCES order_item(id)   ON DELETE CASCADE,
  option_item_id uuid NOT NULL REFERENCES option_item(id)  ON DELETE RESTRICT,
  PRIMARY KEY (order_item_id, option_item_id)
);

CREATE INDEX IF NOT EXISTS idx_oio_option_item ON order_item_option(option_item_id);
