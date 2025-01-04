import React, { useEffect, useState } from "react"
import Header from "../../components/navigation/Header"
import MessageSummary from "../../components/general/chat-preview/MessageSummary"
import ChatBox from "../../components/general/chat-preview/ChatBox"
import GetWindowSize from '../../hooks/GetWindowSize'
import Footer from "../../components/navigation/Footer"

interface Message {
    senderId: number;
    messagePreview: string;
    opened: boolean;
    selected: number;

    messageId?: string;
    sender: string;
    content?: string;
    sentAt?: string;
    read?: boolean;

}

interface Chat {
    senderId: number,
    sender: string,
    userId: number,

    user1?: string,
    user2?: string,
    messages: Message[]
}

/* 

need a view that returns a list of messagepreviews - get{
    senderId 
    sender
    opened = any existence of a message from sender with read = false
    messagePreview = last sent message
    sentAt = time last message was sent
}

need a view that returns an entire chat - get {
    senderId
    sender
    userId
    messages
    chatId (used to update message read status)
}

need a view that updates messages read status - post {
    chatId
    messageId
}

http polling every 45 seconds to reload messagepreviews and currently open chat if exists

*/

export default function Chat(){
    const size = GetWindowSize()
    const [openChat, setOpenChat] = useState<boolean>(false) 
    const [selectedChat, setSelectedChat] = useState<number>(0)
    const [selectedChatDetails, setSelectedChatDetails] = useState<Chat>({
        senderId: -1,
        sender: '',
        userId: -2,
        messages: []
    })

    useEffect(()=>{
        document.title = 'SkillJa - Messages'
    },[])

    useEffect(()=>{
        // if chat is exited, clear any currently selected chat data
        if(!openChat && selectedChatDetails){
            setSelectedChatDetails({
                senderId: -1,
                sender: '',
                userId: -2,
                messages: []
            })
        }
    },[openChat])

    //api call to get user id and pass to chatbox

    return (
        <div className="flex flex-col"> 
            <Header useCase="protected"/>
            <div className="flex mt-10 pb-4 lg:pb-0 mb-16 lg:mb-32 md:px-12">
                {size.width < 900 && openChat === true ?
                    <ChatBox 
                        displayChatBox={setOpenChat} 
                        senderId={selectedChatDetails.senderId}
                        sender={selectedChatDetails.sender}
                        userId={selectedChatDetails.userId}
                        messages={selectedChatDetails.messages}
                    />
                    :
                    <section className="w-full mx-5 lg:mx-0 lg:pr-8">
                        <h1 className=" mt-4 mb-8 mr-auto text-4xl font-source font-semibold">
                            Messages
                        </h1>
                        <div className="flex flex-col h-96 overflow-scroll">
                            <div onClick={()=>{setSelectedChatDetails({
                                senderId: 1,
                                sender: 'jeff',
                                userId: 2,
                                messages: []

                            }); setOpenChat(true); setSelectedChat(1)}
                            }>
                                <MessageSummary
                                    senderId={1}
                                    selected={selectedChat} 
                                    sender="Jeff Mare"
                                    opened={false}
                                    messagePreview="Hi its jeff! I like da meathballs ok ahahah"
                                    sentAt="12-24"
                                />
                            </div>
                            <div onClick={()=>{setSelectedChatDetails({
                                senderId: 3,
                                sender: 'john',
                                userId: 2,
                                messages: []

                            }); setOpenChat(true); setSelectedChat(3)}
                            }>
                                <MessageSummary
                                    senderId={3}
                                    selected={selectedChat} 
                                    sender="john d"
                                    opened={false}
                                    messagePreview="my name john"
                                    sentAt="1-1-25"
                                />
                            </div>
                        </div>   
                    </section>
                }
                {size.width >= 900 && (
                    <ChatBox 
                        displayChatBox={setOpenChat} 
                        senderId={selectedChatDetails.senderId}
                        sender={selectedChatDetails.sender}
                        userId={selectedChatDetails.userId}
                        messages={selectedChatDetails.messages}
                    />
                )}
            </div>
            <Footer />
        </div>
    )
}