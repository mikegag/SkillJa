import React from "react"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Authentication from "./pages/Authentication"
import AthleteIntroduction from "./pages/protected/AthleteIntroduction"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="onboarding"element={<Authentication />}>
          <Route index element={<AthleteIntroduction/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

 