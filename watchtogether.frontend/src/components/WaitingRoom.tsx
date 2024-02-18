import { useState } from "react";


export const WaitingRoom = ({joinChatRoom}:any) => {
    const [username, setUsername] = useState("");
    const [chatroom, setChatroom] = useState("");

    return (
        <form onSubmit={e => {
            e.preventDefault();
            joinChatRoom(username, chatroom);
        }} className="bg-gray-200 p-4 rounded-md shadow-md">
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-bold text-gray-700">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="chatroom" className="block text-sm font-bold text-gray-700">Chatroom:</label>
                <input
                    type="text"
                    id="chatroom"
                    value={chatroom}
                    onChange={e => setChatroom(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300">
                Join Chatroom
            </button>
        </form>
        
    )


}