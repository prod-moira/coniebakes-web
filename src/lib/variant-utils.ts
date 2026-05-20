import { Product, ProductVariant } from './seed-products';

export function isCookieProduct(product: Product): boolean {
  return product.id === 'cookies' || product.id === 'oatmeal-cookies';
}

export function getCookieSizes(variants: ProductVariant[]): string[] {
  const sizes: string[] = [];
  if (variants.some((variant) => variant.label.startsWith('Regular'))) sizes.push('Regular');
  if (variants.some((variant) => variant.label.startsWith('Large'))) sizes.push('Large');
  return sizes;
}

export function getCookiePacks(variants: ProductVariant[], size: string): string[] {
  return variants
    .filter((variant) => variant.label.startsWith(size))
    .map((variant) => variant.label.split(' - ')[1] ?? '')
    .filter(Boolean);
}

export function findCookieVariant(variants: ProductVariant[], size: string, pack: string): ProductVariant | undefined {
  return variants.find((variant) => variant.label.startsWith(size) && variant.label.includes(pack));
}
