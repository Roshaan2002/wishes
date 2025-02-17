import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Birthday from "./pages/Birthday";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://http://3.94.80.174:5000";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/birthday" element={<Birthday />} />
      </Routes>
    </>
  );
};

export default App;
