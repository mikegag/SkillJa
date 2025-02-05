import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react"
import { useEffect } from "react"

interface MonthDays {
    month: string;
    days: number[];
    yearChange?: boolean;
}

interface CalendarProps {
    monthDays: MonthDays;
    daySelection: (value:string)=>void;
    monthSelection: (value:boolean)=>void;
    selectedDay: string;
}

export default function CalendarDisplay({ monthDays, daySelection, monthSelection, selectedDay }: CalendarProps){
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    useEffect(()=>{
        daySelection(selectedDay)
    },[selectedDay])

    function getFirstDayOfMonth(year: number, month: number): number {
        return new Date(year, month, 1).getDay()
    }

    const today = new Date()
    const currentYear = monthDays.yearChange ? today.getFullYear() + 1 : today.getFullYear()
    const currentMonthIndex = new Date(`${monthDays.month} 1, ${currentYear}`).getMonth()
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex)
    const weeks: number[][] = Array.from({ length: 6 }, () => [])

    let currentWeek = 0

    // Empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        weeks[currentWeek].push(0)
    }

    // Fill the days of the month
    monthDays.days.forEach((day) => {
        if (weeks[currentWeek].length === 7) {
            currentWeek++
        }
        weeks[currentWeek].push(day)
    })

    // Fill remaining empty cells for the last week
    while (weeks[currentWeek].length < 7) {
        weeks[currentWeek].push(0)
    }

    return (
        <div className="flex flex-col font-source text-lg lg:text-2xl">
            <div className="flex mb-4 lg:mb-8 lg:px-8">
                <h2 className="text-main-green-900 font-source text-3xl lg:text-4xl font-semibold ml-0 mr-auto my-auto">
                    {monthDays.month} {currentYear}
                </h2>
                <div className="mr-0 ml-auto my-auto">
                    <button 
                        className="p-1 mx-2 w-fit text-main-green-900 hover:text-main-green-500"
                        onClick={()=>monthSelection(true)}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
                    </button>
                    <button 
                        className="p-1 mx-2 w-fit text-main-green-900 hover:text-main-green-500"
                        onClick={()=>monthSelection(false)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
                    </button>
                </div>
            </div>
            <table>
                <thead className="font-source">
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th
                                key={day}
                                className="pr-1 lg:pr-1.5 pb-6 font-source font-light"
                            >
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="pt-6">
                {weeks.map((week, index) => (
                    <tr key={index} className={index===0? 'pt-6': ""}>
                        {week.map((day, i) => (
                            <td 
                                key={i} 
                                id={`${monthDays.month}-${day}`}
                                className={`
                                    ${day === 0 ? 'empty cursor-not-allowed' : ''} 
                                    ${index===0 ? 'pt-5': ""}  
                                    font-source p-2 lg:py-5 lg:px-6`
                                }
                            >
                                <div className="flex justify-center w-full" onClick={()=>daySelection(day.toString())}>
                                    <p className={`flex justify-center px-2 py-0.5 lg:py-2 lg:px-3 md:min-w-12 mx-auto cursor-pointer hover:bg-main-green-400 hover:rounded-full hover:text-white
                                            ${( (today.toDateString().slice(8,10).replace(/^0+(?=\d)/, '') == day.toString()) && (today.toDateString().slice(4,7) == monthDays.month.slice(0,3)) ) && "underline"} 
                                            ${selectedDay === day.toString() && "bg-main-green-700 text-white rounded-full"}  
                                            ${day === 0 && 'cursor-not-allowed hover:bg-transparent'} `}
                                    >
                                        {day !== 0 ? day : ''}
                                    </p>
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}