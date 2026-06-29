DROP TABLE IF EXISTS menu_item_option CASCADE;
DROP TABLE IF EXISTS option_item CASCADE;
DROP TABLE IF EXISTS "option" CASCADE;
DROP TABLE IF EXISTS menu_item CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS merchant CASCADE;

-- ========================
-- Bảng: merchant
-- ========================
CREATE TABLE merchant (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    location JSONB,
    phone VARCHAR(20),
    email VARCHAR(100),
    profile_image JSONB,
    cover_image JSONB,
    time_open JSONB
);

-- ========================
-- Bảng: category
-- ========================
CREATE TABLE category (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    category_name VARCHAR(100) NOT null,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE

);

-- ========================
-- Bảng: menu_item
-- ========================
CREATE TABLE menu_item (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    category_id UUID,
    name_item VARCHAR(255) NOT NULL,
    likes BIGINT DEFAULT 0,
    price BIGINT NOT NULL,
    description TEXT,
    sold_count BIGINT DEFAULT 0,
    image_item JSONB,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

-- ========================
-- Bảng: option
-- ========================
CREATE TABLE "option" (
    id UUID PRIMARY KEY,
    merchant_id UUID NOT NULL,
    option_name VARCHAR(100) NOT NULL,
    multi_select BOOLEAN DEFAULT FALSE,
    require_select BOOLEAN DEFAULT FALSE,
    number_select BIGINT DEFAULT 0,
    FOREIGN KEY (merchant_id) REFERENCES merchant(id) ON DELETE CASCADE

);

-- ========================
-- Bảng: option_item
-- ========================
CREATE TABLE option_item (
    id UUID PRIMARY KEY,
    option_id UUID NOT NULL,
    option_item_name VARCHAR(100) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    status_select BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (option_id) REFERENCES "option"(id) ON DELETE CASCADE
);

-- ========================
-- Bảng trung gian: menu_item_option
-- (N-N giữa menu_item và option)
-- ========================
CREATE TABLE menu_item_option (
    option_id UUID NOT NULL,
    menu_item_id UUID NOT NULL,
    PRIMARY KEY (option_id, menu_item_id),
    FOREIGN KEY (option_id) REFERENCES "option"(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_item(id) ON DELETE CASCADE
);
-- INSERTS generated from provided JSON

-- Owner user_id placeholder for all merchants

-- OWNER_USER_ID = 01b3937d-d3a6-4b26-ba87-fda7bf641d6e


-- ========================
-- MERCHANTS
-- ========================

-- =========================================
-- MERCHANTS
-- =========================================
/* =========================
   1) MERCHANTS (không insert id)
   ========================= */
-- Bật extension để dùng gen_random_uuid()

update merchant 
set merchant_name = 'Phở Hà Nội'
where merchant_name = 'Phở Sài Gòn'

CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE merchant ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE category ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE menu_item ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE "option" ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE option_item ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 1) MERCHANTS (user_id là UUID hợp lệ) - ĐÃ ĐỔI ĐỊA CHỈ SANG TP.HCM
INSERT INTO merchant (user_id, merchant_name, location, phone, email, profile_image, cover_image, time_open)
VALUES
  (
    gen_random_uuid(),
    'Phở Hà Nội',
    -- ĐỔI HN -> HCM
    '{"address":"120 Nguyễn Trãi, Quận 1, TP.HCM","lat":10.7725,"lng":106.6980}'::jsonb,
    '028-1234-5678',
    'contact@pho-hanoi.vn',
    '{"url":"https://images.unsplash.com/photo-1595215909290-847cb783facf"}'::jsonb,
    '{"url":"https://images.unsplash.com/photo-1552566626-52f8b828add9"}'::jsonb,
    '{"mon-sun":{"open":"06:00","close":"22:00"}}'::jsonb
  ),
  (
    gen_random_uuid(),
    'Cà Phê Sài Gòn',
    -- Giữ HCM (đã đúng)
    '{"address":"45 Lê Lợi, Quận 1, TP.HCM","lat":10.7730,"lng":106.7000}'::jsonb,
    '028-9876-5432',
    'hello@caphe-saigon.vn',
    '{"url":"https://images.unsplash.com/photo-1648451142763-6fb6244cb8a5"}'::jsonb,
    '{"url":"https://images.unsplash.com/photo-1517701604599-bb29b565090c"}'::jsonb,
    '{"mon-sun":{"open":"07:00","close":"23:00"}}'::jsonb
  );


select * from merchant
select * from category
select * from menu_item

INSERT INTO merchant (user_id, merchant_name, location, profile_image, cover_image, time_open)
VALUES
(
  gen_random_uuid(),
  'Seoul BBQ House',
  '{"address":"88 Nguyễn Huệ, Quận 1, TP.HCM","lat":10.7755,"lng":106.7031}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}'::jsonb,
  '{"url":"https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}'::jsonb,
  '{"mon-sun":{"open":"10:00","close":"23:00"}}'::jsonb
);

-- 2) CATEGORIES (lookup merchant_id theo tên)

