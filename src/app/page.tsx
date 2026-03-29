import { CategoryShowcase } from "@/components/shop/category-showcase";
import { FeatureStrip } from "@/components/shop/feature-strip";
import { HeroSection } from "@/components/shop/hero-section";
import { HomeCatalog } from "@/components/shop/home-catalog";
import { getCategories, getProducts } from "@/lib/store";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <div className="pb-16">
      <HeroSection categories={categories} products={products} />
      <FeatureStrip />
      <CategoryShowcase categories={categories} />
      <HomeCatalog
        categories={categories}
        featuredProducts={featuredProducts}
        products={products}
      />
    </div>
  );
}
