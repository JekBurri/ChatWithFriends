import { useState } from 'react';
import './App.css'
import { WaitingRoom } from './components/WaitingRoom'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const [conn, setConn] = useState();
  const [messages, setMessages] = useState([]);

  const joinChatRoom = async (username: string, chatroom: string) => {
    try {
      // @ts-ignore
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5289/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinSpecificChatRoom", (username: any, msg: any) => {
        console.log("msg: ", msg);
      });

      conn.on("RecieveMessage", (username: any, msg: any) => {
        setMessages(messages => [...messages, {username, msg}]);
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", { username, chatroom });
      setConn(conn);

    } catch (error) {
      console.log(error);
    }

  }


  const sendMessage = async(message:string) => {
    try {
      // @ts-ignore
      await conn.invoke("SendMessage", message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <main className='flex-1 flex flex-col overflow-hidden'>
      <header className="flex-shrink-0 bg-blue-500">
        <div className="flex items-center justify-between p-2">
          <h1 className="text-white text-2xl">ChatWithFriends</h1>
        </div>
      </header>
      <section className="flex-1 overflow-hidden bg-white">
      <div className="flex justify-around gap-4">
       

        {!conn ? (
          <div className="flex-1 p-4 max-w-lg m-auto">
            <WaitingRoom joinChatRoom={joinChatRoom} />
          </div>
        ) : (
          <div className="flex p-4">
            <ChatRoom messages={messages} sendMessage={sendMessage} />
            <canvas id="canvas" height={500} width={500} className="border"></canvas>
          </div>
        )}
      </div>
    </section>
    </main>
    </div>
  )
}

export default App
