import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Authentication from "./pages/Authentication"
import Onboarding from "./pages/protected/Onboarding"
import HomeFeed from "./pages/protected/HomeFeed"
import Coach from "./pages/protected/Coach"
import Calendar from "./pages/protected/Calendar"
import Chat from "./pages/protected/Chat"
import Profile from "./pages/protected/Profile"
import Settings from "./pages/protected/Settings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="auth"element={<Authentication />}>
          <Route path="onboarding" element={<Onboarding/>}/>
          <Route path="home-feed" element={<HomeFeed />} />
          <Route path="coach" element={<Coach />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="settings" element={<Settings />}  />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

 