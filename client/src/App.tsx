// import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import UserData from "./components/custom/UserData";
import { useAuthContext } from "./context/AuthContext";
import Dashboard from "@/pages/dashboard";

function App() {
  const { authUser, setAuthUser, isLoading } = useAuthContext();
  console.log(authUser, setAuthUser, isLoading);

  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path={"/signin"} element={<SigninPage />} />
      <Route path={"/user"} element={<UserData />} />
      <Route path={"/dashboard"} element={<Dashboard />} />
    </Routes>
  );
}

export default App;
