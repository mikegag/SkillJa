import { faCircle } from "@fortawesome/free-solid-svg-icons"
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
    // Check if passed date is the same as the current date
    function isToday(dateString: string) {
        const date = new Date(dateString)
        const localDate = new Date(date.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }))
        const today = new Date()
        
        return (
            localDate.getDate() === today.getDate() &&
            localDate.getMonth() === today.getMonth() &&
            localDate.getFullYear() === today.getFullYear()
        )
    }

    // Formats sentAt prop which is a date object in the format {yyyy}-{mm}-{dd}T{00:00:00Z}
    function formatSentAtProp(sentAtProp: string) {
        // Convert to Date object
        const date = new Date(sentAtProp)
    
        // Convert to local timezone
        const localDate = new Date(date.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }))
    
        const day = localDate.getDate()
        // 0-indexed
        const month = localDate.getMonth()
        const year = localDate.getFullYear()
    
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
        // Get current date in local time
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        // return current month name and day if passed date falls within current month range
        if (month === currentMonth && year === currentYear) {
            // e.g., "Feb 4"
            return `${monthNames[month]} ${day}`
        }
        // else return month and day e.g., "02-04"
        return `${month + 1}-${day}` 
    }

    return (
        <div 
            className={`flex justify-center items-center ${selectedChat === chatId ? "bg-main-grey-100" : "bg-main-white"} h-24 mb-2.5 rounded-xl border border-main-grey-100 py-0.5 px-2 lg:p-1 cursor-pointer hover:border-main-green-500`}
        >
            <FontAwesomeIcon 
                icon={faCircle} 
                className={`text-lg lg:text-sm mr-6 ml-2 ${opened ? (`${selectedChat === chatId ? "text-main-grey-200": "text-main-grey-100" }`) : "text-main-green-200"}`} 
            />
            <div className="flex flex-col w-full">
                <div className="flex mb-2 w-full">
                    <h3 className="font-kulim">
                        {sender ? sender : "Unknown"}
                    </h3>
                    <p className="my-auto ml-auto mr-0 pr-2">
                        {isToday(sentAt) ? 'Today' : formatSentAtProp(sentAt)}
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