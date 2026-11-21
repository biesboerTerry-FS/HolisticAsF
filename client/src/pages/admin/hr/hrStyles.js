// Shared styling + formatting helpers for the HR admin pages.

export const inputClass =
	"w-full rounded-xl border border-primary-forest-green/12 bg-secondary-soft-beige/70 px-3 py-2.5 text-sm outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10";

export const primaryButton =
	"rounded-full bg-primary-forest-green px-4 py-2.5 text-sm font-medium text-primary-cream transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButton =
	"rounded-full border border-primary-forest-green/15 bg-primary-warm-white/70 px-4 py-2.5 text-sm font-medium text-primary-forest-green transition hover:bg-primary-sage-green/15 disabled:opacity-60";

export const formatDate = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
};

export const formatMoney = (value, currency = "$") =>
	`${currency}${Number(value || 0).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
