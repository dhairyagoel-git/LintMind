import { FaGithub } from "react-icons/fa";

const GithubBtn = () => {
  const handleGithubLogin = () => {
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${
        import.meta.env.VITE_GITHUB_CLIENT_ID
      }&scope=user:email`;
  };

  return (
    <button className="oauth-btn github-btn" onClick={handleGithubLogin}>
      <FaGithub size={20} />
      <span>Continue with GitHub</span>
    </button>
  );
};

export default GithubBtn;