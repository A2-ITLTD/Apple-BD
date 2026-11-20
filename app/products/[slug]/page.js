import { Suspense } from "react";
import AllProductsClient from "@/components/category/AllProductsClient";
import { siteTitle } from "@/lib/storeMeta";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.applebd.com";

async function getCategories() {
  try {
    const res = await fetch(`${API}/api/products/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const categories = await getCategories();
  const slugs = new Set();
  for (const cat of categories) {
    if (cat.slug && cat.slug !== "__placeholder__") slugs.add(cat.slug);
  }
  return [
    { slug: "__placeholder__" },
    ...Array.from(slugs).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === "__placeholder__") {
    return { title: await siteTitle("Products") };
  }
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const label = category?.name || "Products";
  return {
    title: await siteTitle(label),
    description: `Browse ${label} products with the best prices and fast delivery across Bangladesh.`,
  };
}

export default function CategoryProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-32">
          <svg className="animate-spin w-8 h-8 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      }
    >
      <AllProductsClient />
    </Suspense>
  );
}
