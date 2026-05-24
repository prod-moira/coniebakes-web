import { db, isMockFirebase } from './firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { isStaleProductCache, normalizeProduct, normalizeProducts } from './product-utils';
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

async function syncSeedProductsToFirestore() {
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
    const parsed = JSON.parse(stored) as Array<Partial<Product> & { id: string }>;
    if (isStaleProductCache(parsed as Product[])) {
      const normalized = normalizeProducts(parsed);
      localStorage.setItem('cb_products', JSON.stringify(normalized));
      return normalized.filter((product) => product.available);
    }
    return normalizeProducts(parsed).filter((product) => product.available);
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

    if (snapshot.empty) {
      await syncSeedProductsToFirestore();
      return SEED_PRODUCTS.filter((product) => product.available);
    }

    const products = snapshot.docs
      .map((productDoc) => normalizeProduct({ id: productDoc.id, ...productDoc.data() } as Product))
      .filter((product): product is Product => Boolean(product))
      .filter((product) => product.available);

    const patchJobs = snapshot.docs
      .map((productDoc) => {
        const data = productDoc.data();
        if (data.image && data.description && Array.isArray(data.variants) && data.variants.length > 0) return null;
        const normalized = normalizeProduct({ id: productDoc.id, ...data } as Product);
        return normalized ? setDoc(doc(db, 'products', productDoc.id), normalized, { merge: true }) : null;
      })
      .filter(Boolean) as Promise<void>[];

    if (patchJobs.length > 0) await Promise.all(patchJobs);

    const existingIds = new Set(products.map((product) => product.id));
    const missingSeeds = SEED_PRODUCTS.filter((seed) => !existingIds.has(seed.id) && seed.available);
    if (missingSeeds.length > 0) {
      await Promise.all(missingSeeds.map((product) => setDoc(doc(db, 'products', product.id), product, { merge: true })));
      return [...products, ...missingSeeds];
    }

    return products.length > 0 ? products : SEED_PRODUCTS.filter((product) => product.available);
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
