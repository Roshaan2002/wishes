import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import Cookies from "js-cookie";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const textRef = useRef([]);

  useGSAP(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05, // Animate each letter separately
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, []);

  const HandleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        currentState === "Sign Up" ? "/api/auth/register" : "/api/auth/login";

      const response = await axios.post(
        `${backendUrl}${url}`,
        currentState === "Sign Up"
          ? { name, email, password }
          : { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/birthday");
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login/Register Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      navigate("/birthday");
    }
  }, [navigate]);

  return (
    <form
      onSubmit={HandleOnSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-36 gap-4 text-gray-800"
    >
      {/* Animated Text */}
      <p className="text-xl font-semibold text-center">
        {"Hi Sameen, please login or signup".split("").map((char, index) => (
          <span
            key={index}
            ref={(el) => (textRef.current[index] = el)}
            className="inline-block"
            style={{ marginRight: char === " " ? "6px" : "0px" }} // Add space between words
          >
            {char}
          </span>
        ))}
      </p>

      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="text-3xl font-semibold">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          className="w-full px-3 py-2 border border-gray-800 rounded"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          required
        />
      )}

      <input
        className="w-full px-3 py-2 border border-gray-800 rounded"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        required
      />
      <input
        className="w-full px-3 py-2 border border-gray-800 rounded"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm">
        <p className="cursor-pointer">Forgot your password?</p>
        <p
          onClick={() =>
            setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
          }
          className="cursor-pointer"
        >
          {currentState === "Login" ? "Create Account" : "Login here"}
        </p>
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4 rounded">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
