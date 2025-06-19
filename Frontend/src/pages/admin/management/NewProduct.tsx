import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import toast from "react-hot-toast";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUpload } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const NewProduct = () => {
	const { user } = useSelector(
		(state: { userReducer: UserReducerInitialState }) => state.userReducer
	);

	const [name, setName] = useState<string>("");
	const [category, setCategory] = useState<string>("");
	const [price, setPrice] = useState<number>(0);
	const [stock, setStock] = useState<number>(0);
	const [brand, setBrand] = useState<string>("");
	const [originalPrice, setOriginalPrice] = useState<number>(0);
	const [description, setDescription] = useState<string>("");
	const [features, setFeatures] = useState<string>("");
	const [colors, setColors] = useState<string>("");
	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const [NewProductssssss] = useNewProductMutation();

	const navigate = useNavigate();

	const handleImageRemove = (index: number) => {
		const newImages = [...images];
		const newPreviews = [...imagePreviews];

		newImages.splice(index, 1);
		newPreviews.splice(index, 1);

		setImages(newImages);
		setImagePreviews(newPreviews);
	};

	const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		const validTypes = ["image/jpeg", "image/jpg", "image/png"];
		const selectedImages: File[] = [];
		const previews: string[] = [];

		for (const file of files) {
			if (!validTypes.includes(file.type)) {
				toast.error(`${file.name} is not a valid image file.`);
				continue;
			}

			selectedImages.push(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				if (typeof reader.result === "string") {
					previews.push(reader.result);
					setImagePreviews([...previews]);
				}
			};
			reader.readAsDataURL(file);
		}

		setImages(selectedImages);
	};

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!name || !images || !price || !category) {
				return toast.error("All field are required");
			}
			if (stock < 0) {
				return toast.error("Verify Stock value");
			}

			const formData = new FormData();

			formData.set("name", name);
			formData.set("price", String(price));
			formData.set("originalPrice", String(originalPrice));
			formData.set("stock", String(stock));
			formData.set("category", category);
			formData.set("brand", brand);
			formData.set("description", description);
			formData.set("features", features);
			formData.set("colors", colors);

			images.forEach((img) => {
				formData.append("images", img);
			});

			if (!user) return toast.error("User Not Found");

			const res = await NewProductssssss({ id: user._id!, formData });

			console.log("API Response:", res);

			responseToast(res, navigate, "/admin/products");
		} catch (error) {
			console.error("Product creation failed:", error);
		}
	};

	return (
		<div className="adminContainer">
			<AdminSidebar />
			<main className="productManagementContainer">
				<article className="product-form-container">
					<form
						onSubmit={submitHandler}
						className="product-form relative"
					>
						<h2 className="form-title">New Product</h2>
						<button
							type="button"
							onClick={() => navigate("/admin/products")}
							aria-label="Close new form"
							className="absolute top-2 right-2 text-gray-800 hover:text-gray-500"
							style={{ fontSize: "24px" }}
						>
							<IoCloseOutline />
						</button>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Name</label>
								<input
									required
									type="text"
									placeholder="Product Name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="form-input"
								/>
							</div>
							{/* Brand */}
							<div className="form-group">
								<label className="form-label">Brand</label>
								<input
									type="text"
									placeholder="Brand"
									value={brand}
									onChange={(e) => setBrand(e.target.value)}
									className="form-input"
								/>
							</div>{" "}
							<div className="form-group">
								<label htmlFor="name" className="form-label">
									Category
								</label>
								<input
									required
									type="text"
									placeholder="eg. Laptop, Food"
									value={category}
									onChange={(e) =>
										setCategory(e.target.value)
									}
									className="form-input"
								/>
							</div>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Price</label>
								<input
									required
									type="number"
									placeholder="Price"
									value={price}
									onChange={(e) =>
										setPrice(Number(e.target.value))
									}
									className="form-input"
								/>
							</div>

							{/* Original Price */}
							<div className="form-group">
								<label className="form-label">
									Original Price
								</label>
								<input
									type="number"
									placeholder="Original Price"
									value={originalPrice}
									onChange={(e) =>
										setOriginalPrice(Number(e.target.value))
									}
									className="form-input"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="name" className="form-label">
									Stock
								</label>
								<input
									required
									type="number"
									placeholder="Stock"
									value={stock}
									onChange={(e) =>
										setStock(Number(e.target.value))
									}
									className="form-input"
								/>
							</div>
						</div>
						<div className="form-row">
							{/* Description */}
							<div className="form-group">
								<label className="form-label">
									Description
								</label>
								<textarea
									placeholder="Product Description"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className="form-input"
									rows={1}
								/>
							</div>
							{/* Features */}
							<div className="form-group">
								<label className="form-label">
									Features (comma separated)
								</label>
								<input
									type="text"
									placeholder="e.g. Noise Cancellation, Waterproof"
									value={features}
									onChange={(e) =>
										setFeatures(e.target.value)
									}
									className="form-input"
								/>
							</div>
							{/* Colors */}
							<div className="form-group">
								<label className="form-label">
									Colors (comma separated)
								</label>
								<input
									type="text"
									placeholder="e.g. Red, Blue, Black"
									value={colors}
									onChange={(e) => setColors(e.target.value)}
									className="form-input"
								/>
							</div>
						</div>
						<div className="form-row">
							{/* Image Upload */}
							<div className="form-group">
								<label
									htmlFor="images"
									className="form-label flex items-center gap-2 text-gray-700 cursor-pointer text-sm font-medium"
								>
									Upload Images
									<FaUpload />
								</label>
								<input
									type="file"
									onChange={changeImageHandler}
									className="file-input"
									accept="image/jpeg,image/jpg,image/png"
									multiple
								/>
							</div>
						</div>{" "}
						<div className="form-row">
							{/* Previews */}
							{imagePreviews.length > 0 && (
								<div className="image-preview flex flex-wrap gap-4">
									{imagePreviews.map((src, i) => (
										<div
											key={i}
											className="relative w-24 h-24"
										>
											<img
												src={src}
												alt={`Preview ${i}`}
												className="w-full h-full object-cover rounded shadow"
											/>
											<button
												type="button"
												onClick={() =>
													handleImageRemove(i)
												}
												className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
												title="Remove image"
											>
												<FaTimes />
											</button>
										</div>
									))}
								</div>
							)}
						</div>
						<button type="submit" className="submit-btn">
							Create
						</button>
					</form>
				</article>
			</main>
		</div>
	);
};

export default NewProduct;
