import React from "react";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);
  console.log(authScreenState);
  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
}

export default AuthPage;
