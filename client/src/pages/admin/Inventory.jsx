import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Inventory = () => {
	const { products, currency, axios, fetchProducts } = useAppContext();

	// const toggleStock = async (id, inStock) => {
	// 	try {
	// 		const { data } = await axios.post("/api/inventory/stock", {
	// 			id,
	// 			inStock,
	// 		});
	// 		if (data.success) {
	// 			fetchProducts();
	// 			toast.success(data.message);
	// 		} else {
	// 			toast.error(data.message);
	// 		}
	// 	} catch (error) {
	// 		toast.error(error.message);
	// 	}
	// };

	return (
		<div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
			<div className="w-full md:p-10 p-4">
				<h2 className="pb-4 text-lg font-medium">
					all{" "}
					<span className="text-secondary-golden-honey">
						products
					</span>
				</h2>
				<div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-secondary-soft-beige border border-primary-forest-green">
					<table className="w-full border-collapse">
						<thead className="text-primary-forest-green text-sm text-left">
							<tr>
								<th className="px-4 py-3 font-semibold w-1/2">
									product
								</th>
								<th className="px-4 py-3 font-semibold w-1/8">
									category
								</th>
								<th className="px-4 py-3 font-semibold w-1/8 hidden md:table-cell">
									price
								</th>
								<th className="px-4 py-3 font-semibold w-1/8 hidden md:table-cell">
									selling price
								</th>
								<th className="px-4 py-3 font-semibold w-1/8">
									in stock
								</th>
							</tr>
						</thead>
						<tbody className="text-sm text-primary-forest-green">
							{products.map((product) => (
								<tr
									key={product._id}
									className="border-t border-primary-forest-green/20"
								>
									<td className="md:px-8 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
										<div className="border border-primary-forest-green rounded overflow-hidden">
											<img
												src={product.image[0]}
												alt="Product"
												className="w-16"
											/>
										</div>
										<span className="truncate max-sm:hidden w-full">
											{product.description}
										</span>
									</td>
									<td className="px-4 py-3">
										{product.category}
									</td>
									<td className="px-4 py-3 max-sm:hidden">
										{currency} {product.price}
									</td>
									<td className="px-4 py-3 max-sm:hidden">
										{currency} {product.offerPrice}
									</td>
									{/* <td className="px-4 py-3">
										<label className="relative inline-flex items-center cursor-pointer text-primary-forest-green gap-3">
											<input
												type="checkbox"
												className="sr-only peer"
												checked={product.inStock}
												onChange={() =>
													toggleStock(
														product._id,
														!product.inStock,
													)
												}
											/>
											<div className="w-12 h-7 bg-primary-sage-green rounded-full peer peer-checked:bg-primary-forest-green transition-colors duration-200"></div>
											<span className="dot absolute left-1 top-1 w-5 h-5 bg-secondary-golden-honey rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
										</label>
									</td> */}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Inventory;
