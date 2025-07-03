-- Insert categories

INSERT INTO public.categories (id, name) VALUES ('791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', 'Mens Clothing');
INSERT INTO public.categories (id, name) VALUES ('da1094a1-2f29-492e-ab9e-e1b4489416dc', 'Womens Clothing');
INSERT INTO public.categories (id, name) VALUES ('955ee985-9c89-428e-be1b-68fd2ed9aaa5', 'Footwear');
INSERT INTO public.categories (id, name) VALUES ('d3ecda23-d4a0-4e12-8561-154cd96aaaf2', 'Outerwear');
INSERT INTO public.categories (id, name) VALUES ('ecbdd2b8-fd55-4aae-acf3-4e8d26220110', 'Accessories');

-- Insert stores

INSERT INTO public.stores (id, owner_id, name, address, location, logo_url, is_verified, created_at, business_name, tax_id, business_type, contact_phone, contact_email, merchant_id)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'Chelsea Fashion Hub', '123 W 14th St, New York, NY 10011', ST_GeomFromText('POINT(-73.9958 40.7406)', 4326), 'https://example.com/chelsea_fashion_hub_logo.jpg', true, now(), 'Chelsea Fashion Hub', 'NY93914', 'clothing', '123-456-7856', 'chelseafashionhub@example.com', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a');
INSERT INTO public.stores (id, owner_id, name, address, location, logo_url, is_verified, created_at, business_name, tax_id, business_type, contact_phone, contact_email, merchant_id)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'Trendy Threads', '456 W 15th St, New York, NY 10011', ST_GeomFromText('POINT(-73.996 40.742)', 4326), 'https://example.com/trendy_threads_logo.jpg', true, now(), 'Trendy Threads', 'NY60819', 'clothing', '123-456-7873', 'trendythreads@example.com', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a');
INSERT INTO public.stores (id, owner_id, name, address, location, logo_url, is_verified, created_at, business_name, tax_id, business_type, contact_phone, contact_email, merchant_id)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'Urban Styles', '789 W 16th St, New York, NY 10011', ST_GeomFromText('POINT(-73.997 40.743)', 4326), 'https://example.com/urban_styles_logo.jpg', true, now(), 'Urban Styles', 'NY81125', 'clothing', '123-456-7860', 'urbanstyles@example.com', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a');
INSERT INTO public.stores (id, owner_id, name, address, location, logo_url, is_verified, created_at, business_name, tax_id, business_type, contact_phone, contact_email, merchant_id)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'Chic Streetwear', '321 W 17th St, New York, NY 10011', ST_GeomFromText('POINT(-73.998 40.7445)', 4326), 'https://example.com/chic_streetwear_logo.jpg', true, now(), 'Chic Streetwear', 'NY95161', 'clothing', '123-456-7864', 'chicstreetwear@example.com', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a');
INSERT INTO public.stores (id, owner_id, name, address, location, logo_url, is_verified, created_at, business_name, tax_id, business_type, contact_phone, contact_email, merchant_id)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'NYC Apparel', '567 W 18th St, New York, NY 10011', ST_GeomFromText('POINT(-73.999 40.745)', 4326), 'https://example.com/nyc_apparel_logo.jpg', true, now(), 'NYC Apparel', 'NY98027', 'clothing', '123-456-7860', 'nycapparel@example.com', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a');

-- Insert 70 unique products + 30 reused SKUs (100 total entries)

INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0070', 'Product 0070', 'Brand B', 'Description for product 0070', 'https://example.com/product_0070.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0057', 'Product 0057', 'Brand A', 'Description for product 0057', 'https://example.com/product_0057.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0049', 'Product 0049', 'Brand A', 'Description for product 0049', 'https://example.com/product_0049.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0068', 'Product 0068', 'Brand A', 'Description for product 0068', 'https://example.com/product_0068.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0020', 'Product 0020', 'Brand A', 'Description for product 0020', 'https://example.com/product_0020.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0059', 'Product 0059', 'Brand C', 'Description for product 0059', 'https://example.com/product_0059.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0027', 'Product 0027', 'Brand A', 'Description for product 0027', 'https://example.com/product_0027.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0054', 'Product 0054', 'Brand B', 'Description for product 0054', 'https://example.com/product_0054.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0012', 'Product 0012', 'Brand B', 'Description for product 0012', 'https://example.com/product_0012.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0044', 'Product 0044', 'Brand A', 'Description for product 0044', 'https://example.com/product_0044.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0034', 'Product 0034', 'Brand C', 'Description for product 0034', 'https://example.com/product_0034.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0002', 'Product 0002', 'Brand B', 'Description for product 0002', 'https://example.com/product_0002.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0045', 'Product 0045', 'Brand B', 'Description for product 0045', 'https://example.com/product_0045.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0047', 'Product 0047', 'Brand C', 'Description for product 0047', 'https://example.com/product_0047.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0041', 'Product 0041', 'Brand B', 'Description for product 0041', 'https://example.com/product_0041.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0030', 'Product 0030', 'Brand C', 'Description for product 0030', 'https://example.com/product_0030.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0035', 'Product 0035', 'Brand B', 'Description for product 0035', 'https://example.com/product_0035.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0032', 'Product 0032', 'Brand C', 'Description for product 0032', 'https://example.com/product_0032.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0017', 'Product 0017', 'Brand B', 'Description for product 0017', 'https://example.com/product_0017.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0026', 'Product 0026', 'Brand C', 'Description for product 0026', 'https://example.com/product_0026.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0021', 'Product 0021', 'Brand C', 'Description for product 0021', 'https://example.com/product_0021.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0031', 'Product 0031', 'Brand C', 'Description for product 0031', 'https://example.com/product_0031.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0001', 'Product 0001', 'Brand C', 'Description for product 0001', 'https://example.com/product_0001.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0005', 'Product 0005', 'Brand B', 'Description for product 0005', 'https://example.com/product_0005.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0064', 'Product 0064', 'Brand B', 'Description for product 0064', 'https://example.com/product_0064.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0043', 'Product 0043', 'Brand A', 'Description for product 0043', 'https://example.com/product_0043.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0063', 'Product 0063', 'Brand A', 'Description for product 0063', 'https://example.com/product_0063.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0028', 'Product 0028', 'Brand A', 'Description for product 0028', 'https://example.com/product_0028.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0006', 'Product 0006', 'Brand B', 'Description for product 0006', 'https://example.com/product_0006.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0061', 'Product 0061', 'Brand C', 'Description for product 0061', 'https://example.com/product_0061.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0007', 'Product 0007', 'Brand A', 'Description for product 0007', 'https://example.com/product_0007.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0062', 'Product 0062', 'Brand C', 'Description for product 0062', 'https://example.com/product_0062.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0056', 'Product 0056', 'Brand C', 'Description for product 0056', 'https://example.com/product_0056.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0055', 'Product 0055', 'Brand C', 'Description for product 0055', 'https://example.com/product_0055.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0058', 'Product 0058', 'Brand B', 'Description for product 0058', 'https://example.com/product_0058.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0067', 'Product 0067', 'Brand C', 'Description for product 0067', 'https://example.com/product_0067.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0040', 'Product 0040', 'Brand A', 'Description for product 0040', 'https://example.com/product_0040.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0014', 'Product 0014', 'Brand A', 'Description for product 0014', 'https://example.com/product_0014.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0053', 'Product 0053', 'Brand A', 'Description for product 0053', 'https://example.com/product_0053.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0038', 'Product 0038', 'Brand A', 'Description for product 0038', 'https://example.com/product_0038.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0029', 'Product 0029', 'Brand B', 'Description for product 0029', 'https://example.com/product_0029.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0010', 'Product 0010', 'Brand A', 'Description for product 0010', 'https://example.com/product_0010.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0060', 'Product 0060', 'Brand B', 'Description for product 0060', 'https://example.com/product_0060.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0015', 'Product 0015', 'Brand B', 'Description for product 0015', 'https://example.com/product_0015.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0042', 'Product 0042', 'Brand C', 'Description for product 0042', 'https://example.com/product_0042.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0051', 'Product 0051', 'Brand C', 'Description for product 0051', 'https://example.com/product_0051.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0009', 'Product 0009', 'Brand A', 'Description for product 0009', 'https://example.com/product_0009.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0013', 'Product 0013', 'Brand B', 'Description for product 0013', 'https://example.com/product_0013.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0033', 'Product 0033', 'Brand A', 'Description for product 0033', 'https://example.com/product_0033.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0069', 'Product 0069', 'Brand A', 'Description for product 0069', 'https://example.com/product_0069.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0019', 'Product 0019', 'Brand B', 'Description for product 0019', 'https://example.com/product_0019.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0018', 'Product 0018', 'Brand C', 'Description for product 0018', 'https://example.com/product_0018.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0065', 'Product 0065', 'Brand C', 'Description for product 0065', 'https://example.com/product_0065.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0022', 'Product 0022', 'Brand B', 'Description for product 0022', 'https://example.com/product_0022.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0037', 'Product 0037', 'Brand C', 'Description for product 0037', 'https://example.com/product_0037.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0052', 'Product 0052', 'Brand B', 'Description for product 0052', 'https://example.com/product_0052.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0024', 'Product 0024', 'Brand C', 'Description for product 0024', 'https://example.com/product_0024.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0036', 'Product 0036', 'Brand A', 'Description for product 0036', 'https://example.com/product_0036.jpg', '791f9dcc-d7f4-44a9-8f61-f6ab62e4a7d5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0023', 'Product 0023', 'Brand A', 'Description for product 0023', 'https://example.com/product_0023.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0004', 'Product 0004', 'Brand C', 'Description for product 0004', 'https://example.com/product_0004.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0066', 'Product 0066', 'Brand A', 'Description for product 0066', 'https://example.com/product_0066.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0050', 'Product 0050', 'Brand C', 'Description for product 0050', 'https://example.com/product_0050.jpg', '955ee985-9c89-428e-be1b-68fd2ed9aaa5', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0003', 'Product 0003', 'Brand A', 'Description for product 0003', 'https://example.com/product_0003.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0048', 'Product 0048', 'Brand C', 'Description for product 0048', 'https://example.com/product_0048.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0008', 'Product 0008', 'Brand A', 'Description for product 0008', 'https://example.com/product_0008.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0046', 'Product 0046', 'Brand A', 'Description for product 0046', 'https://example.com/product_0046.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0016', 'Product 0016', 'Brand A', 'Description for product 0016', 'https://example.com/product_0016.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0039', 'Product 0039', 'Brand C', 'Description for product 0039', 'https://example.com/product_0039.jpg', 'ecbdd2b8-fd55-4aae-acf3-4e8d26220110', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0025', 'Product 0025', 'Brand C', 'Description for product 0025', 'https://example.com/product_0025.jpg', 'd3ecda23-d4a0-4e12-8561-154cd96aaaf2', now());
INSERT INTO public.products (sku, name, brand, description, image_url, category_id, created_at)
VALUES ('SKU0011', 'Product 0011', 'Brand A', 'Description for product 0011', 'https://example.com/product_0011.jpg', 'da1094a1-2f29-492e-ab9e-e1b4489416dc', now());

