import React, { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment'
import { io } from "socket.io-client"

import { useLocation } from 'react-router-dom'


const ChatRoom = () => {
    const location= useLocation();
    const msgBoxRef = useRef();
    const [socket, setSocket] = useState()
    const [data, setData] = useState({});
    const [msg, setMsg] = useState("");
    const [allMessages, setMessages] = useState([])

useEffect(() => {
    const socket = io("http://localhost:8000")
    setSocket(socket)

    socket.on("connect", () =>{
        console.log(socket.id);

        socket.emit("joinRoom", location.state.room)
    })

    socket.on("getLatestMessage", newMessage=> {
        // console.log(newMessage);
        setMessages([...allMessages,newMessage] )
    })
},[]) 

    useEffect(() => {
        setData(location.state)
        // console.log(data);
    }, [location])


    useEffect(() => {
        if(socket){
            socket.on("getLatestMessage", (newMessage) => {
                console.log(allMessages)
                console.log(newMessage)
                setMessages([ ...allMessages,  newMessage ])
                msgBoxRef.current.scrollIntoView({behavior: "smooth"})
                setMsg("")
                // setLoading(false)
            })
        }
    },[socket,allMessages])

    const handleChange = (e) => setMsg(e.target.value) 
    const handleEnter = e => e.keyCode===13 ? onSubmit() : ""
    const onSubmit =(e) =>{
        if(msg){
            const newMessage = {time: new Date(), msg, name: data.name}
            socket.emit("NewMessage",{ newMessage, room:data.room}    )

        }

            
        // setMessages([...allMessages,newMessage] )
    }
  return (
    <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container" >
    <div className="text-center px-3 mb-4 text-capitalize">
        <h1 className="text-warning mb-4">{data?.room} Chat Room</h1>
    </div>


    <div className="bg-light border rounded p-3 mb-4" style={{height: "450px", overflowY:"scroll"}}>

    {
                    allMessages.map(msg => {
                        return data.name === msg.name
                        ?
                        <div className="row justify-content-end pl-5 ">
                        <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto">
                            <div>
                                <strong className="m-1">{msg.name}</strong>
                                <small className="text-muted m-1"><Moment fromNow>{msg.time}</Moment></small>
                            </div>
                            <h4 className="m-1">{msg.msg}</h4>
                        </div>
                    </div>
                    :
                    <div className="row justify-content-start">
                    <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto">
                        <div>
                            <strong className="m-1">{msg.name}</strong>
                            <small className="text-muted m-1"><Moment fromNow>{msg.time}</Moment></small>
                        </div>
                        <h4 className="m-1">{msg.msg}</h4>
                    </div>
                </div>
                    })
                }
                
      <div ref={msgBoxRef}>

      </div>
               
            
              
       
    </div>
    <div className="form-group d-flex">
        <input type="text" className="form-control bg-light"  value={msg} name="message" onKeyDown={handleEnter} onChange={handleChange} placeholder="Type your message" />
        <button type="button" className="btn btn-warning mx-2" onClick={onSubmit}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                            </svg>
        </button>   
    </div>
</div>
  )
}

export default ChatRoom