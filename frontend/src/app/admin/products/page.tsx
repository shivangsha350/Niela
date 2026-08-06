"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/context/ShopContext";
import { mockProducts } from "@/data/products";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function AdminProductsCrudPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("pads");
  const [image, setImage] = useState("/images/regular_pads.png");

  // Load products list on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niela_admin_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(mockProducts);
        localStorage.setItem("niela_admin_products", JSON.stringify(mockProducts));
      }
    }
  }, []);

  const saveToStorage = (newList: Product[]) => {
    setProducts(newList);
    localStorage.setItem("niela_admin_products", JSON.stringify(newList));
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice(0);
    setOriginalPrice(0);
    setStock(0);
    setCategory("pads");
    setImage("/images/regular_pads.png");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setStock(p.stock);
    setCategory(p.category);
    setImage(p.images[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0 || stock < 0) return;

    if (editingProduct) {
      // Update Action
      const updatedList = products.map((p) =>
        p._id === editingProduct._id
          ? { ...p, name, description, price, originalPrice, stock, category, images: [image] }
          : p
      );
      saveToStorage(updatedList);
    } else {
      // Create Action
      const newProduct: Product = {
        _id: `prod-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        description,
        price,
        originalPrice: originalPrice || undefined,
        stock,
        category,
        images: [image],
        rating: 5.0,
        reviewsCount: 1
      };
      saveToStorage([...products, newProduct]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedList = products.filter((p) => p._id !== id);
      saveToStorage(updatedList);
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
              <th className="py-2.5 font-bold">Stock</th>
              <th className="py-2.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20 text-brand-slate">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-brand-bg/40 transition">
                <td className="py-3">
                  <div className="w-12 h-12 bg-brand-bg rounded-lg overflow-hidden border border-brand-border/40">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-3 font-semibold text-brand-navy max-w-xs truncate">{p.name}</td>
                <td className="py-3 uppercase text-[10px] font-bold text-brand-pink tracking-wider">{p.category}</td>
                <td className="py-3 font-bold text-brand-navy">₹{p.price}</td>
                <td className="py-3 font-medium">{p.stock} units</td>
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
                  placeholder="e.g. Sensitive Skin Ultra Thin Pads"
                  className="w-full border border-brand-border rounded-xl px-4.5 py-2.5 text-brand-navy focus:outline-none"
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
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none resize-none"
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
                    placeholder="349"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    placeholder="399"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="50"
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                  >
                    <option value="pads">Pads</option>
                    <option value="liners">Liners</option>
                    <option value="cups">Cups</option>
                    <option value="kits">Kits</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Product Image Path</label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                >
                  <option value="/images/regular_pads.png">Regular Pads Image</option>
                  <option value="/images/panty_liners.png">Panty Liners Image</option>
                  <option value="/images/starter_kit.png">Starter Kit Image</option>
                  <option value="/images/menstrual_cup.png">Menstrual Cup Image</option>
                </select>
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
