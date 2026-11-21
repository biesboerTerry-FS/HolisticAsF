import React, { useState } from "react";
import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import ThemeToggle from "../../components/ThemeToggle";
import toast from "react-hot-toast";

const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const AdminLayout = () => {
	const clerk = clerkEnabled ? useClerk() : null;
	const { navigate, isAdmin, isAuthLoading, setUser, setIsAdmin } = useAppContext();
	// Category groups that are collapsed. Default: all open.
	const [collapsed, setCollapsed] = useState({});

	const toggleGroup = (label) =>
		setCollapsed((current) => ({ ...current, [label]: !current[label] }));

	const sidebarGroups = [
		{
			label: "Overview",
			links: [
				{ name: "dashboard", path: "/admin", icon: assets.list },
				{ name: "orders", path: "/admin/orders", icon: assets.search },
			],
		},
		{
			label: "Inventory",
			links: [
				{ name: "inventory", path: "/admin/inventory", icon: assets.list },
				{ name: "add inventory", path: "/admin/add-inventory", icon: assets.addIcon },
			],
		},
		{
			label: "Operations",
			links: [{ name: "schedule", path: "/admin/schedule", icon: assets.list }],
		},
		{
			label: "HR",
			links: [
				{ name: "directory", path: "/admin/hr", icon: assets.profile },
				{ name: "payroll", path: "/admin/hr/payroll", icon: assets.coinIcon },
				{ name: "time off", path: "/admin/hr/time-off", icon: assets.list },
				{ name: "performance", path: "/admin/hr/performance", icon: assets.list },
				{ name: "hr settings", path: "/admin/hr/settings", icon: assets.list },
			],
		},
		{
			label: "Communication",
			links: [
				{ name: "messages", path: "/admin/messages", icon: assets.list },
				{ name: "announcements", path: "/admin/announcements", icon: assets.list },
			],
		},
		{
			label: "Employee",
			links: [
				{ name: "my portal", path: "/employee", icon: assets.profile },
			],
		},
	];

	const sidebarLinks = sidebarGroups.flatMap((group) => group.links);

	const logout = async () => {
		try {
			if (clerk?.signOut) await clerk.signOut();
			setUser(null);
			setIsAdmin(false);
			toast.success("Logged out");
		} catch {
			// ignore
		} finally {
			navigate("/");
		}
	};

	if (clerkEnabled && isAuthLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-secondary-soft-beige text-primary-forest-green">
				Verifying access...
			</div>
		);
	}

	if (clerkEnabled && !isAdmin) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(157,191,175,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(224,160,48,0.10),transparent_30%)] bg-secondary-soft-beige text-primary-forest-green">
			<header className="sticky top-0 z-30 border-b border-primary-forest-green/10 bg-primary-warm-white/75 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
					<Link to="/" className="group flex items-center gap-3">
						<div className="rounded-xl p-1.5 transition">
							<img className="h-8 w-auto" src={assets.holisticAfLogoNoBg} alt="holisticAF logo" />
						</div>
						<div className="leading-tight">
							<h1 className="text-sm font-semibold tracking-tight md:text-base">
								admin <span className="text-secondary-golden-honey">portal</span>
							</h1>
							<p className="text-xs text-primary-forest-green/55">Operations dashboard</p>
						</div>
					</Link>
					<div className="flex items-center gap-2 md:gap-3">
						<div className="hidden items-center rounded-full border border-primary-forest-green/10 bg-secondary-soft-beige/70 px-3 py-1.5 text-xs text-primary-forest-green/70 sm:flex">
							{clerkEnabled ? "Clerk enabled" : "Local dev mode"}
						</div>
						<ThemeToggle />
						<button
							onClick={logout}
							className="rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-3.5 py-1.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-sage-green/15 hover:shadow"
						>
							Logout
						</button>
					</div>
				</div>
			</header>

			<div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-7xl">
				<aside className="fixed left-0 top-[65px] z-20 hidden h-[calc(100vh-65px)] w-64 shrink-0 overflow-y-auto border-r border-primary-forest-green/10 bg-primary-warm-white/45 p-4 backdrop-blur [scrollbar-width:thin] md:block lg:left-[max(0px,calc((100vw-80rem)/2))]">
					<nav className="flex flex-col gap-2">
						{sidebarGroups.map((group) => {
							const isCollapsed = Boolean(collapsed[group.label]);
							return (
								<div key={group.label} className="flex flex-col gap-1.5">
									<button
										type="button"
										onClick={() => toggleGroup(group.label)}
										aria-expanded={!isCollapsed}
										aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${group.label} category`}
										className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-forest-green/45 transition hover:bg-primary-sage-green/15 hover:text-primary-forest-green/75"
									>
										<span>{group.label}</span>
										<span className={`text-xs transition-transform ${isCollapsed ? "-rotate-90" : ""}`}>▾</span>
									</button>
									{!isCollapsed && (
										<div className="flex flex-col gap-1.5">
											{group.links.map((item) => (
												<NavLink
													to={item.path}
													key={item.name}
													end
													className={({ isActive }) =>
														`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
															isActive
																? "bg-primary-forest-green text-primary-cream shadow-sm"
																: "text-primary-forest-green/75 hover:bg-primary-sage-green/15 hover:text-primary-forest-green"
														}`
													}
												>
													{({ isActive }) => (
														<>
															<span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${isActive ? "border-primary-cream/20 bg-primary-cream/10" : "border-primary-forest-green/10 bg-secondary-soft-beige/70"}`}>
																<img className={`h-4 w-4 ${isActive ? "brightness-0 invert" : "opacity-75"}`} src={item.icon} alt="" />
															</span>
															<span className="capitalize font-medium">{item.name}</span>
														</>
													)}
												</NavLink>
											))}
										</div>
									)}
								</div>
							);
						})}
					</nav>
					<div className="mt-6 rounded-2xl border border-primary-forest-green/10 bg-gradient-to-br from-primary-sage-green/15 to-secondary-golden-honey/10 p-4 text-xs text-primary-forest-green/70 shadow-sm">
						<p className="font-semibold text-primary-forest-green">Admin tips</p>
						<ul className="mt-2 space-y-1.5">
							<li>• Monitor pending orders daily</li>
							<li>• Keep employee schedules current</li>
							<li>• Use dark mode for low-light work</li>
						</ul>
					</div>
				</aside>

				<div className="min-w-0 flex-1 md:ml-64">
					<div className="border-b border-primary-forest-green/10 bg-primary-warm-white/40 px-2 py-2 backdrop-blur md:hidden">
						<nav className="flex gap-2 overflow-x-auto px-2 pb-1">
							{sidebarLinks.map((item) => (
								<NavLink
									to={item.path}
									key={item.name}
									end
									className={({ isActive }) =>
										`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
											isActive
												? "bg-primary-forest-green text-primary-cream"
												: "border border-primary-forest-green/10 bg-primary-warm-white/70 text-primary-forest-green/75"
										}`
									}
								>
									{item.name}
								</NavLink>
							))}
						</nav>
					</div>
					<main className="min-w-0">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;
