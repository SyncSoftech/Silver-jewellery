import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { CiShoppingCart, CiSearch } from "react-icons/ci";
import {
  AiFillCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { BsBagCheckFill } from "react-icons/bs";
import { MdAccountCircle, MdFilterList } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BiSortAlt2 } from "react-icons/bi";

const Navbar = ({
  Logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  wishlist = {},
  removeFromWishlist,
  clearWishlist,
  moveToCart,
}) => {
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: "all",
    sortBy: "createdAt",
    order: "desc",
  });

  const ref = useRef();
  const wishlistRef = useRef();
  const searchRef = useRef();

  const cartItemCount = Object.keys(cart).reduce(
    (acc, k) => acc + cart[k].qty,
    0
  );
  const wishlistItemCount = Object.keys(wishlist).length;

  // Check if user is logged in before proceeding
  const checkAuthAndProceed = (callback) => {
    if (!user.value) {
      router.push("/login");
      return false;
    }
    callback();
    return true;
  };

  // Handle checkout navigation with auth check
  const handleCheckout = () => {
    checkAuthAndProceed(() => {
      router.push("/checkout");
    });
  };

  // Handle Buy Now from cart with auth check
  const handleCartBuyNow = () => {
    checkAuthAndProceed(() => {
      const firstItemKey = Object.keys(cart)[0];
      if (firstItemKey) {
        router.push(`/product/${firstItemKey}`);
      }
    });
  };

  // Handle Buy Now from wishlist with auth check
  const handleWishlistBuyNow = (itemKey) => {
    checkAuthAndProceed(() => {
      router.push(`/checkout?item=${itemKey}`);
    });
  };

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Auto-open cart when items are added (but not on initial page load)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      setPrevCartCount(cartItemCount);
      return;
    }

    if (cartItemCount > prevCartCount) {
      openCart();
    }
    setPrevCartCount(cartItemCount);
  }, [cartItemCount]);

  const openCart = () => {
    if (
      wishlistRef.current &&
      !wishlistRef.current.classList.contains("translate-x-full")
    ) {
      wishlistRef.current.classList.remove("translate-x-0");
      wishlistRef.current.classList.add("translate-x-full");
    }

    if (ref.current && ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    }
  };

  const toggleCart = () => {
    if (
      wishlistRef.current &&
      !wishlistRef.current.classList.contains("translate-x-full")
    ) {
      wishlistRef.current.classList.remove("translate-x-0");
      wishlistRef.current.classList.add("translate-x-full");
    }

    if (ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-full");
      ref.current.classList.add("translate-x-0");
    } else if (!ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }
  };

  const toggleWishlist = () => {
    if (ref.current && !ref.current.classList.contains("translate-x-full")) {
      ref.current.classList.remove("translate-x-0");
      ref.current.classList.add("translate-x-full");
    }

    if (wishlistRef.current.classList.contains("translate-x-full")) {
      wishlistRef.current.classList.remove("translate-x-full");
      wishlistRef.current.classList.add("translate-x-0");
    } else if (!wishlistRef.current.classList.contains("translate-x-full")) {
      wishlistRef.current.classList.remove("translate-x-0");
      wishlistRef.current.classList.add("translate-x-full");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append("q", searchQuery.trim());
    }

    if (filters.category) {
      params.append("category", filters.category);
    }

    if (filters.minPrice) {
      params.append("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
      params.append("maxPrice", filters.maxPrice);
    }

    if (filters.inStock !== "all") {
      params.append("inStock", filters.inStock);
    }

    params.append("sortBy", filters.sortBy);
    params.append("order", filters.order);

    router.push(`/search?${params.toString()}`);
    setSearchOpen(false);
    setMobileSearchOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: "all",
      sortBy: "createdAt",
      order: "desc",
    });
    setSearchQuery("");
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex flex-col justify-start md:flex-row md:justify-start lg:justify-center  lg:items-center px-4 shadow-lg text-white bg-gray-800 z-50">
      <div className="logo flex justify-start items-start gap-2">
        <Link href="/">
          <div className="lg:w-auto lg:ml-5 lg:m-auto items-center gap-3">
            <Image
              width={160}
              height={60}
              src="/LOGO.png"
              alt="Logo"
              className="lg:m-auto"
            />
          </div>
        </Link>
      </div>

      {/* Desktop Search Bar - Hidden on Mobile */}
      <div className="search-container hidden lg:block mt-4 lg:ml-20 lg:mt-0 mb-2 lg:mb-0 relative  flex-1  max-w-2xl lg:max-w-lg">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search for jewelry..."
            className="w-full px-4 py-2 pr-24 rounded-full border-2 border-slate-200 focus:border-slate-400 focus:outline-none transition-all duration-300 text-gray-800"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-12 top-1/2 mx-2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-all duration-300"
          >
            <MdFilterList className="text-xl" />
          </button>
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition-all duration-300"
          >
            <CiSearch className="text-xl" />
          </button>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MdFilterList className="text-xl" />
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <AiFillCloseCircle className="text-xl" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                >
                  <option value="">All Categories</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="earings">Earings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="rings">Rings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Availability
                </label>
                <select
                  value={filters.inStock}
                  onChange={(e) =>
                    handleFilterChange("inStock", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                >
                  <option value="all">All Items</option>
                  <option value="true">In Stock Only</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  placeholder="Min"
                  min={0}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <BiSortAlt2 />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price">Price</option>
                  <option value="title">Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Order
                </label>
                <select
                  value={filters.order}
                  onChange={(e) => handleFilterChange("order", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-medium"
              >
                Reset Filters
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 font-medium"
              >
                Apply & Search
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="nav mx-auto lg:ml-5  py-2 lg:block">
        <ul className="flex items-center font-alegreya-sans-medium space-x-8 font-medium md:text-lg tracking-wide">
          <Link href={"/bracelets"}>
            <span className="hover:text-slate-700 transition-all duration-300 relative group">
              <li>Bracelets</li>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          <Link href={"/earings"}>
            <span className="hover:text-slate-700 transition-all duration-300 relative group">
              <li>Earings</li>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          {/* <Link href={"/necklaces"}>
            <span className="hover:text-slate-700 transition-all duration-300 relative group">
              <li>Necklaces</li>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          <Link href={"/rings"}>
            <span className="hover:text-slate-700 transition-all duration-300 relative group">
              <li>Rings</li>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-700 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link> */}
        </ul>
      </div>

      <div className="cart absolute right-0 mx-6 top-5 lg:top-8 cursor-pointer flex items-center gap-1">
        {/* Mobile Search Icon - Visible only on mobile */}
        <div className="lg:hidden">
          <CiSearch
            onClick={() => setMobileSearchOpen(true)}
            className="text-3xl text-white hover:text-slate-300 transition-all duration-300 hover:scale-110 mx-2"
          />
        </div>

        <span
          onMouseOver={() => {
            setDropdown(true);
          }}
          onMouseLeave={() => {
            setDropdown(false);
          }}
        >
          {dropdown && (
            <div
              onMouseOver={() => {
                setDropdown(true);
              }}
              onMouseLeave={() => {
                setDropdown(false);
              }}
              className="absolute right-8 bg-white shadow-xl top-9 rounded-xl px-6 py-5 w-40 border border-slate-100 backdrop-blur-sm"
            >
              <ul className="space-y-1">
                <Link href={"/myaccount"}>
                  <li className="py-2 text-gray-500 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold">
                    My Account
                  </li>
                </Link>
                <Link href={"/orders"}>
                  <li className="py-2 text-gray-500 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold">
                    Orders
                  </li>
                </Link>
                <span>
                  <li
                    onClick={Logout}
                    className="py-2 text-gray-500 hover:text-slate-700 hover:translate-x-1 transition-all text-sm font-semibold cursor-pointer"
                  >
                    LogOut
                  </li>
                </span>
              </ul>
            </div>
          )}
          {user.value && (
            <MdAccountCircle className="text-3xl md:text-3xl mx-2 text-white hover:text-white transition-all duration-300 hover:scale-110" />
          )}
        </span>

        {!user.value && (
          <Link href={"/login"}>
            <div>
              <button className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-2 rounded-full text-sm text-white mx-2 hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
                Login
              </button>
            </div>
          </Link>
        )}

        <div className="relative mx-2 group">
          <AiOutlineHeart
            onClick={toggleWishlist}
            className="text-3xl md:text-3xl text-pink-700 hover:text-red-500 transition-all duration-300 hover:scale-110"
          />
          {wishlistItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
              {wishlistItemCount}
            </span>
          )}
        </div>

        <div className="relative group">
          <CiShoppingCart
            onClick={toggleCart}
            className="text-3xl md:text-3xl text-white hover:text-white transition-all duration-300 hover:scale-110"
          />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-br from-slate-700 to-slate-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md animate-pulse">
              {cartItemCount}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white h-full overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Search Products</h2>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-2xl"
              >
                <AiFillCloseCircle />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jewelry..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-slate-300 focus:border-slate-500 focus:outline-none text-gray-800"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                  <CiSearch className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  >
                    <option value="">All Categories</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="earings">Earings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="rings">Rings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange("inStock", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  >
                    <option value="all">All Items</option>
                    <option value="true">In Stock Only</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Min Price (₹)
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      placeholder="Min"
                      min={0}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <BiSortAlt2 />
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  >
                    <option value="createdAt">Newest First</option>
                    <option value="price">Price</option>
                    <option value="title">Name</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.order}
                    onChange={(e) => handleFilterChange("order", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 sticky bottom-0 bg-white pt-4 pb-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-300 font-medium"
                >
                  Reset Filters
                </button>
                <button
                  onClick={handleSearch}
                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all duration-300 font-medium"
                >
                  Apply & Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <div
        ref={ref}
        className={`w-80 h-[100vh] sideCart overflow-y-auto fixed top-0 right-0 bg-white shadow-2xl transform transition-transform duration-500 translate-x-full`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 #f8fafc",
        }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md px-4 py-3 z-10">
          <h2 className="font-bold text-lg text-white flex items-center justify-center">
            <HiOutlineShoppingBag className="mr-2 text-xl" />
            Cart
          </h2>
          <span
            onClick={toggleCart}
            className="absolute top-3 right-4 cursor-pointer text-xl text-white hover:text-red-400 transition-all duration-300"
          >
            <AiFillCloseCircle />
          </span>
        </div>

        <div className="px-4 py-4">
          {Object.keys(cart).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <HiOutlineShoppingBag className="text-5xl text-slate-300" />
              </div>
              <p className="text-slate-600 font-semibold text-base">
                Your cart is empty
              </p>
              <p className="text-slate-400 text-xs mt-2">Start shopping now!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(cart).map((k) => {
                return (
                  <div
                    key={k}
                    className="bg-emerald-50 rounded-lg shadow-sm p-3 border border-emerald-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      {cart[k].img && (
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-slate-200">
                            <Image
                              src={cart[k].img}
                              alt={cart[k].name}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex-1 flex flex-col gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                            {cart[k].name}
                          </h3>
                          {(cart[k].size || cart[k].variant) && (
                            <p className="text-xs text-slate-500 mt-1">
                              {cart[k].size && <span>{cart[k].size}</span>}
                              {cart[k].size && cart[k].variant && (
                                <span className="mx-1">•</span>
                              )}
                              {cart[k].variant && (
                                <span>{cart[k].variant}</span>
                              )}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm border border-slate-200">
                            <AiOutlineMinusCircle
                              onClick={() => {
                                removeFromCart(
                                  k,
                                  1,
                                  cart[k].price,
                                  cart[k].name,
                                  cart[k].size,
                                  cart[k].variant
                                );
                              }}
                              className="cursor-pointer text-slate-500 hover:text-red-500 transition-all duration-300 text-base"
                            />
                            <span className="mx-2 text-xs font-bold text-slate-700 min-w-[16px] text-center">
                              {cart[k].qty}
                            </span>
                            <AiOutlinePlusCircle
                              onClick={() => {
                                addToCart(
                                  k,
                                  1,
                                  cart[k].price,
                                  cart[k].name,
                                  cart[k].size,
                                  cart[k].variant
                                );
                              }}
                              className="cursor-pointer text-slate-500 hover:text-green-500 transition-all duration-300 text-base"
                            />
                          </div>
                          <div className="font-bold text-slate-800 text-sm">
                            ₹{cart[k].price * cart[k].qty}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {Object.keys(cart).length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
              <span className="text-slate-600 font-medium text-sm">
                Subtotal:
              </span>
              <span className="text-xl font-bold text-slate-800">
                ₹{subTotal}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleCheckout}
                  className="flex-1 flex items-center justify-center text-white bg-gradient-to-r from-emerald-600 to-teal-600 border-0 py-2.5 px-4 focus:outline-none hover:from-emerald-700 hover:to-teal-700 rounded-lg text-sm font-bold transition-all duration-300 shadow-md"
                >
                  <BsBagCheckFill className="mr-2 text-sm" />
                  Checkout
                </button>
              </div>
              <button
                onClick={clearCart}
                className="w-full text-slate-600 bg-emerald-100 border-0 py-2 px-4 focus:outline-none hover:bg-emerald-200 rounded-lg text-xs font-medium transition-all duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wishlist Sidebar */}
      <div
        ref={wishlistRef}
        className={`w-80 h-[100vh] sideCart overflow-y-auto fixed top-0 right-0 bg-white shadow-2xl transform transition-transform duration-500 translate-x-full`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#fca5a5 #fef2f2",
        }}
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-500 shadow-md px-4 py-3 z-10">
          <h2 className="font-bold text-lg text-white flex items-center justify-center">
            <AiFillHeart className="mr-2 text-xl" />
            Wishlist
          </h2>
          <span
            onClick={toggleWishlist}
            className="absolute top-3 right-4 cursor-pointer text-xl text-white hover:text-slate-200 transition-all duration-300"
          >
            <AiFillCloseCircle />
          </span>
        </div>

        <div className="px-4 py-4">
          {Object.keys(wishlist).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-50 p-6 rounded-full mb-4">
                <AiOutlineHeart className="text-5xl text-red-300" />
              </div>
              <p className="text-slate-600 font-semibold text-base">
                Your wishlist is empty
              </p>
              <p className="text-slate-400 text-xs mt-2">
                Save your favorites!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.keys(wishlist).map((k) => {
                return (
                  <div
                    key={k}
                    className="bg-red-50 rounded-lg shadow-sm p-3 border border-red-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      {wishlist[k].img && (
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-red-200">
                            <Image
                              src={wishlist[k].img}
                              alt={wishlist[k].name}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                              {wishlist[k].name}
                            </h3>
                            {(wishlist[k].size || wishlist[k].variant) && (
                              <p className="text-xs text-slate-500 mt-1">
                                {wishlist[k].size && (
                                  <span>{wishlist[k].size}</span>
                                )}
                                {wishlist[k].size && wishlist[k].variant && (
                                  <span className="mx-1">•</span>
                                )}
                                {wishlist[k].variant && (
                                  <span>{wishlist[k].variant}</span>
                                )}
                              </p>
                            )}
                            <div className="font-bold text-slate-800 text-sm mt-1">
                              ₹{wishlist[k].price}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(k)}
                            className="text-slate-400 hover:text-red-500 transition-all duration-300"
                          >
                            <AiFillCloseCircle className="text-lg" />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => moveToCart(k)}
                            className="flex-1 bg-slate-800 text-white py-1.5 px-2 rounded-md hover:bg-slate-900 transition-all duration-300 text-xs font-semibold flex items-center justify-center"
                          >
                            <CiShoppingCart className="mr-1 text-sm" />
                            Add to Cart
                          </button>
                            {/* <button
                              onClick={() => handleWishlistBuyNow(k)}
                              className="flex-1 bg-green-600 text-white py-1.5 px-2 rounded-md hover:bg-green-700 transition-all duration-300 text-xs font-semibold flex items-center justify-center whitespace-nowrap"
                            >
                              <BsBagCheckFill className="mr-1 text-xs" />
                              Buy Now
                            </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {Object.keys(wishlist).length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-red-200 px-4 py-3 shadow-lg">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-red-200">
              <span className="text-slate-600 font-medium text-sm">
                Total Items:
              </span>
              <span className="text-xl font-bold text-slate-800">
                {wishlistItemCount}
              </span>
            </div>

            <button
              onClick={clearWishlist}
              className="w-full text-slate-600 bg-red-100 border-0 py-2 px-4 focus:outline-none hover:bg-red-200 rounded-lg text-xs font-medium transition-all duration-300"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;