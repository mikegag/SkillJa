import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState, useEffect, useRef } from "react"

type AccordionProps = {
  title: string,
  children: React.ReactNode
};

export default function Accordion({ title, children }: AccordionProps) {
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
    <div className="rounded-2xl mb-5 mx-auto border border-main-grey-200 bg-white w-72 font-source overflow-hidden">
      <button
        onClick={toggleAccordion}
        className={`flex justify-between items-center w-full p-3   ${isOpen ? 'rounded-b-none' : ''}`}
      >
        <p className="select-btn">{title}</p>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`ml-3 h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      <div
        className={` max-h-40 overflow-scroll transition-height duration-300 rounded-lg ${isOpen ? 'rounded-t-none' : ''}`}
        style={{ height: isOpen ? answerHeight : 0 }}
      >
        <div ref={answerRef} className={`bg-main-color-lightgrey ${isOpen ? 'flex flex-col border-t' : 'hidden'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}