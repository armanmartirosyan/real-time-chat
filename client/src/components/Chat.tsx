import ChatService from "../services/ChatService";
import { UserContext, UserContextType } from "../contexts/userContext";
import { IUserDTO, IMessage, IChat, ApiResponse } from "../@types/index.d";
import React, { useState, useContext, ChangeEvent, useEffect } from "react";


export default function Chat(): React.JSX.Element {
	const { user: currentUser }: { user: IUserDTO } = useContext<UserContextType>(UserContext);
	const [allChats, setAllChats] = useState<IChat[]>([]);
	const [currentChat, setCurrentChat] = useState<IChat | null>(null);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [editingChatId, setEditingChatId] = useState<string | null>(null);
	const [editingChatName, setEditingChatName] = useState("");
	const [editingHeaderChat, setEditingHeaderChat] = useState(false);
	const [headerChatName, setHeaderChatName] = useState("");
	const [loadingChats, setLoadingChats] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [updatingChatName, setUpdatingChatName] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchChats = async () => {
			if (!currentUser?._id)
				return;

			try {
				setLoadingChats(true);
				setError(null);
				const response: ApiResponse = await ChatService.getAllChats(currentUser._id);
				const chats: IChat[] = response.data;
				setAllChats(chats);

				// Set first chat as current if available
				if (chats.length > 0 && !currentChat) {
					setCurrentChat(chats[0]);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load chats");
			} finally {
				setLoadingChats(false);
			}
		}

		fetchChats()
	}, [currentUser]);

	useEffect(() => {
		const fetchMessages = async () => {
			if (!currentChat?._id)
				return;

			try {
				setLoadingMessages(true);
				setError(null);
				const response: ApiResponse = await ChatService.getMessages(currentChat._id);
				setMessages(response.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load messages");
			} finally {
				setLoadingMessages(false);
			}
		}

		fetchMessages();
	}, [currentChat]);

	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	async function sendMessage(): Promise<void> {
		if (!inputValue.trim() || !currentChat?._id || sendingMessage)
			return;

		try {
			setSendingMessage(true);
			setError(null);

			const response = await ChatService.createMessage(currentChat._id, inputValue.trim());
			setMessages((prev) => [...prev, response.data]);
			setInputValue("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send message");
		} finally {
			setSendingMessage(false);
		}
	}

	function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Enter" && !sendingMessage) {
			sendMessage();
		}
	}

	function selectChat(chat: IChat): void {
		setCurrentChat(chat);
		setEditingChatId(null);
		setEditingHeaderChat(false);
	}

	function startEditingChat(chatId: string, currentName: string): void {
		setEditingChatId(chatId);
		setEditingChatName(currentName);
	}

	async function saveEditingChat(): Promise<void> {
		if (!editingChatName.trim() || !editingChatId || updatingChatName)
			return;

		try {
			setUpdatingChatName(true);
			setError(null);

			const response: ApiResponse = await ChatService.updateChatName(editingChatId, editingChatName.trim());

			setAllChats((prev) => prev.map((chat) => (chat._id === editingChatId ? response.data : chat)));

			// Update current chat if it's the one being edited
			if (currentChat?._id === editingChatId) {
				setCurrentChat(response.data);
			}

			setEditingChatId(null);
			setEditingChatName("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update chat name");
		} finally {
			setUpdatingChatName(false);
		}
	}

	function cancelEditingChat(): void {
		setEditingChatId(null);
		setEditingChatName("");
	}

	function startEditingHeaderChat(): void {
		if (!currentChat)
			return;
		setEditingHeaderChat(true);
		setHeaderChatName(currentChat.name);
	}

	async function saveEditingHeaderChat(): Promise<void> {
		if (!headerChatName.trim() || !currentChat?._id || updatingChatName)
			return;

		try {
			setUpdatingChatName(true);
			setError(null);

			const response: ApiResponse = await ChatService.updateChatName(currentChat._id, headerChatName.trim())

			setAllChats((prev) => prev.map((chat) => (chat._id === currentChat._id ? response.data : chat)));
			setCurrentChat(response.data);
			setEditingHeaderChat(false);
			setHeaderChatName("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update chat name");
		} finally {
			setUpdatingChatName(false);
		}
	}

	function cancelEditingHeaderChat(): void {
		setEditingHeaderChat(false);
		setHeaderChatName("");
	}

	function handleChatNameKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Enter") {
			saveEditingChat();
		} else if (e.key === "Escape") {
			cancelEditingChat();
		}
	}

	function handleHeaderChatNameKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Enter") {
			saveEditingHeaderChat();
		} else if (e.key === "Escape") {
			cancelEditingHeaderChat();
		}
	}

	if (!currentUser) {
		return (
			<div className="chat-container">
				<div className="error-message">Please log in to access the chat.</div>
			</div>
		);
	}

	return (
		<div className="chat-container">
			<div className="chat">
				{/* Sidebar - All Chats */}
				<div className="chat-sidebar">
					<div className="chat-sidebar-header">
						<h2 className="chat-sidebar-title">Chats</h2>
					</div>

					<div className="chat-list">
						{loadingChats ? (
							<div className="loading-message">Loading chats...</div>
						) : allChats.length === 0 ? (
							<div className="empty-message">No chats available</div>
						) : (
							allChats.map((chat) => (
								<div
									key={chat._id}
									className={`chat-block ${currentChat?._id === chat._id ? "active" : ""}`}
									onClick={() => selectChat(chat)}
								>
									<div className="chat-block-content">
										<div className="chat-info">
											{editingChatId === chat._id ? (
												<input
													type="text"
													value={editingChatName}
													onChange={(e) => setEditingChatName(e.target.value)}
													onKeyDown={handleChatNameKeyPress}
													className="chat-name-input"
													autoFocus
													onClick={(e) => e.stopPropagation()}
													disabled={updatingChatName}
												/>
											) : (
												<div className="chat-name">{chat.name}</div>
											)}
											<div className="chat-members">
												{chat.members.length} member{chat.members.length !== 1 ? "s" : ""}
											</div>
										</div>
										<div className="chat-actions">
											{editingChatId === chat._id ? (
												<>
													<button
														className="save-button"
														onClick={(e) => {
															e.stopPropagation();
															saveEditingChat();
														}}
														disabled={updatingChatName}
													>
														{updatingChatName ? "..." : "Save"}
													</button>
													<button
														className="cancel-button"
														onClick={(e) => {
															e.stopPropagation();
															cancelEditingChat();
														}}
														disabled={updatingChatName}
													>
														Cancel
													</button>
												</>
											) : (
												<button
													className="edit-button"
													onClick={(e) => {
														e.stopPropagation();
														startEditingChat(chat._id, chat.name);
													}}
													title="Edit chat name"
												>
													✏️
												</button>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				{/* Main Chat Area */}
				<div className="current-chat">
					{currentChat ? (
						<>
							{/* Chat Header */}
							<div className="chat-header">
								<div className="chat-header-info">
									{editingHeaderChat ? (
										<input
											type="text"
											value={headerChatName}
											onChange={(e) => setHeaderChatName(e.target.value)}
											onKeyDown={handleHeaderChatNameKeyPress}
											className="chat-title-input"
											autoFocus
											disabled={updatingChatName}
										/>
									) : (
										<div className="chat-title">{currentChat.name}</div>
									)}
									<div className="chat-members-list">
										{currentChat.members.map((member) => member.username).join(", ")}
									</div>
								</div>
								<div className="chat-header-actions">
									{editingHeaderChat ? (
										<>
											<button className="save-button" onClick={saveEditingHeaderChat} disabled={updatingChatName}>
												{updatingChatName ? "..." : "Save"}
											</button>
											<button className="cancel-button" onClick={cancelEditingHeaderChat} disabled={updatingChatName}>
												Cancel
											</button>
										</>
									) : (
										<button className="edit-button" onClick={startEditingHeaderChat} title="Edit chat name">
											✏️
										</button>
									)}
								</div>
							</div>

							{/* Messages */}
							<div className="chat-messages">
								{loadingMessages ? (
									<div className="loading-message">Loading messages...</div>
								) : messages.length === 0 ? (
									<div className="empty-message">No messages yet. Start the conversation!</div>
								) : (
									messages.map((message) => {
										const isCurrentUser = message.userId === currentUser._id;
										return (
											<div key={message._id} className={`message-wrapper ${isCurrentUser ? "own" : "other"}`}>
												<div className="message-info">
													<span className="message-author">{currentUser.username}</span>
													<span className="message-timestamp">{formatTime(message.createdAt)}</span>
												</div>
												<div className={`message-bubble ${isCurrentUser ? "own" : "other"}`}>
													<div className="message-text">{message.content}</div>
												</div>
											</div>
										);
									})
								)}
							</div>

							{/* Chat Input */}
							<div className="chat-input">
								<div className="input-container">
									<input
										type="text"
										value={inputValue}
										onChange={(e: ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="Type a message..."
										className="chat-input-field"
										disabled={sendingMessage}
									/>
								</div>
								<button onClick={sendMessage} className="send-button" disabled={sendingMessage || !inputValue.trim()}>
									{sendingMessage ? "Sending..." : "Send"}
								</button>
							</div>
						</>
					) : (
						<div className="no-chat-selected">
							<div className="empty-message">Select a chat to start messaging</div>
						</div>
					)}
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="error-toast">
					<span>{error}</span>
					<button onClick={() => setError(null)}>x</button>
				</div>
			)}
		</div>
	)
}