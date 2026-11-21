import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { ensureDemoAdminToken } from "../../../utils/demoAuth";

const tabs = [
	{ name: "Employee directory", to: "/admin/hr", end: true },
	{ name: "Payroll", to: "/admin/hr/payroll", end: false },
	{ name: "Time off", to: "/admin/hr/time-off", end: false },
	{ name: "Performance", to: "/admin/hr/performance", end: false },
	{ name: "Settings", to: "/admin/hr/settings", end: false },
];

const HrShell = () => {
	const { axios } = useAppContext();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Mount HR pages only after the admin JWT cookie exists, so their first
		// request is authenticated even on a hard navigation to /admin/hr.
		let active = true;
		ensureDemoAdminToken(axios).finally(() => {
			if (active) setReady(true);
		});
		return () => {
			active = false;
		};
	}, [axios]);

	return (
		<div className="p-4 text-primary-forest-green md:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl space-y-6">
				<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">
						Admin only
					</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">
						Human <span className="text-secondary-golden-honey">resources</span>
					</h2>
					<p className="mt-1 text-sm text-primary-forest-green/65">
						Manage the team directory, payroll runs, time-off approvals and performance notes.
					</p>
				</div>

				<nav
					aria-label="HR sections"
					data-testid="hr-subnav"
					className="flex gap-2 overflow-x-auto rounded-2xl border border-primary-forest-green/10 bg-primary-warm-white/60 p-2 backdrop-blur"
				>
					{tabs.map((tab) => (
						<NavLink
							key={tab.to}
							to={tab.to}
							end={tab.end}
							className={({ isActive }) =>
								`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
									isActive
										? "bg-primary-forest-green text-primary-cream shadow-sm"
										: "text-primary-forest-green/70 hover:bg-primary-sage-green/15 hover:text-primary-forest-green"
								}`
							}
						>
							{tab.name}
						</NavLink>
					))}
				</nav>

				{ready ? (
					<Outlet />
				) : (
					<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/70 p-10 text-center text-sm text-primary-forest-green/60">
						Preparing HR workspace…
					</div>
				)}
			</div>
		</div>
	);
};

export default HrShell;
