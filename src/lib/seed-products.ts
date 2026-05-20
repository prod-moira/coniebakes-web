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
  image: string;
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'burnt-basque',
    name: 'Burnt Basque Cheesecake',
    category: 'cakes',
    variants: [
      { label: 'Regular 6in', price: 690, unit: 'cake' },
      { label: 'Large 6in', price: 1350, unit: 'cake' },
    ],
    description: 'Classic caramelized basque cheesecake with a rich center and toasted top.',
    storage: 'Refrigerated/chilled',
    shelfLife: '4-5 days',
    available: true,
    image: '/assets/burnt-basque.svg',
  },
  {
    id: 'burnt-basque-blueberries',
    name: 'Burnt Basque Cheesecake with Blueberries',
    category: 'cakes',
    variants: [
      { label: 'Regular 6in', price: 790, unit: 'cake' },
      { label: 'Large 6in', price: 1500, unit: 'cake' },
    ],
    description: 'Our signature burnt basque with fresh blueberry notes.',
    storage: 'Refrigerated/chilled',
    shelfLife: '3-4 days',
    available: true,
    image: '/assets/burnt-basque-blueberries.svg',
  },
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    category: 'cakes',
    variants: [{ label: 'Regular 8x8', price: 650, unit: 'cake' }],
    description: 'Soft and moist chocolate cake finished with deep cocoa flavor.',
    storage: 'Refrigerated',
    shelfLife: '4-5 days',
    available: true,
    image: '/assets/chocolate-cake.svg',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    category: 'cookies',
    variants: [
      { label: 'Regular 25g - 5pcs', price: 130, unit: 'box' },
      { label: 'Regular 25g - 10pcs', price: 250, unit: 'box' },
      { label: 'Regular 25g - 20pcs', price: 480, unit: 'box' },
      { label: 'Large 50g - 5pcs', price: 270, unit: 'box' },
      { label: 'Large 50g - 10pcs', price: 500, unit: 'box' },
      { label: 'Large 50g - 20pcs', price: 960, unit: 'box' },
    ],
    description: 'Chewy classic cookies in regular or large sizes for sharing.',
    storage: 'Room temp 1-2 weeks, refrigerated 1 month',
    shelfLife: '1-2 weeks',
    available: true,
    image: '/assets/cookies.svg',
  },
  {
    id: 'oatmeal-cookies',
    name: 'Oatmeal Cookies',
    category: 'cookies',
    variants: [
      { label: 'Regular 25g - 5pcs', price: 160, unit: 'box' },
      { label: 'Regular 25g - 10pcs', price: 300, unit: 'box' },
      { label: 'Regular 25g - 20pcs', price: 580, unit: 'box' },
      { label: 'Large 50g - 5pcs', price: 320, unit: 'box' },
      { label: 'Large 50g - 10pcs', price: 600, unit: 'box' },
      { label: 'Large 50g - 20pcs', price: 1160, unit: 'box' },
    ],
    description: 'Hearty oatmeal cookies with warm spice and buttery chew.',
    storage: 'Room temp 1-2 weeks, refrigerated 1 month',
    shelfLife: '1-2 weeks',
    available: true,
    image: '/assets/oatmeal-cookies.svg',
  },
];
