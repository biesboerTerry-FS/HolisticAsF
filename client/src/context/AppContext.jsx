import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
	const currency = import.meta.VITE_CURRENCY;
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [showUserLogin, setShowUserLogin] = useState(false);
	const [products, setProducts] = useState([]);
	const [cartItems, setCartItems] = useState({});

	const fetchProducts = async () => {
		setProducts(dummyProducts);
	};

	const addToCart = () => {
		let cartData = structuredClone(cartItems);

		if (cartData[itemId]) {
			cartData[itemId] += 1;
		} else {
			cartData[itemId] = 1;
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const value = {
		navigate,
		user,
		setUser,
		isAdmin,
		setIsAdmin,
		showUserLogin,
		setShowUserLogin,
		products,
		setProducts,
		currency,
	};
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
	return useContext(AppContext);
};
