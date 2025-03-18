import React, { useState, useContext, ChangeEvent } from "react";
import { UserContext, UserContextType } from "../contexts/userContext";

// const socket = new WebSocket('ws://localhost:8080');

interface ChatProps {

}

export default function Chat(props: ChatProps): React.JSX.Element {
	const [message, setMessage] = useState<string>('');

	function sendMessage(): void {
		setMessage('');
	}

	return (
		<div className="display">
			<div>

			</div>
			<div>
				<input
					type="text"
					required
					value={message}
					onChange={(e: ChangeEvent<HTMLInputElement>): void => setMessage(e.target.value)}
					placeholder=" "
					autoComplete="message"
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
}