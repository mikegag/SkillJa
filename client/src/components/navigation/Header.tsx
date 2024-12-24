import React from "react"
import HamburgerMenu from "./HamburgerMenu"
import { Link} from "react-router-dom"

interface HeaderProps {
    useCase: 'default' | 'protected' | 'onboarding';
    imageName?: string;
    url?:string;
}

export default function Header({useCase, imageName, url}:HeaderProps){

    return (
        <>
        {useCase === 'default' ?
            <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-10">
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
                <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-10">
                    <Link to='/home-feed' className="mr-auto ml-0 my-auto">
                        <img 
                            src={require('../../assets/skillja-logo.png')} 
                            className="w-12 lg:w-16"
                            alt="SkillJa logo"
                        />
                    </Link>
                    <HamburgerMenu useCase="authorized" imageName={imageName} url={url}/>
                </div>
            :
                <div className="w-full flex items-center px-4 pt-6 pb-4 mb-8 lg:px-10">
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