import React, { useReducer, useState } from "react"
import { useForm } from "react-hook-form"
import Header from "../../components/navigation/Header"
import AgreementTerms from "../../components/userAuthentication/AgreementTerms"
import LoadingAnimation from "../../components/general/LoadingAnimation"
import GetCSFR from '../../hooks/userAuthentication/GetCSFR'
import { Link, useNavigate } from "react-router-dom"
import { faCalendar, faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition, faChevronDown, faLock, faPhone } from "@fortawesome/free-solid-svg-icons"
import data from "../../data.json"
import axios from "axios"
import ReCAPTCHA from "react-google-recaptcha"
import Footer from "../../components/navigation/Footer"

interface FormStructure {
  fullname: string;
  email: string;
  password: string;
  confirmpassword: string;
  birthdate: string;
  phonenumber: string;
  gender: string;
}

type Option = {
  value: string;
  selected: boolean;
  placeholder: string;
}

interface Input {
  id: string;
  name: string;
  title?: string;
  icon: string;
  type: string;
  placeholder?: string;
  required: string;
  pattern?: {
    value: string;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  }
  options?: Option[];
}

const iconMap: Record<string, IconDefinition> = {
  faEnvelope,
  faChevronDown,
  faLock,
  faCalendar,
  faPhone,
  faUser,
}

interface Series {
  series: number;
  inputs: Input[];
  title: string;
  button: string;
}

interface State {
  currentSeries: number;
}

const initialState: State = { currentSeries: 0 }

const reducer = (state: State, action: { type: "NEXT_SERIES" }): State => {
  switch (action.type) {
    case "NEXT_SERIES":
      return { currentSeries: state.currentSeries + 1 }
    default:
      return state
  }
}

