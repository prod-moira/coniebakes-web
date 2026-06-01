import { Product, SEED_PRODUCTS } from './seed-products';

const SEED_BY_ID = Object.fromEntries(SEED_PRODUCTS.map((product) => [product.id, product]));

export function resolveProductImages(product: Pick<Product, 'id' | 'images'> | null | undefined): string[] {
  if (!product) return ['/assets/hero.svg'];
  if (product.images?.length > 0) return product.images;
  const seed = SEED_BY_ID[product.id];
  return seed?.images ?? ['/assets/hero.svg'];
}

export function normalizeProduct(raw: Partial<Product> & { id: string }): Product | null {
  const seed = SEED_BY_ID[raw.id];
  if (!seed) return null;

  // handle legacy single `image` field from old Firestore docs
  const rawImages = (raw as any).image && !raw.images
    ? [(raw as any).image]
    : raw.images;

  return {
    ...seed,
    ...raw,
    id: raw.id,
    name: raw.name?.trim() || seed.name,
    category: raw.category || seed.category,
    description: raw.description?.trim() || seed.description,
    storage: raw.storage?.trim() || seed.storage,
    shelfLife: raw.shelfLife?.trim() || seed.shelfLife,
    available: raw.available ?? seed.available,
    images: resolveProductImages({ id: raw.id, images: rawImages ?? [] }),
    variants: Array.isArray(raw.variants) && raw.variants.length > 0 ? raw.variants : seed.variants,
  };
}

export function normalizeProducts(rawProducts: Array<Partial<Product> & { id: string }>): Product[] {
  return SEED_PRODUCTS.map((seed) => {
    const existing = rawProducts.find((product) => product.id === seed.id);
    return normalizeProduct(existing ? { ...existing, id: seed.id } : seed)!;
  });
}

export function isStaleProductCache(products: Product[]): boolean {
  if (products.length !== SEED_PRODUCTS.length) return true;
  return products.some((product) => !product.images?.length || !product.description || !product.variants?.length);
}
