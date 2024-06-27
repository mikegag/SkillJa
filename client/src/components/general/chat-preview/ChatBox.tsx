import React from "react"
import GetWindowSize from "../../../hooks/GetWindowSize"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

interface ChatBoxProps {
    displayChatBox: (val:boolean)=>void
    //add child props with messages and sender
}
export default function ChatBox({displayChatBox}:ChatBoxProps){
    //gets current window size
    const size = GetWindowSize()
    
    return (
        <section className="w-full flex flex-col lg:border-l h-dvh border-main-grey-300">
            <div className="flex justify-center lg:justify-start border-b border-main-grey-100 p-4">
                {size.width < 1024?
                    <FontAwesomeIcon 
                        icon={faChevronLeft} 
                        className="text-2xl my-auto mr-auto text-main-green-500 hover:text-main-green-700 cursor-pointer"
                        onClick={()=>displayChatBox(false)} 
                    />
                :
                    <></>
                }
                <div className="flex flex-col mr-auto lg:flex-row">
                    <img 
                        src={require('../../../assets/google-logo.png')} 
                        className="w-16 h-16 my-2 lg:my-auto mx-4 rounded-full border"
                    />
                    <h3 className="text-main-green-900 text-xl lg:text-3xl font-kulim my-auto">Jeff Mare</h3>
                </div>
            </div>
            <div className="flex flex-col h-full py-2 px-8 overflow-scroll">
                <div className="rounded-full bg-main-green-500 text-main-white py-2 px-4 mr-auto my-4">
                    <p className="font-kulim text-center mx-auto">Hi there! Greetings from Jeff</p>
                </div>
                <div className="rounded-full bg-main-grey-100 py-2 px-4 ml-auto my-4">
                    <p className="font-kulim text-center mx-auto">Hey Jeff, its Rass</p>
                </div>
            </div>
            <div className="mt-auto px-4 py-8">
                <input 
                    type="text" 
                    placeholder="Enter a Message" 
                    className="form-input text-base px-4"
                />
            </div>
        </section>
    )
}