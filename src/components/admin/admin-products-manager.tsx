"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderPlus,
  ImageUp,
  PackagePlus,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { parseList, slugify } from "@/lib/admin-utils";
import { formatCurrency } from "@/lib/utils";

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
};

type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  categorySlug: string;
  featured: boolean;
  tags: string;
  imageUrls: string;
};

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

const emptyProductForm: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categorySlug: "",
  featured: false,
  tags: "",
  imageUrls: "",
};

const emptyCategoryForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const adminFieldClass =
  "admin-field mt-2 w-full rounded-2xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-3 text-[var(--foreground)] caret-[var(--brand)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--admin-input-focus)]";

const adminFieldStyle = {
  boxShadow: "var(--admin-input-shadow)",
} as const;

function formatProductForm(product: Product): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: String(product.price),
    stock: String(product.stock),
    categorySlug: product.category,
    featured: product.featured,
    tags: product.tags.join(", "),
    imageUrls: product.images.join(", "),
  };
}

export function AdminProductsManager({
  initialProducts,
  initialCategories,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [productForm, setProductForm] =
    useState<ProductFormState>(emptyProductForm);
  const [categoryForm, setCategoryForm] =
    useState<CategoryFormState>(emptyCategoryForm);
  const [productSaving, setProductSaving] = useState(false);
  const [categorySaving, setCategorySaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock <= 10),
    [products],
  );
  const productImageList = useMemo(
    () => parseList(productForm.imageUrls),
    [productForm.imageUrls],
  );

  function refreshPage() {
    startTransition(() => {
      router.refresh();
    });
  }

  function resetAlerts() {
    setMessage("");
    setError("");
  }

  async function fetchProducts() {
    const response = await fetch("/api/products");
    const data = (await response.json()) as { items: Product[] };
    setProducts(data.items);
  }

  async function fetchCategories() {
    const response = await fetch("/api/categories");
    const data = (await response.json()) as { items: Category[] };
    setCategories(data.items);
  }

  async function handleProductSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetAlerts();
    setProductSaving(true);

    const payload = {
      name: productForm.name,
      slug: productForm.slug || slugify(productForm.name),
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      categorySlug: productForm.categorySlug,
      featured: productForm.featured,
      tags: parseList(productForm.tags),
      imageUrls: productImageList,
    };

    try {
      const response = await fetch(
        productForm.id
          ? `/api/products/${productForm.id}`
          : "/api/products",
        {
          method: productForm.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save product.");
      }

      setMessage(
        productForm.id
          ? "Product updated successfully."
          : "Product created successfully.",
      );
      setProductForm(emptyProductForm);
      await fetchProducts();
      refreshPage();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save product.",
      );
    } finally {
      setProductSaving(false);
    }
  }

  async function handleCategorySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetAlerts();
    setCategorySaving(true);

    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug || slugify(categoryForm.name),
      description: categoryForm.description,
      image: categoryForm.image,
    };

    try {
      const response = await fetch(
        categoryForm.id
          ? `/api/categories/${categoryForm.id}`
          : "/api/categories",
        {
          method: categoryForm.id ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save category.");
      }

      setMessage(
        categoryForm.id
          ? "Category updated successfully."
          : "Category created successfully.",
      );
      setCategoryForm(emptyCategoryForm);
      await fetchCategories();
      await fetchProducts();
      refreshPage();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save category.",
      );
    } finally {
      setCategorySaving(false);
    }
  }

  async function uploadProductImage(file: File) {
    resetAlerts();
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to upload image.");
      }

      setProductForm((current) => ({
        ...current,
        imageUrls: current.imageUrls
          ? `${current.imageUrls}, ${data.url ?? ""}`
          : (data.url ?? ""),
      }));
      setMessage("Image uploaded successfully.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function deleteProduct(id: string) {
    resetAlerts();
    const confirmed = window.confirm(
      "Delete this product? This also removes related order-item references.",
    );
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Unable to delete product.");
      return;
    }

    setMessage("Product deleted successfully.");
    await fetchProducts();
    refreshPage();
  }

  function setProductImages(images: string[]) {
    setProductForm((current) => ({
      ...current,
      imageUrls: images.join(", "),
    }));
  }

  function removeProductImage(imageUrl: string) {
    setProductImages(productImageList.filter((url) => url !== imageUrl));
  }

  function makePrimaryImage(imageUrl: string) {
    setProductImages([
      imageUrl,
      ...productImageList.filter((url) => url !== imageUrl),
    ]);
  }

  async function deleteCategory(id: string) {
    resetAlerts();
    const confirmed = window.confirm(
      "Delete this category? Products must be moved or removed first.",
    );
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Unable to delete category.");
      return;
    }

    setMessage("Category deleted successfully.");
    await fetchCategories();
    await fetchProducts();
    refreshPage();
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="glass-card rounded-[1.75rem] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Total products
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">{products.length}</p>
        </article>
        <article className="glass-card rounded-[1.75rem] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Categories
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">{categories.length}</p>
        </article>
        <article className="glass-card rounded-[1.75rem] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Low stock
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">
            {lowStockProducts.length}
          </p>
        </article>
        <article className="glass-card rounded-[1.75rem] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Featured
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">
            {products.filter((product) => product.featured).length}
          </p>
        </article>
      </div>

      {message ? (
        <p className="rounded-[1.5rem] bg-[rgba(31,107,87,0.12)] px-5 py-4 text-sm text-[var(--accent)]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-2xl font-semibold">
                Product management
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Create new products, keep stock current, and highlight featured
                products on the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setProductForm(emptyProductForm)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold"
            >
              <PackagePlus size={16} />
              New
            </button>
          </div>

          <form onSubmit={handleProductSubmit} className="mt-8 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Product name</span>
                <input
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      name: event.target.value,
                      slug:
                        current.slug.length === 0
                          ? slugify(event.target.value)
                          : current.slug,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Slug</span>
                <input
                  value={productForm.slug}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      slug: slugify(event.target.value),
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Description</span>
              <textarea
                value={productForm.description}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={4}
                required
                className={adminFieldClass}
                style={adminFieldStyle}
              />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium">Price (KES)</span>
                <input
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Stock</span>
                <input
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      stock: event.target.value,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Category</span>
                <select
                  value={productForm.categorySlug}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      categorySlug: event.target.value,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium">Image URLs</span>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">
                  <ImageUp size={14} />
                  {uploadingImage ? "Uploading..." : "Upload with Cloudinary"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void uploadProductImage(file);
                      }
                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
              <textarea
                value={productForm.imageUrls}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    imageUrls: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Paste one or more image URLs separated by commas"
                required
                className={adminFieldClass}
                style={adminFieldStyle}
              />
              <p className="mt-2 text-xs text-[var(--muted)]">
                Add multiple product images. The first image becomes the main
                storefront thumbnail and detail gallery cover.
              </p>
            </label>

            {productImageList.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {productImageList.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--card-strong)] p-3"
                  >
                    <div
                      className="h-32 rounded-[1rem] bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]">
                        {index === 0 ? "Primary image" : `Image ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProductImage(url)}
                        className="text-xs font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="mt-3 truncate text-xs text-[var(--muted)]">
                      {url}
                    </p>
                    {index !== 0 ? (
                      <button
                        type="button"
                        onClick={() => makePrimaryImage(url)}
                        className="mt-3 rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold"
                      >
                        Set as cover
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
              <label className="block">
                <span className="text-sm font-medium">Tags</span>
                <input
                  value={productForm.tags}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="Popular, New, Travel"
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="flex items-end gap-3 rounded-[1.5rem] border border-[var(--line)] px-4 py-4">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                />
                <span className="text-sm font-medium">Feature on storefront</span>
              </label>
              <button
                type="submit"
                disabled={productSaving}
                className="w-full rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
              >
                {productSaving
                  ? "Saving..."
                  : productForm.id
                    ? "Update product"
                    : "Create product"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-8">
          <div className="glass-card rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-2xl font-semibold">
                  Category management
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Keep collections organized for filtering and storefront
                  storytelling.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryForm(emptyCategoryForm)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold"
              >
                <FolderPlus size={16} />
                New
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="mt-8 grid gap-5">
              <label className="block">
                <span className="text-sm font-medium">Category name</span>
                <input
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      name: event.target.value,
                      slug:
                        current.slug.length === 0
                          ? slugify(event.target.value)
                          : current.slug,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Slug</span>
                <input
                  value={categoryForm.slug}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      slug: slugify(event.target.value),
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  value={categoryForm.description}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Cover image URL</span>
                <input
                  value={categoryForm.image}
                  onChange={(event) =>
                    setCategoryForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  required
                  className={adminFieldClass}
                  style={adminFieldStyle}
                />
              </label>
              <button
                type="submit"
                disabled={categorySaving}
                className="rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {categorySaving
                  ? "Saving..."
                  : categoryForm.id
                    ? "Update category"
                    : "Create category"}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-2xl font-semibold">Low stock watch</p>
              <button
                type="button"
                onClick={refreshPage}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[1.5rem] border border-[var(--line)] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-[var(--muted)]">
                          {product.category}
                        </p>
                      </div>
                      <p className="font-semibold">{product.stock} left</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  All products healthy.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-2xl font-semibold">Inventory table</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Edit or remove products directly from the management list.
              </p>
            </div>
          </div>

          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[var(--line)]">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{product.name}</p>
                      <p className="mt-1 text-[var(--muted)]">{product.slug}</p>
                    </td>
                    <td className="px-4 py-4 capitalize">{product.category}</td>
                    <td className="px-4 py-4">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-4">{product.stock}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setProductForm(formatProductForm(product))}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-semibold"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteProduct(product.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 font-semibold text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 lg:hidden">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-[1.5rem] border border-[var(--line)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {product.category} • {product.slug}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Stock: {product.stock}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setProductForm(formatProductForm(product))}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-semibold"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteProduct(product.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-sm font-semibold text-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6">
          <p className="font-mono text-2xl font-semibold">Categories</p>
          <div className="mt-6 space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-[1.5rem] border border-[var(--line)] p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {category.slug}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryForm({
                          id: category.id,
                          name: category.name,
                          slug: category.slug,
                          description: category.description,
                          image: category.image,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 font-semibold"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteCategory(category.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 font-semibold text-red-700"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
