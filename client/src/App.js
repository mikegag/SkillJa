import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./pages/NotFound"
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
import Account from "./pages/protected/Account"
import Notifications from "./pages/protected/settings/Notifications"
import Faqs from "./pages/protected/settings/Faqs"
import Payments from './pages/protected/settings/Payments'
import ComingSoon from "./pages/ComingSoon"
import OrderSuccessful from "./pages/protected/orders/OrderSuccessful"
import OrderCancelled from "./pages/protected/orders/OrderCancelled"
import ConfirmEmail from "./pages/protected/misc/ConfirmEmail"
import Invite from "./pages/protected/settings/Invite"
import Privacy from "./pages/protected/settings/Privacy"
import DeleteAccount from "./pages/protected/settings/DeleteAccount"
import Contact from "./pages/protected/settings/Contact"
import AboutUs from "./pages/AboutUs"
import TermsConditions from "./pages/TermsConditions"
import PrivacyPolicy from "./pages/PrivacyPolicy"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound/>} />
        <Route path="/" element={<Landing />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="home-feed" element={<HomeFeed />} />
        <Route path="faqs" element={<Faqs/>} />
        <Route path="contact-us" element={<Contact/>} />
        <Route path="about-us" element={<AboutUs/>} />
        <Route path="terms-conditions" element={<TermsConditions/>} />
        <Route path="privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="order-success" element={<OrderSuccessful/>} />
        <Route path="order-cancelled" element={<OrderCancelled/>} />
        <Route path="confirm-account" element={<ConfirmEmail/>} />
        <Route path="auth"element={<Authentication />}>
          <Route path="onboarding" element={<Onboarding/>}/>
          <Route path="coach" element={<Coach />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile">
            <Route index element={<Profile />} />
            <Route path="settings">
              <Route index element={<Account />} />
                <Route path="payments" element={<ComingSoon/>} />
                <Route path="notifications" element={<Notifications/>} />
                <Route path="invite" element={<Invite/>} />
                <Route path="privacy">
                  <Route index element={<Privacy/>} />
                  <Route path="delete-account" element={<DeleteAccount/>} />
                </Route>
              </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

 