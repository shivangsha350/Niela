"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, useShop } from "@/context/ShopContext";
import { apiService } from "@/services/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiRefreshCw } from "react-icons/fi";

export default function AdminProductsCrudPage() {
  const { products, updateProductsList, refreshProducts, logoutUser } = useShop();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [inStock, setInStock] = useState(true); // Toggle stock status
  const [category, setCategory] = useState("pads");
  const [images, setImages] = useState<string[]>([]); // Array of image paths/Base64 strings
  const [rating, setRating] = useState(5.0);
  const [reviewsCount, setReviewsCount] = useState(1);
  const [variants, setVariants] = useState(""); // Comma-separated string
  const [features, setFeatures] = useState(""); // Newline-separated string
  const [variantPrices, setVariantPrices] = useState<{ [key: string]: number }>({});
  const [variantOriginalPrices, setVariantOriginalPrices] = useState<{ [key: string]: number }>({});
  const [variantImages, setVariantImages] = useState<{ [key: string]: string }>({});
  const [showOnHome, setShowOnHome] = useState(false);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(0);
    setOriginalPrice(0);
    setStock(50);
    setInStock(true);
    setCategory("pads");
    setImages(["/images/regular_pads.png"]);
    setRating(5.0);
    setReviewsCount(1);
    setVariants("Regular, Super, Super Plus");
    setFeatures("100% Certified Organic Cotton Top Sheet\nUltra-thin (1mm) design\nHighly breathable sheet\nHypoallergenic & free from toxins");
    setVariantPrices({});
    setVariantOriginalPrices({});
    setVariantImages({});
    setShowOnHome(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setStock(p.stock);
    setInStock(p.stock > 0);
    setCategory(p.category);
    setImages(p.images || []);
    setRating(p.rating || 5.0);
    setReviewsCount(p.reviewsCount || 0);
    setVariants(p.variants ? p.variants.join(", ") : "");
    setFeatures(p.features ? p.features.join("\n") : "");
    setVariantPrices(p.variantPrices || {});
    setVariantOriginalPrices(p.variantOriginalPrices || {});
    setVariantImages(p.variantImages || {});
    setShowOnHome(p.showOnHome !== undefined ? Boolean(p.showOnHome) : false);
    setIsModalOpen(true);
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) return data.url;
      }
    } catch (e) {
      console.warn("Direct upload failed, falling back to WebP compression:", e);
    }

    // Fallback to high-definition WebP compression
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawBase64 = event.target?.result as string;
        compressImage(rawBase64).then(resolve);
      };
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str.startsWith("data:image/")) {
        resolve(base64Str);
        return;
      }
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const TARGET_SIZE = 1024;
        const canvas = document.createElement("canvas");
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Fill pure white background for standard 1:1 e-commerce display
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);

          // Standard 1:1 square contain fit (no cropping, no stretching, perfect crispness)
          const scale = Math.min(TARGET_SIZE / img.width, TARGET_SIZE / img.height);
          const drawWidth = img.width * scale;
          const drawHeight = img.height * scale;
          const dx = (TARGET_SIZE - drawWidth) / 2;
          const dy = (TARGET_SIZE - drawHeight) / 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        }

        // Modern WebP format with 0.92 high quality (or JPEG fallback)
        let dataUrl = canvas.toDataURL("image/webp", 0.92);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const uploadedUrls = await Promise.all(fileList.map((f) => uploadFileToServer(f)));
    setImages((prev) => [...prev, ...uploadedUrls.filter(Boolean)]);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0) return;

    setIsSaving(true);
    const finalStock = inStock ? (stock > 0 ? stock : 50) : 0;
    const imagesArray = images.filter(Boolean);
    const variantsArray = variants.split(",").map(v => v.trim()).filter(Boolean);
    const featuresArray = features.split("\n").map(f => f.trim()).filter(Boolean);

    // Clean up variant prices and images to only keep defined ones matching active variants
    const cleanedPrices: { [key: string]: number } = {};
    const cleanedOriginalPrices: { [key: string]: number } = {};
    const cleanedVariantImages: { [key: string]: string } = {};
    variantsArray.forEach((v) => {
      if (variantPrices[v] && variantPrices[v] > 0) cleanedPrices[v] = variantPrices[v];
      if (variantOriginalPrices[v] && variantOriginalPrices[v] > 0) cleanedOriginalPrices[v] = variantOriginalPrices[v];
      if (variantImages[v]) cleanedVariantImages[v] = variantImages[v];
    });

    if (editingProduct) {
      // Update Action - Target the real MongoDB ObjectId (dbId or _id)
      const targetDbId = editingProduct.dbId || editingProduct._id;
      const targetSlug = editingProduct.slug || targetDbId;

      const payload = {
        name,
        description,
        price,
        originalPrice: originalPrice || undefined,
        stock: finalStock,
        category,
        images: imagesArray.length > 0 ? imagesArray : ["/images/regular_pads.png"],
        rating: rating || 5.0,
        reviewsCount: reviewsCount || 0,
        variants: variantsArray,
        features: featuresArray,
        slug: targetSlug,
        variantPrices: cleanedPrices,
        variantOriginalPrices: cleanedOriginalPrices,
        variantImages: cleanedVariantImages,
        showOnHome: Boolean(showOnHome),
      };

      try {
        const updatedDoc = await apiService.admin.updateProduct(targetDbId, payload);

        const updatedProductObj: Product = {
          ...editingProduct,
          ...payload,
          _id: updatedDoc?._id ? String(updatedDoc._id) : targetDbId,
          dbId: updatedDoc?._id ? String(updatedDoc._id) : targetDbId,
          slug: updatedDoc?.slug || targetSlug,
        };

        const updatedList = products.map((p) =>
          (p.dbId && p.dbId === targetDbId) || p._id === targetDbId || (p.slug && p.slug === targetSlug)
            ? updatedProductObj
            : p
        );

        // Update local store ONLY after backend confirms successful persistence
        updateProductsList(updatedList);
        await refreshProducts();
        showToast("Product & pricing updated successfully in database!", "success");
        setIsModalOpen(false);
      } catch (err: any) {
        console.error("Backend update error:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to update product in database";
        showToast(errMsg, "error");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser();
          router.push("/admin/login");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      // Create Action
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const payload = {
        name,
        description,
        price,
        originalPrice: originalPrice || undefined,
        stock: finalStock,
        category,
        images: imagesArray.length > 0 ? imagesArray : ["/images/regular_pads.png"],
        rating: rating || 5.0,
        reviewsCount: reviewsCount || 0,
        variants: variantsArray,
        features: featuresArray,
        slug: generatedSlug,
        variantPrices: cleanedPrices,
        variantOriginalPrices: cleanedOriginalPrices,
        variantImages: cleanedVariantImages,
        showOnHome: Boolean(showOnHome),
      };

      try {
        const created = await apiService.admin.createProduct(payload);
        if (created && created._id) {
          const newProduct: Product = {
            ...payload,
            _id: String(created._id),
            dbId: String(created._id),
            slug: created.slug || generatedSlug,
          };
          updateProductsList([...products, newProduct]);
          await refreshProducts();
          showToast("New product created and saved to database!", "success");
          setIsModalOpen(false);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: any) {
        console.error("Backend create error:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to create product in database";
        showToast(errMsg, "error");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser();
          router.push("/admin/login");
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async (p: Product) => {
    const targetId = p.dbId || p._id;
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      try {
        await apiService.admin.deleteProduct(targetId);
        const updatedList = products.filter((item) => item._id !== p._id && item.dbId !== targetId && item._id !== targetId);
        updateProductsList(updatedList);
        await refreshProducts();
        showToast("Product deleted successfully!", "success");
      } catch (err: any) {
        console.error("Backend delete error:", err);
        const errMsg = err.response?.data?.message || err.message || "Failed to delete product";
        showToast(errMsg, "error");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logoutUser();
          router.push("/admin/login");
        }
      }
    }
  };

  const handleToggleShowOnHome = async (p: Product) => {
    const newShowOnHome = !p.showOnHome;
    const targetDbId = p.dbId || p._id;

    try {
      await apiService.admin.updateProduct(targetDbId, { showOnHome: newShowOnHome });
      const updatedList = products.map((item) =>
        (item.dbId && item.dbId === targetDbId) || item._id === targetDbId || item._id === p._id
          ? { ...item, showOnHome: newShowOnHome }
          : item
      );
      updateProductsList(updatedList);
      showToast(
        newShowOnHome
          ? `"${p.name}" will now appear on the Home Page! 🏠`
          : `"${p.name}" removed from Home Page.`,
        "success"
      );
    } catch (err: any) {
      console.error("Backend update showOnHome error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to update homepage status";
      showToast(errMsg, "error");
      if (err.response?.status === 401 || err.response?.status === 403) {
        logoutUser();
        router.push("/admin/login");
      }
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold transition-all animate-bounce ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <FiCheck className="w-5 h-5" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">Products Inventory</h1>
          <p className="text-xs sm:text-sm text-brand-slate">Manage your active catalog listings, details, and stock levels.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-pink text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-200 shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white border border-brand-border/60 rounded-3xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-brand-bg border-b border-brand-border/60 text-brand-navy uppercase tracking-wider text-[11px] font-bold">
            <tr>
              <th className="py-4 px-6">Product</th>
              <th className="py-4">Category</th>
              <th className="py-4">Base Price</th>
              <th className="py-4">Stock Status</th>
              <th className="py-4 text-center">Home Page</th>
              <th className="py-4">Rating</th>
              <th className="py-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-brand-bg/40 transition">
                <td className="py-3 px-6 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white overflow-hidden border border-brand-border/40 flex-shrink-0 p-0.5 flex items-center justify-center">
                    <img src={p.images[0] || "/images/regular_pads.png"} alt={p.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="font-semibold text-brand-navy max-w-xs truncate">{p.name}</span>
                </td>
                <td className="py-3 uppercase text-[10px] font-bold text-brand-pink tracking-wider">{p.category}</td>
                <td className="py-3 font-bold text-brand-navy">
                  ₹{p.price}{" "}
                  {p.originalPrice && (
                    <span className="text-[10px] text-brand-slate line-through font-normal ml-1">₹{p.originalPrice}</span>
                  )}
                </td>
                <td className="py-3 font-medium">
                  {p.stock > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      In Stock ({p.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleShowOnHome(p)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition shadow-sm ${
                      p.showOnHome
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                    title={
                      p.showOnHome
                        ? "Currently shown on Homepage (Click to hide)"
                        : "Hidden from Homepage (Click to show)"
                    }
                  >
                    {p.showOnHome ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5" />
                        <span>On Home</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-400 font-bold">+</span>
                        <span>Off</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="py-3 text-brand-navy font-semibold">{p.rating || "5.0"} ⭐ ({p.reviewsCount || 0})</td>
                <td className="py-3 text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 hover:bg-brand-bg text-brand-navy hover:text-brand-pink rounded-lg transition"
                      title="Edit Product"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                      title="Delete Product"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Form Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
              <h3 className="font-serif font-bold text-brand-navy text-lg">
                {editingProduct ? "Edit Product Details" : "Create New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX className="w-6 h-6 text-brand-dark-navy hover:text-brand-pink transition" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Niela Starter Kit"
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize product materials, sizing and details..."
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="699"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="799"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy font-semibold flex items-center gap-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  >
                    <option value="pads">Pads</option>
                    <option value="liners">Liners</option>
                    <option value="cups">Cups</option>
                    <option value="kits">Kits</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Stock Availability</label>
                  <select
                    value={inStock ? "true" : "false"}
                    onChange={(e) => {
                      const val = e.target.value === "true";
                      setInStock(val);
                      if (!val) setStock(0);
                    }}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              {inStock && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Quantity in Stock</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="30"
                    min="1"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    placeholder="5.0"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Reviews Count</label>
                  <input
                    type="number"
                    value={reviewsCount}
                    onChange={(e) => setReviewsCount(Number(e.target.value))}
                    placeholder="89"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              {/* Home Page Featured Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-brand-bg/50 border border-brand-border/60 rounded-2xl">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                    Show on Home Page (होम पेज पर दिखाएं)
                  </label>
                  <p className="text-[11px] text-brand-slate">
                    Display this product in the &ldquo;Our Bestsellers&rdquo; section on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnHome(!showOnHome)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showOnHome ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={showOnHome}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      showOnHome ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                  Product Images
                </label>
                
                {/* File Upload Selector */}
                <div className="flex items-center gap-3">
                  <label className="flex-grow flex items-center justify-center border border-dashed border-brand-border hover:border-brand-pink rounded-xl py-3 px-4 bg-brand-bg/50 hover:bg-brand-bg transition cursor-pointer text-xs font-semibold text-brand-navy">
                    <span>📤 Upload Image(s) from System</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="text-xs text-red-500 hover:text-red-700 underline font-semibold transition"
                    >
                      Clear Images
                    </button>
                  )}
                </div>

                {/* Previews & URL Inputs Row */}
                {images.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider block">Image Previews & Paths</span>
                    <div className="flex flex-col gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-brand-bg/40 p-2 border border-brand-border/40 rounded-xl">
                          <div className="relative w-12 h-12 rounded-lg border border-brand-border/40 overflow-hidden bg-white flex-shrink-0 p-0.5 flex items-center justify-center">
                            <img src={img || "/images/regular_pads.png"} alt="preview" className="w-full h-full object-contain" />
                          </div>
                          <input
                            type="text"
                            value={img.startsWith("data:") ? "(Uploaded System Image)" : img}
                            disabled={img.startsWith("data:")}
                            onChange={(e) => {
                              const updated = [...images];
                              updated[idx] = e.target.value;
                              setImages(updated);
                            }}
                            placeholder="e.g. /images/starter_kit.png"
                            className="flex-grow border border-brand-border rounded-xl px-3 py-1.5 text-xs text-brand-navy focus:outline-none focus:border-brand-pink"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImages(images.filter((_, itemIdx) => itemIdx !== idx));
                            }}
                            className="p-2 bg-white hover:bg-red-50 text-red-500 rounded-xl border border-brand-border/60 hover:border-red-200 transition"
                            title="Remove Image"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setImages([...images, ""])}
                  className="text-xs text-brand-navy hover:text-brand-pink font-semibold border-b border-brand-navy hover:border-brand-pink transition mt-1"
                >
                  + Add Custom Image URL / Path
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Variants (comma-separated)</label>
                <input
                  type="text"
                  value={variants}
                  onChange={(e) => setVariants(e.target.value)}
                  placeholder="Small Cup Kit, Medium Cup Kit, Large Cup Kit"
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink"
                />
              </div>

              {/* Variant Prices configuration list */}
              {variants.split(",").map(v => v.trim()).filter(Boolean).length > 0 && (
                <div className="space-y-2.5 border border-brand-border/60 rounded-2xl p-4 bg-brand-bg/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                      💰 Set Prices &amp; Images per Variant (वैरिएंट के दाम और फोटो)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newV: { [k: string]: number } = {};
                        const newOrig: { [k: string]: number } = {};
                        variants
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean)
                          .forEach((vName) => {
                            newV[vName] = price;
                            if (originalPrice) newOrig[vName] = originalPrice;
                          });
                        setVariantPrices(newV);
                        setVariantOriginalPrices(newOrig);
                        showToast(`Updated all variants to ₹${price}`);
                      }}
                      className="text-[11px] font-bold text-brand-pink hover:underline"
                    >
                      Apply ₹{price} to all variants
                    </button>
                  </div>
                  <div className="space-y-3">
                    {variants.split(",").map(v => v.trim()).filter(Boolean).map((vName) => (
                      <div key={vName} className="p-3 bg-white border border-brand-border/60 rounded-xl space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                            🏷️ {vName}
                          </span>
                          {variantImages[vName] ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              ✓ Custom Photo Set
                            </span>
                          ) : (
                            <span className="text-[10px] text-brand-slate">Uses default image</span>
                          )}
                        </div>

                        {/* Price Row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-brand-slate block mb-0.5">Sale Price (₹)</span>
                            <input
                              type="number"
                              placeholder={price ? `${price}` : "Price"}
                              value={variantPrices[vName] || ""}
                              onChange={(e) => {
                                setVariantOriginalPrices({
                                  ...variantOriginalPrices,
                                  [vName]: variantOriginalPrices[vName] || originalPrice
                                });
                                setVariantPrices({
                                  ...variantPrices,
                                  [vName]: Number(e.target.value) || 0
                                });
                              }}
                              className="w-full border border-brand-border rounded-xl px-3 py-1.5 text-xs text-brand-navy focus:outline-none focus:border-brand-pink"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-brand-slate block mb-0.5">Original (₹)</span>
                            <input
                              type="number"
                              placeholder={originalPrice ? `${originalPrice}` : "Original"}
                              value={variantOriginalPrices[vName] || ""}
                              onChange={(e) => {
                                setVariantOriginalPrices({
                                  ...variantOriginalPrices,
                                  [vName]: Number(e.target.value) || 0
                                });
                              }}
                              className="w-full border border-brand-border rounded-xl px-3 py-1.5 text-xs text-brand-navy focus:outline-none focus:border-brand-pink"
                            />
                          </div>
                        </div>

                        {/* Variant Image Selector Row */}
                        <div className="pt-2 border-t border-brand-border/40">
                          <span className="text-[10px] uppercase font-bold text-brand-slate block mb-1">
                            🖼️ Variant Image (इस वैरिएंट की फोटो)
                          </span>
                          <div className="flex items-center gap-2">
                            {/* Preview Thumbnail */}
                            <div className="w-10 h-10 rounded-lg border border-brand-border/60 overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-0.5">
                              {variantImages[vName] ? (
                                <img src={variantImages[vName]} alt={vName} className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-gray-300 text-[9px] text-center px-1">Default</span>
                              )}
                            </div>

                            {/* Dropdown to select from product gallery */}
                            <select
                              value={variantImages[vName] || ""}
                              onChange={(e) => {
                                setVariantImages({
                                  ...variantImages,
                                  [vName]: e.target.value,
                                });
                              }}
                              className="flex-grow border border-brand-border rounded-xl px-2.5 py-1.5 text-xs text-brand-navy focus:outline-none focus:border-brand-pink bg-white truncate"
                            >
                              <option value="">-- Default (First Image) --</option>
                              {images.filter(Boolean).map((imgUrl, imgIdx) => (
                                <option key={imgIdx} value={imgUrl}>
                                  Image {imgIdx + 1}: {imgUrl.startsWith("data:") ? "Uploaded Image" : imgUrl.slice(-25)}
                                </option>
                              ))}
                            </select>

                            {/* Upload button for this variant */}
                            <label className="cursor-pointer bg-brand-navy/5 hover:bg-brand-navy hover:text-white text-brand-navy text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-brand-border/60 transition flex-shrink-0" title="Upload new photo for this variant">
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const url = await uploadFileToServer(file);
                                  if (url) {
                                    setImages((prev) => (prev.includes(url) ? prev : [...prev, url]));
                                    setVariantImages((prev) => ({ ...prev, [vName]: url }));
                                    showToast(`Image set for ${vName}!`);
                                  }
                                  e.target.value = "";
                                }}
                              />
                            </label>

                            {variantImages[vName] && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = { ...variantImages };
                                  delete updated[vName];
                                  setVariantImages(updated);
                                }}
                                className="text-red-400 hover:text-red-600 p-1"
                                title="Reset to default image"
                              >
                                <FiX className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Product Features (one per line)</label>
                <textarea
                  rows={4}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="1 Pack of Regular Pads&#10;1 Pack of Panty Liners&#10;1 Menstrual Cup"
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none focus:border-brand-pink resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full text-white font-semibold py-3 rounded-xl transition ${
                    isSaving
                      ? "bg-brand-slate cursor-not-allowed"
                      : "bg-brand-navy hover:bg-brand-navy/95"
                  }`}
                >
                  {isSaving
                    ? "Saving changes..."
                    : editingProduct
                    ? "Update Product"
                    : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
