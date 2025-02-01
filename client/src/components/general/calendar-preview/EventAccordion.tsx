import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState, useEffect, useRef } from "react"

type EventAccordionProps = {
  title: string;
  time: string;
  description?: string;
  styling?: string;
}

export default function EventAccordion({ title, time, description, styling }: EventAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [answerHeight, setAnswerHeight] = useState<number | undefined>(undefined)
  const answerRef = useRef<HTMLDivElement>(null)
  let formattedTime = time.slice(10,-3)

  function formatTime(dateString:string) {
    const date = new Date(dateString); // Convert the string to a Date object
  
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',  
      hour12: true 
    };
    
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
    
    return formattedTime; // This will return the time in "hh:mm AM/PM" format
  }
  useEffect(() => {
    setAnswerHeight(isOpen ? answerRef.current?.scrollHeight : 0)
  }, [isOpen])

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`${styling} rounded-xl my-3 border border-gray-300 bg-white w-72 lg:w-96 font-source overflow-hidden hover:border-main-green-700`}>
      <button
        onClick={toggleAccordion}
        className={`flex justify-between items-center w-full px-4 py-3   ${isOpen ? 'rounded-b-none' : ''}`}
      >
        <p className="bg-main-white font-kulim font-medium text-main-green-900 text-base mr-auto">{title}</p>
        <p className="bg-main-white font-kulim font-medium text-main-green-900 text-base ml-auto pl-8">{formatTime(time)}</p>
      </button>
      <div
        className={` max-h-40 overflow-scroll transition-height duration-300 rounded-lg ${isOpen ? 'rounded-t-none' : ''}`}
        style={{ height: isOpen ? answerHeight : 0 }}
      >
        <div ref={answerRef} className={`bg-main-color-lightgrey flex flex-col items-start p-4 ${isOpen ? 'flex flex-col' : 'hidden'}`}>
          <p className="font-kulim font-light text-main-green-900 my-3 mx-auto">
            {description ? description : 'No event details given.'}
          </p>
        </div>
      </div>
    </div>
  )
}