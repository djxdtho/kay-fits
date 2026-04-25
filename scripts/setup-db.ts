import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mbvgqrugfadmocvpkaez.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idmdxcnVnZmFkbW9jdnBrYWV6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzEzMTMxMiwiZXhwIjoyMDkyNzA3MzEyfQ.VadaNMfm_8EDNwSQXhNysW4xghHiLsbYj5BC_3OwKCk'

const supabase = createClient(supabaseUrl, serviceKey)

async function setupDatabase() {
  console.log('Setting up database...')

  // Create profiles table
  await supabase.from('profiles').insert({
    id: 'test-user',
    email: 'test@example.com',
    full_name: 'Test User',
  }).catch(() => {})

  // Create products
  const products = [
    { id: 1, name: 'Classic Black Hoodie', description: 'Premium cotton hoodie', price: 15000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_01.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
    { id: 2, name: 'Urban Track Suit', description: 'Comfortable track wear', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_02.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
    { id: 3, name: 'Classic Polo Shirt', description: 'Cotton polo', price: 8000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_03.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY'], in_stock: true },
    { id: 4, name: 'Cargo Pants', description: 'Multi-pocket cargo', price: 10000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_04.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
    { id: 5, name: 'Sports Jersey', description: 'Breathable jersey', price: 6000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_05.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK'], in_stock: true },
    { id: 6, name: 'Oversized Hoodie', description: 'Oversized fit', price: 18000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_06.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
    { id: 7, name: 'Track Pants', description: 'Slim fit track', price: 9000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_07.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK'], in_stock: true },
    { id: 8, name: 'Denim Cargo', description: 'Denim cargo pants', price: 14000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_08.jpg', sizes: ['S','M','L','XL'], colors: ['BLUE','BLACK'], in_stock: true },
    { id: 9, name: 'Premium Polo', description: 'Premium cotton polo', price: 9500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_09.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
    { id: 10, name: 'Tech Cargo', description: 'Tech cargo pants', price: 11000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_10.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
    { id: 11, name: 'Retro Jersey', description: 'Retro style jersey', price: 7500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_11.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED'], in_stock: true },
    { id: 12, name: 'Full Track Suit', description: 'Full track wear set', price: 18000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_12.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
    { id: 13, name: 'Zipper Hoodie', description: 'Zip-up hoodie', price: 16500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_13.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY','NAVY'], in_stock: true },
    { id: 14, name: 'Jogger Cargo', description: 'Jogger style cargo', price: 10500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_14.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
    { id: 15, name: 'Slim Fit Polo', description: 'Slim fit cotton polo', price: 7000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_15.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','NAVY'], in_stock: true },
    { id: 16, name: 'Training Jersey', description: 'Training jersey', price: 5500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_16.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
    { id: 17, name: 'Wool Blend Hoodie', description: 'Wool blend hoodie', price: 20000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_17.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','CREAM'], in_stock: true },
    { id: 18, name: 'Sweat Track Pants', description: 'Heavyweight track', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_18.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
    { id: 19, name: 'Utility Cargo', description: 'Utility cargo pants', price: 13000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_19.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
    { id: 20, name: 'Vintage Polo', description: 'Vintage style polo', price: 8500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_20.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
    { id: 21, name: 'Dry Fit Jersey', description: 'Dry fit sports jersey', price: 6500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_21.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','BLUE'], in_stock: true },
    { id: 22, name: 'Fleece Hoodie', description: 'Heavyweight fleece', price: 17500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_22.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY','GREY'], in_stock: true },
    { id: 23, name: 'Cargo Shorts', description: 'Summer cargo shorts', price: 7500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_23.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
    { id: 24, name: 'Performance Jersey', description: 'Performance jersey', price: 8000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_24.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
  ]

  // Insert products (will fail if table doesn't exist, that's ok)
  for (const product of products) {
    try {
      await supabase.from('products').insert(product)
    } catch (e) {
      console.log('Products table may not exist yet')
      break
    }
  }

  console.log('Done!')
}

setupDatabase()