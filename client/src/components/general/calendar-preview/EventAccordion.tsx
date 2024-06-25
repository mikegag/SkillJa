import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState, useEffect, useRef } from "react"

type EventAccordionProps = {
  title: string,
  time: string, 
  description: string
};

export default function EventAccordion({ title, time, description }: EventAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [answerHeight, setAnswerHeight] = useState<number | undefined>(undefined)
  const answerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAnswerHeight(isOpen ? answerRef.current?.scrollHeight : 0)
  }, [isOpen])

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="rounded-3xl my-3 mx-auto border border-main-grey-200 bg-white w-72 lg:w-96 font-source overflow-hidden hover:border-main-green-100">
      <button
        onClick={toggleAccordion}
        className={`flex justify-between items-center w-full px-4 py-3   ${isOpen ? 'rounded-b-none' : ''}`}
      >
        <p className="bg-main-white font-kulim font-medium text-main-green-900 text-base mr-auto">{title}</p>
        <p className="bg-main-white font-kulim font-medium text-main-green-900 text-base ml-auto pl-8">{time}</p>
      </button>
      <div
        className={` max-h-40 overflow-scroll transition-height duration-300 rounded-lg ${isOpen ? 'rounded-t-none' : ''}`}
        style={{ height: isOpen ? answerHeight : 0 }}
      >
        <div ref={answerRef} className={`bg-main-color-lightgrey flex flex-col items-start p-4 ${isOpen ? 'flex flex-col border-t' : 'hidden'}`}>
          <p className="font-kulim font-light text-main-green-900 mb-8">
            {description}
          </p>
          <button 
            className="form-btn text-sm py-1.5 px-5 bg-main-green-400 hover:bg-main-green-500 ml-auto"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  )
}