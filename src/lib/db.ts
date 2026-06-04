import { db, isMockFirebase } from './firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { normalizeProduct } from './product-utils';
import { Product, SEED_PRODUCTS } from './seed-products';

export type { Product, ProductVariant } from './seed-products';
export { SEED_PRODUCTS };

export interface OrderItem {
  productId: string;
  productName: string;
  variantLabel: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface Order {
  customerName: string;
  phoneNumber: string;
  facebookLink: string;
  email: string | null;
  address: string;
  payment: string;
  deliveryDate: string;
  deliveryTime: string | null;
  items: OrderItem[];
  total: number;
  specialInstructions: string | null;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Inquiry {
  name: string;
  email: string;
  phone: string | null;
  inquiryType: 'Concern' | 'Special Order Request' | 'Feedback' | 'Other';
  message: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  image: string;
  isAddon: true;
}

const MOCK_ADDONS: Addon[] = [
  { id: 'topper-happy-birthday', name: 'Happy Birthday Topper', price: 50, image: '/assets/topper-hb.png', isAddon: true },
  { id: 'candle-blue', name: 'Blue Candle', price: 15, image: '/assets/candle-blue.png', isAddon: true },
  { id: 'candle-pink', name: 'Pink Candle', price: 15, image: '/assets/candle-pink.png', isAddon: true },
  { id: 'candle-white', name: 'White Candle', price: 15, image: '/assets/candle-white.png', isAddon: true },
];

// Only used when Firestore is completely empty (first-time setup)
async function seedFirestore() {
  if (!db) return;
  await Promise.all(SEED_PRODUCTS.map((product) => setDoc(doc(db, 'products', product.id), product, { merge: true })));
}

function getMockProducts(): Product[] {
  if (typeof window === 'undefined') return SEED_PRODUCTS;
  const stored = localStorage.getItem('cb_products');
  if (!stored) {
    localStorage.setItem('cb_products', JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  try {
    return JSON.parse(stored) as Product[];
  } catch {
    localStorage.setItem('cb_products', JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
}

function getMockData() {
  if (typeof window === 'undefined') {
    return { products: SEED_PRODUCTS, deliveries: {}, orders: [], inquiries: [] };
  }
  const deliveries = JSON.parse(localStorage.getItem('cb_deliveries') ?? '{}') as Record<string, number>;
  const orders = JSON.parse(localStorage.getItem('cb_orders') ?? '[]');
  const inquiries = JSON.parse(localStorage.getItem('cb_inquiries') ?? '[]');
  return { products: getMockProducts(), deliveries, orders, inquiries };
}

function saveMockData(data: { products: Product[]; deliveries: Record<string, number>; orders: unknown[]; inquiries: unknown[] }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cb_products', JSON.stringify(data.products));
  localStorage.setItem('cb_deliveries', JSON.stringify(data.deliveries));
  localStorage.setItem('cb_orders', JSON.stringify(data.orders));
  localStorage.setItem('cb_inquiries', JSON.stringify(data.inquiries));
}

export async function getProducts(): Promise<Product[]> {
  if (isMockFirebase || !db) {
    return getMockProducts().filter((product) => product.available);
  }

  try {
    const snapshot = await getDocs(query(collection(db, 'products'), where('available', '==', true)));

    // First time setup only — seed Firestore if completely empty
    if (snapshot.empty) {
      await seedFirestore();
      return SEED_PRODUCTS.filter((product) => product.available);
    }

    // Firestore is the source of truth — just fetch and return
    const products = snapshot.docs
      .map((productDoc) => normalizeProduct({ id: productDoc.id, ...productDoc.data() } as Product))
      .filter((product): product is Product => Boolean(product))
      .filter((product) => product.available);

    return products;
  } catch (error) {
    console.error('Failed to load products from Firestore. Falling back to seed data.', error);
    return SEED_PRODUCTS.filter((product) => product.available);
  }
}

export async function placeOrder(orderData: Omit<Order, 'status'>): Promise<{ success: boolean; error?: string; orderId?: string }> {
  if (isMockFirebase || !db) {
    const data = getMockData();
    data.orders.push({ ...orderData, status: 'pending', createdAt: Date.now(), id: `order-${Date.now()}` });
    saveMockData(data);
    return { success: true, orderId: `mock-${Date.now()}` };
  }
  try {
    const orderRef = doc(collection(db, 'orders'));
    await setDoc(orderRef, { ...orderData, status: 'pending', createdAt: Date.now() });
    return { success: true, orderId: orderRef.id };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Unable to place order.' };
  }
}

export async function placeInquiry(inquiryData: Inquiry): Promise<{ success: boolean; error?: string; inquiryId?: string }> {
  if (isMockFirebase || !db) {
    const data = getMockData();
    const id = `inq-${Date.now()}`;
    data.inquiries.push({ ...inquiryData, id, createdAt: Date.now() });
    saveMockData(data);
    return { success: true, inquiryId: id };
  }
  try {
    const ref = doc(collection(db, 'inquiries'));
    await setDoc(ref, { ...inquiryData, createdAt: Date.now() });
    return { success: true, inquiryId: ref.id };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Unable to send inquiry.' };
  }
}

export async function getAddons(): Promise<Addon[]> {
  if (isMockFirebase || !db) {
    return MOCK_ADDONS;
  }
  try {
    const snapshot = await getDocs(collection(db, 'addons'));
    return snapshot.docs.map((addonDoc) => ({ id: addonDoc.id, ...addonDoc.data() })) as Addon[];
  } catch (error) {
    console.error('Failed to load addons from Firestore. Falling back to mock.', error);
    return MOCK_ADDONS;
  }
}