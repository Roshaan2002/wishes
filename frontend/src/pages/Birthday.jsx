import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Birthday = () => {
  const navigate = useNavigate();
  const balloonRef = useRef([]);
  const cakeRef = useRef(null);
  const messageRef = useRef(null);
  const birthdayMessageRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);
  const poemLines = [
    "In the lake there lies a reflection, a mere perfected image of you.",
    "If you sit quietly by her bedside, she'll move closer and closer to you.",
    "If you smile, she'll smile back. Whenever you touch her, she'll react.",
    "In the lake there lies a reflection, if you love her, she will always love you back.",
    "Just a reminder, no matter what you are going through, love yourself first and you will always be loved; no one can take that away from you.",
  ];
  const lineRefs = useRef([]);

  // Unified animation configuration
  const staggerAnimation = (elements) => {
    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  };

  useEffect(() => {
    // Balloon animation
    balloonRef.current.forEach((balloon, index) => {
      gsap.fromTo(
        balloon,
        { y: 200, opacity: 0, rotation: index % 2 === 0 ? -15 : 15 },
        {
          y: -250,
          opacity: 1,
          rotation: index % 2 === 0 ? 15 : -15,
          duration: 3 + index * 0.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    });

    // Cake entrance animation
    gsap.fromTo(
      cakeRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      }
    );
  }, []);

  useEffect(() => {
    if (showMessage) {
      staggerAnimation(lineRefs.current);
    }
  }, [showMessage]);

  useEffect(() => {
    if (showBirthdayMessage) {
      const birthdayElements = [
        ...birthdayMessageRef.current.querySelectorAll(
          ".birthday-heading, .birthday-subtext"
        ),
      ];
      staggerAnimation(birthdayElements);
    }
  }, [showBirthdayMessage]);

  const handleShowMessage = () => {
    setShowBirthdayMessage(false);
    gsap.to(birthdayMessageRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        setShowMessage(true);
        gsap.fromTo(
          messageRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "back.out(1.7)",
          }
        );
      },
    });
  };

  const handleShowBirthdayMessage = () => {
    setShowMessage(false);
    gsap.to(messageRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        setShowBirthdayMessage(true);
        gsap.fromTo(
          birthdayMessageRef.current,
          { opacity: 0, scale: 1.2 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)",
          }
        );
      },
    });
  };

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-800 via-gray-600 to-pink-500 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Control Panel */}
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-10 z-10">
        <button
          onClick={handleShowBirthdayMessage}
          className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
            border border-white/20"
        >
          Birthday Message
        </button>

        <button
          onClick={handleShowMessage}
          className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
            border border-white/20"
        >
          Secret Message
        </button>

        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
            border border-white/20"
        >
          Exit
        </button>
      </div>

      {/* Content Area */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl px-4 z-10">
        {showMessage && (
          <div
            ref={messageRef}
            className="text-lg p-8 bg-gradient-to-br from-gray-900/60 to-gray-800/50 
              text-white rounded-2xl shadow-2xl backdrop-blur-lg border-2 border-white/30 mx-auto"
          >
            {poemLines.map((line, index) => (
              <p
                key={index}
                ref={(el) => (lineRefs.current[index] = el)}
                className="opacity-0 leading-relaxed mb-4 last:mb-0 text-purple-100 font-medium"
              >
                {line}
                {index === poemLines.length - 1 && (
                  <span className="text-cyan-300 font-semibold mt-4 block">
                    ✨ Self-love is eternal ✨
                  </span>
                )}
              </p>
            ))}
          </div>
        )}

        {showBirthdayMessage && (
          <div ref={birthdayMessageRef} className="space-y-8 mx-auto">
            <h1
              className="text-[42px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 
              bg-clip-text text-transparent"
            >
              <span className="birthday-heading opacity-0">
                🎉 Happy Birthday Sameen! 🎂
              </span>
            </h1>
            <div className="text-xl text-purple-100 font-medium">
              <span className="birthday-subtext opacity-0">
                Wishing you an amazing day filled with joy! 🌟
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cake Emoji */}
      <div
        ref={cakeRef}
        className="absolute bottom-10 right-10 text-6xl opacity-0 z-10"
      >
        🎂
      </div>
    </div>
  );
};

export default Birthday;
