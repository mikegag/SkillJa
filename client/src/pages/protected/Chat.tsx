import React, { useEffect, useState } from "react"
import Header from "../../components/navigation/Header"
import MessageSummary from "../../components/general/chat-preview/MessageSummary"
import ChatBox from "../../components/general/chat-preview/ChatBox"
import GetWindowSize from '../../hooks/GetWindowSize'
import Footer from "../../components/navigation/Footer"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"

interface Message {
    messageId: number;
    senderId: number;
    content: string;
    sentAt: string;
    read: boolean;
}

interface MessagePreview {
    chatId: number;
    userId: number;
    senderId: number;
    sender: string;
    opened: boolean;
    messagePreview: string;
    sentAt: string;
}

interface Chat {
    chatId: number;
    userId: number;
    senderId: number;
    sender: string;
    messages: Message[];
}


export default function Chat(){
    const size = GetWindowSize()
    const [openChat, setOpenChat] = useState<boolean>(false) 
    const [selectedChat, setSelectedChat] = useState<number>(-1)
    const [selectedChatDetails, setSelectedChatDetails] = useState<Chat | null>(null)
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [savedChats, setSavedChats] = useState<MessagePreview[] | null>(null)

    useEffect(()=>{
        document.title = 'SkillJa - Messages'

        // if a chat is currently being displayed, use http polling to update the conversation periodically
        if(selectedChatDetails){
            const httpPolling = setInterval(()=> retrieveChatInfo(selectedChatDetails.chatId), 45000)
            return ()=> clearInterval(httpPolling)
        }

    },[selectedChatDetails])

    useEffect(()=>{
        // if chat is exited, clear any currently selected chat data
        if(!openChat && selectedChatDetails){
            setSelectedChat(-1)
            setSelectedChatDetails(null)
        }

        // get any previous chats and display their previews
        retrieveMessagePreviews()
        
        // update message read status if currently selected chat has unopened messages
        if(selectedChat === selectedChatDetails?.chatId && savedChats?.filter((chatPreviewInfo)=> chatPreviewInfo.opened === false)){
            axios.post(`${process.env.REACT_APP_SKILLJA_URL}/chat/update_message_read_status/`, {chat_id: selectedChatDetails.chatId}, { 
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
                }) 
                .then(res => {
                    if(res.status===200){
                        // update displayed message previews, since message read status has been updated
                        retrieveMessagePreviews()
                    } 
                })
                .catch(error => {console.error(error)})
        }

    },[openChat])

    // Retrieves chat details
    function retrieveChatInfo(chatId:number){
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/chat/get_message_previews/?chat_id=${chatId}`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===200){
                    setSelectedChatDetails(res.data.chat)
                }
            })
            .catch(error => {console.error(error)})
    }

    // Retrieve message previews
    function retrieveMessagePreviews(){
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/chat/get_message_previews/`, { 
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===200){
                    setSavedChats(res.data.messagePreviews)
                } 
                // user is not part of any chats
                else if (res.status===204){
                    setSavedChats([])
                }
            })
            .catch(error => {console.error(error)})
    }

    return (
        <div className="flex flex-col"> 
            <Header useCase="protected"/>
            <div className="flex mt-10 pb-4 lg:pb-0 mb-16 lg:mb-32 md:px-12">
                {size.width < 900 && openChat === true ?
                    <ChatBox 
                        displayChatBox={setOpenChat} 
                        senderId={selectedChatDetails ? selectedChatDetails.senderId : -1}
                        sender={selectedChatDetails ? selectedChatDetails.sender : "Select a chat"}
                        userId={selectedChatDetails ? selectedChatDetails.userId : -2}
                        messages={selectedChatDetails ? selectedChatDetails.messages : []}
                    />
                    :
                    <section className="w-full mx-5 lg:mx-0 lg:pr-8">
                        <h1 className=" mt-4 mb-8 mr-auto text-4xl font-source font-semibold">
                            Messages
                        </h1>
                        <div className="flex flex-col h-96 overflow-scroll">
                            {savedChats ? 
                                savedChats.map((preview, index)=>(
                                    <div 
                                        key={index} 
                                        onClick={()=>{
                                            retrieveChatInfo(preview.chatId);
                                            setOpenChat(true); 
                                            setSelectedChat(preview.chatId);
                                        }}
                                    >
                                        <MessageSummary
                                            senderId={preview.senderId}
                                            chatId={preview.chatId}
                                            selectedChat={selectedChat} 
                                            sender={preview.sender}
                                            opened={preview.opened}
                                            messagePreview={preview.messagePreview}
                                            sentAt={preview.sentAt}
                                        />
                                    </div>
                                ))
                            :
                                <div className="mx-auto my-6">
                                    <p className="px-3 mx-auto">No messages available</p>
                                </div>
                            }
                        </div>   
                    </section>
                }
                {size.width >= 900 && (
                    <ChatBox 
                        displayChatBox={setOpenChat} 
                        senderId={selectedChatDetails ? selectedChatDetails.senderId : -1}
                        sender={selectedChatDetails ? selectedChatDetails.sender : "Select a chat"}
                        userId={selectedChatDetails ? selectedChatDetails.userId : -2}
                        messages={selectedChatDetails ? selectedChatDetails.messages : []}
                    />
                )}
            </div>
            <Footer />
        </div>
    )
}