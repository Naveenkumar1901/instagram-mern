import Login from "../pages/Login";
import Register from "../pages/Register";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user) return children;
    else return <Navigate to="/login" />;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
