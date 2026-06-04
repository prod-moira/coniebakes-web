export interface ProductVariant {
  label: string;
  price: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  variants: ProductVariant[];
  description: string;
  storage: string;
  shelfLife: string;
  available: boolean;
  images: string[];
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'burnt-basque',
    name: 'Burnt Basque',
    category: 'cakes',
    variants: [
      { label: 'Small (6 inches) - Plain', price: 680, unit: 'cake' },
      { label: 'Small (6 inches) - Strawberry Topping', price: 750, unit: 'cake' },
      { label: 'Small (6 inches) - Blueberry Topping', price: 780, unit: 'cake' },
      { label: 'Small (6 inches) - Biscoff Topping', price: 790, unit: 'cake' },
      { label: 'Large (9 inches) - Plain', price: 1350, unit: 'cake' },
      { label: 'Large (9 inches) - Strawberry Topping', price: 1480, unit: 'cake' },
      { label: 'Large (9 inches) - Blueberry Topping', price: 1560, unit: 'cake' },
      { label: 'Large (9 inches) - Biscoff Topping', price: 1580, unit: 'cake' },
    ],
    description: 'Classic burnt basque with a perfectly caramelized top and creamy center.',
    storage: 'Refrigerated/chilled',
    shelfLife: '4-5 days',
    available: true,
    images: ['/assets/burnt-basque/burnt-basque1.jpg', '/assets/burnt-basque/burnt-basque2.jpg', '/assets/burnt-basque/burnt-basque3.jpg', '/assets/burnt-basque/burnt-basque4.jpg'],
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate cake',
    category: 'cakes',
    variants: [
      { label: 'Small (8x4 inches)', price: 350, unit: 'cake' },
      { label: 'Regular (8x8 inches)', price: 680, unit: 'cake' },
    ],
    description:
      'Layered with a rich, velvety Belgian chocolate ganache, every slice is a perfect harmony of deep, dark chocolate and a luxuriously smooth texture, creating an unforgettable experience.',
    storage: 'Refrigerated',
    shelfLife: '4-5 days',
    available: true,
    images: ['/assets/chocolate-cake/chocolate-cake1.jpg', '/assets/chocolate-cake/chocolate-cake2.jpg', '/assets/chocolate-cake/chocolate-cake3.jpg'],
  },
];
