import React from "react"
import { Link } from "react-router-dom"

interface HeaderProps {
    useCase: 'default' | 'protected'
}

export default function Header({useCase}:HeaderProps){
    return (
        <div className="flex justify-start mr-auto ml-0 px-2 lg:px-8 mt-4 mb-10 lg:mb-8">
            <Link to={`${useCase === 'default'? '/': '/auth/home-feed'}`}>
                <img 
                    src={require('../../assets/skillja-logo.png')} 
                    className="w-14 lg:w-20"
                />
            </Link>
        </div>
    )
}