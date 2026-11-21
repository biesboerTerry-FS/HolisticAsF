import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import {
	bootstrapProfile,
	readLocalAddresses,
	readLocalPayments,
	readLocalProfile,
	writeLocalAddresses,
	writeLocalPayments,
	saveProfile,
	addAddress,
	editAddress,
	removeAddress,
	makeDefaultAddress,
	addPaymentMethod,
	removePaymentMethod,
	makeDefaultPaymentMethod,
} from "../services/profileApi";

const CARD_BRANDS = ["Test card", "Visa", "Mastercard", "Amex"];

const inputClass =
	"mt-1 w-full rounded-lg border border-primary-forest-green/25 bg-primary-warm-white px-3 py-2 text-sm text-primary-forest-green outline-none transition placeholder:text-primary-forest-green/45 focus:border-secondary-golden-honey focus:ring-2 focus:ring-secondary-golden-honey/25";
const primaryButton =
	"cursor-pointer rounded-full bg-primary-forest-green px-4 py-2 text-sm font-semibold text-primary-warm-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const ghostButton =
	"cursor-pointer rounded-full border border-primary-forest-green/30 px-4 py-2 text-sm font-semibold text-primary-forest-green transition hover:bg-primary-forest-green/10";
const cardClass =
	"rounded-2xl border border-primary-forest-green/15 bg-primary-cream/70 p-5 shadow-sm sm:p-6";

const Field = ({ id, label, type = "text", ...props }) => (
	<div>
		<label
			htmlFor={id}
			className="block text-xs font-semibold uppercase tracking-wide text-primary-forest-green/65"
		>
			{label}
		</label>
		<input id={id} type={type} className={inputClass} {...props} />
	</div>
);

const SectionHeading = ({ title, description, action }) => (
	<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
		<div>
			<h2 className="text-xl font-semibold text-primary-forest-green">{title}</h2>
			{description ? (
				<p className="mt-1 text-sm text-primary-forest-green/65">{description}</p>
			) : null}
		</div>
		{action}
	</div>
);

