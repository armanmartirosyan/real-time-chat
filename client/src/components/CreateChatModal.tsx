"use client"

import type React from "react";
import { useState } from "react";
import { useChatContext } from "../contexts/chatContext";

export default function CreateChatModal(): React.JSX.Element {
	const { showCreateChatModal, closeCreateChatModal, createChat, creatingChat, error } = useChatContext()
	const [secondUsername, setSecondUsername] = useState("")
	const [chatName, setChatName] = useState("")

	async function handleSubmit(e: React.FormEvent): Promise<void> {
		e.preventDefault();
		if (!secondUsername.trim()) return;

		await createChat(secondUsername, chatName || undefined);

		if (!error) {
			setSecondUsername("");
			setChatName("");
		}
	}

	function handleClose(): void {
		setSecondUsername("");
		setChatName("");
		closeCreateChatModal();
	}

	if (!showCreateChatModal) return <></>;

	return (
		<div className="modal-overlay" onClick={handleClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h3>Create New Chat</h3>
					<button className="modal-close-button" onClick={handleClose}>
						x
					</button>
				</div>

				<form onSubmit={handleSubmit} className="create-chat-form">
					<div className="form-group">
						<label htmlFor="secondUsername">Username *</label>
						<input
							type="text"
							id="secondUsername"
							value={secondUsername}
							onChange={(e) => setSecondUsername(e.target.value)}
							placeholder="Enter username to chat with"
							required
							disabled={creatingChat}
							autoFocus
						/>
					</div>

					<div className="form-group">
						<label htmlFor="chatName">Chat Name (Optional)</label>
						<input
							type="text"
							id="chatName"
							value={chatName}
							onChange={(e) => setChatName(e.target.value)}
							placeholder="Enter chat name (optional)"
							disabled={creatingChat}
						/>
					</div>

					<div className="form-actions">
						<button type="button" onClick={handleClose} className="cancel-button" disabled={creatingChat}>
							Cancel
						</button>
						<button type="submit" className="create-button" disabled={creatingChat || !secondUsername.trim()}>
							{creatingChat ? "Creating..." : "Create Chat"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
