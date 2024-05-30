import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

interface CredentialProps {
    credentials: boolean
}
export default function Authentication({credentials}:CredentialProps){
    const navigate = useNavigate()
    function isUserAuthentication():boolean{
       //implement logic later, returns true for testing
       return true
    }
    return (
        <>
            {isUserAuthentication() ? <Outlet /> : navigate('/') } 
        </>
    )
}