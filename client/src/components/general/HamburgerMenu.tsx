import React, { useEffect, useRef, useState } from "react"

interface UserDataStructure {
    picture: string
}

export default function HamburgerMenu(){
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [userData, setuserData] = useState<UserDataStructure>({
        picture: ''
    })
    const menuRef = useRef<HTMLDivElement>(null)
    
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
    
    return (
        <div ref={menuRef}>
            <div className={`flex bg-main-white rounded-2xl border border-main-grey-100 p-1 h-12 my-auto hover:cursor-pointer hover:shadow-lg ${menuOpen? "shadow-lg":""}`} onClick={()=>setMenuOpen(!menuOpen)}>
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
                <div className="flex flex-col absolute py-1 right-16 mt-2 shadow-sm bg-main-white rounded-2xl">
                    <p>Messages</p>
                    <p>Calendar</p>
                </div>
            :
                <></>
            }
        </div>
    )
}