-- Insert inventory (SKU-based, 20 SKUs per store)

INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0021', 70.85, 99, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0019', 56.55, 75, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0012', 71.14, 33, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0038', 92.41, 71, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0010', 92.72, 31, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0018', 88.17, 15, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0042', 69.19, 14, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0009', 76.48, 38, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0059', 77.61, 21, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0027', 64.31, 26, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0047', 50.13, 35, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0048', 37.72, 41, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0046', 97.4, 67, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0054', 55.42, 23, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0041', 49.44, 35, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0050', 92.48, 80, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0055', 43.48, 86, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0068', 94.22, 67, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0022', 65.71, 23, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0032', 71.17, 57, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0019', 79.31, 27, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0012', 38.14, 28, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0038', 48.71, 78, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0023', 61.81, 25, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0010', 68.58, 52, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0067', 85.45, 49, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0018', 30.63, 44, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0052', 82.39, 70, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0045', 49.7, 13, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0026', 35.24, 81, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0009', 57.84, 46, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0014', 98.98, 84, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0024', 56.05, 56, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0070', 54.48, 44, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0047', 43.37, 33, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0027', 95.71, 82, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0025', 99.68, 32, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0066', 75.11, 93, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0033', 46.18, 42, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0013', 95.72, 79, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0012', 81.68, 33, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0038', 84.51, 13, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0028', 34.1, 81, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0039', 54.83, 46, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0037', 44.95, 89, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0010', 47.89, 63, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0067', 34.93, 25, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0020', 71.77, 89, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0052', 85.69, 51, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0011', 81.36, 67, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0017', 79.55, 38, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0049', 75.69, 73, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0007', 52.78, 68, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0050', 97.18, 61, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0055', 79.31, 24, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0035', 66.9, 67, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0022', 65.22, 86, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0062', 87.64, 86, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0013', 84.75, 39, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0058', 90.55, 55, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0021', 84.23, 69, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0012', 67.71, 48, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0008', 62.16, 64, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0003', 66.24, 58, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0051', 50.89, 55, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0028', 39.49, 66, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0038', 88.1, 41, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0020', 96.54, 46, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0034', 56.82, 84, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0011', 61.53, 96, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0044', 54.42, 77, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0005', 73.41, 80, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0030', 31.95, 10, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0048', 35.02, 19, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0049', 59.79, 70, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0007', 86.37, 96, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0043', 77.02, 31, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0033', 76.83, 39, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0032', 44.71, 44, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0040', 73.46, 44, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0019', 72.43, 82, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0023', 68.31, 39, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0039', 54.59, 27, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0065', 60.7, 17, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0067', 78.78, 90, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0001', 78.05, 46, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0052', 99.56, 70, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0045', 73.11, 58, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0009', 74.75, 19, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0011', 66.92, 42, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0044', 70.11, 33, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0069', 44.95, 29, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0030', 82.3, 32, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0070', 75.61, 75, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0046', 67.53, 85, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0050', 81.61, 61, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0043', 91.33, 70, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0033', 54.78, 18, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0062', 63.25, 52, now());
INSERT INTO public.inventory (store_id, sku, price, quantity, updated_at)
VALUES ('0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0063', 34.86, 65, now());

