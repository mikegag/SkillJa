import React from "react"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Authentication from "./pages/Authentication"
import Onboarding from "./pages/protected/Onboarding"
import HomeFeed from "./pages/protected/HomeFeed"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="onboarding"element={<Authentication />}>
          <Route index element={<Onboarding/>}/>
          <Route path="home-feed" element={<HomeFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

 