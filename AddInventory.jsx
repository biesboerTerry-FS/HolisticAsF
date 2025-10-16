import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import fileUpload from "../../assets/fileUpload.svg";

const AddInventory = () => {
	const [files, setFiles] = useState([]);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [salePrice, setSalePrice] = useState("");

	// const { axios } = useAppContext();

	// const onSubmitHandler = async (event) => {
	// 	try {
	// 		event.preventDefault();

	// 		const productData = {
	// 			name,
	// 			description: description.split("\n"),
	// 			category,
	// 			price,
	// 			salePrice,
	// 		};

	// 		const formData = new FormData();
	// 		formData.append("productData", JSON.stringify(productData));
	// 		for (let index = 0; index < files.length; index++) {
	// 			formData.append("images", files[index]);
	// 		}

	// 		const { data } = await axios.post("/api/product/add", formData);

	// 		if (data.success) {
	// 			toast.success(data.message);
	// 			setName("");
	// 			setDescription("");
	// 			setCategory("");
	// 			setPrice("");
	// 			setSalePrice("");
	// 			setFiles([]);
	// 		} else {
	// 			toast.error(data.message);
	// 		}
	// 	} catch (error) {
	// 		toast.error(error.message);
	// 	}
	// };

	return (
		<div className="no-scrollbar h-[95vh] overflow-y-scroll flex flex-col justify-between flex-1">
			<form
				onSubmit={onSubmitHandler}
				className="md:p-10 p-4 space-y-5 max-w-lg"
			>
				<div>
					<div>
						<h2 className="text-lg">
							Add{" "}
							<span className="text-[#8cae8c] text-lg">
								Products
							</span>
						</h2>
					</div>

					<p className="text-base font-medium">
						Product <span className="text-[#8cae8c] "> Images</span>
					</p>
					<div className="flex flex-wrap items-center gap-3 mt-2">
						{/* {Array(4)
							.fill("")
							.map((_, index) => (
								<label key={index} htmlFor={`image${index}`}>
									<input
										onChange={(e) => {
											const updatedFiles = [...files];
											updatedFiles[index] =
												e.target.files[0];
											setFiles(updatedFiles);
										}}
										type="file"
										id={`image${index}`}
										hidden
									/>
									<img
										className="max-w-24 cursor-pointer"
										src={
											files[index]
												? URL.createObjectURL(
														files[index]
												  )
												: fileUpload
										}
										alt="uploadArea"
										width={100}
										height={100}
									/>
								</label>
							))} */}
					</div>
				</div>
				<div className="flex flex-col gap-1 max-w-md">
					<label
						className="text-base font-medium"
						htmlFor="product-name"
					>
						Product
						<span className="text-[#8cae8c] "> Name</span>
					</label>
					<input
						onChange={(e) => setName(e.target.value)}
						value={name}
						id="product-name"
						type="text"
						placeholder="Type here"
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
						required
					/>
				</div>
				<div className="flex flex-col gap-1 max-w-md">
					<label
						className="text-base font-medium"
						htmlFor="product-description"
					>
						Product
						<span className="text-[#8b4513]"> Description</span>
					</label>
					<textarea
						onChange={(e) => setDescription(e.target.value)}
						value={description}
						id="product-description"
						rows={4}
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
						placeholder="Type here"
					></textarea>
				</div>
				<div className="w-full flex flex-col gap-1">
					<label className="text-base font-medium" htmlFor="category">
						<p>
							Product{" "}
							<span className="text-[#8cae8c] ">Category</span>
						</p>
					</label>
					<select
						onChange={(e) => setCategory(e.target.value)}
						value={category}
						id="category"
						className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
					>
						<option value="">Select Category</option>
						{/* {categories.map((item, index) => (
							<option key={index} value={item.path}>
								{item.path}
							</option>
						))} */}
					</select>
				</div>
				<div className="flex items-center gap-5 flex-wrap">
					<div className="flex-1 flex flex-col gap-1 w-32">
						<label
							className="text-base font-medium"
							htmlFor="product-price"
						>
							Product
							<span className="text-[#8cae8c] "> Price</span>
						</label>
						<input
							onChange={(e) => setPrice(e.target.value)}
							value={price}
							id="product-price"
							type="number"
							placeholder="$0.00"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							required
						/>
					</div>
					<div className="flex-1 flex flex-col gap-1 w-32">
						<label
							className="text-base font-medium"
							htmlFor="sale-price"
						>
							sale
							<span className="text-[#8cae8c] "> Price</span>
						</label>
						<input
							onChange={(e) => setSalePrice(e.target.value)}
							value={salePrice}
							id="sale-price"
							type="number"
							placeholder="$0.00"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							required
						/>
					</div>
				</div>
				{/* 
				<div className="flex items-center gap-5 flex-wrap">
					<div className="flex-1 flex flex-col gap-1 w-32">
						<label
							className="text-base font-medium"
							htmlFor="product-price"
						>
							Quantity Added
						</label>
						<input
							onChange={(e) => setQuantityAdded(e.target.value)}
							value={quantityAdded}
							id="quantity-added"
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
							required
						/>
					</div>
					<div className="flex-1 flex flex-col gap-1 w-32">
						<label
							className="text-base font-medium"
							htmlFor="sale-price"
						>
							Total In Stock
						</label>
						<p
							// onChange={(e) => setTotalInStock({})}
							// value={totalInStock}
							id="total-stock"
							type="number"
							placeholder="0"
							className="outline-none md:py-2.5 py-2 px-3 rounded "
						></p>
					</div>
				</div> */}

				<button
					onSubmit={onSubmitHandler}
					className="px-8 py-2.5 bg-[#2196f3] text-[#f9f9f9] font-medium rounded"
				>
					Add
				</button>
			</form>
		</div>
	);
};

export default AddInventory;
