import { notFound } from "next/navigation";
import { mockProducts } from "@/data/products";
import ProductDetailsClient from "@/components/ProductDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product._id,
  }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = mockProducts.find((p) => p._id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
