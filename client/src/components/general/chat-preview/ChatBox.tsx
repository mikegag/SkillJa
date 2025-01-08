import React, { useEffect, useRef, useState } from "react"
import GetWindowSize from "../../../hooks/GetWindowSize"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faCircleArrowUp } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";

interface Message {
    messageId: number;
    senderId: number;
    content: string;
    sentAt: string;
    read: boolean;
}

interface ChatBoxProps {
    userId: number;
    displayChatBox: (val:boolean)=>void
    sender: string;
    senderId: number;
    messages: Message[];
    chatId: number;
    csrftoken: string;
}


export default function ChatBox({displayChatBox, userId, sender, messages, chatId, csrftoken}:ChatBoxProps){
    const size = GetWindowSize()
    const displayedDates = new Set<string>()
    const currentDate = getCurrentDate() 
    const [message, setMessage] = useState<string>("")
    const [chatMessages, setChatMessages] = useState<Message[]>(messages)
     // Ref for the chat end to enforce autoscroll during initial load
    const chatEndRef = useRef<HTMLDivElement>(null)
    
    useEffect(()=>{
        setChatMessages(messages)
    },[chatId])

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block:"nearest" })
    }, [chatMessages])
    
    // helper function that returns the a raw and formatted date object
    function getCurrentDate(){
        const date = new Date()
        const month = date.getMonth() + 1
        const day = date.getDate().toString()
        return `0${day}-0${month}`
    }
    // formats sentAt prop which is a date object in the format {yyyy}-{mm}-{dd}T{00:00:00Z}
    function formatSentAtProp(sentAtProp: string){
        const day = sentAtProp.slice(8,10)
        const month = sentAtProp.slice(5,7)
        return `${day}-${month}`
    }
    // API call to send message in chat
    function handleMessage(){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/chat/send_chat_message/`, {chat_id: chatId, message: message}, { 
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if (res.status === 201) {
                    const newMessage:Message = res.data.message
    
                    // Update UI optimistically and clear message input field
                    setChatMessages((prevMessages) => [...prevMessages, newMessage])
                    setMessage("")
                }
            })
            .catch(error => {
                console.error(error)
                alert("Failed to send the message. Please try again.")
            })
    }
    
    return (
        <section className="w-full h-fit flex flex-col px-4 md:pr-0 md:pl-8 md:border-l-4 border-main-grey-200">
            <div className="flex justify-center lg:justify-start pb-6 mb-2">
                {size.width < 900 && (
                    <FontAwesomeIcon 
                        icon={faChevronLeft} 
                        className="text-2xl my-auto mr-6 ml-3 text-main-green-500 hover:text-main-green-700 cursor-pointer"
                        onClick={()=>displayChatBox(false)} 
                    />
                )}
                <div className="flex justify-center items-center mr-6 md:mr-auto lg:flex-row bg-white border border-gray-300 w-full rounded-xl">
                    <h3 className="text-main-green-900 text-xl lg:text-2xl text-center font-source mx-auto p-3">
                        {sender ? sender : 'Select a chat'}
                    </h3>
                </div>
            </div>
            <div className="flex flex-col h-96 overflow-scroll">
                {chatMessages.map((msg, index) => {
                    const isUserMessage = msg.senderId === userId;
                    const showDate = displayedDates.has(formatSentAtProp(msg.sentAt));
                    if (msg.sentAt) displayedDates.add(formatSentAtProp(msg.sentAt));

                    return (
                        <div key={msg.messageId || index} className="flex flex-col">
                            {!showDate && (
                                <p className="text-sm mx-auto my-2">
                                    {formatSentAtProp(msg.sentAt) === currentDate
                                        ? "Today"
                                        : formatSentAtProp(msg.sentAt)}
                                </p>
                            )}
                            <div
                                className={`rounded-2xl w-fit py-2 px-4 my-1.5 ${
                                    isUserMessage
                                        ? "bg-main-green-500 text-main-white ml-auto"
                                        : "bg-main-grey-100 text-black mr-auto"
                                }`}
                            >
                                <p className="font-kulim text-center mx-auto">{msg.content}</p>
                            </div>
                            {/* Invisible div to scroll to the bottom */}
                            {chatMessages.length === index+1 && (<div ref={chatEndRef} />)}
                        </div>
                    )
                })}
                
            </div>
            <div className="relative w-full pt-6">
                <input 
                    type="text" 
                    placeholder="Type Message Here" 
                    className="form-input border-gray-300 text-base px-4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleMessage()}
                />
                <FontAwesomeIcon 
                    icon={faCircleArrowUp} 
                    className="absolute right-4 inset-y-12 text-main-green-500 my-auto text-2xl" 
                    onClick={handleMessage}
                />
            </div>
        </section>
    )
}