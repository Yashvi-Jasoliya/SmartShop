// AppRoutes.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Loading from './components/Loading';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUs';
import Wishlist from './pages/Wishlist';
import { User } from './types/types';
import ProductPage from './pages/ProductDetails';

import Category from './pages/Category';
import DealsPage from './pages/Deals';

import Signup from './pages/SignUp';


const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Search = lazy(() => import('./pages/Search'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const MyAccount = lazy(() => import('./pages/MyAccount'));

//Admin Routes Importing
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Transaction = lazy(() => import('./pages/admin/Transaction'));
const AdminPanel = lazy(() => import("./pages/admin/Reviews"));
const Products = lazy(() => import('./pages/admin/Products'));
const NewProduct = lazy(() => import('./pages/admin/management/NewProduct'));
const ProductManagement = lazy(
    () => import('./pages/admin/management/ProductManagement')
);
const TransactionManagement = lazy(
    () => import('./pages/admin/management/TransactionManagement')
);
const BarCharts = lazy(() => import('./pages/admin/charts/BarCharts'));
const PieCharts = lazy(() => import('./pages/admin/charts/PieCharts'));
const LineCharts = lazy(() => import('./pages/admin/charts/LineCharts'));
const Stopwatch = lazy(() => import('./pages/admin/apps/Stopwatch'));
const Coupon = lazy(() => import('./pages/admin/apps/Coupon'));
const Toss = lazy(() => import('./pages/admin/apps/Toss'));

const AppRoutes = ({ user }: { user: User | null }) => {
    const location = useLocation();
    const hideHeader = location.pathname.startsWith('/admin');

    return (
		<>
			{/* Header */}

			{!hideHeader && <Header user={user} />}
			{/* <ProductProvider>
			<ReviewProvider> */}
			<Suspense fallback={<Loading />}>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<Home />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/search" element={<Search />} />
					<Route path="/product/:id" element={<ProductPage />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/categories" element={<Category />} />
					<Route path="/deals" element={<DealsPage />} />

					{/* Not logged In Route */}
					<Route
						path="/login"
						element={
							<ProtectedRoute
								isAuthenticated={user ? false : true}
							>
								<Login />
                                
							</ProtectedRoute>
						}
					/>
                    <Route path='/signup' element={<Signup />}>

                    </Route>

					{/* Loggedin User Routes */}
					<Route
						element={
							<ProtectedRoute
								isAuthenticated={user ? true : false}
							/>
						}
					>
						<Route path="/account" element={<MyAccount />} />
						<Route path="/wishlist" element={<Wishlist />} />
						<Route path="/shipping" element={<Shipping />} />
						<Route path="/pay" element={<Checkout />} />
						<Route path="/orders" element={<Orders />} />
						<Route path="/orders/:id" element={<OrderDetails />} />
                        
					</Route>

					{/* Admin Routes */}
					<Route
						element={
							<ProtectedRoute
								isAuthenticated={user ? true : false}
								adminRoute={true}
								isAdmin={user?.role === "admin" ? true : false}
							/>
						}
					>
						<Route
							path="/admin/dashboard"
							element={<Dashboard />}
						/>
						<Route
							path="/admin/customers"
							element={<Customers />}
						/>
						<Route path="/admin/products" element={<Products />} />
						<Route
							path="/admin/transaction"
							element={<Transaction />}
						/>

						<Route path="/admin/review" element={<AdminPanel />} />

						{/* Charts */}
						<Route
							path="/admin/chart/bar"
							element={<BarCharts />}
						/>
						<Route
							path="/admin/chart/pie"
							element={<PieCharts />}
						/>
						<Route
							path="/admin/chart/line"
							element={<LineCharts />}
						/>

						{/* Apps */}
						<Route
							path="/admin/app/stopwatch"
							element={<Stopwatch />}
						/>
						<Route path="/admin/app/coupon" element={<Coupon />} />
						<Route path="/admin/app/toss" element={<Toss />} />

						{/* Management */}
						<Route
							path="/admin/product/new"
							element={<NewProduct />}
						/>
						<Route
							path="/admin/product/:id"
							element={<ProductManagement />}
						/>
						<Route
							path="/admin/transaction/:id"
							element={<TransactionManagement />}
						/>
					</Route>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</Suspense>
			{/* </ReviewProvider> */}
			{/* </ProductProvider> */}
		</>
	);
};

export default AppRoutes;
