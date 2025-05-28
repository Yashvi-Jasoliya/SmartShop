
import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { notificationService } from "../../services/notificationService";
import type { Notification as AppNotification } from "../../types/types"; 
import { User } from "firebase/auth";

interface NotificationBellProps {
	userId: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
		useNotifications(userId);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formatTimeAgo = (date: Date): string => {
		const seconds = Math.floor(
			(new Date().getTime() - date.getTime()) / 1000
		);
		const intervals: { [key: string]: number } = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60,
            seconds: 1,
		};

		for (const [unit, secondsInUnit] of Object.entries(intervals)) {
			const interval = Math.floor(seconds / secondsInUnit);
			if (interval >= 1) {
				return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
			}
		}
		return "Just now";
	};

	const handleNotificationClick = async (notification: AppNotification) => {
		if (!notification.isRead) {
			await markAsRead(notification.id);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-full hover:bg-gray-100 relative"
				aria-label="Notifications"
			>
				<svg
					className="w-6 h-6 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
						{unreadCount >= 3 ? "3+" : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
					<div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
						<h3 className="font-semibold text-gray-900">
							Notifications
						</h3>
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className="text-sm text-blue-600 hover:text-blue-800 font-medium"
							>
								{loading ? "Mark all read" : ""}
							</button>
						)}
					</div>

					<div className="max-h-64 overflow-y-auto">
						{loading ? (
							notifications.map(
								(notification: AppNotification) => {
									console.log(notification);
									const { icon, color } =
										notificationService.getNotificationIcon(
											notification.type
										);
									return (
										<div
											key={notification.id}
											onClick={() =>
												handleNotificationClick(
													notification
												)
											}
											className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
												!notification.isRead
													? "bg-blue-50"
													: ""
											}`}
										>
											<div className="flex items-start space-x-3">
												<div
													className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
													style={{
														backgroundColor: `${color}20`,
														color,
													}}
												>
													{icon}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between">
														<p
															className={`text-sm font-medium text-gray-900 ${
																!notification.isRead
																	? "font-semibold"
																	: ""
															}`}
														>
															{notification.title}
														</p>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														{notification.message}
													</p>
													{notification.metadata && (
														<div className="mt-1">
															{notification
																.metadata
																.userEmail && (
																<p className="text-xs text-gray-500">
																	User:{" "}
																	{
																		notification
																			.metadata
																			.userEmail
																	}
																</p>
															)}
															{notification
																.metadata
																.amount && (
																<p className="text-xs text-gray-500">
																	Amount: $
																	{
																		notification
																			.metadata
																			.amount
																	}
																</p>
															)}
														</div>
													)}
													<p className="text-xs text-gray-500 mt-1">
														{formatTimeAgo(
															new Date(
																notification.timestamp
															)
														)}
													</p>
												</div>
												{!notification.isRead && (
													<div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
												)}
											</div>
										</div>
									);
								}
							)
						) : (
							<div className="p-4 text-center text-gray-500">
								No notifications
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
