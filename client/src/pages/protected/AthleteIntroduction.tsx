import React, { useEffect, useReducer, useState } from "react";
import data from "../../data.json"

interface Question {
    id: number,
    title: string,
    options?: string[],
    multiSelect?: boolean,
    body?: string,
    buttonValue?: string
}

interface Series {
    series: number,
    questions: Question[]
}

interface State {
    currentSeries: number,
    answers: { questionId: number; answer: string[] }[]
}

interface Action {
    type: 'ANSWER_QUESTION' | 'NEXT_SERIES',
    payload?: { questionId: number; answer: string[] }
}

const initialState: State = {
    currentSeries: 0,
    answers: [],
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ANSWER_QUESTION':
            return {
                ...state,
                answers: [...state.answers.filter(ans => ans.questionId !== action.payload!.questionId), action.payload!],
            };
        case 'NEXT_SERIES':
            return {
                ...state,
                currentSeries: state.currentSeries + 1,
            };
        default:
            return state;
    }
};

export default function AthleteIntroduction() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [optionsOverloaded, setOptionsOverloaded] = useState(false)
    const [progress, setProgress] = useState(1)
    const athleteQuestions: Series[] = data.athleteQuestions

    useEffect(() => {
        document.title = "SkillJa - Onboarding"
        //checks if multiple options have been selected on questions where this feature has been disabled
        state.answers[0]?.answer?.length > 1 && athleteQuestions[state.currentSeries].questions[0].multiSelect === false ? 
            setOptionsOverloaded(true) : setOptionsOverloaded(false)
    }, [state])

    const handleAnswer = (questionId: number, option: string) => {
        const currentAnswers = state.answers.find(ans => ans.questionId === questionId)?.answer || []
        const updatedAnswers = currentAnswers.includes(option)
            ? currentAnswers.filter(ans => ans !== option)
            : [...currentAnswers, option]
        dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, answer: updatedAnswers } })
    }

    const isContinueButtonEnabled = () => {
        const currentQuestion = athleteQuestions[state.currentSeries].questions[0]
        const selectedOptions = state.answers.find(ans => ans.questionId === currentQuestion?.id)?.answer || []
        
        return selectedOptions.length > 0 || (!currentQuestion?.multiSelect && selectedOptions.length === 1)
    }

    return (
        <>
            {athleteQuestions[state.currentSeries].questions.map((currentQuestion: Question) => (
                <div key={currentQuestion.id} className="flex flex-row justify-center items-center flex-wrap">
                    <h3 className="heading my-14 px-4 w-full">{currentQuestion.title}</h3>
                    {currentQuestion.options?.map((option, index) => (
                        <div key={option}>
                            <button onClick={() => handleAnswer(currentQuestion.id, option)}>
                                <div className={`selectBtn m-3 ${state.answers.find(ans => ans.questionId === currentQuestion.id)?.answer.includes(option) ? 'bg-main-green-500 text-main-white' : 'bg-main-white text-main-black'}`}>
                                    {option}
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            ))}

            <div className="mt-36 w-full mx-auto flex flex-col items-center">
                <button 
                    className={`w-72 selectBtn bg-main-green-500 text-main-cream hover:bg-main-green-700 ${isContinueButtonEnabled() && !optionsOverloaded ? '' : 'opacity-70 cursor-not-allowed'}`} 
                    disabled={!isContinueButtonEnabled() || optionsOverloaded}
                    onClick={()=>{
                        setProgress(progress+1) 
                        dispatch({ type: 'NEXT_SERIES' })
                    }}
                    >
                    Continue
                </button>
                <div className="flex my-5">
                    <div role="presentation" className="bg-main-green-300 h-2 w-16 rounded-l-full"></div>
                    <div role="presentation" className={`${progress>=2? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 ml-2 mr-1`}></div>
                    <div role="presentation" className={`${progress>=3? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 ml-1 mr-2`}></div>
                    <div role="presentation" className={`${progress>=4? "bg-main-green-300" : "bg-main-grey-200"} h-2 w-16 rounded-r-full`}></div>
                </div> 
            </div>
        </>
    )
}