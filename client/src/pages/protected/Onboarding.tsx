import React, { useEffect, useReducer, useState, useRef } from "react"
import data from "../../data.json"
import Accordion from "../../components/general/Accordion"
import FilterOnboardingData from "../../hooks/userAuthentication/FilterOnboardingData"
import { Link } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/userAuthentication/GetCSFR"
import Header from "../../components/navigation/Header"
import SendEmailConfirmation from "../../hooks/userAuthentication/SendEmailConfirmation"
import GetUserEmail from "../../hooks/general/GetUserEmail"

// Interface for a single question
interface Question {
    id: number,
    title: string,
    options?: string[],
    multiOptions?: Options,
    multiSelect?: boolean,
    subtitle?: string,
    buttonValue?: string,
    image?: string
}

// Interface for options related to team and individual sports
interface Options {
    team: string[],
    individual: string[]
}

// Interface for a series of questions
interface Series {
    series: number,
    questions: Question[]
}

// Interface for the component state
interface State {
    currentSeries: number,
    answers: { questionId: number; answer: string[] }[]
}

// Interface for actions dispatched to the reducer
interface Action {
    type: 'ANSWER_QUESTION' | 'NEXT_SERIES',
    payload?: { questionId: number; answer: string[] }
}

// Initial state for the reducer
const initialState: State = {
    currentSeries: 0,
    answers: [],
}

// Reducer function to manage state transitions between question sets
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ANSWER_QUESTION':
            return {
                ...state,
                answers: [...state.answers.filter(ans => ans.questionId !== action.payload!.questionId), action.payload!],
            }
        case 'NEXT_SERIES':
            return {
                ...state,
                currentSeries: state.currentSeries + 1,
            }
        default:
            return state
    }
}

