import { CategoryShowcase } from "@/components/shop/category-showcase";
import { EditorialBanner } from "@/components/shop/editorial-banner";
import { HeroSection } from "@/components/shop/hero-section";
import { HomeCatalog } from "@/components/shop/home-catalog";
import { SocialProof } from "@/components/shop/social-proof";
import { getCategories, getProducts } from "@/lib/store";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts();
  const featuredProducts = products.filter((product) => product.featured);
  const spotlight = featuredProducts[0] ?? products[0];

  return (
    <div className="pb-16">
      <HeroSection categories={categories} products={products} />
      <CategoryShowcase categories={categories} />
      {spotlight ? <EditorialBanner spotlight={spotlight} /> : null}
      <HomeCatalog
        categories={categories}
        featuredProducts={featuredProducts}
        products={products}
      />
      <SocialProof />
    </div>
  );
}
