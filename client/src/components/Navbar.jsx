import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import ThemeToggle from "./ThemeToggle";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const DISMISSED_KEY = "holisticaf-announcement-dismissed";
const CACHE_KEY = "holisticaf-announcement-cache";

// Used only when the API is unreachable or has no active announcements, so the
// storefront still has a friendly bulletin even without a database seed.
const DEFAULT_ANNOUNCEMENT = {
	title: "Welcome to holisticAF",
	body: "Explore fresh, holistic groceries and everyday wellness essentials — new arrivals are added every week.",
	type: "info",
};

const readCachedAnnouncement = () => {
	try {
		const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
		if (cached?.title && cached?.body) return cached;
	} catch {
		// ignore malformed or unavailable storage
	}
	return DEFAULT_ANNOUNCEMENT;
};

const cacheAnnouncement = (announcement) => {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(announcement));
	} catch {
		// ignore
	}
};

const BANNER_TONES = {
	info: "border-semantic-info/25 bg-semantic-info/10",
	warning: "border-semantic-warning/30 bg-semantic-warning/10",
	promotion: "border-secondary-golden-honey/30 bg-secondary-golden-honey/10",
};

const BANNER_DOTS = {
	info: "bg-semantic-info",
	warning: "bg-semantic-warning",
	promotion: "bg-secondary-golden-honey",
};

