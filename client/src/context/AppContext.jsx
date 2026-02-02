import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KrogerApi from "../services/KrogerApi";
import { useUser } from "@clerk/clerk-react"; // Import Clerk hook
// import { dummyProducts } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
	const { user: clerkUser, isSignedIn } = useUser();
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const currency = import.meta.env.VITE_CURRENCY;
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [showUserLogin, setShowUserLogin] = useState(false);
	const [products, setProducts] = useState([]);
	const [cartItems, setCartItems] = useState({});
	const [searchQuery, setSearchQuery] = useState({});
	const [loading, setLoading] = useState(false);

	// ^ fetch admin status
	const fetchAdminStatus = async () => {
		try {
			const { data } = await axios.get("/api/admin/is-auth");
			if (data.success) {
				setIsAdmin(true);
			} else {
				setIsAdmin(false);
			}
		} catch (error) {
			setIsAdmin(false);
		}
	};

	// ^ fetch user status
	const fetchUserStatus = async () => {
		try {
			const { data } = await axios.get("/api/user/is-auth");
			if (data.success) {
				setCartItems(data.user.cartItems || {});
			}
		} catch (error) {
			console.error("DB User status check failed");
		}
	};

	// const fetchUserStatus = async () => {
	// 	try {
	// 		const { data } = await axios.get("/api/user/is-auth");
	// 		if (data.success) {
	// 			setUser(data.user);
	// 			setCartItems(data.user.cartItems);
	// 		}
	// 	} catch (error) {
	// 		setUser(null);
	// 	}
	// };

	// ^ fetch all products
	const fetchProducts = async (initialQuery = "") => {
		try {
			if (!initialQuery?.trim()) return;

			setLoading(true);
			const { data } = await axios.get("/api/kroger/search", {
				params: { query: initialQuery, limit: 50 },
			});

			if (data.success) {
				setProducts(data.products);
				console.log(`Loaded ${data.products.length} products`);
				console.log(data.products);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error(error);
			toast.error("Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	// ^ search products krogerAPI
	const searchProducts = async (query) => {
		try {
			setLoading(true);
			console.log(`Searching for: ${query}`);

			const { data } = await axios.get("/api/kroger/search", {
				params: { query, limit: 50 },
			});

			if (data.success) {
				setProducts(data.products);
				console.log(`Found ${data.products.length} products`);

				if (data.products.length === 0) {
					toast.info("No products found. Try a different search.");
				}
			} else {
				toast.error(data.message || "Search failed");
				setProducts([]);
			}
		} catch (error) {
			console.error("Search error:", error);
			toast.error("Search failed");
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	// ^ get products by category krogerAPI
	const getProductsByCategory = async (category) => {
		try {
			setLoading(true);
			console.log(`📂 Loading category: ${category}`);

			const { data } = await axios.get(
				`/api/kroger/category/${category}`,
				{
					params: { limit: 50 },
				},
			);

			if (data.success) {
				setProducts(data.products);
				console.log(
					`✅ Loaded ${data.products.length} products in ${category}`,
				);
			} else {
				toast.error("Failed to load category products");
			}
		} catch (error) {
			console.error("Category error:", error);
			toast.error("Failed to load products");
		} finally {
			setLoading(false);
		}
	};

	// ^ add item to cart
	const addToCart = (itemId) => {
		let cartData = structuredClone(cartItems);

		if (cartData[itemId]) {
			cartData[itemId] += 1;
		} else {
			cartData[itemId] = 1;
		}
		setCartItems(cartData);
		toast.success("Added to cart.");
	};

	// ^ update cart item quantity
	const updateCartItems = (itemId, quantity) => {
		let cartData = structuredClone(cartItems);
		cartData[itemId] = quantity;
		setCartItems(cartData);
		toast.success("Cart updated.");
	};

	// ^ remove product from cart
	const removeFromCart = (itemId) => {
		let cartData = structuredClone(cartItems);
		if (cartData[itemId]) {
			cartData[itemId] -= 1;
			if (cartData[itemId] === 0) {
				delete cartData[itemId];
			}
		}
		toast.success("Removed from cart.");
		setCartItems(cartData);
	};

	// ^ get cart item count
	const getCartCount = () => {
		let totalCount = 0;
		for (const item in cartItems) {
			totalCount += cartItems[item];
		}
		return totalCount;
	};

	// ^ get total cart amount krogerAPI
	const getCartAmount = () => {
		let totalAmount = 0;

		for (const itemId in cartItems) {
			const product = products.find(
				(product) =>
					product._id === itemId ||
					product.productId === itemId ||
					product.id === itemId ||
					product.upc === itemId,
			);

			if (product && cartItems[itemId] > 0) {
				const price =
					product.offerPrice ||
					product.price?.sale ||
					product.regularPrice ||
					product.price?.regular ||
					product.price ||
					0;
				totalAmount += price * cartItems[itemId];
			}
		}

		return Math.round(totalAmount * 100) / 100;
	};

	useEffect(() => {
		// fetchAdminStatus();
		fetchProducts();
	}, []);

	useEffect(() => {
		const handleSync = async () => {
			if (clerkUser === undefined) return;

			if (isSignedIn && clerkUser?.id) {
				console.log("Attempting to sync user:", clerkUser.id);
				try {
					const { data } = await axios.post("/api/user/sync", {
						clerkId: clerkUser.id,
						email: clerkUser.primaryEmailAddress.emailAddress,
						name: clerkUser.fullName,
					});

					if (data.success) {
						setUser(data.user);
						setCartItems(data.user.cartItems || {});
						setIsAdmin(data.user.role === "admin");
						setShowUserLogin(false);
						console.log("Sync successful. Role:", data.user.role);
					}
				} catch (error) {
					console.error("Sync error:", error);
				} finally {
					setIsAuthLoading(false);
				}
			} else {
				// User is signed out
				setUser(null);
				setIsAdmin(false);
				// setCartItems({});
				setIsAuthLoading(false);
			}
		};

		handleSync();
	}, [isSignedIn, clerkUser?.id]);

	// Remove BOTH existing useEffects for [cartItems] and replace with this ONE:
	useEffect(() => {
		const updateCart = async () => {
			try {
				// No more manual headers needed!
				const { data } = await axios.post("/api/cart/update", {
					cartItems,
				});

				if (!data.success && data.message) {
					toast.error(data.message);
				}
			} catch (error) {
				console.error("Cart update error:", error.message);
			}
		};

		if (user) {
			updateCart();
		}
	}, [cartItems, user]);

	useEffect(() => {
		// Create the interceptor
		const authInterceptor = axios.interceptors.request.use(
			(config) => {
				const identifier = user?.clerkId || user?.id;

				if (identifier) {
					config.headers.clerkid = identifier;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		// Cleanup: Remove the interceptor when the component unmounts or user changes
		// This prevents memory leaks and duplicate headers
		return () => {
			axios.interceptors.request.eject(authInterceptor);
		};
	}, [user]);

	const value = {
		addToCart,
		axios,
		navigate,
		user,
		setUser,
		isAdmin,
		setIsAdmin,
		showUserLogin,
		setShowUserLogin,
		products,
		setProducts,
		cartItems,
		setCartItems,
		currency,
		updateCartItems,
		removeFromCart,
		searchQuery,
		setSearchQuery,
		getCartAmount,
		getCartCount,
		fetchProducts,
		fetchUserStatus,
		loading,
		searchProducts,
		getProductsByCategory,
	};
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
	return useContext(AppContext);
};
