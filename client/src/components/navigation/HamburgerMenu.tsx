import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import axios from "axios"
import GetCSFR from "../../hooks/GetCSFR"
import data from "../../data.json"
import RetrieveImage from "../../hooks/RetrieveImage"

interface MenuProps {
    useCase: 'public' | 'authorized';
    url?: string;
}

export default function HamburgerMenu({useCase, url}:MenuProps){
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
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
        axios.post(`${process.env.REACT_APP_SKILLJA_URL}/logout/`,{}, {
            headers: {
                'X-CSRFToken': csrfToken,
            }, 
            withCredentials: true
        })
            .then(res => {
                if (res.status === 200) { 
                    if (window.location.pathname === '/') {
                        window.location.reload()
                    } else {
                        navigate('/')
                    }
                } else {
                    console.error("Logout failed")
                }
            })
            .catch(error => {
                console.error('Logout Error:', error)
                alert("Logout failed. Please try again.")
            })
    }
    
    return (
        <div ref={menuRef}>
            {/* Hamburger Icon and User Avatar */}
            <div 
                className={`flex bg-main-white rounded-2xl border border-main-grey-100 p-1 h-12 my-auto hover:cursor-pointer hover:shadow-lg ${menuOpen? "shadow-lg":""}`} 
                onClick={()=>setMenuOpen(!menuOpen)}
            >
                <div className="flex flex-col mx-2 my-auto" role="presentation">
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5"></div>
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5"></div>
                    <div className="h-0.5 bg-main-green-900 rounded-full w-4 my-0.5"></div>
                </div>
                <div className="my-auto mx-2" >
                    <RetrieveImage url={url} styling="w-8 rounded-full h-8" />
                </div>
            </div>
            {/* Menu Dropdown */}
            {menuOpen && (
                <div className="flex flex-col absolute py-2 right-5 z-10 lg:right-11 mt-2 shadow-sm border border-main-grey-100 bg-main-white rounded-2xl w-60 overflow-hidden">
                    {menuData.map((currSection,index)=>(
                        currSection.title.includes('Log out') ?
                            <div 
                                className="w-full px-3 py-2 hover:bg-main-grey-100 cursor-pointer font-kulim font-medium" 
                                onClick={()=>handleLogout()}
                                key={index}
                            >
                                <p>{currSection.title}</p>
                            </div>
                        :
                            <Link 
                                to={currSection.link} 
                                key={index} 
                                className="w-full px-3 py-2 hover:bg-main-grey-100 cursor-pointer font-kulim font-medium"
                            >
                                <p>{currSection.title}</p>
                            </Link>
                    ))}
                </div>
            )}
        </div>
    )
}