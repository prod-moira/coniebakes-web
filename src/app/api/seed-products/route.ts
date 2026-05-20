import { NextResponse } from 'next/server';
import { db, isMockFirebase } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SEED_PRODUCTS } from '@/lib/seed-products';

export async function POST() {
  if (isMockFirebase || !db) {
    return NextResponse.json({
      success: false,
      message: 'Firebase is not configured. Products are served from local seed data in mock mode.',
    });
  }

  try {
    await Promise.all(SEED_PRODUCTS.map((product) => setDoc(doc(db, 'products', product.id), product, { merge: true })));
    return NextResponse.json({ success: true, count: SEED_PRODUCTS.length });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to seed products.' },
      { status: 500 },
    );
  }
}
