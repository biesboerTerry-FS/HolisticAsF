import React, { useEffect, useRef, useState } from "react";
import { assets, categories } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { getHttpErrorMessage } from "../../utils/http";

const MAX_IMAGES = 4;

function ImageThumbnail({ file, index, onRemove }) {
	const [preview] = useState(() => URL.createObjectURL(file));

	useEffect(() => () => URL.revokeObjectURL(preview), [preview]);

	return (
		<div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl border border-primary-forest-green/10 bg-secondary-soft-beige/70 shadow-sm">
			<img
				className="h-full w-full object-cover"
				src={preview}
				alt={`Attached product image ${index + 1}`}
			/>
			<button
				type="button"
				onClick={() => onRemove(index)}
				aria-label={`Remove image ${index + 1}`}
				title="Remove image"
				className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary-forest-green/80 text-sm leading-none text-primary-cream shadow transition hover:bg-semantic-error hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary-golden-honey"
			>
				×
			</button>
		</div>
	);
}

const AddInventory = () => {
	const [files, setFiles] = useState([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [offerPrice, setOfferPrice] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const nextFileId = useRef(0);

	const { axios } = useAppContext();

	const onFilesSelected = (event) => {
		const selected = Array.from(event.target.files || []);
		if (selected.length) {
			setFiles((previous) => {
				const remaining = MAX_IMAGES - previous.length;
				if (remaining <= 0) return previous;
				return [
					...previous,
					...selected.slice(0, remaining).map((file) => ({ id: ++nextFileId.current, file })),
				];
			});
		}
		// Reset the input so the same file can be selected again and the zone
		// immediately returns to its plain "upload" state.
		event.target.value = "";
	};

	const removeFile = (index) => {
		setFiles((previous) => previous.filter((_, fileIndex) => fileIndex !== index));
	};

	const onSubmitHandler = async (event) => {
		event.preventDefault();
		setError("");
		setSubmitting(true);
		try {
			const productData = {
				name,
				description: description.split("\n").filter(Boolean),
				category,
				price,
				offerPrice,
			};

			const formData = new FormData();
			formData.append("productData", JSON.stringify(productData));
			for (let index = 0; index < files.length; index++) {
				if (files[index]?.file) formData.append("images", files[index].file);
			}

			const { data } = await axios.post("/api/inventory/add-inventory", formData, {
				suppressGlobalErrorToast: true,
			});

			if (data.success) {
				toast.success(data.message || "Product added");
				setName("");
				setDescription("");
				setCategory("");
				setPrice("");
				setOfferPrice("");
				setFiles([]);
			} else {
				const message = data.message || data.error || "Failed to add product";
				setError(message);
				toast.error(message);
			}
		} catch (err) {
			const message = getHttpErrorMessage(err, "Failed to add product");
			setError(message);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="p-4 md:p-6 lg:p-8 text-primary-forest-green">
			<div className="mx-auto max-w-4xl space-y-5">
				<div className="rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-5 shadow-sm backdrop-blur">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-forest-green/50">Create</p>
					<h2 className="mt-1 text-2xl font-semibold tracking-tight">
						Add <span className="text-secondary-golden-honey">inventory</span>
					</h2>
					<p className="mt-1 text-sm text-primary-forest-green/65">
						Upload product images and details to add a new item to your catalog.
					</p>
				</div>

				{error ? (
					<div className="rounded-2xl border border-semantic-error/20 bg-semantic-error/10 p-4 text-sm text-semantic-error shadow-sm">
						{error}
					</div>
				) : null}

				<form
					onSubmit={onSubmitHandler}
					className="space-y-6 rounded-3xl border border-primary-forest-green/10 bg-primary-warm-white/75 p-4 shadow-sm backdrop-blur md:p-6"
				>
					<section>
						<div className="flex items-end justify-between gap-3">
							<div>
								<p className="text-sm font-semibold">Product images</p>
								<p className="mt-1 text-xs text-primary-forest-green/55">Upload up to 4 images. First image is typically used as the primary thumbnail.</p>
							</div>
						</div>
						<div className="mt-4 flex max-w-md flex-wrap items-start gap-2 sm:gap-3">
							{files.map((entry, index) => (
								<ImageThumbnail
									key={entry.id}
									file={entry.file}
									index={index}
									onRemove={removeFile}
								/>
							))}
							{files.length < MAX_IMAGES ? (
								<label htmlFor="product-images" className="group relative block w-24 shrink-0">
									<input
										onChange={onFilesSelected}
										accept="image/*"
										type="file"
										id="product-images"
										multiple
										hidden
									/>
									<div className="aspect-square overflow-hidden rounded-2xl border border-dashed border-primary-forest-green/20 bg-secondary-soft-beige/70 p-2 transition group-hover:border-secondary-golden-honey/50 group-hover:bg-primary-sage-green/5">
										<img
											className="h-full w-full cursor-pointer rounded-xl object-cover"
											src={assets.fileUpload}
											alt="Upload product"
										/>
									</div>
								</label>
							) : null}
						</div>
						<p className="mt-2 text-xs text-primary-forest-green/55">
							{files.length} of {MAX_IMAGES} images attached
						</p>
					</section>

					<section className="grid gap-4 md:grid-cols-2">
						<div className="flex flex-col gap-1.5 md:col-span-2">
							<label className="text-sm font-medium" htmlFor="product-name">Product name</label>
							<input
								onChange={(event) => setName(event.target.value)}
								value={name}
								id="product-name"
								type="text"
								placeholder="e.g. Organic chamomile tea"
								className="rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5 md:col-span-2">
							<label className="text-sm font-medium" htmlFor="product-description">Product description</label>
							<textarea
								onChange={(event) => setDescription(event.target.value)}
								value={description}
								id="product-description"
								rows={5}
								className="resize-y rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								placeholder="Add key details, benefits, or usage notes (one per line)"
							/>
						</div>

						<div className="flex flex-col gap-1.5 md:col-span-2">
							<label className="text-sm font-medium" htmlFor="category">Category</label>
							<select
								onChange={(event) => setCategory(event.target.value)}
								value={category}
								id="category"
								className="rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								required
							>
								<option value="">Select a category</option>
								{categories.map((item, index) => (
									<option key={index} value={item.path}>
										{item.path}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium" htmlFor="product-price">Price</label>
							<input
								onChange={(event) => setPrice(event.target.value)}
								value={price}
								id="product-price"
								type="number"
								min="0"
								step="0.01"
								placeholder="0.00"
								className="rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								required
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium" htmlFor="offer-price">Offer price</label>
							<input
								onChange={(event) => setOfferPrice(event.target.value)}
								value={offerPrice}
								id="offer-price"
								type="number"
								min="0"
								step="0.01"
								placeholder="0.00"
								className="rounded-xl border border-primary-forest-green/10 bg-secondary-soft-beige/80 px-4 py-3 outline-none transition focus:border-secondary-golden-honey/60 focus:ring-4 focus:ring-secondary-golden-honey/10"
								required
							/>
						</div>
					</section>

					<div className="flex flex-col gap-3 border-t border-primary-forest-green/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
						<p className="text-xs text-primary-forest-green/55">HTTP and network errors are displayed inline and as toast notifications.</p>
						<button
							disabled={submitting}
							className="inline-flex items-center justify-center rounded-full bg-primary-forest-green px-6 py-3 font-medium text-primary-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
						>
							{submitting ? "Adding product..." : "Add product"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddInventory;