INSERT INTO category (merchant_id, category_name)
SELECT m.id, v.category_name
FROM merchant m
JOIN (VALUES ('BBQ'), ('Soup'), ('Đồ Uống')) AS v(category_name) ON TRUE
WHERE m.merchant_name = 'Seoul BBQ House';

INSERT INTO category (merchant_id, category_name)
SELECT m.id, v.category_name
FROM merchant m
JOIN (VALUES ('Phở'),('Bánh Mì'),('Bún'),('Đồ Uống')) AS v(category_name) ON TRUE
WHERE m.merchant_name='Phở Hà Nội'
AND NOT EXISTS (
  SELECT 1 FROM category c WHERE c.merchant_id=m.id AND c.category_name=v.category_name
);

INSERT INTO category (merchant_id, category_name)
SELECT m.id, 'Đồ uống - Cà phê'
FROM merchant m
WHERE m.merchant_name = 'Cà Phê Sài Gòn';

-- 3) MENU ITEMS cho "Phở Hà Nội"
-- Phở
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Bò Đặc Biệt', 68000,
'Phở bò thượng hạng với đầy đủ topping: thịt chín mềm, tái mỏng, gầu dai ngon, gân giòn và sách bò. Nước dùng trong vắt, thơm lừng ninh từ xương bò suốt 12 tiếng. Kèm rau thơm, chanh, ớt tươi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Gà', 70000,
'Phở gà thơm ngon với thịt gà tươi, nước dùng trong ngọt từ xương gà ta. Bánh phở mềm dai, kèm đầy đủ rau thơm và nước chấm đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1636474498689-27e2d3ecf8d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Tái', 75000,
'Phở bò tái với thịt bò tái mỏng như giấy, tươi ngon, nước dùng trong vắt ninh từ xương bò. Ăn kèm rau thơm và chanh tươi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1597577652129-7ffad9d37ad4')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Phở Chín', 70000,
'Phở bò chín truyền thống với thịt bò chín mềm ngon, nước dùng đậm đà thơm lừng. Món phở an toàn cho mọi lứa tuổi.',
jsonb_build_object('url','https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Phở'
WHERE m.merchant_name='Phở Hà Nội';

-- Bánh mì
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Thịt Nướng', 35000,
'Bánh mì Việt Nam truyền thống với vỏ giòn rụm, ruột mềm. Thịt heo nướng than hoa thơm lừng, pate gan tự làm, rau cải, cà rót, đồ chua và tương ớt đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1524062008239-962eb6d3383d')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Pâté', 25000,
'Bánh mì pâté truyền thống với pâté gan tự làm thơm ngon, rau thơm tươi mát, đồ chua giòn giòn và tương ớt đặc biệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1599461143300-67b5d7ffe42c')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Chả Cá', 40000,
'Bánh mì chả cá Hà Nội với chả cá thơm lừng, thêm thì là, rau thơm và bún tươi. Hương vị đặc trưng khó quên.',
jsonb_build_object('url','https://images.unsplash.com/photo-1526551800-4c06b10ee6ee')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bánh Mì Xíu Mại', 35000,
'Bánh mì xíu mại với những viên xíu mại mềm thơm, nước sốt đậm đà, rau sống tươi và đồ chua chua ngọt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1524062008239-962eb6d3383d')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bánh Mì'
WHERE m.merchant_name='Phở Hà Nội';