// Small storefront bulletin. Failures are intentionally silent — the storefront
// should never break or show an error just because an announcement is missing.
const AnnouncementBanner = () => {
	const { axios } = useAppContext();
	const [announcement, setAnnouncement] = useState(null);

	useEffect(() => {
		let active = true;
		try {
			if (sessionStorage.getItem(DISMISSED_KEY)) return undefined;
		} catch {
			// sessionStorage can be unavailable (private mode); ignore.
		}

		const showFallback = () => {
			if (!active) return;
			const fallback = readCachedAnnouncement();
			cacheAnnouncement(fallback);
			setAnnouncement(fallback);
		};

		axios
			.get("/api/announcements/active", { suppressGlobalErrorToast: true })
			.then(({ data }) => {
				if (!active) return;
				const list =
					data?.success && Array.isArray(data.announcements)
						? data.announcements
						: [];
				if (list.length === 0) {
					showFallback();
					return;
				}
				cacheAnnouncement(list[0]);
				setAnnouncement(list[0]);
			})
			.catch(() => {
				// Silent by design, but keep the bulletin visible offline.
				showFallback();
			});

		return () => {
			active = false;
		};
	}, [axios]);

	if (!announcement) return null;

	const type = BANNER_TONES[announcement.type] ? announcement.type : "info";

	const dismiss = () => {
		try {
			sessionStorage.setItem(DISMISSED_KEY, "1");
		} catch {
			// ignore
		}
		setAnnouncement(null);
	};

	return (
		<div
			role="status"
			aria-live="polite"
			className={`relative border-b px-4 py-2.5 sm:px-8 lg:px-16 xl:px-24 ${BANNER_TONES[type]}`}
		>
			<div className="mx-auto flex max-w-[1600px] items-start gap-3 pr-8 text-primary-forest-green">
				<span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${BANNER_DOTS[type]}`} aria-hidden="true" />
				<div className="min-w-0">
					<p className="text-sm font-semibold leading-snug">{announcement.title}</p>
					{announcement.body ? (
						<p className="mt-0.5 text-xs leading-relaxed text-primary-forest-green/75">{announcement.body}</p>
					) : null}
				</div>
				<span className="ml-auto hidden shrink-0 rounded-full border border-primary-forest-green/15 bg-primary-warm-white/60 px-2.5 py-0.5 text-[11px] font-medium capitalize sm:inline-block">
					{type}
				</span>
			</div>
			<button
				type="button"
				onClick={dismiss}
				aria-label="Dismiss announcement"
				className="absolute right-3 top-2 rounded-full px-2 text-xl leading-none text-primary-forest-green/60 transition hover:bg-primary-forest-green/10 hover:text-primary-forest-green sm:right-6"
			>
				×
			</button>
		</div>
	);
};

const Navbar = () => {
	const clerk = clerkEnabled ? useClerk() : null;
	const [open, setOpen] = useState(false);

	const {
		navigate,
		user,
		setUser,
		setIsAdmin,
		setShowUserLogin,
		setSearchQuery,
		searchQuery,
		getCartCount,
		isAdmin,
	} = useAppContext();

	const logout = async () => {
		try {
			if (clerk?.signOut) await clerk.signOut();
			setUser(null);
			setIsAdmin(false);
			setShowUserLogin(false);
			toast.success("Logged out successfully");
			navigate("/");
		} catch (error) {
			toast.error(error.message || "Logout failed");
		}
	};

	useEffect(() => {
		if (searchQuery.length > 0) {
			navigate("/products");
		}
	}, [searchQuery, navigate]);

	return (
		<>
		<nav className="flex items-center justify-between px-4 sm:px-8 lg:px-16 xl:px-24 py-4 border-b border-primary-forest-green bg-secondary-soft-beige text-primary-forest-green transition-all">
			<NavLink onClick={() => setOpen(false)} to={"/"}>
				<img className="h-10" src={assets.holisticAfLogoNoBg} alt="holisticAF logo" />
			</NavLink>

			<div className="hidden sm:flex items-center gap-6 lg:gap-8">
				<div className="hidden lg:flex items-center text-sm gap-2 border border-secondary-deep-forest px-3 rounded-full bg-primary-warm-white">
					<input
						onChange={(e) => setSearchQuery(e.target.value)}
						className="py-1.5 w-full bg-transparent outline-none placeholder-primary-forest-green"
						type="text"
						placeholder="search products"
					/>
					<img src={assets.search} alt="search" className="w-4 h-4 text-secondary-deep-forest" />
				</div>

				<NavLink to={"/"}>home</NavLink>
				<NavLink to={"/products"}>products</NavLink>
				<NavLink to={"/profile"}>my profile</NavLink>
				<NavLink to={"/contact"}>contact</NavLink>

				<ThemeToggle />

				<div onClick={() => navigate("/cart")} className="relative cursor-pointer">
					<img src={assets.cart} alt="cart" className="w-6 opacity-80 text-primary-sage-green" />
					{getCartCount() > 0 && (
						<button className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-primary-warm-white bg-secondary-golden-honey rounded-full ring-2 ring-primary-warm-white">
							{getCartCount()}
						</button>
					)}
				</div>

				{!clerkEnabled ? (
					<span className="text-xs px-3 py-1.5 rounded-full border border-primary-forest-green/30 text-primary-forest-green/70">
						Clerk key needed
					</span>
				) : !user ? (
					<button
						onClick={() => setShowUserLogin(true)}
						className="cursor-pointer px-8 py-2 bg-secondary-golden-honey text-white dark:text-[#111827] border border-primary-forest-green hover:opacity-90 transition rounded-full"
					>
						login
					</button>
				) : (
					<div className="flex items-center gap-3">
						<div className="relative group">
							<img
								src={clerk?.user?.imageUrl || assets.profile}
								className="w-10 h-10 rounded-full object-cover cursor-pointer outline-secondary-soft-beige"
								alt="profile"
							/>
							<ul className="hidden group-hover:block absolute top-10 right-0 bg-secondary-soft-beige shadow border border-primary-forest-green py-2.5 w-36 rounded-md text-sm z-40">
								<li onClick={() => navigate("/profile")} className="p-1.5 pl-3 hover:bg-primary-sage-green/20 cursor-pointer">
									my profile
								</li>
								<li onClick={() => navigate("/my-orders")} className="p-1.5 pl-3 hover:bg-primary-sage-green/20 cursor-pointer">
									my orders
								</li>
								{isAdmin && (
									<li onClick={() => navigate("/admin")} className="p-1.5 pl-3 hover:bg-primary-sage-green/20 cursor-pointer">
										admin
									</li>
								)}
								<li onClick={logout} className="p-1.5 pl-3 hover:bg-primary-sage-green/20 cursor-pointer">
									logout
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center gap-4 sm:hidden">
				<ThemeToggle />
				<div onClick={() => navigate("/cart")} className="relative cursor-pointer">
					<img src={assets.cart} alt="cart" className="w-6 opacity-80" />
					{getCartCount() > 0 && (
						<button className="absolute -top-2 -right-3 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-primary-warm-white bg-secondary-golden-honey rounded-full ring-2 ring-primary-warm-white">
							{getCartCount()}
						</button>
					)}
				</div>
				<button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="bg-transparent border-none cursor-pointer p-0">
					<img src={assets.menuGreen} alt="menu" />
				</button>
			</div>

			{open && (
				<div className="flex sm:hidden fixed inset-0 top-[60px] bg-secondary-soft-beige shadow-md py-8 flex-col items-center gap-3 px-5 text-2xl z-50 min-h-screen overflow-y-auto">
					<NavLink to={"/"} onClick={() => setOpen(false)}>home</NavLink>
					<NavLink to={"/products"} onClick={() => setOpen(false)}>products</NavLink>
					<NavLink to={"/profile"} onClick={() => setOpen(false)}>my profile</NavLink>
					<NavLink to={"/contact"} onClick={() => setOpen(false)}>contact</NavLink>
					{user && <NavLink to={"/my-orders"} onClick={() => setOpen(false)}>my orders</NavLink>}

					{!clerkEnabled ? (
						<p className="mt-6 text-sm text-center text-primary-forest-green/70 px-6">
							Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to enable sign-in.
						</p>
					) : !user ? (
						<button
							onClick={() => {
								setOpen(false);
								setShowUserLogin(true);
							}}
							className="cursor-pointer px-6 py-2 mt-8 bg-primary-forest-green text-primary-warm-white rounded-full text-lg border-none"
						>
							login
						</button>
					) : (
						<button
							onClick={() => {
								setOpen(false);
								logout();
							}}
							className="cursor-pointer px-6 py-2 mt-4 bg-primary-forest-green text-primary-warm-white rounded-full text-base border-none"
						>
							logout
						</button>
					)}
				</div>
			)}
		</nav>
		<AnnouncementBanner />
		</>
	);
};

export default Navbar;
