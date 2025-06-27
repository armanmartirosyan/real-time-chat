"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, useRef, type ReactNode, type Context } from "react";
import ChatService from "../services/ChatService";
import type { IUserDTO, IMessage, IChat, ApiResponse } from "../@types/index.d";

export interface ChatContextType {
	// State
	allChats: IChat[];
	currentChat: IChat | null;
	messages: IMessage[];
	inputValue: string;
	editingChatId: string | null;
	editingChatName: string;
	editingHeaderChat: boolean;
	headerChatName: string;
	loadingChats: boolean;
	loadingMessages: boolean;
	sendingMessage: boolean;
	updatingChatName: boolean;
	creatingChat: boolean;
	showCreateChatModal: boolean;
	error: string | null;
	wsConnected: boolean;

	// Actions
	setInputValue: (value: string) => void;
	sendMessage: () => Promise<void>;
	selectChat: (chat: IChat) => void;
	startEditingChat: (chatId: string, currentName: string) => void;
	saveEditingChat: () => Promise<void>;
	cancelEditingChat: () => void;
	startEditingHeaderChat: () => void;
	saveEditingHeaderChat: () => Promise<void>;
	cancelEditingHeaderChat: () => void;
	setError: (error: string | null) => void;
	refreshChats: () => Promise<void>;
	setEditingChatName: (value: string) => void;
	setHeaderChatName: (value: string) => void;
	getUsernameById: (userId: string) => string;
	openCreateChatModal: () => void;
	closeCreateChatModal: () => void;
	createChat: (secondUsername: string, chatName?: string) => Promise<void>;
}

const ChatContext: Context<ChatContextType | null> = createContext<ChatContextType | null>(null);

export function useChatContext(): ChatContextType {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
}