export default function Onboarding() {
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const [state, dispatch] = useReducer(reducer, initialState)
    // Track if option selection is valid
    const [optionsOverloaded, setOptionsOverloaded] = useState(false)
    // Keeps track of completed questions (user progress)
    const [progress, setProgress] = useState(1)
    // Default dataset to athlete question set
    const userData: Series[] = data.athleteQuestions
    const questionSetRef = useRef(userData)
    const userQuestions = questionSetRef.current
    // stores user email set in cookies during signup process, utilized by SendEmailConfirmation hook
    const [userEmail, setUserEmail] = useState<string>("")

    useEffect(()=>{
        const fetchUserEmail = async () => {
            const token = csrfToken!
            const email = await GetUserEmail({ token })
            setUserEmail(email)
          }
      
        fetchUserEmail()
    },[])

    useEffect(() => {
        document.title = "SkillJa - Onboarding"
        const currentQuestion = userQuestions[state.currentSeries].questions[0]
        const selectedOptions = state.answers.find((ans) => ans.questionId === currentQuestion.id)?.answer

        // Check if multiple options are selected on questions where this feature is disabled
        if (selectedOptions && selectedOptions.length > 1 && !currentQuestion.multiSelect) {
            setOptionsOverloaded(true)
        } else {
            setOptionsOverloaded(false)
        }
        // Changes question set from default "athlete" to "coach" based on user selection
        if(state.currentSeries > 0){
            state.answers[0]?.answer?.forEach((curr)=>{
                if(curr.toLocaleLowerCase().includes("coach")){
                    questionSetRef.current = data.coachQuestions
                }
            })
        } 
        // End of onboarding process, prepares answers to be submitted
        if (state.currentSeries === userQuestions.length - 1) {
            const formattedResponses = FilterOnboardingData(state.answers)
            handleSubmit(formattedResponses)
        }
    }, [state, userQuestions, questionSetRef])

    // Function to handle user answer selection
    const handleAnswer = (questionId: number, option: string) => {
        const currentAnswers = state.answers.find(ans => ans.questionId === questionId)?.answer || []
        const updatedAnswers = currentAnswers.includes(option) ? currentAnswers.filter(ans => ans !== option) : [...currentAnswers, option]
        dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, answer: updatedAnswers } })
    }

    // Function to determine if the continue button should be enabled
    const isContinueButtonEnabled = () => {
        const currentQuestion = userQuestions[state.currentSeries].questions[0];
        const selectedOptions = state.answers.find((ans) => ans.questionId === currentQuestion.id)?.answer || []
        // Enable the button if there's at least one option selected
        if (selectedOptions.length > 0) {
            if (currentQuestion.multiSelect || selectedOptions.length === 1) {
                return true
            }
        }
        return false
    }

    // Submits onboarding responses to database
    function handleSubmit(responses: Record<string, string[] | string>){
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/auth/onboarding/`, responses, {
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
            .then(res => {
                if (res.status === 201) {
                    SendEmailConfirmation({recipient: userEmail, token: csrfToken!})
                } else {
                    console.error("onboarding failed")
                }
            })
            .catch(error => {
                if (error.response) {
                    // the server responded with a status code that falls out of the range of 2xx
                    console.error('Error response:', error.response.data)
                    console.error('Status:', error.response.status)
                    console.error('Headers:', error.response.headers)
                } else if (error.request) {
                    // no response was received
                    console.error('No response received:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up request:', error.message)
                }
                console.error('Error config:', error.config)
            })
    }

    return (
        <>
            <Header useCase="onboarding" />
            {userQuestions[state.currentSeries].questions.map((currentQuestion: Question) => (
            <div key={`q-${currentQuestion.id}`}>
                <div className="flex flex-row justify-center items-center flex-wrap">
                    <h3 className="heading my-14 px-4 w-full">{currentQuestion.title}</h3>
                    {currentQuestion.subtitle? <p className="mb-8"> {currentQuestion.subtitle} </p> : <></>}
                    {state.currentSeries !== 1 ?
                        ( 
                            <div className="flex flex-col">
                            {currentQuestion.options?.map((option, index) => (
                                <button 
                                    onClick={() => handleAnswer(currentQuestion.id, option)} 
                                    key={index}
                                    aria-label="answer option for current question"
                                >
                                    <div className={`select-btn w-72 m-2 ${state.answers.find(ans => ans.questionId === currentQuestion.id)?.answer.includes(option) ? 'bg-main-green-500 text-main-white' : 'bg-main-white text-main-black'}`}>
                                        {option}
                                    </div>
                                </button>
                             
                            ))}
                            </div>
                        )
                    
                    :
                        (
                            <div className="flex flex-col">
                             <Accordion title="Team Sports" >
                                {currentQuestion.multiOptions?.team?.map((option, index) => (
                                    <button 
                                        onClick={() => handleAnswer(currentQuestion.id, option)} 
                                        key={`team=${index}`}
                                        aria-label={`team sports option for ${option}`}
                                        className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${state.answers.find(ans => ans.questionId === currentQuestion.id)?.answer.includes(option) ? 'bg-main-green-500 text-main-white' : 'bg-main-white text-main-black'}`}
                                    >
                                        {option}
                                </button>
                                ))}
                             </Accordion>
                             <Accordion title="Individual Sports">
                                {currentQuestion.multiOptions?.individual?.map((option, index) => (
                                    <button 
                                        onClick={() => handleAnswer(currentQuestion.id, option)} 
                                        key={`individual-${index}`} 
                                        aria-label={`individual sports option for ${option}`}
                                        className={`text-left p-3 hover:bg-main-green-700 hover:text-main-color-white ${state.answers.find(ans => ans.questionId === currentQuestion.id)?.answer.includes(option) ? 'bg-main-green-500 text-main-white' : 'bg-main-white text-main-black'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                             </Accordion>
                            </div>
                        )
                    }
                </div>
            
                {state.currentSeries !== userQuestions.length-1 ? 
                    <div className="mt-36 w-full mx-auto flex flex-col items-center">
                        <button 
                            className={`w-72 select-btn bg-main-green-500 text-main-cream hover:bg-main-green-700 ${isContinueButtonEnabled() && !optionsOverloaded ? '' : 'opacity-70 cursor-not-allowed'}`} 
                            aria-label="submit current answers"
                            disabled={!isContinueButtonEnabled() || optionsOverloaded}
                            onClick={()=>{
                                setProgress(progress+1) 
                                dispatch({ type: 'NEXT_SERIES' })
                            }}
                        >
                            {currentQuestion.buttonValue ? currentQuestion.buttonValue : "Continue" }
                        </button>
                        <div className="flex my-5">
                            <div role="presentation" className="bg-main-green-300 h-2 w-16 rounded-l-full"></div>
                            <div role="presentation" className={`${progress>=2? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 ml-2 mr-1`}></div>
                            <div role="presentation" className={`${progress>=3? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 ml-1 mr-2`}></div>
                            <div role="presentation" className={`${progress>=4? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 rounded-r-full`}></div>
                        </div> 
                    </div>
                : 
                    <div className="flex flex-col items-center">
                        <img 
                            src={require(`../../assets/${currentQuestion.image}`)} 
                            className="w-72 mb-5"
                            alt="two runners kneeling down ready to race each other"
                        />
                        <Link to={'../../home-feed'}>
                            <button 
                                className="w-72 select-btn bg-main-green-500 text-main-cream hover:bg-main-green-700"
                                aria-label="navigate to home feed page"
                            >
                                {currentQuestion.buttonValue? currentQuestion.buttonValue : "Explore"}
                            </button>
                        </Link>
                    </div>  
                }
            </div>
            ))}   
        </>
    )
}