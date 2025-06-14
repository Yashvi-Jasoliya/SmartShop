import { useState } from "react";
import { Product } from "../types/types";

type ChatMessage = {
	text: string;
	fromUser: boolean;
	products?: Product[];
};

type ChatWindowProps = {
	messages: ChatMessage[];
	onSubmit: (query: string) => void;
	onClose: () => void;
	isTyping: boolean;
};

const ChatWindow = ({
	messages,
	onSubmit,
	onClose,
	isTyping,
}: ChatWindowProps) => {
	const [inputValue, setInputValue] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			onSubmit(inputValue);
			setInputValue("");
		}
	};

	return (
		<div className="flex flex-col h-[70vh] w-50 max-w-xl mx-auto rounded-lg shadow-lg border border-gray-200">
			{/* Header */}
			<div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
				<h3 className="text-lg font-semibold">AI Shopping Assistant</h3>
				<button
					onClick={onClose}
					className="text-white hover:text-gray-200 text-2xl"
				>
					×
				</button>
			</div>

			{/* Messages */}
			<div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`mb-4 ${
							msg.fromUser ? "text-right" : "text-left"
						}`}
					>
						<div
							className={`inline-block p-3 rounded-lg max-w-[85%] sm:max-w-[80%] ${
								msg.fromUser
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-gray-800"
							}`}
						>
							<p>{msg.text}</p>
							{msg.products && msg.products.length > 0 && (
								<div className="mt-2">
									<p className="font-semibold mb-1">
										Suggested Products:
									</p>
									<div className="space-y-2">
										{msg.products.map((product) => (
											<div
												key={product._id}
												className="p-2 bg-white rounded border border-gray-200"
											>
												<p className="font-medium">{product.name}</p>
												<p className="text-sm">₹{product.price}</p>
												{product.originalPrice && (
													<p className="text-xs text-gray-500 line-through">
														₹{product.originalPrice}
													</p>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				))}

				{/* Typing Indicator */}
				{isTyping && (
					<div className="flex items-center space-x-1">
						<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
						<div
							className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
							style={{ animationDelay: "0.2s" }}
						></div>
						<div
							className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
							style={{ animationDelay: "0.4s" }}
						></div>
					</div>
				)}
			</div>

			{/* Input */}
			<form
				onSubmit={handleSubmit}
				className="p-3 sm:p-4 border-t border-gray-200 bg-white"
			>
				<div className="flex">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Ask about products..."
						className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
					/>
					<button
						type="submit"
						className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatWindow;