interface ChatProviderProps {
	children: ReactNode;
	currentUser: IUserDTO;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, currentUser }) => {
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
	const [creatingChat, setCreatingChat] = useState(false);
	const [showCreateChatModal, setShowCreateChatModal] = useState(false);
	const [wsConnected, setWsConnected] = useState(false);
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const socketRef = useRef<WebSocket | null>(null);

	function normalizeMessage(messageData: any): IMessage | null {
		let normalizedMessage: IMessage;

		if (messageData.from && messageData.content) {
			// Server format: { type: 'message', from: 'userId', chatId: 'chatId', content: 'content' }
			normalizedMessage = {
				_id: messageData._id || `ws-${Date.now()}-${Math.random()}`,
				userId: messageData.from,
				content: messageData.content,
				createdAt: messageData.createdAt || new Date().toISOString(),
			}
		} else if (messageData._id && messageData.userId && messageData.content) {
			// Standard format: { _id: 'id', userId: 'userId', content: 'content', createdAt: 'timestamp' }
			normalizedMessage = messageData;
		} else {
			console.warn("Invalid message structure:", messageData);
			return null;
		}

		return normalizedMessage;
	}

	function joinChat(chatId: string): void {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			const joinMessage = {
				type: "join_chat",
				chatId: chatId,
				userId: currentUser._id,
			}
			socketRef.current.send(JSON.stringify(joinMessage));
		}
	}

	function leaveChat(chatId: string): void {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			const leaveMessage = {
				type: "leave_chat",
				chatId: chatId,
				userId: currentUser._id,
			}
			socketRef.current.send(JSON.stringify(leaveMessage));
		}
	}

	function handleIncomingMessage(messageData: any): void {

		const normalizedMessage = normalizeMessage(messageData);
		if (!normalizedMessage)
			return;


		setMessages((prevMessages) => {

			if (messageData.tempId) {
				const updatedMessages = prevMessages.map((msg) =>
					msg._id === messageData.tempId ? { ...normalizedMessage, tempId: undefined } : msg,
				)
				return updatedMessages;
			}

			if (normalizedMessage.userId === currentUser._id) {
				const now = Date.now();
				const recentOptimisticMessages = prevMessages.filter(
					(msg) =>
						msg._id.startsWith("temp-") &&
						msg.userId === currentUser._id &&
						msg.content === normalizedMessage.content &&
						now - Number.parseInt(msg._id.split("-")[1]) < 5000,
				)

				if (recentOptimisticMessages.length > 0) {
					const filteredMessages = prevMessages.filter(
						(msg) => !recentOptimisticMessages.some((opt) => opt._id === msg._id),
					)
					return [...filteredMessages, normalizedMessage];
				}
			}

			const exists = prevMessages.some((msg) => msg._id === normalizedMessage._id);
			if (exists) {
				return prevMessages;
			}

			const newMessages = [...prevMessages, normalizedMessage];
			return newMessages;
		})
	}

	useEffect(() => {
		if (!currentUser?._id)
			return;

		const currentToken = localStorage.getItem("token");
		setToken(currentToken);

		if (!currentToken)
			return;

		const ws = new WebSocket(`ws://localhost:8088?token=${currentToken}`);
		socketRef.current = ws;

		ws.onopen = () => {
			setWsConnected(true);
			setError(null);

			if (currentChat?._id) {
				joinChat(currentChat._id);
			}
		}

		ws.onmessage = (event) => {
			try {
				const messageData = JSON.parse(event.data);

				if (messageData.type) {
					switch (messageData.type) {
						case "message":
							handleIncomingMessage(messageData);
							break;

						case "chat_joined":
							break;

						case "chat_left":
							break;

						case "error":
							console.error("WebSocket error:", messageData.message);
							setError(messageData.message);
							break;

						default:
							break;
					}
				} else {
					handleIncomingMessage(messageData);
				}
			} catch (err) {
				console.error("Error parsing WebSocket message:", err);
				console.error("Raw message data:", event.data);
			}
		}

		ws.onclose = () => {
			setWsConnected(false);
		}

		ws.onerror = (err) => {
			console.error("WebSocket error:", err);
			setWsConnected(false);
			setError("WebSocket connection error");
		}

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				if (currentChat?._id) {
					leaveChat(currentChat._id);
				}
				ws.close();
			}
		}
	}, [currentUser, token]);

	useEffect(() => {
		if (wsConnected && currentChat?._id) {
			joinChat(currentChat._id);
		}
	}, [currentChat?._id, wsConnected]);

	function openCreateChatModal(): void {
		setShowCreateChatModal(true);
	}

	function closeCreateChatModal(): void {
		setShowCreateChatModal(false);
	}

	async function fetchChats(): Promise<void> {
		if (!currentUser?._id)
			return;

		try {
			setLoadingChats(true);
			setError(null);
			const response: ApiResponse = await ChatService.getAllChats(currentUser._id);
			const chats: IChat[] = response.data;
			setAllChats(chats);

			if (chats.length > 0 && !currentChat) {
				setCurrentChat(chats[0]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load chats");
		} finally {
			setLoadingChats(false);
		}
	}

	async function fetchMessages(): Promise<void> {
		if (!currentChat?._id)
			return;

		try {
			setLoadingMessages(true);
			setError(null);

			const response: ApiResponse = await ChatService.getMessages(currentChat._id);

			const normalizedMessages: IMessage[] = [];

			if (Array.isArray(response.data)) {
				response.data.forEach((msg: any) => {
					const normalizedMsg = normalizeMessage(msg);
					if (normalizedMsg) {
						normalizedMessages.push(normalizedMsg);
					}
				})
			}

			setMessages(normalizedMessages);
		} catch (err: any) {
			console.error("Error fetching messages:", err);
			if (err.response?.status === 404) {
				setMessages([]);
			} else {
				setError(err instanceof Error ? err.message : "Failed to load messages");
			}
		} finally {
			setLoadingMessages(false);
		}
	}

	async function sendMessage(): Promise<void> {
		if (!inputValue.trim() || !currentChat?._id || sendingMessage)
			return;

		if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
			setError("WebSocket connection not available. Please refresh the page.");
			return;
		}

		try {
			setSendingMessage(true);
			setError(null);

			const optimisticMessage: IMessage = {
				_id: `temp-${Date.now()}-${Math.random()}`,
				userId: currentUser._id,
				content: inputValue.trim(),
				createdAt: new Date().toISOString(),
			}

			setMessages((prev) => {
				const newMessages = [...prev, optimisticMessage]
				return newMessages
			});

			const messagePayload = {
				type: "message",
				chatId: currentChat._id,
				from: currentUser._id,
				content: inputValue.trim(),
				tempId: optimisticMessage._id,
			}

			socketRef.current.send(JSON.stringify(messagePayload));

			setInputValue("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send message");
			setMessages((prev) => prev.filter((msg) => !msg._id.startsWith("temp-")));
		} finally {
			setSendingMessage(false);
		}
	}

	function selectChat(chat: IChat): void {
		if (currentChat?._id && wsConnected) {
			leaveChat(currentChat._id);
		}

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

			const response: ApiResponse = await ChatService.updateChatName(currentChat._id, headerChatName.trim());

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

	async function refreshChats(): Promise<void> {
		await fetchChats();
	}

	function getUsernameById(userId: string): string {
		if (userId === currentUser._id) {
			return currentUser.username;
		}

		const member = currentChat?.members.find((member) => member._id === userId);
		return member?.username || "Unknown User";
	}

	async function createChat(secondUsername: string, chatName?: string): Promise<void> {
		if (!secondUsername.trim() || creatingChat)
			return;

		try {
			setCreatingChat(true);
			setError(null);

			secondUsername = secondUsername.trim();
			if (chatName) chatName = chatName.trim();
			if (!chatName) chatName = "Awesome Chat";

			const response: ApiResponse = await ChatService.createChat(secondUsername, chatName);
			const newChat: IChat = response.data;
			setAllChats((prev) => {
				const exists = prev.some((chat) => chat._id === newChat._id);
				if (exists)
					return prev;
				return [newChat, ...prev];
			})
			setCurrentChat(newChat);
			setShowCreateChatModal(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create chat");
		} finally {
			setCreatingChat(false);
		}
	}

	useEffect(() => {
		fetchChats();
	}, [currentUser]);

	useEffect(() => {
		fetchMessages();
	}, [currentChat]);

	const contextValue: ChatContextType = {
		// State
		allChats,
		currentChat,
		messages,
		inputValue,
		editingChatId,
		editingChatName,
		editingHeaderChat,
		headerChatName,
		loadingChats,
		loadingMessages,
		sendingMessage,
		updatingChatName,
		creatingChat,
		showCreateChatModal,
		error,
		wsConnected,

		// Actions
		setInputValue,
		sendMessage,
		selectChat,
		startEditingChat,
		saveEditingChat,
		cancelEditingChat,
		startEditingHeaderChat,
		saveEditingHeaderChat,
		cancelEditingHeaderChat,
		setError,
		refreshChats,
		setEditingChatName,
		setHeaderChatName,
		getUsernameById,
		openCreateChatModal,
		closeCreateChatModal,
		createChat,
	}

	return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
