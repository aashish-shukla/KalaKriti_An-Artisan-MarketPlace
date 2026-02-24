// artisan/app/(main)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { productService, reviewService } from '@/lib/api/services';
import { ProductDetail } from '@/components/products/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const response = await productService.getProduct(slug);
    return response.product;
  } catch (error) {
    return null;
  }
}

async function getReviews(productId: string) {
  try {
    const response = await reviewService.getProductReviews(productId, { page: 1, limit: 5 });
    return response;
  } catch (error) {
    return { data: [], pagination: { page: 1, limit: 5, total: 0, pages: 0 } };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getReviews(product._id);

  return <ProductDetail product={product} initialReviews={reviews} />;
}