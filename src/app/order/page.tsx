import { redirect } from 'next/navigation';

export default function LegacyOrderPage() {
  redirect('/checkout');
}
