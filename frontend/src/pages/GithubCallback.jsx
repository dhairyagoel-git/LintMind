import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GithubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginWithGithub = async () => {
      try {
        const code = new URLSearchParams(
          window.location.search
        ).get("code");

        const res = await axios.post(
          `${import.meta.env.VITE_APP_URL}/auth/github`,
          { code }
        );

        const user = res.data.data;

        localStorage.setItem("token", user.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: user._id,
            name: user.name,
            email: user.email,
          })
        );

        navigate("/");
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    loginWithGithub();
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default GithubCallback;