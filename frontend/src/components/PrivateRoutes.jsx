import { Navigate } from "react-router-dom";
import { userContext } from "../contexts/zustand-context/UserContext.js";
import { useStore } from "../contexts/zustand-context/PlayerContext.js";
import Room from "../pages/Room.jsx";
import RoomQRCode from "../pages/RoomQRCode/Room-QRCOde.jsx";
import { Loading } from "./Loading.jsx";
import { useEffect } from "react";

import { doc, db, updateDoc } from "../Services/firebase.js";

export default function PrivateRoutes() {
  const { user } = userContext((store) => {
    return {
      user: store.user,
    };
  });
  const { roomSpecs } = useStore((store) => {
    return {
      roomSpecs: store.roomSpecs,
    };
  });

  if (!user || !roomSpecs) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  // } else if (user.uid === roomSpecs.owner) {
  //   return <Room />;
  // } else {
  //   return <RoomQRCode />;
  // }
}
