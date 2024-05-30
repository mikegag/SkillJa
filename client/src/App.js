import React from "react"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import AthleteIntroduction from "./pages/AthleteIntroduction"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="athlete-introduction" element={<AthleteIntroduction/>}/>
      </Routes>
    </BrowserRouter>
  )
}

 