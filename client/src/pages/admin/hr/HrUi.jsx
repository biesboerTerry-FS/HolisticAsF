import React from "react";

export const HrHeader = ({ eyebrow = "People ops", title, accent, description, actions }) => (
	<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur md:p-6">
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div>
				<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">
					{eyebrow}
				</p>
				<h2 className="mt-1 text-2xl font-semibold tracking-tight">
					{title} {accent ? <span className="text-secondary-golden-honey">{accent}</span> : null}
				</h2>
				{description ? (
					<p className="mt-1 max-w-2xl text-sm text-primary-forest-green/65">{description}</p>
				) : null}
			</div>
			{actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
		</div>
	</div>
);

const PILL_STYLES = {
	active: "border-semantic-success/25 bg-semantic-success/10 text-semantic-success",
	inactive: "border-primary-forest-green/15 bg-secondary-soft-beige/70 text-primary-forest-green/60",
	paid: "border-semantic-success/25 bg-semantic-success/10 text-semantic-success",
	pending: "border-secondary-golden-honey/30 bg-secondary-golden-honey/15 text-secondary-earthy-brown",
	approved: "border-semantic-success/25 bg-semantic-success/10 text-semantic-success",
	denied: "border-semantic-error/25 bg-semantic-error/10 text-semantic-error",
};

export const Pill = ({ status, children }) => (
	<span
		className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${
			PILL_STYLES[status] || PILL_STYLES.pending
		}`}
	>
		{children || status}
	</span>
);

export const OfflineBanner = ({ offline }) =>
	offline ? (
		<div className="rounded-2xl border border-secondary-golden-honey/30 bg-secondary-golden-honey/10 p-3 text-xs text-secondary-earthy-brown">
			Backend unavailable — showing the local demo copy. Changes are saved in this browser.
		</div>
	) : null;

export const Modal = ({ title, subtitle, onClose, children, wide = false, testId }) => (
	<div
		className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-primary-forest-green/40 p-4 backdrop-blur-sm md:p-8"
		onMouseDown={(event) => {
			if (event.target === event.currentTarget) onClose();
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={title}
			data-testid={testId}
			className={`my-auto w-full ${wide ? "max-w-3xl" : "max-w-xl"} rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white p-5 shadow-2xl md:p-6`}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
					{subtitle ? <p className="mt-0.5 text-xs text-primary-forest-green/60">{subtitle}</p> : null}
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close dialog"
					className="rounded-full border border-primary-forest-green/15 px-2.5 py-1 text-sm text-primary-forest-green/70 transition hover:bg-secondary-soft-beige"
				>
					✕
				</button>
			</div>
			<div className="mt-5">{children}</div>
		</div>
	</div>
);

export const Field = ({ label, hint, children, className = "" }) => (
	<label className={`block ${className}`}>
		<span className="mb-1 block text-xs font-medium text-primary-forest-green/70">{label}</span>
		{children}
		{hint ? <span className="mt-1 block text-[11px] text-primary-forest-green/45">{hint}</span> : null}
	</label>
);

export const EmptyState = ({ children }) => (
	<div className="rounded-2xl border border-dashed border-primary-forest-green/15 p-8 text-center text-sm text-primary-forest-green/60">
		{children}
	</div>
);
