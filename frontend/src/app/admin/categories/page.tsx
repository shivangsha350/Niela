"use client";

import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const defaultCategories: CategoryItem[] = [
  { id: "cat-1", name: "Sanitary Pads", slug: "pads", description: "Organic GOTS cotton day and night pads." },
  { id: "cat-2", name: "Panty Liners", slug: "liners", description: "Ultra-thin breathable everyday panty liners." },
  { id: "cat-3", name: "Menstrual Cups", slug: "cups", description: "Sustainable medical-grade silicone cups." },
  { id: "cat-4", name: "Starter Kits", slug: "kits", description: "Value bundles combining pads, liners and cups." }
];

export default function AdminCategoriesCrudPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("niela_admin_categories");
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem("niela_admin_categories", JSON.stringify(defaultCategories));
      }
    }
  }, []);

  const saveToStorage = (newList: CategoryItem[]) => {
    setCategories(newList);
    localStorage.setItem("niela_admin_categories", JSON.stringify(newList));
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingCategory) {
      const updatedList = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, name, slug, description } : cat
      );
      saveToStorage(updatedList);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description
      };
      saveToStorage([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedList = categories.filter((cat) => cat.id !== id);
      saveToStorage(updatedList);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">Product Categories</h1>
          <p className="text-xs sm:text-sm text-brand-slate">Manage your storefront product classification schemas and metadata tags.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-brand-navy text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-navy/95 transition flex items-center gap-1.5 shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white border border-brand-border/60 rounded-3xl p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="text-brand-navy border-b border-brand-border/40 pb-2">
              <th className="py-2.5 font-bold">Category Name</th>
              <th className="py-2.5 font-bold">Category Slug</th>
              <th className="py-2.5 font-bold">Description</th>
              <th className="py-2.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/20 text-brand-slate">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-brand-bg/40 transition">
                <td className="py-4 font-semibold text-brand-navy">{cat.name}</td>
                <td className="py-4 font-mono text-[11px] text-brand-pink font-semibold">/{cat.slug}</td>
                <td className="py-4 max-w-sm truncate text-brand-slate">{cat.description}</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 hover:bg-brand-bg text-brand-navy hover:text-brand-pink rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
              <h3 className="font-serif font-bold text-brand-navy text-lg">
                {editingCategory ? "Edit Category Schema" : "Create New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX className="w-6 h-6 text-brand-dark-navy hover:text-brand-pink transition" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Category Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="e.g. Sanitary Pads"
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Slug Path</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="pads"
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe classification..."
                  className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-brand-navy focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-navy/95 transition"
                >
                  {editingCategory ? "Update Category" : "Publish Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
