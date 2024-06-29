import React, { useEffect, useReducer, useState } from "react"
import Header from "../components/general/Header"
import SignInPartners from "../components/userAuthentication/SignInPartners"
import AgreementTerms from "../components/userAuthentication/AgreementTerms"
import { Link, useNavigate } from "react-router-dom"
import { faCalendar, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition, faChevronDown, faLock, faPhone } from "@fortawesome/free-solid-svg-icons"
import data from "../data.json"

interface Input {
    id: string;
    name: string;
    title?: string;
    icon: string;
    type: string;
    placeholder?: string;
    pattern?: string;
    options?: { value: string; selected: boolean; placeholder: string }[]
  }
  
  const iconMap: Record<string, IconDefinition> = {
    faEnvelope,
    faChevronDown,
    faLock,
    faCalendar,
    faPhone,
    faUser
  }
  
  interface Series {
    series: number;
    inputs: Input[];
    title: string;
    button: string;
  }
  
  interface State {
    currentSeries: number;
    answers: { inputId: string; answer: string[] }[];
  }
  
  interface Action {
    type: "ANSWER_QUESTION" | "NEXT_SERIES";
    payload?: { inputId: string; answer: string[] };
  }
  
  const initialState: State = {
    currentSeries: 0,
    answers: [],
  };
  
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "ANSWER_QUESTION":
        return {
          ...state,
          answers: [...state.answers, action.payload!],
        };
      case "NEXT_SERIES":
        return {
          ...state,
          currentSeries: state.currentSeries + 1,
        };
      default:
        return state;
    }
  }

export default function SignUp(){
    const navigate = useNavigate()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
    const signupQuestions: Series[] = data.signup

    useEffect(() => {
        document.title = "SkillJa - Sign Up"
    }, [])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (state.currentSeries < signupQuestions.length - 1) {
          dispatch({ type: "NEXT_SERIES" })
        } else {
          navigate("/auth/onboarding")
        }
      }
    
      const currentInputs = signupQuestions[state.currentSeries].inputs

    return (
        <div className="flex flex-col h-dvh px-2">
          <Header useCase="default" />
          <h2 className="heading mt-0">{signupQuestions[state.currentSeries].title}</h2>
          <div className="flex flex-col justify-center items-center py-12">
              <form className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit}>
                  {currentInputs.map((input) => (
                      <div className="relative w-full mb-5" key={input.id}>
                      {input.type !== "select" ? (
                      <>
                          <input
                              id={input.id}
                              name={input.name}
                              type={input.type}
                              placeholder={input.placeholder}
                              className={`form-input ${input.type==='date'? 'date-input': '' }`}
                              required
                              autoComplete="on"
                          />
                          {input.type!=='date'?
                              <FontAwesomeIcon
                                  icon={iconMap[input.icon]}
                                  className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                              />
                          :
                              <></>
                          }
                      </>
                      ) : (
                          <>
                          <select id={input.id} name={input.name} className="form-input appearance-none" required>
                          {input.options?.map((option, index) => (
                              index === 0 ? (
                                  <option key={option.value} disabled selected={option.selected} value="">
                                  {option.placeholder}
                                  </option>
                              ) : (
                                  <option key={option.value} value={option.value} selected={option.selected}>
                                      {option.placeholder}
                                  </option>
                              )
                          ))}
                          
                          </select>
                          <FontAwesomeIcon
                              icon={iconMap[input.icon]}
                              className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                          />
                      </>
                      )}
                      </div>
                  ))}
                  {state.currentSeries === signupQuestions.length - 1 ?
                        <AgreementTerms isClicked = {agreeToTerms} /> 
                        :
                        <></>
                  }
                  <button
                      className="w-full form-btn mx-auto"
                      aria-label="sign up form submission"
                      type="submit"
                      disabled={agreeToTerms=== true && state.currentSeries === signupQuestions.length - 1}
                  >
                      {signupQuestions[state.currentSeries].button}
                  </button>
              </form>
              <div className="flex justify-center items-center my-7">
                  <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
                  <p className="mx-3 lg:mx-4 text-main-grey-200">Or Sign Up With</p>
                  <div className="bg-main-grey-300 h-0.5 w-28 lg:w-36"></div>
              </div>
              <div className="mb-9">
                  <SignInPartners />
              </div>
              <p className="text-main-grey-300 font-kulim">
                  Already have an account? 
                  <Link to={'/login'}>
                      <span className="underline cursor-pointer text-main-green-700 ml-1 hover:text-main-green-500">
                          Login Here
                      </span>
                  </Link>
              </p>
          </div>
        </div>

    )
} 