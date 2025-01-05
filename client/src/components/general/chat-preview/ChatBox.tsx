import React from "react"
import GetWindowSize from "../../../hooks/GetWindowSize"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faCircleArrowUp } from "@fortawesome/free-solid-svg-icons"

interface Message {
    messageId: number;
    senderId: number;
    content: string;
    sentAt: string;
    read: boolean;
}

interface ChatBoxProps {
    userId?: number;
    displayChatBox: (val:boolean)=>void
    sender?: string;
    senderId?: number;
    messages?: Message[];
}


export default function ChatBox({displayChatBox, userId, sender, messages}:ChatBoxProps){
    const size = GetWindowSize()
    const displayedDates = new Set<string>()
    const currentDate = getCurrentDate() 

     // helper function that returns the a raw and formatted date object
     function getCurrentDate(){
        const date = new Date()
        let month = date.getMonth() + 1
        let year = date.getFullYear().toString()
        let formattedYear = year.slice(2)
        return {rawDate: `${year}-${month}`, formattedDate: `${month}-${formattedYear}` }
    }
    // formats sentAt prop which is a date object in the format {yyyy}-{mm}-{dd}T{00:00:00Z}
    function formatSentAtProp(sentAtProp: string){
        const year = sentAtProp.slice(0,5)
        const month = sentAtProp.slice(6,8)
        return `${month}-${year}`
    }
    
    
    return (
        <section className="w-full h-fit flex flex-col pl-8 lg:border-l border-l-4 border-main-grey-200">
            <div className="flex justify-center lg:justify-start pb-6 mb-2">
                {size.width < 900 && (
                    <FontAwesomeIcon 
                        icon={faChevronLeft} 
                        className="text-2xl my-auto mr-6 ml-3 text-main-green-500 hover:text-main-green-700 cursor-pointer"
                        onClick={()=>displayChatBox(false)} 
                    />
                )}
                <div className="flex mr-auto lg:flex-row bg-white border border-gray-300 w-full rounded-xl">
                    <h3 className="text-main-green-900 text-xl lg:text-2xl text-center font-source mx-auto p-3">
                        {sender ? sender : 'Select a chat'}
                    </h3>
                </div>
            </div>
            <div className="flex flex-col h-96 overflow-scroll">
                {messages?.map((message, index) => {
                    const isUserMessage = message.senderId === userId
                    const showDate = !displayedDates.has(message.sentAt || "")
                    if (message.sentAt) displayedDates.add(message.sentAt)

                    return (
                        <div key={index}>
                            {showDate && (
                                <p className="text-sm mx-auto my-2">
                                    {message.sentAt ? (message.sentAt === currentDate.rawDate ? 'Today' : formatSentAtProp(message.sentAt)) : "-"}
                                </p>
                            )}
                            <div
                                className={`rounded-2xl ${isUserMessage ? "bg-main-green-500 text-main-white" : "bg-main-grey-100 text-black"} py-2 px-4 ${isUserMessage ? "ml-auto" : "mr-auto"} my-1`}
                            >
                                <p className="font-kulim text-center mx-auto">
                                    {message.content}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="relative w-full pt-6">
                <input 
                    type="text" 
                    placeholder="Type Message Here" 
                    className="form-input border-gray-300 text-base px-4"
                />
                <FontAwesomeIcon icon={faCircleArrowUp} className="absolute right-4 inset-y-12 text-main-green-500 my-auto text-2xl" />
            </div>
        </section>
    )
}