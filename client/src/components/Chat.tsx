"use client"

import type React from "react"
import CreateChatModal from "./CreateChatModal"
import type { IUserDTO } from "../@types/index.d"
import { useChatContext } from "../contexts/chatContext"
import { UserContext, type UserContextType } from "../contexts/userContext"
import { useEffect, useRef, useContext, type ChangeEvent, type RefObject } from "react"

export default function Chat(): React.JSX.Element {
  const { user: currentUser }: { user: IUserDTO } = useContext<UserContextType>(UserContext)
  const messagesEndRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const messagesContainerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
  const {
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
    wsConnected,
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
    setEditingChatName,
    setHeaderChatName,
    getUsernameById,
    openCreateChatModal,
  } = useChatContext()

  function scrollToBottom(): void {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (currentChat && !loadingMessages) {
      setTimeout(scrollToBottom, 100)
    }
  }, [currentChat, loadingMessages])

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && !sendingMessage) {
      sendMessage()
    }
  }

  function handleChatNameKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      saveEditingChat()
    } else if (e.key === "Escape") {
      cancelEditingChat()
    }
  }

  function handleHeaderChatNameKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      saveEditingHeaderChat()
    } else if (e.key === "Escape") {
      cancelEditingHeaderChat()
    }
  }

  if (!currentUser) {
    return (
      <div className="chat-container">
        <div className="error-message">Please log in to access the chat.</div>
      </div>
    )
  }

  return (
    <div className="chat-container">
      <div className="chat">
        {/* Sidebar - All Chats */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-sidebar-title">Chats</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                className={`status-dot ${wsConnected ? "valid" : "invalid"}`}
                title={wsConnected ? "Connected" : "Disconnected"}
                style={{ width: "8px", height: "8px" }}
              ></div>
              <button className="create-chat-button" onClick={openCreateChatModal} title="Create new chat">
                +
              </button>
            </div>
          </div>

          <div className="chat-list">
            {loadingChats ? (
              <div className="loading-message">Loading chats...</div>
            ) : allChats.length === 0 ? (
              <div className="empty-message">
                <p>No chats available</p>
                <button className="create-first-chat-button" onClick={openCreateChatModal}>
                  Create your first chat
                </button>
              </div>
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
                              e.stopPropagation()
                              saveEditingChat()
                            }}
                            disabled={updatingChatName}
                          >
                            {updatingChatName ? "..." : "Save"}
                          </button>
                          <button
                            className="cancel-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEditingChat()
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
                            e.stopPropagation()
                            startEditingChat(chat._id, chat.name)
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
              <div className="chat-messages" ref={messagesContainerRef}>
                {loadingMessages ? (
                  <div className="loading-message">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="empty-message">No messages yet. Start the conversation!</div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isCurrentUser = message.userId === currentUser._id
                      const messageAuthor = getUsernameById(message.userId)

                      return (
                        <div key={message._id} className={`message-wrapper ${isCurrentUser ? "own" : "other"}`}>
                          <div className="message-info">
                            <span className="message-author">{messageAuthor}</span>
                            <span className="message-timestamp">{formatTime(message.createdAt)}</span>
                          </div>
                          <div className={`message-bubble ${isCurrentUser ? "own" : "other"}`}>
                            <div className="message-text">{message.content}</div>
                          </div>
                        </div>
                      )
                    })}
                    {/* Invisible div to scroll to */}
                    <div ref={messagesEndRef} />
                  </>
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
                    placeholder={wsConnected ? "Type a message..." : "Connecting..."}
                    className="chat-input-field"
                    disabled={sendingMessage || !wsConnected}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  className="send-button"
                  disabled={sendingMessage || !inputValue.trim() || !wsConnected}
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-message">
                Select a chat to start messaging or{" "}
                <button className="create-chat-link" onClick={openCreateChatModal}>
                  create a new chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Chat Modal */}
      <CreateChatModal />

      {/* Error Display */}
      {error && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
	)  
}
