import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import GetWindowSize from "../../../hooks/GetWindowSize"
import Accordion from "../Accordion"
import DatePicker from "react-datepicker"
import axios from "axios"

interface Props {
    displayForm: (value:boolean) => void;
    csrftoken: string;
}
interface Week {
    dayOfWeek: number;
    startTime: string; 
    endTime: string;
}
interface Availability {
    currentMonth: {
        weekly: Week[],
        blockedDays: string[]
    };
    nextMonth: {
        weekly: Week[],
        blockedDays: string[]
    };
}

export default function AvailabilityForm({csrftoken, displayForm}:Props){
    const daysInWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    const windowSize = GetWindowSize()
    const [insideForm, setInsideForm] = useState<boolean>(false)
    const [prevAvailability, setPrevAvailability] = useState<Availability>()
    // Holds values for both current and next month checked days
    const [checkedDays, setCheckedDays] =  useState<{ [key: string]: boolean }>({})
    // Fill availabilities with default values
    const [currentMonthAvailability, setCurrentMonthAvailability] = useState<Availability['currentMonth']>({
        weekly: Array.from({ length: 7 }, (_, index) => ({ dayOfWeek: index, startTime: '00:00', endTime: '00:00'})),
        blockedDays: [],
    })
    const [nextMonthAvailability, setNextMonthAvailability] = useState<Availability['nextMonth']>({
        weekly: Array.from({ length: 7 }, (_, index) => ({ dayOfWeek: index, startTime: '00:00', endTime: '00:00'})),
        blockedDays: [],
    })
    
    useEffect(()=>{
        console.log(nextMonthAvailability)
        console.log(currentMonthAvailability)
        console.log(checkedDays)
    },[nextMonthAvailability, currentMonthAvailability, checkedDays])

    // API call to get any saved previous availability 
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/calendar/get_coach_availability/`, { 
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===200){
                    setPrevAvailability(res.data.availability)
                } 
            })
            .catch(error => {console.error(error)})
    },[])

    // API call to save availability changes
    function handleSubmit(){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/calendar/create_coach_availability/`, {
            currentMonth: currentMonthAvailability,
            nextMonth: nextMonthAvailability
        }, { 
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
            }) 
            .then(res => {
                if(res.status===200){
                } 
            })
            .catch(error => {console.error(error)})
    }

    // Handle date selection from the calendar
    function handleDateSelect (date: Date | null, month: 'current' | 'next') {
        if (date && month === 'current') {
            // Format as YYYY-MM-DD
            const formattedDate = date.toISOString().split('T')[0]
            if (!currentMonthAvailability.blockedDays.includes(formattedDate)) {
                setCurrentMonthAvailability({
                    ...currentMonthAvailability, 
                    blockedDays: [...currentMonthAvailability.blockedDays, formattedDate]
                })
            }
        }
        else if (date && month === 'next') {
            // Format as YYYY-MM-DD
            const formattedDate = date.toISOString().split('T')[0]
            if (!nextMonthAvailability.blockedDays.includes(formattedDate)) {
                setNextMonthAvailability({
                    ...nextMonthAvailability, 
                    blockedDays: [...nextMonthAvailability.blockedDays, formattedDate]
                })
            }
        }
    }

    // Remove a date from the blocked days list
    function handleRemoveDate (dateToRemove: string, month: 'current' | 'next') {
        if (month === 'current'){
            setCurrentMonthAvailability({
                ...currentMonthAvailability, 
                blockedDays: currentMonthAvailability.blockedDays.filter((day:string) => day !== dateToRemove)
            })
        }
        else if (month === 'next'){
            setNextMonthAvailability({
                ...nextMonthAvailability, 
                blockedDays: nextMonthAvailability.blockedDays.filter((day:string) => day !== dateToRemove)
            })
        }
    }

    // Close the form if user clicks outside of it
    function handleExit(value:boolean){
        if(!insideForm) { displayForm(value) }
    }

    // Toggle checkbox state for a day
    function handleCheckboxChange(day: string) {
        setCheckedDays(prevState => ({...prevState, [day]: !prevState[day]}))
    }

    // Update selected month availability times
    function handleTimeChange(day: string, type: 'start' | 'end', value: string, month: 'current' | 'next') {
        // Find the day index
        const dayIndex = daysInWeek.indexOf(day)
        // Determine the correct availability state and setter function
        const [availability, setAvailability] = month === 'current' ? 
            [currentMonthAvailability, setCurrentMonthAvailability] : [nextMonthAvailability, setNextMonthAvailability]
        // Create an updated availability object
        const updatedAvailability = {
            ...availability,
            weekly: availability.weekly.map((dayObj, index) =>
                index === dayIndex
                    ? { ...dayObj, [type === 'start' ? 'startTime' : 'endTime']: value }
                    : dayObj
            ),
        }
        // Update the state
        setAvailability(updatedAvailability)
    }


    return (
        <div className="pop-up-background">
            <div className="pop-up-container h-5/6 py-0">
                <div className="flex justify-center items-center p-4 font-kulim bg-main-white rounded-t-xl">
                    <FontAwesomeIcon 
                        icon={faX}
                        className="text-main-green-900 hover:text-main-green-500 mr-auto cursor-pointer"
                        onClick={()=>handleExit(false)}
                        onMouseEnter={()=>setInsideForm(false)}
                    />
                    <h3 className="text-lg font-medium mx-auto text-center pl-6">
                        Edit Availability
                    </h3>
                    <p 
                        className="text-main-green-900 hover:text-main-green-500 ml-auto cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Save
                    </p>
                </div>
                <Accordion 
                    title="Current Month" 
                    styles=" border-0 mt-12 mb-12 px-4" 
                    childrenContainerStyles="max-h-92 border-b border-main-grey-100"
                    children = {
                        <div className="px-6">
                            <form>
                                <div className="py-4">
                                    {daysInWeek.map((day, index)=>(
                                        <div key={index} className="flex flex-wrap justify-end mx-auto mb-4">
                                            <div className="toggle-btn my-auto mx-0">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox" id={`current-month-${day}-checkbox`} 
                                                    checked={checkedDays[`current-month-${day}-checkbox`] || false} 
                                                    onChange={() => {
                                                        handleCheckboxChange(`current-month-${day}-checkbox`);
                                                        checkedDays[`current-month-${day}-checkbox`] === false && (handleTimeChange(day, 'start', '00:00', 'current'))
                                                        checkedDays[`current-month-${day}-checkbox`] === false && (handleTimeChange(day, 'end', '00:00', 'current'))
                                                    }}
                                                />
                                                <label htmlFor={`current-month-${day}-checkbox`} className="checkbox-label">
                                                    <span className="ball" id="ball"></span>
                                                </label>
                                            </div>
                                            <label className="px-3 my-auto ml-3 mr-auto font-kulim">{windowSize.width >=1100 ? day : day.slice(0,3)}</label>
                                            {!checkedDays[`current-month-${day}-checkbox`] ? 
                                                <p className="font-kulim text-end my-auto ml-auto py-1.5">Unavailable</p>
                                            :
                                            <>
                                                <div className="flex border border-main-grey-100 rounded-lg ml-auto mr-0 cursor-pointer hover:border-main-green-500">
                                                    <input 
                                                        type="time" 
                                                        id={`current-month-${day}-start-time`}   
                                                        className="font-kulim text-sm rounded-lg focus:ring-0 focus:border-0 outline-none w-full p-2 cursor-pointer" 
                                                        min="04:00" 
                                                        max="21:00" 
                                                        value={currentMonthAvailability.weekly[index]?.startTime || '00:00'}
                                                        onChange={(e) => handleTimeChange(day, 'start', e.target.value, 'current')}
                                                    />
                                                </div>
                                                <p className="mx-4 my-auto">To</p>
                                                <div className="flex border border-main-grey-100 rounded-lg mx-0 cursor-pointer hover:border-main-green-500">
                                                    <input 
                                                        type="time" 
                                                        id={`current-month-${day}-end-time`}  
                                                        className="font-kulim text-sm rounded-lg focus:ring-0 focus:border-0 outline-none w-full p-2 cursor-pointer" 
                                                        min="04:00" 
                                                        max="21:00" 
                                                        value={currentMonthAvailability.weekly[index]?.endTime || '00:00'}
                                                        onChange={(e) => handleTimeChange(day, 'end', e.target.value, 'current')}
                                                    />
                                                </div>
                                            </>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </form>
                            <p className="mt-6 mb-3 underline w-full font-kulim">Blocked Days</p>
                            <div className="flex flex-wrap justify-center mt-3 mb-12">
                                <DatePicker
                                    inline
                                    minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)}
                                    wrapperClassName="datepicker"
                                    onChange={(date) => handleDateSelect(date, 'current')} // Trigger when a date is selected
                                    highlightDates={currentMonthAvailability.blockedDays.map((day) => new Date(day))} // Highlight blocked days
                                />
                                {currentMonthAvailability.blockedDays.length === 0 ? (
                                    <p className="m-auto font-kulim">No blocked days yet.</p>
                                ) : (
                                    <ul className="flex flex-col flex-wrap max-h-60 list-none mx-auto pt-4 md:pt-0 px-4 border-t md:border-l md:border-t-0 border-main-grey-100 lg:max-w-80 overflow-scroll">
                                        {currentMonthAvailability.blockedDays.map((date) => (
                                            <li key={date} 
                                                className="mb-3 md:mr-6"
                                            >
                                                <span className="font-kulim">{date}</span>
                                                <button
                                                    className="font-kulim bg-red-500 hover:bg-red-800 hover:text-white ml-2 py-1 px-2 rounded-lg text-sm"
                                                    onClick={() => handleRemoveDate(date, 'current')}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    } 
                />
                <Accordion 
                    title="Next Month" 
                    styles="border-0 px-4" 
                    childrenContainerStyles="max-h-92 border-b border-main-grey-100"
                    children = {
                        <>
                        <form>
                            <div className="py-4 px-6">
                                {daysInWeek.map((day, index)=>(
                                    <div key={index} className="flex mx-auto mb-4">
                                        <div className="toggle-btn my-auto mx-0">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox" 
                                                id={`next-month-${day}-checkbox`} 
                                                checked={checkedDays[`next-month-${day}-checkbox`] || false} 
                                                onChange={() => {
                                                    handleCheckboxChange(`next-month-${day}-checkbox`);
                                                    checkedDays[`next-month-${day}-checkbox`] === false && (handleTimeChange(day, 'start', '00:00', 'next'))
                                                    checkedDays[`next-month-${day}-checkbox`] === false && (handleTimeChange(day, 'end', '00:00', 'next'))
                                                }}
                                            />
                                            <label htmlFor={`next-month-${day}-checkbox`} className="checkbox-label">
                                                <span className="ball" id="ball"></span>
                                            </label>
                                        </div>
                                        <label className="px-3 my-auto ml-3 mr-auto font-kulim">{windowSize.width >=1100 ? day : day.slice(0,3)}</label>
                                        {!checkedDays[`next-month-${day}-checkbox`] ? 
                                            <p className="text-end my-auto ml-auto font-kulim py-1.5">
                                                Unavailable
                                            </p>
                                        :
                                        <>
                                            <div className="flex border border-main-grey-100 rounded-lg ml-auto mr-0 cursor-pointer hover:border-main-green-500">
                                                <input 
                                                    type="time" 
                                                    id={`next-month-${day}-start-time`}  
                                                    className="font-kulim text-sm rounded-lg focus:ring-0 focus:border-0 outline-none w-full p-2 cursor-pointer" 
                                                    min="04:00" 
                                                    max="21:00" 
                                                    value={nextMonthAvailability.weekly[index]?.startTime || '00:00'}
                                                    onChange={(e) => handleTimeChange(day, 'start', e.target.value, 'next')}
                                                />
                                            </div>
                                            <p className="mx-4 my-auto font-kulim">To</p>
                                            <div className="flex border border-main-grey-100 rounded-lg mx-0 cursor-pointer hover:border-main-green-500">
                                                <input 
                                                    type="time" 
                                                    id={`next-month-${day}-end-time`}  
                                                    className="font-kulim text-sm rounded-lg focus:ring-0 focus:border-0 outline-none w-full p-2 cursor-pointer" 
                                                    min="04:00" 
                                                    max="21:00" 
                                                    value={nextMonthAvailability.weekly[index]?.endTime || '00:00'}
                                                    onChange={(e) => (handleTimeChange(day, 'end', e.target.value, 'next'))}
                                                />
                                            </div>
                                        </>
                                        }
                                    </div>
                                ))}
                            </div>
                        </form>
                        <p className="mt-6 mb-3 underline w-full font-kulim">Blocked Days</p>
                        <div className="flex flex-wrap justify-center mt-3 mb-12 px-6">
                            <DatePicker
                                inline
                                minDate={new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)}
                                maxDate={new Date(new Date().getFullYear(), new Date().getMonth()+2, 0)}
                                wrapperClassName="datepicker"
                                className="datepicker"
                                onChange={(date) => handleDateSelect(date, 'next')} // Trigger when a date is selected
                                highlightDates={nextMonthAvailability.blockedDays.map((day:string) => new Date(day))} // Highlight blocked days
                            />
                            {nextMonthAvailability.blockedDays.length === 0 ? (
                                <p className="m-auto font-kulim">No blocked days yet.</p>
                            ) : (
                                <ul className="flex flex-col flex-wrap max-h-60 list-none mx-auto pt-4 md:pt-0 px-4 border-t md:border-l md:border-t-0 border-main-grey-100 lg:max-w-80 overflow-scroll">
                                    {nextMonthAvailability.blockedDays.map((date) => (
                                        <li key={date} 
                                            className="mb-3 mr-6"
                                        >
                                            <span className="font-kulim">{date}</span>
                                            <button
                                                className="font-kulim bg-red-500 hover:bg-red-800 hover:text-white ml-2 py-1 px-2 rounded-lg text-sm"
                                                onClick={() => handleRemoveDate(date, 'next')}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        </>
                    } 
                />
                <p className="font-kulim px-4 my-auto  text-main-grey-200 text-sm text-center py-5">
                    Weekly availability will auto-repeat for every week of each individually set month. Blocked Days will
                    restrict athletes from booking any sessions at any point in time within that 24 hour period.
                    Please be sure to actively update your availability if your schedule varies from month to month.
                </p>
            </div>
        </div>
    )
}