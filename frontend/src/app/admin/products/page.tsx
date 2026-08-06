"use client";

import React, { useState } from "react";
import { Product, useShop } from "@/context/ShopContext";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function AdminProductsCrudPage() {
  const { products, updateProductsList } = useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file to base64
    const filePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((base64Strings) => {
      setImages((prev) => [...prev, ...base64Strings]);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0) return;

    const finalStock = inStock ? (stock > 0 ? stock : 50) : 0;
    const imagesArray = images.filter(Boolean);
    const variantsArray = variants.split(",").map(v => v.trim()).filter(Boolean);
    const featuresArray = features.split("\n").map(f => f.trim()).filter(Boolean);

    // Clean up variant prices to only keep defined ones matching active variants
    const cleanedPrices: { [key: string]: number } = {};
    const cleanedOriginalPrices: { [key: string]: number } = {};
    variantsArray.forEach((v) => {
      if (variantPrices[v]) cleanedPrices[v] = variantPrices[v];
      if (variantOriginalPrices[v]) cleanedOriginalPrices[v] = variantOriginalPrices[v];
    });

    if (editingProduct) {
      // Update Action
      const updatedList = products.map((p) =>
        p._id === editingProduct._id
          ? {
              ...p,
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
              variantPrices: cleanedPrices,
              variantOriginalPrices: cleanedOriginalPrices
            }
          : p
      );
      updateProductsList(updatedList);
    } else {
      // Create Action
      const newProduct: Product = {
        _id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
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
        variantPrices: cleanedPrices,
        variantOriginalPrices: cleanedOriginalPrices
      };
      updateProductsList([...products, newProduct]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedList = products.filter((p) => p._id !== id);
      updateProductsList(updatedList);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">Products Inventory</h1>
          <p className="text-xs sm:text-sm text-brand-slate">Manage your active catalog listings, details, and stock levels.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-brand-navy text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-navy/95 transition flex items-center gap-1.5 shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Grid of existing products */}
      <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-brand-navy border-b border-brand-border/40 pb-2">
              <th className="py-2.5 font-bold">Image</th>
              <th className="py-2.5 font-bold">Product Name</th>
              <th className="py-2.5 font-bold">Category</th>
              <th className="py-2.5 font-bold">Price</th>
              <th className="py-2.5 font-bold">Stock Status</th>
              <th className="py-2.5 font-bold">Rating</th>
              <th className="py-2.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20 text-brand-slate">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-brand-bg/40 transition">
                <td className="py-3">
                  <div className="w-12 h-12 bg-brand-bg rounded-lg overflow-hidden border border-brand-border/40">
                    <img src={p.images ? p.images[0] : ""} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 font-semibold text-brand-navy max-w-xs truncate">{p.name}</td>
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
                <td className="py-3 text-brand-navy font-semibold">{p.rating || "5.0"} ⭐ ({p.reviewsCount || 0})</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 hover:bg-brand-bg text-brand-navy hover:text-brand-pink rounded-lg transition"
                      title="Edit Product"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
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
                          <div className="relative w-12 h-12 rounded-lg border border-brand-border/40 overflow-hidden bg-brand-bg flex-shrink-0">
                            <img src={img || "/images/regular_pads.png"} alt="preview" className="w-full h-full object-cover" />
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
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-navy block">
                    💰 Set Different Prices per Variant (Optional)
                  </span>
                  <div className="space-y-3">
                    {variants.split(",").map(v => v.trim()).filter(Boolean).map((vName) => (
                      <div key={vName} className="grid grid-cols-3 gap-2 items-center">
                        <span className="text-xs font-semibold text-brand-navy truncate" title={vName}>
                          {vName}
                        </span>
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
                  className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-navy/95 transition"
                >
                  {editingProduct ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