-- Bún
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Chả Hà Nội', 75000,
'Món bún chả Hà Nội chính gốc với thịt nướng than hoa thơm ngon, chả viên đặc biệt, bún tươi. Nước chấm chua ngọt đậm đà, rau sống tươi mát và nem cua bể giòn tan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Bò Nam Bộ', 65000,
'Bún bò Nam Bộ đặc biệt với thịt bò nướng thơm ngon, rau thơm đa dạng, đậu phộng rang và nước mắm chua ngọt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Riêu', 55000,
'Bún riêu cua đồng với nước dùng chua ngọt từ cua đồng, cà chua, đậu hũ và rau muống. Thơm ngon đậm đà.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bún Chả Cá', 70000,
'Bún chả cá Hà Nội với chả cá thơm lừng, thì là tươi, bún tươi và nước mắm chấm đậm đà. Món ăn đặc trưng của thủ đô.',
jsonb_build_object('url','https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Bún'
WHERE m.merchant_name='Phở Hà Nội';

-- Đồ Uống
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Nước Lọc', 8000,
'Nước lọc tinh khiết chai 500ml, mát lạnh.',
jsonb_build_object('url','https://images.unsplash.com/photo-1757332051114-ae8c79214cef')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Nước Dừa Tươi', 25000,
'Nước dừa tươi ngọt mát, giải khát tuyệt vời. Dừa xiêm xanh tươi hái trong ngày.',
jsonb_build_object('url','https://images.unsplash.com/photo-1757332051114-ae8c79214cef')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Trà Đá', 5000,
'Trà đá truyền thống Việt Nam, thơm mát, giá phải chăng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Phở Hà Nội';

-- 4) MENU ITEMS cho "Cà Phê Sài Gòn"
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Đen Đá', 20000,
'Cà phê đen Robusta Buôn Ma Thuột rang mộc, pha phin truyền thống, đậm đà, thơm lừng. Uống kèm đá lạnh giải nhiệt.',
jsonb_build_object('url','https://images.unsplash.com/photo-1644204010193-a35de7b0d702')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Sữa Đá', 30000,
'Cà phê phin Việt Nam kết hợp sữa đặc ngọt ngào, tạo nên hương vị đặc trưng không thể nhầm lẫn của Sài Gòn.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Bạc Xỉu', 28000,
'Cà phê bạc xỉu với nhiều sữa, ít cà phê, ngọt ngào dễ uống. Phù hợp cho người không thích đắng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Espresso', 22000,
'Espresso Việt Nam đậm đà, pha theo style Italy nhưng dùng hạt Robusta Buôn Ma Thuột. Đắng ngọt hậu vị.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Cà Phê Cappuccino', 35000,
'Cappuccino Việt Nam với espresso đậm, sữa tươi và bọt sữa mịn. Rắc bột cacao, phong cách Âu - Á.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
WHERE m.merchant_name='Cà Phê Sài Gòn';

-- 5) OPTIONS (thuộc merchant "Cà Phê Sài Gòn")
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Chọn Size', FALSE, TRUE, 1 FROM merchant m WHERE m.merchant_name='Cà Phê Sài Gòn';
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Đường', FALSE, TRUE, 1 FROM merchant m WHERE m.merchant_name='Cà Phê Sài Gòn';
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Đá',   FALSE, TRUE, 1 FROM merchant m WHERE m.merchant_name='Cà Phê Sài Gòn';

-- 6) OPTION ITEMS
-- Size
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'S', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Chọn Size';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'M', TRUE, TRUE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Chọn Size';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'L', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Chọn Size';

-- Đường
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Không', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đường';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Ít', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đường';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Vừa', TRUE, TRUE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đường';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Nhiều', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đường';

-- Đá
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Không', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đá';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Ít', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đá';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Vừa', TRUE, TRUE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đá';
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, 'Nhiều', TRUE, FALSE FROM "option" o JOIN merchant m ON o.merchant_id=m.id
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name='Mức Đá';

-- 7) GẮN OPTIONS VÀO MÓN "Cà Phê Đen Đá" (N-N)
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN "option" o ON o.merchant_id=m.id
JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ uống - Cà phê'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id AND mi.name_item='Cà Phê Đen Đá'
WHERE m.merchant_name='Cà Phê Sài Gòn' AND o.option_name IN ('Chọn Size','Mức Đường','Mức Đá');

-- ========================
-- MENU ITEMS: BBQ
-- ========================
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Bulgogi Beef', 450000,
'Thịt bò Wagyu A5 thái lát mỏng, ướp sốt bulgogi truyền thống với lê, nước tương, mắm tôm. Nướng than hoa, ăn kèm kimchi và banchan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Galbi Beef', 580000,
'Sườn bò Galbi cao cấp ướp sốt truyền thống, nướng than hoa. Thịt mềm ngọt, ăn kèm kimchi và banchan.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Samgyeopsal', 380000,
'Thịt ba chỉ heo Hàn Quốc nướng giòn, ăn với rau sống, tỏi và các loại banchan. Đậm đà hương vị truyền thống.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Korean Fried Chicken', 280000,
'Gà rán Hàn Quốc giòn tan với sốt gochujang cay ngọt. Da giòn, thịt mềm, vị cay đậm đà khó cưỡng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
WHERE m.merchant_name='Seoul BBQ House';

