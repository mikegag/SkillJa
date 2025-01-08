import { faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

interface Message {
    senderId: number;
    sender: string;
    messagePreview: string;
    opened: boolean;
    selectedChat: number;
    chatId: number;
    sentAt: string;
}

export default function MessageSummary({sender, messagePreview, opened, selectedChat, chatId, sentAt, senderId}: Message){
    const currentDate = getCurrentDate()

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

    return (
        <div 
            className={`flex justify-center items-center ${selectedChat === chatId ? "bg-main-grey-100" : "bg-main-white"} h-24 mb-2.5 rounded-xl border border-main-grey-100 py-0.5 px-2 lg:p-1 cursor-pointer hover:border-main-green-500`}
        >
            <FontAwesomeIcon icon={faCircle} className={`text-lg lg:text-sm mr-6 ml-2 ${opened ? (`${selectedChat === chatId ? "text-main-grey-200": "text-main-grey-100" }`) : "text-main-green-200"}`} />
            {/* <img 
                src={require('../../../assets/google-logo.png')} 
                className="w-14 h-14 lg:w-16 lg:h-16 my-2 mx-4 lg:ml-4 lg:mr-3 rounded-full border"
            /> */}
            <div className="flex flex-col w-full">
                <div className="flex mb-2 w-full">
                    <h3 className="font-kulim">
                        {sender ? sender : "Unknown"}
                    </h3>
                    <p className="my-auto ml-auto mr-0 pr-2">
                        {formatSentAtProp(sentAt) === currentDate ? 'Today' : formatSentAtProp(sentAt)}
                    </p>
                </div>  
                <div className="w-48 whitespace-nowrap">
                    <p className="text-sm overflow-hidden text-ellipsis">
                        {messagePreview ? messagePreview : "..."}
                    </p>
                </div> 
            </div>
        </div>
    )
}