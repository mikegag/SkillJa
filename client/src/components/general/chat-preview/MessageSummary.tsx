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
        <div 
            className={`flex justify-center items-center ${selectedChat === chatId? "bg-main-grey-100" : "bg-main-white"} mb-2.5 rounded-xl border border-main-grey-100 py-0.5 px-2 lg:p-1 cursor-pointer hover:border-main-green-500`}
        >
            <FontAwesomeIcon icon={faCircle} className={`text-lg lg:text-sm lg:ml-1 ${opened ? "text-main-grey-100" : "text-main-green-200"}`} />
            <img 
                src={require('../../../assets/google-logo.png')} 
                className="w-14 h-14 lg:w-16 lg:h-16 my-2 mx-4 lg:ml-4 lg:mr-3 rounded-full border"
            />
            <div className="flex flex-col w-full">
                <div className="flex mb-2 w-full">
                    <h3 className="font-kulim">
                        {sender ? sender : "Unknown"}
                    </h3>
                    <p className="my-auto ml-auto mr-0 pr-2">
                        {sentAt ? (sentAt === currentDate.rawDate ? 'Today' : formatSentAtProp(sentAt)) : "-"}
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