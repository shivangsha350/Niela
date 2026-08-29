"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop, Product } from "@/context/ShopContext";
import { 
  FiSearch, 
  FiShoppingBag, 
  FiUser, 
  FiHeart, 
  FiMenu, 
  FiX, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiChevronDown 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    wishlist, 
    user, 
    logoutUser,
    products
  } = useShop();

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Detect scroll to style the header sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update search results dynamically
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, products]);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-brand-pink text-white text-center py-2 text-xs tracking-wider uppercase font-medium">
        Free Shipping on all orders above ₹499 • 100% Biodegradable & Plastic-Free
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? "glass-nav shadow-sm border-b border-brand-border/60 py-3" 
            : "bg-white/90 border-b border-brand-border/20 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className={`relative overflow-hidden rounded-full flex-shrink-0 transition-all duration-300 ${
              isScrolled ? "w-9 h-9" : "w-11 h-11"
            }`}>
              <img 
                src="/images/logo.png" 
                alt="niela logo" 
                className="absolute w-[200%] h-[200%] max-w-none -top-[15%] left-1/2 -translate-x-1/2 object-cover" 
              />
            </div>
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-navy">
              niela
            </span>
            <span className="w-1.5 h-1.5 bg-brand-pink rounded-full self-end mb-1"></span>
          </Link>

          {/* Desktop Mega Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            <div className="relative group">
              <Link href="/products" className="text-brand-dark-navy hover:text-brand-pink transition duration-200 flex items-center gap-1 py-1">
                Shop <FiChevronDown className="w-3.5 h-3.5" />
              </Link>
              {/* Mega Dropdown menu */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white border border-brand-border rounded-xl shadow-xl p-6 grid grid-cols-2 gap-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200">
                <div>
                  <h4 className="font-serif font-semibold text-brand-navy border-b border-brand-border pb-1 mb-2">Sanitary Pads</h4>
                  <ul className="space-y-2 text-xs text-brand-slate">
                    <li><Link href="/products?category=pads" className="hover:text-brand-pink">Day Use Pads</Link></li>
                    <li><Link href="/products?category=pads" className="hover:text-brand-pink">Heavy Flow Night Pads</Link></li>
                    <li><Link href="/products?category=pads" className="hover:text-brand-pink">Ultrathin Liners</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-brand-navy border-b border-brand-border pb-1 mb-2">Sustainable & Kits</h4>
                  <ul className="space-y-2 text-xs text-brand-slate">
                    <li><Link href="/products?category=cups" className="hover:text-brand-pink">Menstrual Cups</Link></li>
                    <li><Link href="/products?category=kits" className="hover:text-brand-pink">Starter kits</Link></li>
                    <li><Link href="/products" className="hover:text-brand-pink">All Bundles</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/about" className="text-brand-dark-navy hover:text-brand-pink transition duration-200 py-1">
              Our Story
            </Link>
            <Link href="/#reviews" className="text-brand-dark-navy hover:text-brand-pink transition duration-200 py-1">
              Reviews
            </Link>
            <Link href="/contact" className="text-brand-dark-navy hover:text-brand-pink transition duration-200 py-1">
              Contact
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-brand-dark-navy">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:text-brand-pink transition duration-200"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              className="p-1 hover:text-brand-pink transition duration-200 relative"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon Drawer Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1 hover:text-brand-pink transition duration-200 relative"
              aria-label="Open Cart"
            >
              <FiShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-1 hover:text-brand-pink transition duration-200 flex items-center"
                aria-label="User Account"
              >
                <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-white border border-brand-border rounded-xl shadow-lg py-2 z-50 text-sm"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-brand-border/60">
                          <p className="font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-brand-slate truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-brand-bg transition duration-200">
                          My Profile
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 hover:bg-brand-bg transition duration-200">
                          My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link href="/admin" className="block px-4 py-2 text-brand-gold font-medium hover:bg-brand-bg transition duration-200">
                            Admin Portal
                          </Link>
                        )}
                        <button 
                          onClick={logoutUser}
                          className="w-full text-left block px-4 py-2 text-red-500 hover:bg-red-50 transition duration-200 border-t border-brand-border/60 mt-1"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 hover:bg-brand-bg transition duration-200">
                          Login
                        </Link>
                        <Link href="/register" className="block px-4 py-2 hover:bg-brand-bg transition duration-200">
                          Sign Up
                        </Link>
                        <Link href="/admin/login" className="block px-4 py-2 text-brand-gold hover:bg-brand-bg transition duration-200 border-t border-brand-border/60 mt-1">
                          Admin Access
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 md:hidden hover:text-brand-pink transition duration-200"
              aria-label="Toggle Menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-4/5 max-w-sm h-full bg-white p-6 shadow-xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                    <div className="relative w-9 h-9 overflow-hidden rounded-full flex-shrink-0">
                      <img 
                        src="/images/logo.png" 
                        alt="niela logo" 
                        className="absolute w-[200%] h-[200%] max-w-none -top-[15%] left-1/2 -translate-x-1/2 object-cover" 
                      />
                    </div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-brand-navy">niela</span>
                    <span className="w-1.5 h-1.5 bg-brand-pink rounded-full self-end mb-1"></span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <FiX className="w-6 h-6 text-brand-dark-navy" />
                  </button>
                </div>
                <nav className="space-y-6 text-base font-semibold">
                  <Link href="/products" className="block text-brand-dark-navy hover:text-brand-pink">
                    Shop Products
                  </Link>
                  <Link href="/about" className="block text-brand-dark-navy hover:text-brand-pink">
                    Our Story
                  </Link>
                  <Link href="/#reviews" className="block text-brand-dark-navy hover:text-brand-pink">
                    Reviews
                  </Link>
                  <Link href="/contact" className="block text-brand-dark-navy hover:text-brand-pink">
                    Contact Us
                  </Link>
                </nav>
              </div>

              {/* Mobile Drawer Auth Link */}
              <div className="border-t border-brand-border pt-6">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">{user.name}</p>
                      <button onClick={logoutUser} className="text-red-500 text-xs mt-1 underline">Logout</button>
                    </div>
                    <Link href="/profile" className="text-xs text-brand-navy bg-brand-bg px-3 py-1.5 rounded-full font-medium">My Profile</Link>
                  </div>
                ) : (
                  <Link href="/login" className="block w-full text-center bg-brand-navy text-white py-3 rounded-lg text-sm font-semibold hover:bg-brand-navy/95 transition">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 w-full sm:w-[450px] h-full bg-white shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="w-5 h-5 text-brand-navy" />
                  <h3 className="font-serif font-bold text-lg text-brand-navy">Your Bag ({cartCount})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)}>
                  <FiX className="w-6 h-6 text-brand-dark-navy" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-brand-slate space-y-4">
                    <FiShoppingBag className="w-12 h-12 stroke-[1.5]" />
                    <p className="font-serif text-lg font-medium">Your shopping bag is empty</p>
                    <Link 
                      href="/products" 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-navy/90 transition"
                    >
                      Shop Period Care
                    </Link>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={`${item.product._id}-${item.selectedVariant}`} className="flex items-start gap-4 border-b border-brand-border/60 pb-4">
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 bg-brand-bg rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-brand-navy truncate">{item.product.name}</h4>
                        <p className="text-xs text-brand-slate mt-0.5">Pack: {item.selectedVariant}</p>
                        <p className="font-bold text-sm text-brand-navy mt-1">₹{item.product.price}</p>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-3 mt-3">
                          <div className="flex items-center border border-brand-border rounded-md px-2 py-1 bg-brand-bg">
                            <button 
                              onClick={() => updateCartQuantity(item.product._id, item.selectedVariant, item.quantity - 1)}
                              className="p-1 hover:text-brand-pink transition"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.product._id, item.selectedVariant, item.quantity + 1)}
                              className="p-1 hover:text-brand-pink transition"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.product._id, item.selectedVariant)}
                            className="text-red-500 hover:text-red-600 transition flex items-center gap-1 text-xs"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-border bg-brand-bg/40 space-y-4">
                  <div className="flex justify-between items-center text-brand-navy">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-bold text-lg">₹{cartSubtotal}</span>
                  </div>
                  <p className="text-xs text-brand-slate">Shipping and taxes are calculated at checkout.</p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link 
                      href="/cart" 
                      onClick={() => setIsCartOpen(false)}
                      className="text-center border border-brand-navy text-brand-navy py-3 rounded-lg text-sm font-medium hover:bg-brand-navy hover:text-white transition duration-200"
                    >
                      View Cart
                    </Link>
                    <Link 
                      href="/checkout" 
                      onClick={() => setIsCartOpen(false)}
                      className="text-center bg-brand-navy text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-navy/95 transition duration-200"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-dark-navy/90 flex flex-col justify-start"
          >
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white hover:text-brand-pink transition"
                >
                  <FiX className="w-8 h-8" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative border-b-2 border-white/40 focus-within:border-brand-pink transition duration-300 py-3 flex items-center">
                <FiSearch className="text-white/60 w-6 h-6 mr-4" />
                <input
                  type="text"
                  placeholder="Search period care, starter kits, menstrual cups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white font-serif text-xl sm:text-2xl placeholder-white/40 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              <div className="mt-8 overflow-y-auto max-h-[60vh] space-y-4 pr-2">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link 
                      key={product._id} 
                      href={`/products/${product._id}`}
                      className="flex items-center gap-4 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition duration-200 border border-white/5"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-base">{product.name}</h4>
                        <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{product.description}</p>
                        <p className="text-white font-bold text-sm mt-1">₹{product.price}</p>
                      </div>
                    </Link>
                  ))
                ) : searchQuery.trim() !== "" ? (
                  <p className="text-white/60 text-center py-6 font-serif">No products found matching &quot;{searchQuery}&quot;</p>
                ) : (
                  <div className="text-white/40 text-center py-10 space-y-2">
                    <p className="font-serif text-lg">Looking for something specific?</p>
                    <p className="text-xs">Try searching for &quot;liners&quot;, &quot;pads&quot;, &quot;cup&quot;, or &quot;starter kit&quot;.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
