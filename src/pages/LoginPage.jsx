import { useContext, useState } from "react";
import assets from '../assets/assets'
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [currState, setCurState] = useState("sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  // ✅ Move this inside component
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const apiEndpoint = currState === "sign up" ? "signup" : "login";

    if (apiEndpoint === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    const credentials =
      apiEndpoint === "signup"
        ? { fullName, email, password, bio }
        : { email, password };

    const success = await login(apiEndpoint, credentials);
    if (success) {
      navigate("/");
    }
  };


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center 
      gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl bg-black">
      <img src={assets.logo_big} alt="" className="w-[min(30vw,250px)]" />
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "sign up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {currState === "sign up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
            placeholder="Add Your Bio"
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms and use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currState === "sign up" ? (
            <p className="text-gray-600 text-sm">
              Already have an account{" "}
              <span
                onClick={() => {
                  setCurState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-gray-600 text-sm">
              Create an Account{" "}
              <span
                onClick={() => {
                  setCurState("sign up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