export default function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormStructure>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [invalidCaptcha, setInvalidCaptcha] = useState(true)
  const csrfToken = GetCSFR({ name: "csrftoken" })
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const password = watch("password") 
  const [errorEmailMessage, setErrorEmailMessage] = useState<string | undefined>(undefined)
  const [errorPasswordMessage, setErrorPasswordMessage] = useState<string | undefined>(undefined)


  function onSubmit(formData:FormStructure){
    setLoading(true)
    if (state.currentSeries < signupQuestions.length - 1) {
      dispatch({ type: "NEXT_SERIES" });
      setTimeout(() => setLoading(false), 1000);
    } else {
      axios.post(`${process.env.REACT_APP_SKILLJA_URL}/signup/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      .then(res => {
        if (res.status === 201) {
          navigate("/auth/onboarding")
        } else {
          console.error("Signup failed")
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
    }
  }

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaToken(value);
      setInvalidCaptcha(false);
      axios.post(`${process.env.REACT_APP_SKILLJA_URL}/verify_captcha/`, { token: value }, {
        headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then(res => setInvalidCaptcha(!res.data.success))
      .catch(() => setInvalidCaptcha(true))
    } else {
      setInvalidCaptcha(true)
    }
  }

  const signupQuestions: Series[] = data.signup;
  const currentInputs = signupQuestions[state.currentSeries].inputs


  return (
    <div className="flex flex-col h-dvh px-2">
      <Header useCase="default" />
      <h2 className="heading mt-0">{signupQuestions[state.currentSeries].title}</h2>
      <div className="flex flex-col justify-center items-center py-12">
        {loading && state.currentSeries === signupQuestions.length - 1 ? (
          <div className="mt-20">
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <form className="flex flex-col justify-center w-full mx-auto px-4 md:w-7/12 lg:w-4/12" onSubmit={handleSubmit(onSubmit)}>
              {currentInputs.map((input) => (
                <div className="relative w-full mb-5" key={input.id}>
                  <label htmlFor={input.id} className="sr-only">
                    {input.placeholder}
                  </label>
                  {input.type !== "select" ? (
                    <>
                      <input
                        id={input.id}
                        type={input.type}
                        {...register(input.name as keyof FormStructure, {
                          required: input.required,
                          pattern: input.pattern ? { value: new RegExp(input.pattern.value), message: input.pattern.message } : undefined,
                          minLength: input.minLength ? { value: input.minLength.value, message: input.minLength.message } : undefined,
                          maxLength: input.maxLength ? { value: input.maxLength.value, message: input.maxLength.message } : undefined,
                          validate: async (val) => {
                            if (input.name === "confirmpassword" && password !== val) {
                              setErrorPasswordMessage("Passwords do not match!")
                            }
                            if (input.name === "confirmpassword" && password === val) {
                              setErrorPasswordMessage(undefined)
                            }
                            if (input.name === "email") {
                              try {
                                const response = await axios.post(`${process.env.REACT_APP_SKILLJA_URL}/does_user_exist/`, 
                                  { email: val },
                                  {
                                    headers: {
                                      "X-CSRFToken": csrfToken!,
                                      "Content-Type": "application/json",
                                    },
                                    withCredentials: true,
                                  }
                                )
                                if (response.data.exists) {
                                  setErrorEmailMessage("This email is already in use.")
                                  return false
                                } else {
                                  setErrorEmailMessage(undefined)
                                  return true
                                }
                              } catch (error) {
                                console.error("Error checking email existence:", error)
                                return "Failed to validate email. Please try again."
                              }
                            }
                            return true
                          },
                        })}
                        placeholder={input.placeholder}
                        className={`form-input ${input.type === "date" ? "date-input" : ""}`}
                        autoComplete="on"
                      />
                      {errors[input.name as keyof FormStructure]?.message && (
                        <p className="text-red-500 text-sm my-3 mx-auto text-center">
                          {errors[input.name as keyof FormStructure]?.message}
                        </p>
                      )}
                      {errorEmailMessage && input.name === "email" && (
                        <p className="text-red-500 text-sm my-3 mx-auto text-center">{errorEmailMessage}</p>
                      )}
                      {errorPasswordMessage && input.name === "confirmpassword" && (
                        <p className="text-red-500 text-sm my-3 mx-auto text-center">{errorPasswordMessage}</p>
                      )}
                      {input.type !== "date" && (
                        <FontAwesomeIcon
                          icon={iconMap[input.icon]}
                          className="absolute inset-y-4 left-0 flex items-center pl-4 text-main-grey-500"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <select
                        id={input.id}
                        {...register(input.name as keyof FormStructure, { required: true })}
                        className="form-input appearance-none"
                      >
                        {input.options?.map((option, index) => (
                          <option
                            key={option.value}
                            value={index === 0 ? "" : option.value}
                            disabled={index === 0}
                          >
                            {option.placeholder}
                          </option>
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
              {state.currentSeries === signupQuestions.length - 1 && <AgreementTerms isClicked={agreeToTerms} />}
              <button
                className={`w-full form-btn mx-auto ${(agreeToTerms && state.currentSeries === signupQuestions.length - 1) || invalidCaptcha ? "cursor-not-allowed" : ""}`}
                type="submit"
                disabled={agreeToTerms || invalidCaptcha}
              >
                {signupQuestions[state.currentSeries].button}
              </button>
            </form>
            <div className="mx-auto my-7">
              {invalidCaptcha && state.currentSeries === 0 && (
                <ReCAPTCHA
                  onChange={handleCaptchaChange}
                  sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY!}
                  onExpired={() => setCaptchaToken(null)}
                />
              )}
            </div>
            <div className="bg-main-grey-300 h-0.5 w-28 lg:w-40 mb-6" role="presentation"></div>
              <p className="text-main-grey-300 font-kulim"> 
                Already have an account? 
                <Link to={'/login'}>
                  <span className="underline cursor-pointer text-main-green-700 ml-1 hover:text-main-green-500">
                    Login Here
                  </span>
                </Link>
              </p>
          </>
        )}
      </div>
      <div className="mb-6 mt-10">
        <Footer />
      </div>
    </div>
  )
}
