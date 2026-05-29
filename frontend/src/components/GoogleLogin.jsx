import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AuthPage.css";
const GoogleBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const res = await axios.post(
            `${import.meta.env.VITE_APP_URL}/auth/google`,
            {
              credential: credentialResponse.credential,
            },
          );

          const user = res.data.data;

          localStorage.setItem("token", user.token);

          localStorage.setItem(
            "user",
            JSON.stringify({
              _id: user._id,
              name: user.name,
              email: user.email,
            }),
          );

          navigate("/");
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleBtn;
