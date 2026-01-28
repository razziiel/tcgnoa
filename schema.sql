
-- CollectorVault Database Schema

-- 1. Roles & Profiles
CREATE TYPE user_role AS ENUM ('Admin', 'User');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'User',
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT, -- Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products
CREATE TYPE item_condition AS ENUM ('Mint', 'NM', 'LP', 'MP', 'Damaged', 'New', 'Used');

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  condition item_condition DEFAULT 'New',
  purchase_price DECIMAL(12, 2) NOT NULL,
  sale_price DECIMAL(12, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  details JSONB DEFAULT '{}'::jsonb, -- Store specific TCG/Toy details
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Transactions
CREATE TYPE transaction_type AS ENUM ('sale', 'purchase');

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  customer_name TEXT,
  total_amount DECIMAL(12, 2) NOT NULL,
  type transaction_type DEFAULT 'sale',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Transaction Items
CREATE TABLE transaction_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL
);

-- Security RLS (Example)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do anything on products" 
ON products FOR ALL 
USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'Admin' );

CREATE POLICY "Everyone can view products" 
ON products FOR SELECT 
USING ( true );
