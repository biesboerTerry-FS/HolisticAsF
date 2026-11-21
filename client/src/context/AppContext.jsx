import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import { catalogProducts, catalogCategories } from "../data/catalog";
import { ensureDemoAdminToken } from "../utils/demoAuth";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

const useAppState = () => {
	const currency = import.meta.env.VITE_CURRENCY || "$";
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [employee, setEmployee] = useState(() => {
		try {
			const stored = JSON.parse(localStorage.getItem("holisticaf-demo-employee") || "null");
			return stored?.employeeId ? stored : null;
		} catch {
			return null;
		}
	});
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthLoading, setIsAuthLoading] = useState(true);
	const [showUserLogin, setShowUserLogin] = useState(false);
	const [products, setProducts] = useState([]);
	const [cartItems, setCartItems] = useState({});
	const [searchQuery, setSearchQuery] = useState({});
	const [loading, setLoading] = useState(false);

	// The web storefront and the mobile app share the same product catalog.
	const filterCatalog = (term = "") => {
		const query = String(term || "").trim().toLowerCase();
		const genericTerms = ["healthy", "clean", "organic", "holistic", "natural", "wellness", "fresh", "all"];
		if (!query || genericTerms.some((term) => query.includes(term))) {
			return catalogProducts;
		}
		return catalogProducts.filter((product) =>
			`${product.name} ${product.category}`.toLowerCase().includes(query),
		);
	};

	const fetchProducts = async (initialQuery = "healthy") => {
		setLoading(true);
		setProducts(filterCatalog(initialQuery));
		setLoading(false);
	};

	const searchProducts = async (query) => {
		setLoading(true);
		const results = filterCatalog(query);
		setProducts(results);
		if (results.length === 0) {
			toast.error("No products found. Try a different search.");
		}
		setLoading(false);
	};

	const getProductsByCategory = async (category) => {
		setLoading(true);
		const match = catalogCategories.find(
			(item) =>
				item.path === category ||
				item.text.toLowerCase() === String(category || "").toLowerCase(),
		);
		setProducts(match ? catalogProducts.filter((product) => product.category === match.text) : catalogProducts);
		setLoading(false);
	};

	const addToCart = (itemId) => {
		let cartData = structuredClone(cartItems);
		cartData[itemId] = (cartData[itemId] || 0) + 1;
		setCartItems(cartData);
		toast.success("Added to cart.");
	};

	const updateCartItems = (itemId, quantity) => {
		let cartData = structuredClone(cartItems);
		cartData[itemId] = quantity;
		setCartItems(cartData);
		toast.success("Cart updated.");
	};

	const removeFromCart = (itemId) => {
		let cartData = structuredClone(cartItems);
		if (cartData[itemId]) {
			cartData[itemId] -= 1;
			if (cartData[itemId] === 0) delete cartData[itemId];
		}
		toast.success("Removed from cart.");
		setCartItems(cartData);
	};

	const getCartCount = () => {
		let totalCount = 0;
		for (const item in cartItems) totalCount += cartItems[item];
		return totalCount;
	};

	const getCartAmount = () => {
		let totalAmount = 0;
		for (const itemId in cartItems) {
			const product = products.find(
				(p) => p._id === itemId || p.productId === itemId || p.id === itemId || p.upc === itemId,
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
		fetchProducts();
	}, []);

	// Persist cart for logged-in app user
	useEffect(() => {
		const updateCart = async () => {
			try {
				const { data } = await axios.post("/api/cart/update", { cartItems });
				if (!data.success && data.message) toast.error(data.message);
			} catch (error) {
				console.error("Cart update error:", error.message);
			}
		};
		if (user) updateCart();
	}, [cartItems, user]);

	// Attach user identifier for backend compatibility
	useEffect(() => {
		const authInterceptor = axios.interceptors.request.use(
			(config) => {
				const identifier = user?.clerkId || user?.id;
				if (identifier) config.headers.clerkid = identifier;
				return config;
			},
			(error) => Promise.reject(error),
		);
		return () => axios.interceptors.request.eject(authInterceptor);
	}, [user]);

	return {
		addToCart,
		axios,
		navigate,
		user,
		setUser,
		employee,
		setEmployee,
		isAdmin,
		setIsAdmin,
		isAuthLoading,
		setIsAuthLoading,
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
		loading,
		searchProducts,
		getProductsByCategory,
	};
};

export const ClerkAppContextProvider = ({ children }) => {
	const state = useAppState();
	const { user: clerkUser, isSignedIn, isLoaded } = useUser();

	useEffect(() => {
		const handleSync = async () => {
			if (!isLoaded) return;

			if (isSignedIn && clerkUser?.id) {
				try {
					const { data } = await axios.post("/api/user/sync", {
						clerkId: clerkUser.id,
						email: clerkUser.primaryEmailAddress?.emailAddress || "",
						name: clerkUser.fullName || clerkUser.firstName || "User",
					});
					if (data.success) {
						state.setUser(data.user);
						state.setCartItems(data.user.cartItems || {});
						state.setIsAdmin(data.user.role === "admin");
						state.setShowUserLogin(false);
					}
				} catch (error) {
					console.error("Sync error:", error);
				} finally {
					state.setIsAuthLoading(false);
				}
			} else {
				state.setUser(null);
				state.setIsAdmin(false);
				state.setIsAuthLoading(false);
			}
		};

		handleSync();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoaded, isSignedIn, clerkUser?.id]);

	return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const LocalAppContextProvider = ({ children }) => {
	const state = useAppState();

	useEffect(() => {
		// No Clerk configured: keep app usable in local/dev mode.
		// Obtain a short-lived demo admin token so the now-protected admin
		// routes keep working in this mode too. Also seed it on hard navigations
		// straight to an admin page (the token cookie may be absent there).
		ensureDemoAdminToken(state.axios).finally(() => {
			if (window.location.pathname.startsWith("/admin")) {
				ensureDemoAdminToken(state.axios);
			}
			state.setUser(null);
			state.setIsAdmin(true);
			state.setIsAuthLoading(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
