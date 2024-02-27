import { useEffect, useRef, useState } from "react";
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
  const [room, setRoom] = useState("");
  const [drawingRoomId, setDrawingRoomId] = useState<string>("");
  const [drawing, setDrawing] = useState<string>("");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    handleSave(); // Save the drawing state on mouse up
  };

  useEffect(() => {
    const loadCanvasData = async () => {
      try {
        console.log("Parsed Drawing Room Id:", drawingRoomId);

        if (canvasConnection) {
          await canvasConnection.invoke("GetDrawing", drawingRoomId);
        }
      } catch (error) {
        console.error("Error loading canvas data:", error);
      }
    };

    if (canvasRef.current && canvasConnection) {
      console.log("Loading canvas data...");
      loadCanvasData();
    }
  }, [canvasRef.current, canvasConnection, drawingRoomId]);

  useEffect(() => {
    if (drawing) {
      canvasRef.current?.loadSaveData(drawing, true);
    }
  }, [drawing]);

  const handleState = async () => {
    // ... other code

    // 1. Check if canvasRef and connection exist
    if (!canvasRef.current || !canvasConnection) {
      console.error("Canvas reference or connection is null or undefined");
      return;
    }

    console.log("Loading canvas data...");

    try {
      await canvasConnection.invoke("GetDrawing", drawingRoomId);
      canvasRef?.current.loadSaveData(drawing, true);
      console.log("Clicked LOAD -> Current state to load:", drawing);
    } catch (error) {
      console.error("Error loading drawing:", error);
    }
  };

  const handleSave = async () => {
    // @ts-ignore
    if (canvasRef.current && canvasConnection) {
      // @ts-ignore
      const saveData = canvasRef.current.getSaveData();

      if (saveData) {
        const drawingData = JSON.parse(saveData);

        console.log("Drawing being saved:", drawingData);

        try {
          // const drawingId = uuidv4();
          setDrawingRoomId(room);

          if (canvasConnection) {
            // await canvasConnection.invoke("GetDrawing", drawingRoomId);
            // @ts-ignore
            await canvasConnection.invoke("SaveDrawing", room, drawingData);
            console.log("Drawing saved:", drawingData);
          } else {
            console.error("Canvas connection is not in a connected state.");
          }
        } catch (error) {
          console.error("Error saving drawing:", error);
        }
      } else {
        console.error("Save data is null");
      }
    } else {
      console.error("Canvas reference or connection is null or undefined");
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

      canvasConn.on("ReceiveDrawing", (drawingData: any) => {
        console.log("Drawing received from backend:", drawingData);
        console.log("Loading drawing...");
        //TODO:
        // Use optional chaining to check if canvasRef is not null or undefined
        canvasRef.current?.loadSaveData(JSON.stringify(drawingData), true);
      });

      canvasConn.on("GetDrawing", (drawingData: any) => {
        console.log("Attempting to get drawing...");
        if (drawingData) {
          setDrawing(JSON.stringify(drawingData));
          console.log(drawingData);
          console.log("Drawing received:", drawingData);
          canvasRef.current?.loadSaveData(JSON.stringify(drawingData), true);
        } else {
          console.error("Invalid drawingData:", drawingData);
        }
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
                  <div
                    className="flex p-4"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                  >
                    <CanvasDraw
                      ref={(canvas: any) => (canvasRef.current = canvas)}
                      brushColor={brushColor}
                      canvasWidth={800}
                      canvasHeight={600}
                      hideGrid
                    />
                  </div>
                  <div className="flex flex-col items-center ml-4">
                    {/* Color picker */}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                    />
                    {/* Save button */}
                    {canvasRef ? (
                      <>
                        <button onClick={handleSave}>SAVE</button>
                        <button onClick={handleState}>LOAD</button>
                        <button onClick={() => canvasRef.current?.clear()}>
                          Clear
                        </button>
                        <button onClick={() => canvasRef.current?.undo()}>
                          Undo
                        </button>
                        <button
                          onClick={() => {
                            canvasRef.current?.loadSaveData(
                              JSON.stringify({
                                lines: [
                                  {
                                    points: [
                                      {
                                        x: 419.1032459743615,
                                        y: 232.53962513619842,
                                      },
                                      {
                                        x: 419.1032459743615,
                                        y: 232.53962513619842,
                                      },
                                      {
                                        x: 419.1032459743615,
                                        y: 232.53962513619842,
                                      },
                                      {
                                        x: 419.1032459743615,
                                        y: 232.53962513619842,
                                      },
                                      {
                                        x: 419.1032459743615,
                                        y: 232.53962513619842,
                                      },
                                    ],
                                    brushColor: "#000000",
                                    brushRadius: 10,
                                  },
                                ],
                                width: 800,
                                height: 600,
                              }),
                              true
                            );
                          }}
                        >
                          test
                        </button>
                        <button
                          onClick={() => {
                            console.log("localstate: " + drawing);
                          }}
                        >
                          local state
                        </button>
                        {/* <button onClick={()=>canvasRef.loadSaveData(JSON.stringify(drawing), true)}>Load</button> */}
                      </>
                    ) : (
                      <div></div>
                    )}
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
