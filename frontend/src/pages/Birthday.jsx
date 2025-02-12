import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Birthday = () => {
  const navigate = useNavigate();
  const textRef = useRef(null);
  const balloonRef = useRef([]);
  const cakeRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "bounce.out" }
    );

    balloonRef.current.forEach((balloon, index) => {
      gsap.fromTo(
        balloon,
        { y: 200, opacity: 0 },
        {
          y: -150,
          opacity: 1,
          duration: 2 + index * 0.5,
          ease: "power2.out",
          repeat: -1,
          yoyo: true,
        }
      );
    });

    gsap.fromTo(
      cakeRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.3)" }
    );
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      Cookies.remove("token");
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error.response?.data || error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-500 to-gray-300 text-white overflow-hidden">
      <h1
        ref={textRef}
        className="mt-40 text-6xl font-serif font-bold mb-6 text-center"
      >
        🎉 Happy Birthday! 🎂
      </h1>

      <div className="relative w-40 h-40 mt-10" ref={cakeRef}>
        <div className="absolute bottom-0 w-full h-24 bg-yellow-300 rounded-t-xl shadow-lg"></div>
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-4 h-10 bg-red-500 rounded-full"></div>
      </div>

      <div className="absolute top-10 flex space-x-8">
        {["red", "blue", "green", "yellow"].map((color, index) => (
          <div
            key={index}
            ref={(el) => (balloonRef.current[index] = el)}
            className={`w-12 h-16 bg-${color}-500 rounded-full shadow-lg`}
          ></div>
        ))}
      </div>
      <div className="w-full flex justify-end mt-10 mr-20">
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-black text-white rounded-lg shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Birthday;