-- Insert mock orders

INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('0c5017bb-45de-4d0e-8522-c5120f951210', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'completed', 277.04, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('86ec559c-9be3-4757-9f8b-9f90044df2fb', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'completed', 232.02, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('b7a28f84-9b7f-4f11-b575-36844f958d6f', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'completed', 288.46, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('cb8f854f-c1f5-483c-8d83-c06515746bc2', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'completed', 184.94, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('3da4011d-9385-4f84-8a95-a809d2cec3d6', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'completed', 152.84, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('01e454ad-a0fd-4bca-a258-a8e9a7b4d8f9', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'completed', 228.1, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('3a2dd73d-316b-4a04-b7d3-5325465816aa', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'e6415440-72e3-410c-a551-1cc4cb5b9a11', 'completed', 229.26, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('0f4daeed-d633-4946-a03c-800a6827d585', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'completed', 299.7, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('bdecd253-c0cf-4353-90f2-32737e58300c', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'completed', 397.25, now() + INTERVAL '1 day', now());
INSERT INTO public.orders (id, user_id, store_id, status, total_amount, pickup_time, created_at)
VALUES ('4c57a756-c19f-4b80-91a1-eff9bda8adc8', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'completed', 182.49, now() + INTERVAL '1 day', now());

-- Insert mock order items

INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('0c5017bb-45de-4d0e-8522-c5120f951210', 'SKU0062', 2, 88.79);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('0c5017bb-45de-4d0e-8522-c5120f951210', 'SKU0010', 1, 99.46);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('86ec559c-9be3-4757-9f8b-9f90044df2fb', 'SKU0043', 1, 78.42);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('86ec559c-9be3-4757-9f8b-9f90044df2fb', 'SKU0052', 2, 76.8);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('b7a28f84-9b7f-4f11-b575-36844f958d6f', 'SKU0035', 2, 92.4);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('b7a28f84-9b7f-4f11-b575-36844f958d6f', 'SKU0052', 2, 51.83);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('cb8f854f-c1f5-483c-8d83-c06515746bc2', 'SKU0050', 3, 49.25);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('cb8f854f-c1f5-483c-8d83-c06515746bc2', 'SKU0055', 1, 37.19);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('3da4011d-9385-4f84-8a95-a809d2cec3d6', 'SKU0035', 2, 58.32);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('3da4011d-9385-4f84-8a95-a809d2cec3d6', 'SKU0013', 1, 36.2);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('01e454ad-a0fd-4bca-a258-a8e9a7b4d8f9', 'SKU0049', 2, 60.06);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('01e454ad-a0fd-4bca-a258-a8e9a7b4d8f9', 'SKU0039', 2, 53.99);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('3a2dd73d-316b-4a04-b7d3-5325465816aa', 'SKU0028', 3, 40.74);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('3a2dd73d-316b-4a04-b7d3-5325465816aa', 'SKU0049', 2, 53.52);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('0f4daeed-d633-4946-a03c-800a6827d585', 'SKU0019', 3, 65.24);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('0f4daeed-d633-4946-a03c-800a6827d585', 'SKU0047', 3, 34.66);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('bdecd253-c0cf-4353-90f2-32737e58300c', 'SKU0039', 3, 96.19);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('bdecd253-c0cf-4353-90f2-32737e58300c', 'SKU0062', 2, 54.34);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('4c57a756-c19f-4b80-91a1-eff9bda8adc8', 'SKU0067', 2, 56.12);
INSERT INTO public.order_items (order_id, sku, quantity, unit_price)
VALUES ('4c57a756-c19f-4b80-91a1-eff9bda8adc8', 'SKU0070', 1, 70.25);

-- Insert mock reviews

INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('08cfc70a-ccc6-4735-8948-7cdd4ffadeeb', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0006', 3, 'Great experience with SKU0006!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('08b9809f-3ea4-4774-a40d-749377eaf827', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0066', 5, 'Great experience with SKU0066!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('868f1351-dc96-4798-96e9-b7e433f88bc4', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0055', 3, 'Great experience with SKU0055!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('ee4f6e8b-e587-4de2-9818-cc225be5c65d', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0035', 5, 'Great experience with SKU0035!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('ac65f6d0-b5f6-4e75-92de-f2df87aab162', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0059', 3, 'Great experience with SKU0059!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('ad201a1f-aa67-4451-a710-c5bd5c0cc58b', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SKU0070', 5, 'Great experience with SKU0070!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('f900ef0c-223d-41b4-a25e-f55dcf54401c', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0019', 3, 'Great experience with SKU0019!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('37d860d4-c809-4f47-a250-24c997ae5d89', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0064', 3, 'Great experience with SKU0064!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('04798978-3a8b-499c-8724-32700c16f4de', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0036', 4, 'Great experience with SKU0036!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('8a5ff618-f909-428d-9602-7066f786324e', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'cf57a2c6-ad12-4051-87e0-27ca80fbf426', 'SKU0010', 5, 'Great experience with SKU0010!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('96b49f7a-1a07-4aaa-aacf-38186cff4097', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0001', 5, 'Great experience with SKU0001!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('a9bc2f7b-ee5d-45ce-becc-6bfc75806994', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0020', 5, 'Great experience with SKU0020!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('11b7f181-f429-4bb6-9e16-e6bda1289618', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '4253cb71-dcf8-44d0-af53-67fba239d352', 'SKU0069', 5, 'Great experience with SKU0069!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('c0835704-abde-42a4-9070-7ef7d3cf8465', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', 'bc878dad-d606-4574-a060-a906f5d19f93', 'SKU0063', 3, 'Great experience with SKU0063!', now());
INSERT INTO public.reviews (id, user_id, store_id, sku, rating, comment, created_at)
VALUES ('7dfb8b9b-56dc-456a-a6d8-abfd45bade25', '52487cd8-7f9d-4536-aef1-7a1d8c13a26a', '0c695f8b-f359-4c8d-bf73-d4a90455ef32', 'SKU0040', 4, 'Great experience with SKU0040!', now());

-- Insert mock coupons

INSERT INTO public.coupons (id, store_id, code, discount_type, discount_value, min_order_amount, max_uses, used_count, expires_at, is_active, created_at, updated_at)
VALUES ('7d48d3f4-dbd2-4f26-bbec-5967d8a2560c', 'bc878dad-d606-4574-a060-a906f5d19f93', 'SALE403', 'fixed', 10, 30.00, 100, 0, now() + INTERVAL '30 days', true, now(), now());
INSERT INTO public.coupons (id, store_id, code, discount_type, discount_value, min_order_amount, max_uses, used_count, expires_at, is_active, created_at, updated_at)
VALUES ('90c8e5bd-6c0d-406c-bb33-20abe02ea386', '4253cb71-dcf8-44d0-af53-67fba239d352', 'SALE887', 'percentage', 15, 30.00, 100, 0, now() + INTERVAL '30 days', true, now(), now());
INSERT INTO public.coupons (id, store_id, code, discount_type, discount_value, min_order_amount, max_uses, used_count, expires_at, is_active, created_at, updated_at)
VALUES ('9fbb405a-4fe9-43fe-a1a7-ab1ef82b0c89', 'e6415440-72e3-410c-a551-1cc4cb5b9a11', 'SALE617', 'fixed', 10, 30.00, 100, 0, now() + INTERVAL '30 days', true, now(), now());