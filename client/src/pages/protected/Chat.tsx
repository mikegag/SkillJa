import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import MessageSummary from "../../components/general/chat-preview/MessageSummary"
import ChatBox from "../../components/general/chat-preview/ChatBox"
import GetWindowSize from '../../hooks/GetWindowSize'

export default function Chat(){
    //gets current window size
    const size = GetWindowSize()
    const [openChat, setOpenChat] = useState<boolean>(false)
    useEffect(()=>{
        console.log(openChat)
    },[openChat])
    return (
        <div className="flex">
            {size.width < 1024 && openChat === true?
                <ChatBox displayChatBox={setOpenChat} />
                :
                <section className="w-full lg:max-w-lg">
                    <div className="flex mt-8 mb-14 px-8">
                        <h1 className="mr-auto text-3xl font-source">Chats</h1>
                        <FontAwesomeIcon 
                            icon={faPlusCircle} 
                            className="ml-auto text-3xl text-main-green-500 hover:text-main-green-700 cursor-pointer"
                            onClick={()=>setOpenChat(true)}
                        />
                    </div>
                    <MessageSummary />
                </section>
            }
            {size.width >= 1024 ? (
                <ChatBox displayChatBox={setOpenChat} />
            ) : (
                <></>
            )}
        </div>
    )
}