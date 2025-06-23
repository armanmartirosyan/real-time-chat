"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, type ReactNode, Context } from "react";
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
	error: string | null;

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
	children: ReactNode
	currentUser: IUserDTO
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

	async function fetchChats(): Promise<void> {
		if (!currentUser?._id) return;

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
		if (!currentChat?._id) return;

		try {
			setLoadingMessages(true);
			setError(null);
			const response: ApiResponse = await ChatService.getMessages(currentChat._id);
			setMessages(response.data);
		} catch (err) {
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
		if (!inputValue.trim() || !currentChat?._id || sendingMessage) return;

		try {
			setSendingMessage(true);
			setError(null);

			const response: ApiResponse = await ChatService.createMessage(currentChat._id, inputValue.trim());
			setMessages((prev) => [...prev, response.data]);
			setInputValue("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to send message");
		} finally {
			setSendingMessage(false);
		}
	}

	function selectChat(chat: IChat): void {
		setCurrentChat(chat);
		setEditingChatId(null);
		setEditingHeaderChat(false);
	}

	function startEditingChat(chatId: string, currentName: string): void {
		setEditingChatId(chatId)
		setEditingChatName(currentName)
	}

	async function saveEditingChat(): Promise<void> {
		if (!editingChatName.trim() || !editingChatId || updatingChatName) return;

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
		if (!currentChat) return;
		setEditingHeaderChat(true);
		setHeaderChatName(currentChat.name);
	}

	async function saveEditingHeaderChat(): Promise<void> {
		if (!headerChatName.trim() || !currentChat?._id || updatingChatName) return;

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
		error,

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
	}

	return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
