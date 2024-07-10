import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"
import data from "../../data.json"

interface UserDataStructure {
    picture: string
}

interface MenuProps {
    useCase: 'public' | 'authorized'
}

export default function HamburgerMenu({useCase}:MenuProps){
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [userData, setuserData] = useState<UserDataStructure>({
        picture: ''
    })
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const csrfToken = GetCSFR({ name: "csrftoken" })
    const menuData = useCase ==='public'? data.HamburgerMenu.public : data.HamburgerMenu.authorized
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function handleLogout(){
        axios.post('http://localhost:8000/logout/',{}, {
            headers: {
                'X-CSRFToken': csrfToken,
            },
            withCredentials: true
        })
            .then(res => {
                if (res.status === 200) {
                    navigate("/")
                } else {
                    console.error("logout failed")
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
        <div ref={menuRef}>
            <div 
                className={`flex bg-main-white rounded-2xl border border-main-grey-100 p-1 h-12 my-auto hover:cursor-pointer hover:shadow-lg ${menuOpen? "shadow-lg":""}`} 
                onClick={()=>setMenuOpen(!menuOpen)}
            >
                <div className="flex flex-col mx-2 my-auto">
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5">
                    </div>
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5">
                    </div>
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5">
                    </div>
                </div>
                <img 
                    src={userData.picture? userData.picture : require('../../assets/default-avatar.jpg')}
                    className="w-8 rounded-full my-auto mx-2" 
                    alt="profile of logged in user"
                />
            </div>
            {menuOpen ?
                <div className="flex flex-col absolute py-2 right-10 mt-2 shadow-sm border border-main-grey-100 bg-main-white rounded-2xl w-60 overflow-hidden">
                    {menuData.map((currSection,index)=>(
                        currSection.title.includes('logout')?
                            <div 
                                className="w-full p-2 hover:bg-main-grey-100 cursor-pointer" 
                                onClick={()=>handleLogout()}
                                key={index}
                            >
                                <p>{currSection.title}</p>
                            </div>
                        :
                            <Link 
                                to={currSection.link} 
                                key={index} 
                                className="w-full p-2 hover:bg-main-grey-100 cursor-pointer"
                            >
                                <p>{currSection.title}</p>
                            </Link>
                    ))}
                </div>
            :
                <></>
            }
        </div>
    )
}