-- ========================
-- MENU ITEMS: Soup
-- ========================
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Kimchi Jjigae', 180000,
'Canh kimchi chua cay đặc trưng với kimchi lên men 3 tháng, thịt heo ba chỉ, đậu phụ và rau củ. Nước dùng đậm đà, ấm nóng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Sundubu Jjigae', 160000,
'Canh đậu hũ non cay với hải sản, trứng và kimchi. Nước dùng đỏ đậm đà, ấm nóng, tốt cho sức khỏe.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Doenjang Jjigae', 140000,
'Canh tương đậu truyền thống với đậu hũ, khoai tây, hành lá và rau củ. Vị đậm đà, bổ dưỡng.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Miyeok Guk', 120000,
'Canh rong biển truyền thống Hàn Quốc với thịt bò, bổ dưỡng cho phụ nữ sau sinh. Trong vắt, ngọt thanh.',
jsonb_build_object('url','https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Soup'
WHERE m.merchant_name='Seoul BBQ House';

-- ========================
-- MENU ITEMS: Đồ Uống
-- ========================
INSERT INTO menu_item (merchant_id, category_id, name_item, price, description, image_item)
SELECT m.id, c.id, 'Soju Original', 120000,
'Soju truyền thống Hàn Quốc 20.1% độ cồn, vị ngọt nhẹ, uống lạnh cùng BBQ.',
jsonb_build_object('url','https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=center&cs=tinysrgb&fit=crop&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral&h=300')
FROM merchant m JOIN category c ON c.merchant_id=m.id AND c.category_name='Đồ Uống'
WHERE m.merchant_name='Seoul BBQ House';

-- 5) OPTIONS (thuộc merchant "Seoul BBQ House")
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Phần Thịt', FALSE, TRUE, 1
FROM merchant m WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Mức Cay', FALSE, TRUE, 1
FROM merchant m WHERE m.merchant_name='Seoul BBQ House';

INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Ăn Kèm', TRUE, FALSE, 2
FROM merchant m WHERE m.merchant_name='Seoul BBQ House';

-- Riêng gà rán có thêm chọn sốt
INSERT INTO "option" (merchant_id, option_name, multi_select, require_select, number_select)
SELECT m.id, 'Loại Sốt', FALSE, TRUE, 1
FROM merchant m WHERE m.merchant_name='Seoul BBQ House';

-- 6) OPTION ITEMS cho từng option
-- Gọn bằng 1 VALUES + JOIN theo option_name
INSERT INTO option_item (option_id, option_item_name, status, status_select)
SELECT o.id, v.option_item_name, v.status, v.status_select
FROM "option" o
JOIN merchant m ON m.id=o.merchant_id AND m.merchant_name='Seoul BBQ House'
JOIN (
  -- Phần Thịt (chọn 1)
  VALUES 
    ('Phần Thịt','200g', TRUE, FALSE),
    ('Phần Thịt','300g', TRUE, TRUE),   -- mặc định
    ('Phần Thịt','500g', TRUE, FALSE),

  -- Mức Cay (chọn 1)
    ('Mức Cay','Không', TRUE, FALSE),
    ('Mức Cay','Vừa',   TRUE, TRUE),    -- mặc định
    ('Mức Cay','Cay',   TRUE, FALSE),

  -- Ăn Kèm (multi-select, tối đa 2 tuỳ app enforce)
    ('Ăn Kèm','Rau cuốn', TRUE, FALSE),
    ('Ăn Kèm','Kimchi',   TRUE, FALSE),
    ('Ăn Kèm','Cơm trắng',TRUE, FALSE),

  -- Loại Sốt (cho gà rán)
    ('Loại Sốt','Original',   TRUE, TRUE),  -- mặc định
    ('Loại Sốt','Soy Garlic', TRUE, FALSE),
    ('Loại Sốt','Gochujang',  TRUE, FALSE)
) AS v(option_name, option_item_name, status, status_select)
ON o.option_name = v.option_name;

-- 7) GẮN OPTIONS VÀO CÁC MÓN BBQ

-- Gắn 'Phần Thịt' + 'Mức Cay' + 'Ăn Kèm' cho 3 món thịt nướng
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id 
                  AND mi.name_item IN ('Bulgogi Beef','Galbi Beef','Samgyeopsal')
JOIN "option" o ON o.merchant_id=m.id AND o.option_name IN ('Phần Thịt','Mức Cay','Ăn Kèm')
WHERE m.merchant_name='Seoul BBQ House';

-- Gắn đầy đủ 4 option cho 'Korean Fried Chicken' (có thêm 'Loại Sốt')
INSERT INTO menu_item_option (option_id, menu_item_id)
SELECT o.id, mi.id
FROM merchant m
JOIN category c ON c.merchant_id=m.id AND c.category_name='BBQ'
JOIN menu_item mi ON mi.merchant_id=m.id AND mi.category_id=c.id 
                  AND mi.name_item='Korean Fried Chicken'
JOIN "option" o ON o.merchant_id=m.id 
               AND o.option_name IN ('Phần Thịt','Mức Cay','Ăn Kèm','Loại Sốt')
WHERE m.merchant_name='Seoul BBQ House';

















