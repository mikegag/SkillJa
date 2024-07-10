import React from "react"
import HamburgerMenu from "./HamburgerMenu"
import { Link } from "react-router-dom"

interface HeaderProps {
    useCase: 'default' | 'protected'
}

export default function Header({useCase}:HeaderProps){
    return (
        <>
        {useCase === 'default' ?
            <div className="w-full flex items-center px-4 pt-2 pb-4 lg:px-10 mb-10 lg:mb-8">
                <Link to='/' className="mr-auto ml-0 my-auto">
                    <img 
                        src={require('../../assets/skillja-logo.png')} 
                        className="w-12 lg:w-16"
                    />
                </Link>
                <HamburgerMenu useCase="public" />
            </div>
        :
            <div className="w-full flex items-center px-4 pt-2 pb-4 lg:px-10 mb-10 border-b border-main-grey-100 lg:mb-8">
                <Link to='/auth/home-feed' className="mr-auto ml-0 my-auto">
                    <img 
                        src={require('../../assets/skillja-logo.png')} 
                        className="w-12 lg:w-16"
                    />
                </Link>
                <HamburgerMenu useCase="authorized" />
            </div>
        }
        </> 
    )
}