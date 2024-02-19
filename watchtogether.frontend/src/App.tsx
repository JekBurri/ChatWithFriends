import { useEffect, useState } from "react";
import "./App.css";
import { WaitingRoom } from "./components/WaitingRoom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import ChatRoom from "./components/ChatRoom";
import CanvasDraw from "react-canvas-draw";

function App() {
  const [conn, setConn] = useState();
  const [canvasConnection, setCanvasConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [brushColor, setBrushColor] = useState("#000000");
  const [canvasRef, setCanvasRef] = useState(null);
  const [room, setRoom] = useState("");

  type Point = {
    x: number;
    y: number;
  };

  type Line = {
    points: Point[];
    brushColor: string;
    brushRadius: number;
  };

  type JsonData = {
    lines: Line[];
    width: number;
    height: number;
  };

  useEffect(() => {
    if (canvasRef) {
      console.log("Canvas reference set:", canvasRef);
    }
  }, [canvasRef]);

  const handleSave = async () => {
    console.log("click");
  
      // @ts-ignore
    if (canvasRef) {
      // @ts-ignore
      const saveData = canvasRef.getSaveData();
  
      if (saveData) {
        const drawingData = JSON.parse(saveData);
  
        console.log("Drawing Data:", drawingData);
  
        try {
          // Assuming you have a drawingId for the current drawing session
          const drawingId = 1; // Replace with the actual drawingId
          // @ts-ignore
          await canvasConnection.invoke("SaveDrawing", drawingId, drawingData);
        } catch (error) {
          console.error("Error saving drawing:", error);
        }
      } else {
        console.error("Save data is null");
      }
    } else {
      console.error("Canvas reference is null or undefined");
    }
  };
  

  const joinChatRoom = async (username: string, chatroom: string) => {
  
    setRoom(chatroom);
    try {
      // @ts-ignore
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5289/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinSpecificChatRoom", (username: any, msg: any) => {
        console.log("User: ", username, "msg: ", msg);
      });

      conn.on("RecieveMessage", (username: any, msg: any) => {
        // @ts-ignore
        setMessages((messages) => [...messages, { username, msg }]);
        console.log(messages);
      });

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", { username, chatroom });
      // @ts-ignore
      setConn(conn);
    } catch (error) {
      console.log(error);
    }

    //canvas conn
    try {
      // @ts-ignore
      const canvasConn = new HubConnectionBuilder()
        .withUrl("http://localhost:5289/Draw")
        .configureLogging(LogLevel.Information)
        .build();

      console.log(canvasRef);

      canvasConn.on("ReceiveDrawing", (drawingData: any) => {
        console.log("Drawing received:", drawingData);
        console.log("Loading drawing...");
      
        // Use optional chaining to check if canvasRef is not null or undefined
        canvasRef?.loadSaveData(JSON.stringify(drawingData), true);
      });
      

      await canvasConn.start();
      // @ts-ignore
      setCanvasConnection(canvasConn);
      
    } catch (error) {
      console.error("Error creating connection:", error);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      // @ts-ignore
      await conn.invoke("SendMessage", message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col overflow-hidden">
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
                <div className="flex p-4">
                  {/* CanvasDraw component */}
                  <CanvasDraw
                    ref={(canvas: any) => setCanvasRef(canvas)}
                    brushColor={brushColor}
                    canvasWidth={800}
                    canvasHeight={600}
                    hideGrid
                  />
                  <div className="flex flex-col items-center ml-4">
                    {/* Color picker */}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                    />
                    {/* Save button */}
                    <button onClick={handleSave}>Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
