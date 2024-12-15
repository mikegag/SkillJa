import { useState } from "react"

export default function ErrorMessage(){
    const showAlert = () => {
        alert("Passwords must match each other. Try again.");
    };

    return (
        <div className="cursor-pointer" onClick={showAlert}>
            <div className="absolute left-0 right-0 top-10 mx-auto text-center font-kulim shadow-lg border rounded-lg border-main-green-900 bg-main-white w-64 p-2">
                Passwords must match each other 
                <span className="text-amber-600 font-semibold text-xl ml-1">
                    !
                </span>
            </div>
        </div>
    )
}