const Profile = () => {
	const { axios, user } = useAppContext();

	const [profile, setProfile] = useState(() => readLocalProfile(user));
	const [addresses, setAddresses] = useState(() => readLocalAddresses());
	const [paymentMethods, setPaymentMethods] = useState(() => readLocalPayments());
	const [backend, setBackend] = useState(false);
	const [loading, setLoading] = useState(true);

	const [editingProfile, setEditingProfile] = useState(false);
	const [profileDraft, setProfileDraft] = useState(profile);

	const [addressForm, setAddressForm] = useState(null);
	const [savingAddress, setSavingAddress] = useState(false);

	const [showCardForm, setShowCardForm] = useState(false);
	const [cardDraft, setCardDraft] = useState({
		label: "",
		brand: "Test card",
		last4: "",
		exp: "",
	});

	useEffect(() => {
		let active = true;
		bootstrapProfile(axios, user).then((result) => {
			if (!active) return;
			setProfile(result.profile);
			setProfileDraft(result.profile);
			setAddresses(result.addresses);
			setPaymentMethods(result.paymentMethods);
			setBackend(result.backend);
			setLoading(false);
		});
		return () => {
			active = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [axios, user?.clerkId || user?.id]);

	const report = (result, message) => {
		if (result.backend) {
			setBackend(true);
			toast.success(message);
		} else {
			setBackend(false);
			toast.success(`${message} — saved locally`);
		}
	};

	const startProfileEdit = () => {
		setProfileDraft(profile);
		setEditingProfile(true);
	};

	const handleProfileSave = async (event) => {
		event.preventDefault();
		const name = profileDraft.name.trim();
		const email = profileDraft.email.trim();

		if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
			toast.error("Enter a name and a valid email address.");
			return;
		}

		const next = { name, email, phone: profileDraft.phone.trim() };
		const result = await saveProfile(axios, backend, next);
		setProfile(result.profile);
		setEditingProfile(false);
		report(result, "Profile saved");
	};

	const blankAddress = () => ({
		label: "Home",
		firstName: profile.name.split(" ")[0] || "",
		lastName: profile.name.split(" ").slice(1).join(" ") || "",
		line1: "",
		line2: "",
		city: "",
		state: "",
		zip: "",
		country: "US",
		phone: profile.phone || "",
		email: profile.email || "",
		isDefault: addresses.length === 0,
	});

	const openAddressForm = (address = null) => {
		setAddressForm({
			mode: address ? "edit" : "add",
			id: address?._id || address?.id,
			values: address
				? {
						label: address.label || "Shipping",
						firstName: address.firstName || "",
						lastName: address.lastName || "",
						line1: address.line1 || address.streetLine1 || "",
						line2: address.line2 || address.streetLine2 || "",
						city: address.city || "",
						state: address.state || "",
						zip: address.zip || address.zipCode || "",
						country: address.country || "US",
						phone: address.phone || "",
						email: address.email || profile.email || "",
						isDefault: Boolean(address.isDefault),
					}
				: blankAddress(),
		});
	};

	const handleAddressChange = (event) => {
		const { name, value, type, checked } = event.target;
		setAddressForm((current) => ({
			...current,
			values: {
				...current.values,
				[name]: type === "checkbox" ? checked : value,
			},
		}));
	};

	const handleAddressSubmit = async (event) => {
		event.preventDefault();
		const values = addressForm.values;
		if (!values.line1 || !values.city || !values.state || !values.zip) {
			toast.error("Fill in the street, city, state and ZIP code.");
			return;
		}

		setSavingAddress(true);
		const payload = {
			...values,
			streetLine1: values.line1,
			streetLine2: values.line2,
			zipCode: values.zip,
		};

		let result;
		if (addressForm.mode === "edit") {
			result = await editAddress(axios, backend, addressForm.id, payload);
			if (result.backend) {
				setAddresses((current) => {
					const next = current.map((item) =>
						(item._id || item.id) === addressForm.id ? result.address : item,
					);
					const normalized = payload.isDefault
						? next.map((item) => ({
								...item,
								isDefault: (item._id || item.id) === addressForm.id,
							}))
						: next;
					writeLocalAddresses(normalized);
					return normalized;
				});
			} else {
				setAddresses((current) => {
					const next = current.map((item) => {
						if ((item._id || item.id) !== addressForm.id) return item;
						return {
							...item,
							...payload,
							_id: item._id || item.id,
							id: item.id || item._id,
						};
					});
					const normalized = payload.isDefault
						? next.map((item) => ({
								...item,
								isDefault: (item._id || item.id) === addressForm.id,
							}))
						: next;
					writeLocalAddresses(normalized);
					return normalized;
				});
			}
		} else {
			result = await addAddress(axios, backend, payload);
			setAddresses((current) => {
				const withoutOldDefault = payload.isDefault
					? current.map((item) => ({ ...item, isDefault: false }))
					: current;
				const next = [...withoutOldDefault, result.address];
				writeLocalAddresses(next);
				return next;
			});
		}

		setSavingAddress(false);
		setAddressForm(null);
		report(result, addressForm.mode === "edit" ? "Address updated" : "Address added");
	};

	const handleDeleteAddress = async (address) => {
		const id = address._id || address.id;
		if (!window.confirm(`Remove the "${address.label || "shipping"}" address?`)) return;
		const result = await removeAddress(axios, backend, id);
		setAddresses((current) => {
			const next = current.filter((item) => (item._id || item.id) !== id);
			if (address.isDefault && next.length > 0) {
				next[0] = { ...next[0], isDefault: true };
			}
			writeLocalAddresses(next);
			return next;
		});
		report(result, "Address removed");
	};

	const handleDefaultAddress = async (address) => {
		const id = address._id || address.id;
		const result = await makeDefaultAddress(axios, backend, id);
		setAddresses((current) => {
			const next = current.map((item) => ({
				...item,
				isDefault: (item._id || item.id) === id,
			}));
			writeLocalAddresses(next);
			return next;
		});
		report(result, "Default shipping address updated");
	};

	const handleCardSubmit = async (event) => {
		event.preventDefault();
		const last4 = cardDraft.last4.replace(/\D/g, "");
		if (last4.length !== 4) {
			toast.error("Enter exactly 4 digits (test card only).");
			return;
		}
		const exp = cardDraft.exp.trim();
		if (exp && !/^\d{2}\/\d{2}$/.test(exp)) {
			toast.error("Expiry must use MM/YY format.");
			return;
		}

		const payload = {
			label: cardDraft.label.trim() || "Test card",
			brand: cardDraft.brand,
			last4,
			exp,
			isDefault: paymentMethods.length === 0,
		};
		const result = await addPaymentMethod(axios, backend, payload);
		setPaymentMethods((current) => {
			const next = [
				...current.map((item) => ({
					...item,
					isDefault: payload.isDefault ? false : item.isDefault,
				})),
				result.method,
			];
			writeLocalPayments(next);
			return next;
		});
		setCardDraft({ label: "", brand: "Test card", last4: "", exp: "" });
		setShowCardForm(false);
		report(result, "Demo card added");
	};

	const handleDeleteCard = async (method) => {
		const id = method._id || method.id;
		const result = await removePaymentMethod(axios, backend, id);
		setPaymentMethods((current) => {
			const next = current.filter((item) => (item._id || item.id) !== id);
			if (method.isDefault && next.length > 0) {
				next[0] = { ...next[0], isDefault: true };
			}
			writeLocalPayments(next);
			return next;
		});
		report(result, "Demo card removed");
	};

	const handleDefaultCard = async (method) => {
		const id = method._id || method.id;
		const result = await makeDefaultPaymentMethod(axios, backend, id);
		setPaymentMethods((current) => {
			const next = current.map((item) => ({
				...item,
				isDefault: (item._id || item.id) === id,
			}));
			writeLocalPayments(next);
			return next;
		});
		report(result, "Default demo card updated");
	};

	return (
		<div className="mx-auto w-full max-w-6xl py-10 md:py-16">
			<header className="mb-8 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-golden-honey">
						your account
					</p>
					<h1 className="mt-2 text-3xl font-semibold text-primary-forest-green md:text-4xl">
						my profile
					</h1>
					<p className="mt-2 text-sm text-primary-forest-green/70">
						Manage your contact details, shipping addresses and demo payment methods.
					</p>
				</div>
				<p className="rounded-full border border-primary-forest-green/15 px-3 py-1 text-xs text-primary-forest-green/70" aria-live="polite">
					{loading
						? "loading…"
						: backend
							? "saved to your account"
							: "demo mode — saved locally"}
				</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Personal information */}
				<section className={`${cardClass} lg:col-span-1`} aria-labelledby="personal-info-heading">
					<SectionHeading
						title="Personal info"
						description="How we reach you about your order."
						action={
							!editingProfile ? (
								<button type="button" className={ghostButton} onClick={startProfileEdit}>
									edit
								</button>
							) : null
						}
					/>
					<h2 id="personal-info-heading" className="sr-only">
						Personal information
					</h2>

					{editingProfile ? (
						<form className="space-y-4" onSubmit={handleProfileSave}>
							<Field
								id="profile-name"
								label="Full name"
								value={profileDraft.name}
								onChange={(e) =>
									setProfileDraft((draft) => ({ ...draft, name: e.target.value }))
								}
								required
							/>
							<Field
								id="profile-email"
								label="Email"
								type="email"
								value={profileDraft.email}
								onChange={(e) =>
									setProfileDraft((draft) => ({ ...draft, email: e.target.value }))
								}
								required
							/>
							<Field
								id="profile-phone"
								label="Phone"
								type="tel"
								value={profileDraft.phone}
								onChange={(e) =>
									setProfileDraft((draft) => ({ ...draft, phone: e.target.value }))
								}
							/>
							<div className="flex gap-2 pt-1">
								<button type="submit" className={primaryButton}>
									save changes
								</button>
								<button
									type="button"
									className={ghostButton}
									onClick={() => setEditingProfile(false)}
								>
									cancel
								</button>
							</div>
						</form>
					) : (
						<dl className="divide-y divide-primary-forest-green/10 text-sm">
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-primary-forest-green/60">name</dt>
								<dd className="text-right font-medium text-primary-forest-green">{profile.name}</dd>
							</div>
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-primary-forest-green/60">email</dt>
								<dd className="break-all text-right font-medium text-primary-forest-green">{profile.email}</dd>
							</div>
							<div className="flex justify-between gap-4 py-3">
								<dt className="text-primary-forest-green/60">phone</dt>
								<dd className="text-right font-medium text-primary-forest-green">
									{profile.phone || <span className="opacity-60">not set</span>}
								</dd>
							</div>
						</dl>
					)}
				</section>

				{/* Addresses */}
				<section className={`${cardClass} lg:col-span-2`} aria-labelledby="addresses-heading">
					<SectionHeading
						title="Addresses"
						description="Your saved shipping destinations."
						action={
							<button
								type="button"
								className={primaryButton}
								onClick={() => openAddressForm()}
							>
								add address
							</button>
						}
					/>
					<h2 id="addresses-heading" className="sr-only">
						Saved addresses
					</h2>

					{addressForm ? (
						<form
							className="mb-6 rounded-xl border border-primary-forest-green/15 bg-primary-warm-white/50 p-4"
							onSubmit={handleAddressSubmit}
						>
							<p className="mb-4 text-sm font-semibold capitalize text-primary-forest-green">
								{addressForm.mode} address
							</p>
							<div className="grid gap-3 sm:grid-cols-2">
								<Field
									id="address-label"
									label="Label (e.g. Home)"
									name="label"
									value={addressForm.values.label}
									onChange={handleAddressChange}
									placeholder="Home"
								/>
								<Field
									id="address-country"
									label="Country"
									name="country"
									value={addressForm.values.country}
									onChange={handleAddressChange}
								/>
								<Field
									id="address-first-name"
									label="First name"
									name="firstName"
									value={addressForm.values.firstName}
									onChange={handleAddressChange}
								/>
								<Field
									id="address-last-name"
									label="Last name"
									name="lastName"
									value={addressForm.values.lastName}
									onChange={handleAddressChange}
								/>
								<div className="sm:col-span-2">
									<Field
										id="address-line1"
										label="Street address"
										name="line1"
										value={addressForm.values.line1}
										onChange={handleAddressChange}
										placeholder="123 Wellness Way"
										required
									/>
								</div>
								<div className="sm:col-span-2">
									<Field
										id="address-line2"
										label="Apartment, suite (optional)"
										name="line2"
										value={addressForm.values.line2}
										onChange={handleAddressChange}
									/>
								</div>
								<Field
									id="address-city"
									label="City"
									name="city"
									value={addressForm.values.city}
									onChange={handleAddressChange}
									required
								/>
								<Field
									id="address-state"
									label="State / region"
									name="state"
									value={addressForm.values.state}
									onChange={handleAddressChange}
									required
								/>
								<Field
									id="address-zip"
									label="ZIP / postal code"
									name="zip"
									value={addressForm.values.zip}
									onChange={handleAddressChange}
									required
								/>
								<Field
									id="address-phone"
									label="Phone"
									type="tel"
									name="phone"
									value={addressForm.values.phone}
									onChange={handleAddressChange}
								/>
								<Field
									id="address-email"
									label="Email"
									type="email"
									name="email"
									value={addressForm.values.email}
									onChange={handleAddressChange}
								/>
							</div>
							<label
								htmlFor="address-default"
								className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-primary-forest-green"
							>
								<input
									id="address-default"
									type="checkbox"
									name="isDefault"
									checked={addressForm.values.isDefault}
									onChange={handleAddressChange}
									className="h-4 w-4 accent-secondary-golden-honey"
								/>
								Use as my default shipping address
							</label>
							<div className="mt-4 flex gap-2">
								<button type="submit" className={primaryButton} disabled={savingAddress}>
									{savingAddress ? "saving…" : "save address"}
								</button>
								<button
									type="button"
									className={ghostButton}
									onClick={() => setAddressForm(null)}
								>
									cancel
								</button>
							</div>
						</form>
					) : null}

					{addresses.length === 0 && !addressForm ? (
						<p className="rounded-xl border border-dashed border-primary-forest-green/25 p-6 text-center text-sm text-primary-forest-green/70">
							No addresses saved yet. Add one to speed up checkout.
						</p>
					) : (
						<ul className="space-y-3">
							{addresses.map((address) => {
								const id = address._id || address.id;
								return (
									<li
										key={id}
										className="rounded-xl border border-primary-forest-green/15 bg-primary-warm-white/50 p-4"
									>
										<div className="flex flex-wrap items-start justify-between gap-3">
											<div>
												<p className="flex flex-wrap items-center gap-2 font-semibold text-primary-forest-green">
													{address.label || "Shipping"}
													{address.isDefault ? (
														<span className="rounded-full bg-secondary-golden-honey/15 px-2 py-0.5 text-[11px] font-semibold text-secondary-golden-honey">
															default
														</span>
													) : null}
												</p>
												<address className="mt-1 whitespace-pre-line text-sm not-italic leading-relaxed text-primary-forest-green/75">
													{[address.firstName, address.lastName].filter(Boolean).join(" ")}
													{"\n"}
													{address.line1 || address.streetLine1}
													{address.line2 || address.streetLine2
														? `, ${address.line2 || address.streetLine2}`
														: ""}
													{"\n"}
													{address.city}, {address.state} {address.zip || address.zipCode}
													{"\n"}
													{address.country || "US"}
												</address>
											</div>
											<div className="flex flex-wrap gap-2 text-xs">
												{!address.isDefault ? (
													<button
														type="button"
														className="cursor-pointer rounded-full border border-primary-forest-green/30 px-3 py-1 font-semibold text-primary-forest-green transition hover:bg-primary-forest-green/10"
														aria-label={`Set ${address.label || "shipping"} as default`}
														onClick={() => handleDefaultAddress(address)}
													>
														set default
													</button>
												) : null}
												<button
													type="button"
													className="cursor-pointer rounded-full border border-primary-forest-green/30 px-3 py-1 font-semibold text-primary-forest-green transition hover:bg-primary-forest-green/10"
													aria-label={`Edit ${address.label || "shipping"} address`}
													onClick={() => openAddressForm(address)}
												>
													edit
												</button>
												<button
													type="button"
													className="cursor-pointer rounded-full border border-semantic-error/40 px-3 py-1 font-semibold text-semantic-error transition hover:bg-semantic-error/10"
													aria-label={`Delete ${address.label || "shipping"} address`}
													onClick={() => handleDeleteAddress(address)}
												>
													delete
												</button>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</section>

				{/* Demo payment methods */}
				<section className={`${cardClass} lg:col-span-3`} aria-labelledby="payments-heading">
					<SectionHeading
						title="Payment methods"
						description="Demo cards only — nothing here is charged."
						action={
							<button
								type="button"
								className={ghostButton}
								onClick={() => setShowCardForm((value) => !value)}
								aria-expanded={showCardForm}
							>
								{showCardForm ? "cancel" : "add demo card"}
							</button>
						}
					/>
					<h2 id="payments-heading" className="sr-only">
						Demo payment methods
					</h2>

					<div
						role="note"
						className="mb-5 rounded-xl border border-secondary-golden-honey/30 bg-secondary-golden-honey/10 px-4 py-3 text-sm text-primary-forest-green"
					>
						<span className="font-semibold text-secondary-golden-honey">
							Test mode — no real payments.
						</span>{" "}
						Only masked demo metadata (brand, last 4 digits, expiry) is stored.
						Never enter real card details here.
					</div>

					{showCardForm ? (
						<form
							className="mb-6 grid gap-3 rounded-xl border border-primary-forest-green/15 bg-primary-warm-white/50 p-4 sm:grid-cols-2"
							onSubmit={handleCardSubmit}
						>
							<Field
								id="card-label"
								label="Card nickname (optional)"
								value={cardDraft.label}
								onChange={(e) =>
									setCardDraft((draft) => ({ ...draft, label: e.target.value }))
								}
								placeholder="Test card"
							/>
							<div>
								<label
									htmlFor="card-brand"
									className="block text-xs font-semibold uppercase tracking-wide text-primary-forest-green/65"
								>
									Brand
								</label>
								<select
									id="card-brand"
									className={inputClass}
									value={cardDraft.brand}
									onChange={(e) =>
										setCardDraft((draft) => ({ ...draft, brand: e.target.value }))
									}
								>
									{CARD_BRANDS.map((brand) => (
										<option key={brand} value={brand}>
											{brand}
										</option>
									))}
								</select>
							</div>
							<Field
								id="card-last4"
								label="Last 4 digits"
								inputMode="numeric"
								autoComplete="off"
								maxLength={4}
								pattern="[0-9]{4}"
								placeholder="4242"
								value={cardDraft.last4}
								onChange={(e) =>
									setCardDraft((draft) => ({
										...draft,
										last4: e.target.value.replace(/\D/g, "").slice(0, 4),
									}))
								}
								required
							/>
							<Field
								id="card-exp"
								label="Expiry (MM/YY, optional)"
								placeholder="12/30"
								maxLength={5}
								value={cardDraft.exp}
								onChange={(e) =>
									setCardDraft((draft) => ({ ...draft, exp: e.target.value }))
								}
							/>
							<div className="sm:col-span-2">
								<button type="submit" className={primaryButton}>
									save demo card
								</button>
							</div>
						</form>
					) : null}

					{paymentMethods.length === 0 && !showCardForm ? (
						<p className="rounded-xl border border-dashed border-primary-forest-green/25 p-6 text-center text-sm text-primary-forest-green/70">
							No demo cards yet.
						</p>
					) : (
						<ul className="grid gap-3 sm:grid-cols-2">
							{paymentMethods.map((method) => {
								const id = method._id || method.id;
								return (
									<li
										key={id}
										className="flex items-center justify-between gap-3 rounded-xl border border-primary-forest-green/15 bg-primary-warm-white/50 p-4"
									>
										<div>
											<p className="flex flex-wrap items-center gap-2 font-semibold text-primary-forest-green">
												{method.label || method.brand || "Test card"} •••• {method.last4}
												{method.isDefault ? (
													<span className="rounded-full bg-secondary-golden-honey/15 px-2 py-0.5 text-[11px] font-semibold text-secondary-golden-honey">
														default
													</span>
												) : null}
											</p>
											<p className="mt-1 text-xs text-primary-forest-green/65">
												{method.brand || "Test card"}
												{method.exp ? ` · expires ${method.exp}` : ""} · demo only
											</p>
										</div>
										<div className="flex shrink-0 gap-2 text-xs">
											{!method.isDefault ? (
												<button
													type="button"
													className="cursor-pointer rounded-full border border-primary-forest-green/30 px-3 py-1 font-semibold text-primary-forest-green transition hover:bg-primary-forest-green/10"
													aria-label={`Set card ending ${method.last4} as default`}
													onClick={() => handleDefaultCard(method)}
												>
													set default
												</button>
											) : null}
											<button
												type="button"
												className="cursor-pointer rounded-full border border-semantic-error/40 px-3 py-1 font-semibold text-semantic-error transition hover:bg-semantic-error/10"
												aria-label={`Remove demo card ending ${method.last4}`}
												onClick={() => handleDeleteCard(method)}
											>
												remove
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</section>
			</div>
		</div>
	);
};

export default Profile;
