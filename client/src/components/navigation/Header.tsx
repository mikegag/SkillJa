import React from "react"
import HamburgerMenu from "./HamburgerMenu"
import { Link, useLocation } from "react-router-dom"

interface HeaderProps {
    useCase: 'default' | 'protected' | 'onboarding'
}

export default function Header({useCase}:HeaderProps){
    const location = useLocation();
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // Only reload the page if there is a query string
        if (location.search) {
            window.location.reload();
        }
    }

    return (
        <>
        {useCase === 'default' ?
            <div className="w-full flex items-center px-4 pt-2 pb-4 mb-8 lg:px-10">
                <Link to='/' className="mr-auto ml-0 my-auto">
                    <img 
                        src={require('../../assets/skillja-logo.png')} 
                        className="w-12 lg:w-16"
                    />
                </Link>
                <HamburgerMenu useCase="public" />
            </div>
        :
            (useCase === 'protected' ? 
                <div className="w-full flex items-center px-4 pt-2 pb-4 lg:px-10">
                    <Link to='/home-feed' className="mr-auto ml-0 my-auto" onClick={handleLinkClick}>
                        <img 
                            src={require('../../assets/skillja-logo.png')} 
                            className="w-12 lg:w-16"
                        />
                    </Link>
                    <HamburgerMenu useCase="authorized" />
                </div>
            :
                <div className="w-full flex items-center px-4 pt-2 pb-4 lg:px-10">
                    <img 
                        src={require('../../assets/skillja-logo.png')} 
                        className="w-12 mr-auto cursor-not-allowed ml-0 my-auto lg:w-16"
                    />
                </div>
            )
        }
        </> 
    )
}