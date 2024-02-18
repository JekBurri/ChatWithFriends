import { useEffect, useRef } from "react";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";


export default function ChatRoom({messages, sendMessage}: any) {
    const messagesContainerRef = useRef();

    useEffect(() => {
        // Automatically scroll to the bottom when new messages are added
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, [messages]);


    return (<>
        <div className="flex flex-col flex-1 overflow-hidden bg-white">
  {/* Chat Room Title */}
  <div className="flex justify-center items-center bg-gray-200 p-2">
    <h2 className="text-lg font-semibold">Chat Room</h2>
  </div>

  {/* Message Container */}
  <div className="flex-1 overflow-y-auto px-5 py-3 max-h-60" ref={messagesContainerRef}>
    <MessageContainer messages={messages} />
  </div>

  {/* Send Message Form */}
  <div className="bg-gray-200 p-3">
    <SendMessageForm sendMessage={sendMessage} />
  </div>
</div>
    </>)
}
