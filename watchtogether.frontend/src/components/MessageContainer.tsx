

export default function MessageContainer({messages}:any) {
    return <div>
        {messages.map((msg:any, index:any) => {
            return <div className={"flex gap-4 mb-2"} key={index}>
                <span className="font-bold self-center text-xl text-blue-500">{msg.username}</span>
                <span className="bg-gray-200 p-2 rounded-md">{msg.msg}</span>
            </div>
        })}
    </div>
}