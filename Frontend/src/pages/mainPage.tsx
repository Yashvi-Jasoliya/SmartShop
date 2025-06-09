import { useState, useEffect } from "react";
import {
	Sparkles,
	Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

type FloatingProduct = {
	id: number;
	emoji: string;
	x: number;
	y: number;
	delay: number;
};

const mainPage = () => {
	const [animationStep, setAnimationStep] = useState(0);
	const [floatingProducts, setFloatingProducts] = useState<FloatingProduct[]>(
		[]
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationStep((prev) => (prev + 1) % 6);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		
		const products = [
			"🎧",
			"⌚",
			"👟",
			"🧥",
			"📱",
			"💻",
			"🎮",
			"🛍️",
			"⚽",
		];
		setFloatingProducts(
			products.map((emoji, i) => ({
				id: i,
				emoji,
				x: Math.random() * 100,
				y: Math.random() * 100,
				delay: i * 0.5,
			}))
		);
	}, []);


	const HeroSection = () => (
		<section className="relative overflow-hidden bg-gradient-to-br from-purple-300 via-blue-500 to-indigo-500 text-white min-h-screen flex items-center">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-black opacity-20"></div>
				{floatingProducts.map((product) => (
					<div
						key={product.id}
						className="absolute w-16 h-16 opacity-20"
						style={{
							left: `${product.x}%`,
							top: `${product.y}%`,
							animation: `float ${
								3 + product.delay
							}s ease-in-out infinite`,
							animationDelay: `${product.delay}s`,
						}}
					>
						<div className="w-full h-full bg-white bg-opacity-10 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
							{product.emoji}
						</div>
					</div>
				))}
			</div>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="text-center">
					<div className="mb-8">
						<h1 className="text-3xl md:text-5xl font-bold mb-6">
							<span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
								ShopSmart
							</span>
						</h1>
						<div className="h-2 w-32 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-8 animate-pulse"></div>
					</div>

					<h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
						The Evolution of Online Shopping
					</h2>

					<p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
						Experience revolutionary shopping with smart
						recommendations, role-based access control, and seamless
						user experience
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
						<Link to="/login">
							<button className="group px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-2xl">
								<span className="flex items-center space-x-3">
									<Rocket className="w-6 h-6 group-hover:animate-bounce" />
									<span>Start Your Journey</span>
								</span>
							</button>
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{[
							{
								icon: "🤖",
								label: "AI Detection",
								delay: "0.5s",
							},
							{ icon: "🛡️", label: "Secure Access", delay: "1s" },
							{
								icon: "⚡",
								label: "Fast Commerce",
								delay: "1.5s",
							},
						].map((item, index) => (
							<div
								key={index}
								className="group p-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105"
								style={{ animationDelay: item.delay }}
							>
								<div className="text-4xl mb-3 group-hover:animate-bounce">
									{item.icon}
								</div>
								<p className="font-semibold">{item.label}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					50% {
						transform: translateY(-20px) rotate(180deg);
					}
				}
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 1s ease-out;
				}
			`}</style>
		</section>
	);

	const CallToAction = () => (
		<section className="py-20 bg-gradient-to-r from-pink-400 via-purple-600 to-indigo-700">
			<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
				<h2 className="text-3xl md:text-3xl font-bold mb-8">
					Ready to Experience the Future?
				</h2>
				<p className="text-xl md:text-2xl mb-12 opacity-90">
					Join thousands of users already enjoying the next generation
					of e-commerce
				</p>

				<div className="flex flex-col sm:flex-row gap-6 justify-center">
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link to="/login">
							<button className="group px-6 py-4 bg-white text-purple-600 rounded-full text-base font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
								<span className="flex items-center space-x-2">
									<Sparkles className="w-4 h-4 group-hover:animate-spin" />
									<span>Get Started</span>
								</span>
							</button>
						</Link>
						<button className="px-6 py-2 border border-white text-white rounded-full text-base font-semibold ">
							Learn More
						</button>
					</div>
				</div>
			</div>
		</section>
	);

	return (
		<div className="min-h-screen">
			<HeroSection />
			<CallToAction />
		</div>
	);
};

export default mainPage;
