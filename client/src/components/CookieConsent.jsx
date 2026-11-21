import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsent, hasConsentDecision, onConsentOpen, setConsent } from "../lib/cookieConsent";

// Lightweight consent banner with separate analytics/marketing toggles.
const CookieConsent = () => {
	const [visible, setVisible] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [analytics, setAnalytics] = useState(false);
	const [marketing, setMarketing] = useState(false);

	useEffect(() => {
		const existing = getConsent();
		if (!hasConsentDecision()) {
			setVisible(true);
			setAnalytics(Boolean(existing?.analytics));
			setMarketing(Boolean(existing?.marketing));
		}
		return onConsentOpen(() => {
			const current = getConsent();
			setAnalytics(Boolean(current?.analytics));
			setMarketing(Boolean(current?.marketing));
			setShowDetails(true);
			setVisible(true);
		});
	}, []);

	const save = (nextAnalytics, nextMarketing, decision) => {
		setConsent({ analytics: nextAnalytics, marketing: nextMarketing, decision });
		setVisible(false);
		setShowDetails(false);
	};

	if (!visible) return null;

	const secondary =
		"rounded-full border border-primary-forest-green/30 px-4 py-2 text-sm font-semibold text-primary-forest-green transition hover:bg-primary-forest-green/10";
	const primary =
		"rounded-full bg-secondary-golden-honey px-4 py-2 text-sm font-bold text-primary-warm-white transition hover:opacity-90 dark:text-[#111827]";
	const checkbox = "h-4 w-4 accent-secondary-golden-honey cursor-pointer";

	return (
		<div
			role="dialog"
			aria-live="polite"
			aria-label="Cookie preferences"
			className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-secondary-golden-honey bg-primary-warm-white px-5 py-4 text-primary-forest-green shadow-2xl"
		>
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="text-sm">
						<p className="text-base font-bold">Cookie &amp; storage preferences</p>
						<p className="mt-1 max-w-2xl leading-relaxed text-primary-forest-green/75">
							Essential storage keeps holisticAF working. With your
							permission we also use optional analytics and marketing
							storage. Change this any time from the footer.{" "}
							<Link
								to="/contact"
								className="underline hover:text-secondary-golden-honey"
								onClick={() => setVisible(false)}
							>
								Contact us
							</Link>
						</p>
					</div>
					<div className="flex shrink-0 flex-wrap gap-2">
						<button type="button" className={secondary} onClick={() => save(false, false, "declined")}>
							Reject optional
						</button>
						<button
							type="button"
							className={secondary}
							onClick={() => setShowDetails((open) => !open)}
							aria-expanded={showDetails}
						>
							{showDetails ? "Hide options" : "Manage"}
						</button>
						<button type="button" className={primary} onClick={() => save(true, true, "accepted")}>
							Accept all
						</button>
					</div>
				</div>

				{showDetails && (
					<div className="mt-4 grid gap-3 rounded-xl border border-primary-forest-green/15 bg-secondary-soft-beige p-4 sm:grid-cols-3">
						<label className="flex items-start justify-between gap-3">
							<span>
								<span className="block text-sm font-semibold">Essential</span>
								<span className="block text-xs text-primary-forest-green/70">
									Required for sign-in, cart and checkout. Always on.
								</span>
							</span>
							<input type="checkbox" checked disabled aria-label="Essential storage always enabled" className={checkbox} />
						</label>
						<label className="flex items-start justify-between gap-3">
							<span>
								<span className="block text-sm font-semibold">Analytics</span>
								<span className="block text-xs text-primary-forest-green/70">
									Help us see which products are popular.
								</span>
							</span>
							<input
								type="checkbox"
								checked={analytics}
								onChange={(event) => setAnalytics(event.target.checked)}
								aria-label="Allow analytics storage"
								className={checkbox}
							/>
						</label>
						<label className="flex items-start justify-between gap-3">
							<span>
								<span className="block text-sm font-semibold">Marketing</span>
								<span className="block text-xs text-primary-forest-green/70">
									Remember preferences for newsletters and offers.
								</span>
							</span>
							<input
								type="checkbox"
								checked={marketing}
								onChange={(event) => setMarketing(event.target.checked)}
								aria-label="Allow marketing storage"
								className={checkbox}
							/>
						</label>
						<div className="flex justify-end sm:col-span-3">
							<button type="button" className={primary} onClick={() => save(analytics, marketing, "custom")}>
								Save preferences
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CookieConsent;
