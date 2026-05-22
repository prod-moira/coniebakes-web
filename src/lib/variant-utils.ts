import { Product, ProductVariant } from './seed-products';

export function isCookieProduct(product: Product): boolean {
  return product.id === 'cookies' || product.id === 'oatmeal-cookies';
}

// Products that use a two-step selection: size -> option (e.g. Burnt Basque toppings)
export function isTwoStepProduct(product: Product): boolean {
  return product.id === 'burnt-basque' || product.id === 'chocolate-cake';
}

export function getTwoStepSizes(variants: ProductVariant[]): string[] {
  const sizes = new Set<string>();
  variants.forEach((v) => {
    const [size] = v.label.split(' - ');
    sizes.add(size);
  });
  return Array.from(sizes);
}

export function getTwoStepOptions(variants: ProductVariant[], size: string): string[] {
  const opts = variants
    .filter((v) => v.label.split(' - ')[0] === size)
    .map((v) => v.label.split(' - ')[1] ?? '')
    .filter(Boolean);
  return Array.from(new Set(opts));
}

export function findTwoStepVariant(variants: ProductVariant[], size: string, option: string): ProductVariant | undefined {
  return variants.find((v) => {
    const parts = v.label.split(' - ');
    const s = parts[0];
    const o = parts[1] ?? '';
    if (option) return s === size && o === option;
    // if no explicit option (single-variant size), match by size
    return s === size;
  });
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
