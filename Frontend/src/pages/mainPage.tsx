
import { useState, useEffect, useRef } from "react";
import {
	Sparkles,
	Rocket,
	Mic,
	Shield,
	Zap,
	MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

type FloatingProduct = {
	id: number;
	emoji: string;
	x: number;
	y: number;
	delay: number;
};

type ChatMessage = {
	id: number;
	text: string;
	sender: "user" | "bot";
};

const MainPage = () => {
	const [animationStep, setAnimationStep] = useState(0);
	const [floatingProducts, setFloatingProducts] = useState<FloatingProduct[]>(
		[]
	);
	const [chatOpen, setChatOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isListening, setIsListening] = useState(false);
	const chatEndRef = useRef<HTMLDivElement>(null);
	const recognitionRef = useRef<any>(null);

	// Initialize speech recognition
	useEffect(() => {
		if ("webkitSpeechRecognition" in window) {
			const recognition = new (window as any).webkitSpeechRecognition();
			recognition.continuous = false;
			recognition.interimResults = false;
			recognition.lang = "en-US";

			recognition.onresult = (event: any) => {
				const transcript = event.results[0][0].transcript;
				setInputMessage(transcript);
				setIsListening(false);
			};

			recognition.onerror = (event: any) => {
				console.error("Speech recognition error", event.error);
				setIsListening(false);
			};

			recognitionRef.current = recognition;
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationStep((prev) => (prev + 1) % 6);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const products = ["🎧", "⌚", "👟", "🧥", "📱", "💻", "🎮", "🛍️", "⚽"];
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
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-black opacity-10"></div>
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
						<h1 className="text-4xl md:text-6xl font-bold mb-6">
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
						Experience revolutionary shopping with AI-powered
						recommendations, voice-enabled reviews, and a seamless
						personalized experience
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
						<Link to="/login">
							<button className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-pink-500/50">
								<span className="flex items-center space-x-3">
									<Rocket className="w-6 h-6" />
									<span>Start Your Shopping</span>
								</span>
							</button>
						</Link>
						<Link to="/search">
							<button className="group px-5 py-4 bg-white bg-opacity-20 backdrop-blur-md rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/30">
								<span className="flex items-center space-x-3 text-white">
									<MessageSquare className="w-6 h-6 group-hover:animate-pulse" />
									<span>Get Recommendations</span>
								</span>
							</button>
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{[
							{
								icon: <Zap className="w-8 h-8 text-pink-400" />,
								label: "AI-Powered Suggestions",
								description:
									"Our smart assistant learns your preferences to recommend perfect products",
								delay: "0.5s",
							},
							{
								icon: (
									<Mic className="w-8 h-8 text-purple-400" />
								),
								label: "Voice Reviews",
								description:
									"Leave feedback hands-free with our voice recognition system",
								delay: "1s",
							},
							{
								icon: (
									<Shield className="w-8 h-8 text-indigo-400" />
								),
								label: "Secure Shopping",
								description:
									"Enterprise-grade security protecting your data and transactions",
								delay: "1.5s",
							},
						].map((item, index) => (
							<div
								key={index}
								className="group p-8 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl hover:bg-opacity-20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-white border-opacity-10 hover:border-opacity-30"
								style={{ animationDelay: item.delay }}
							>
								<div className="text-4xl mb-4 group-hover:animate-bounce flex justify-center">
									{item.icon}
								</div>
								<h3 className="font-bold text-xl mb-3">
									{item.label}
								</h3>
								<p className="text-gray-200 text-opacity-80">
									{item.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<style>{`
        @keyframes float {
          0%, 100% {
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

	const FeaturesSection = () => (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Revolutionary Shopping Features
					</h2>
					<div className="h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{[
						{
							title: "AI Shopping Assistant",
							description:
								"Our chatbot helps you find exactly what you're looking for with personalized recommendations.",
							icon: (
								<MessageSquare className="w-8 h-8 text-purple-600" />
							),
							color: "from-purple-500 to-indigo-500",
						},
						{
							title: "Voice Product Reviews",
							description:
								"Leave hands-free feedback with our voice recognition system - no typing required.",
							icon: <Mic className="w-8 h-8 text-pink-600" />,
							color: "from-pink-500 to-rose-500",
						},
						{
							title: "Role-Based Access",
							description:
								"Different interfaces for shoppers, sellers, and admins with appropriate controls.",
							icon: <Shield className="w-8 h-8 text-green-600" />,
							color: "from-green-500 to-teal-500",
						},
						{
							title: "Subscribe",
							description:
								"Subscribe our website and get latest notifications with new deals",
							icon: (
								<Sparkles className="w-8 h-8 text-yellow-600" />
							),
							color: "from-yellow-500 to-amber-500",
						},
						{
							title: "Instant Checkout",
							description:
								"One-click purchasing with saved preferences for lightning-fast transactions.",
							icon: <Zap className="w-8 h-8 text-red-600" />,
							color: "from-red-500 to-orange-500",
						},
					].map((feature, index) => (
						<div
							key={index}
							className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-300 hover:shadow-xl"
						>
							<div
								className={`p-6 bg-gradient-to-r ${feature.color} text-white`}
							>
								<div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
									{feature.icon}
								</div>
							</div>
							<div className="p-6">
								<h3 className="text-xl font-bold text-gray-900 mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-600">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);

	const CallToAction = () => (
		<section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
			<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
				<h2 className="text-3xl md:text-4xl font-bold mb-8">
					Ready to Experience the Future of Shopping?
				</h2>
				<p className="text-xl md:text-2xl mb-12 opacity-90">
					Join thousands of users enjoying our next-generation
					e-commerce platform
				</p>

				<div className="flex flex-col sm:flex-row gap-6 justify-center">
					<Link to="/login">
						<button className="group px-5 py-3 bg-white text-purple-600 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-white/20">
							<span className="flex items-center space-x-3">
								<Sparkles className="w-5 h-5 group-hover:animate-spin" />
								<span>Get Started Now</span>
							</span>
						</button>
					</Link>
					<button
						onClick={() => setChatOpen(true)}
						className="px-5 py-3 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105"
					>
						Ask Our Assistant
					</button>
				</div>
			</div>
		</section>
	);

	return (
		<div className="min-h-screen">
			<HeroSection />
			<FeaturesSection />
			<CallToAction />
		</div>
	);
};

export default MainPage;
