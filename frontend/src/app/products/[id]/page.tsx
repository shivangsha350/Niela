import { mockProducts } from "@/data/products";
import ProductDetailsClient from "@/components/ProductDetailsClient";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product._id,
  }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  let resolvedParams: any;
  try {
    resolvedParams = await params;
  } catch (err: any) {
    resolvedParams = params;
  }

  const id = resolvedParams?.id;
  const product = mockProducts.find((p) => p._id === id);

  return <ProductDetailsClient productId={id} initialProduct={product} />;
}

