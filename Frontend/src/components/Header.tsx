declare global {
	interface Window {
		SpeechRecognition: typeof SpeechRecognition;
		webkitSpeechRecognition: typeof SpeechRecognition;
	}
}

import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	FaBars,
	FaClipboardList,
	FaHeart,
	FaShoppingCart,
	FaSignOutAlt,
	FaTimes,
	FaUser,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useGetWishlistQuery } from "../redux/api/wishlistAPI";
import { CartReducerInitialState } from "../types/reducer-types";
import { User } from "../types/types";
import sideimg from "../assets/sideimg.png";

interface PropsType {
	user: User | null;
}

const Header = ({ user }: PropsType) => {
	const { cartItems } = useSelector(
		(state: { cartReducer: CartReducerInitialState }) => state.cartReducer
	);

	const { data: wishlistData } = useGetWishlistQuery(user?._id!);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
    const isActive = (path: string) => location.pathname === path;

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const logoutHandler = async () => {
		try {
			await signOut(auth);
			toast.success("Sign out successfully");
			return;
		} catch (error) {
			console.log("Failed to sign out", error);
			toast.error("Failed to sign out");
		}
	};

	return (
		<header className={`header ${scrolled ? "scrolled" : ""}`}>
			<div className="header-container">
				<button
					className="mobile-menu-btn"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle menu"
				>
					{isMenuOpen ? <FaTimes /> : <FaBars />}
				</button>

				<Link to="/store" className="header-logo">
					<span>Smart</span>Shop
				</Link>

				<nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
					<div className="main-links">
						<Link
							to="/store"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/store") ? "active" : ""}
						>
							Home
						</Link>
						<Link
							to="/search"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/search") ? "active" : ""}
						>
							Shop
						</Link>
						<Link
							to="/categories"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/categories") ? "active" : ""}
						>
							Categories
						</Link>
						<Link
							to="/deals"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/deals") ? "active" : ""}
						>
							Deals
						</Link>
						<Link
							to="/about"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/about") ? "active" : ""}
						>
							About
						</Link>
						<Link
							to="/contact"
							onClick={() => setIsMenuOpen(false)}
							className={isActive("/contact") ? "active" : ""}
						>
							Contact
						</Link>
					</div>

					<div className="user-controls">
						{user ? (
							<div className="user-dropdown">
								<button className="user-btn">
									<FaUser />
									<span className="user-name">
										{user.name.split(" ")[0]}
									</span>
								</button>
								<div className="dropdown-content">
									<Link
										to="/account"
										onClick={() => setIsMenuOpen(false)}
									>
										<FaUser />
										My Account
									</Link>
									<Link
										to="/orders"
										onClick={() => setIsMenuOpen(false)}
									>
										<FaClipboardList />
										My Orders
									</Link>
									<Link
										to="/wishlist"
										onClick={() => setIsMenuOpen(false)}
									>
										<FaHeart />
										Wishlist
									</Link>
									{user.role === "admin" && (
										<Link
											to="/admin/dashboard"
											onClick={() => setIsMenuOpen(false)}
										>
											<MdSpaceDashboard />
											Dashboard
										</Link>
									)}
									<button
										className="logout-btn"
										onClick={logoutHandler}
									>
										<FaSignOutAlt />
										Sign Out
									</button>
								</div>
							</div>
						) : (
							<Link to="/login" className="auth-link">
								<FaUser /> Sign In
							</Link>
						)}

						<Link
							to={user ? "/wishlist" : "/store"}
							onClick={() => {
								setIsMenuOpen(false);
								if (!user)
									toast.error("login to view your wishlist");
							}}
							className="icon-link"
						>
							<FaHeart />
							{wishlistData?.items &&
								wishlistData.items.length > 0 && (
									<span className="badge">
										{wishlistData.items.length}
									</span>
								)}
						</Link>

						<Link
							to="/cart"
							onClick={() => setIsMenuOpen(false)}
							className="icon-link cart-icon"
						>
							<FaShoppingCart />
							{cartItems.length > 0 ? (
								<span className="badge">
									{cartItems.length}
								</span>
							) : (
								""
							)}
						</Link>
					</div>
				</nav>

				<div
					className="relative group"
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
				>
					<Link to={user ? "/orders" : "/store"}>
						<img
							src={sideimg}
							alt="Orders"
							className="w-20 h-12 object-contain cursor-pointer"
						/>
					</Link>

					{isHovering && (
						<div className="absolute z-10 right-0 mt-2 w-48 bg-gray-400 rounded-md shadow-lg py-1">
							<div className="px-4 py-2 text-sm text-white">
								{user
									? "Check your order status"
									: "Login to view your orders"}
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
