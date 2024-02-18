import { useState } from "react";


export default function SendMessageForm({sendMessage}:any) {
    const[msg,setMsg] = useState('');
    return(<form onSubmit={(e) =>{
        e.preventDefault();
        sendMessage(msg);
        setMsg('');
    }}>
        <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button type="submit">Send</button>
    </form>)
}