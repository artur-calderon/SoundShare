import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Room from "./pages/Room.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home/Home.jsx";
import UserHome from "./pages/App/UserHome.jsx";
import SearchRooms from "./components/SearchRooms/SearchRooms.jsx";
import MyRooms from "./components/MyRooms/MyRooms.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import EditRoomPage from "./pages/EditRoom/EditRoom.jsx";

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/room/:id" element={<Room />} />
      <Route path="*" element={<Navigate to="/" />} />

      <Route path="/app" element={<UserHome />}>
        <Route path="/app" element={<SearchRooms />} />
        <Route path="/app/myrooms" element={<MyRooms />} />
        <Route path="/app/profile" element={<UserProfile />} />
        <Route path="/app/editroom/:id" element={<EditRoomPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
