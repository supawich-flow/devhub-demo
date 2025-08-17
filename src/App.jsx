import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/layout/DashBoardLayout";
import CommunityFeed from "./pages/CommunityFeed";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
        </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/communityfeed" element={<CommunityFeed />} />
          <Route path="/userprofile/:userId" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
