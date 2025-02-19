import axios from "axios"
import React, { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

interface Props {
    csrftoken: string;
    coachId: string;
    dateTime: (vals:string)=>void;
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
interface BookedEvent {
    date: string; 
    startTime: string; 
    endTime: string;
}

export default function ServiceDateTimePicker({ csrftoken, coachId, dateTime }: Props) {
    const [startDate, setStartDate] = useState(new Date())
    const [openPicker, setOpenPicker] = useState<boolean>(false)
    // Store any previously saved availability
    const [CoachAvailability, setCoachAvailability] = useState<Availability | null>(null)
    // Store any previously booked events/sessions
    const [bookedSessions, setBookedSessions] = useState<BookedEvent[]>([])

    // Calculate the date range
    const today = new Date()
    const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())

    // Dynamic time range calculation using API data
    const getMinMaxTime = (date: Date | null) => {
        if (!date || !CoachAvailability) return {}

        // Determine if the date is in the current or next month
        const isCurrentMonth = date.getMonth() === today.getMonth()
        const availability = isCurrentMonth ? CoachAvailability.currentMonth : CoachAvailability.nextMonth
         // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const dayOfWeek = date.getDay()
        // Adjust Sunday to 7 for API alignment
        const dayKey = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const daySchedule = availability.weekly[dayKey] || null

        if (!daySchedule) return {}

        const [startHour, startMinute] = daySchedule.startTime.split(':').map(Number)
        const [endHour, endMinute] = daySchedule.endTime.split(':').map(Number)

        const minTime = new Date()
        minTime.setHours(startHour, startMinute, 0)

        const maxTime = new Date()
        maxTime.setHours(endHour, endMinute, 0)

        return { minTime, maxTime }
    }

    useEffect(() => {
        if (startDate) {
            const year = startDate.getFullYear();
            const month = String(startDate.getMonth() + 1).padStart(2, '0')
            const day = String(startDate.getDate()).padStart(2, '0')
            const hours = String(startDate.getHours()).padStart(2, '0')
            const minutes = String(startDate.getMinutes()).padStart(2, '0')
    
            const formattedDateTime = `${year}-${month}-${day}-${hours}-${minutes}`
            dateTime(formattedDateTime)
        }
    }, [startDate])
    

    // Determine time range based on the selected date
    const { minTime, maxTime } = getMinMaxTime(startDate)

    // API call to get coach availability
    function getCoachAvailability() {
        axios.get(`${process.env.REACT_APP_SKILLJA_URL}/calendar/get_coach_availability/?coachId=${coachId}`, {
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            .then((res) => {
                if (res.status === 200) {
                    setCoachAvailability(res.data.availability)
                    setBookedSessions(res.data.bookedEvents)
                }
            })
            .catch((error) => {console.error(error)})
    }

    return (
        <div className="ml-0 mr-auto my-6 w-56">
            {openPicker ? (
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date!)}
                    showTimeSelect
                    dateFormat="Pp"
                    popperClassName="datepicker"
                    className="border mx-auto text-center w-56 border-main-grey-100 rounded-2xl p-2 focus:ring-0 outline-main-green-500"
                    minDate={today}
                    maxDate={twoMonthsFromNow}
                    minTime={minTime}
                    maxTime={maxTime}
                    filterDate={(date) => {
                        if (!CoachAvailability) return true;
                        // Determine if the date is in the current or next month
                        const isCurrentMonth = date.getMonth() === today.getMonth();
                        const availability = isCurrentMonth ? CoachAvailability.currentMonth : CoachAvailability.nextMonth;
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        // Disable blocked days only
                        return !availability.blockedDays.includes(formattedDate);
                    }}
                    filterTime={(time) => {
                        if (!bookedSessions.length) return true;
                    
                        const selectedDate = time.toISOString().split("T")[0]; 
                        const selectedMinutes = time.getHours() * 60 + time.getMinutes();
                    
                        return !bookedSessions.some((session) => {
                            if (session.date !== selectedDate) return false;
                    
                            const sessionStartMinutes = parseInt(session.startTime.split(":")[0]) * 60 + parseInt(session.startTime.split(":")[1]);
                            const sessionEndMinutes = parseInt(session.endTime.split(":")[0]) * 60 + parseInt(session.endTime.split(":")[1]);
                    
                            return selectedMinutes >= sessionStartMinutes && selectedMinutes < sessionEndMinutes;
                        });
                    }}
                />
            ) : (
                <div
                    role="presentation"
                    className="bg-white rounded-2xl mx-auto text-center px-4 py-2 border border-main-grey-100 cursor-pointer hover:border-main-green-500"
                    onClick={() => {
                        setOpenPicker(true);
                        getCoachAvailability();
                    }}
                >
                    Select Date & Time
                </div>
            )}
        </div>
    )
}
