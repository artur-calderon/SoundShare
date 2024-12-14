import Main from "../components/main/Main.jsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Layout, ConfigProvider, Modal } from "antd";
import AsideMenu from "../components/AsideMenu.jsx";
import { darkRoomTheme } from "../themes/darkRoomTheme.js";
import { lightTheme } from "../themes/lightTheme.js";
import { motion } from "framer-motion";
import { socketUseStore } from "../contexts/zustand-context/Socket.js";
import { useStore } from "../contexts/zustand-context/PlayerContext.js";
import PlayerControls from "../components/PlayerControls/PlayerControls.jsx";
import { userContext } from "../contexts/zustand-context/UserContext.js";
import { Loading } from "../components/Loading.jsx";
import RoomQRCode from "./RoomQRCode/Room-QRCOde.jsx";

function Room() {
  const { id } = useParams();

  const [changeTheme, setTheme] = useState(true);

  const { Sider, Content } = Layout;
  const navigate = useNavigate();

  const { playing, getInfoRoom, roomSpecs, currentMusicPlaying } = useStore(
    (store) => {
      return {
        playlist: store.playlist,
        updatePlaylist: store.updatePlaylist,
        playing: store.playing,
        getInfoRoom: store.getInfoRoom,
        roomSpecs: store.roomSpecs,
        currentMusicPlaying: store.currentMusicPlaying,
      };
    },
  );
  const { connectSocket, sendHandShake, startListeners } = socketUseStore(
    (state) => {
      return {
        update_uid: state.update_uid,
        remove_users: state.remove_users,
        connectSocket: state.connectSocket,
        startListeners: state.startListeners,
        sendHandShake: state.sendHandShake,
      };
    },
  );
  const { isLogged, user } = userContext((store) => {
    return {
      user: store.user,
      loginLoad: store.loginLoad,
      isLogged: store.isLogged,
    };
  });

  const roomLocation = useLocation();
  useEffect(() => {
    //manter o usuário dentro da sala após carregar a página.
    localStorage.setItem("insideRoom", roomLocation.pathname);
  }, [roomLocation]);
  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  useEffect(() => {
    //  Conecta no web socket
    connectSocket();
    getInfoRoom(id, user).then(() => {
      sendHandShake();
    });
    // inicia os eventos
    startListeners();
  }, [connectSocket, startListeners, sendHandShake, getInfoRoom, id, user]);

  const variantsControls = {
    show: { position: "fixed", y: -120, display: "flex", width: "100%" },
    closed: { position: "relative", y: 0, display: "none", width: "100%" },
  };
  //adiciona um loading antes de verificar se o user é o dono da sala.
  if (!roomSpecs || Object.keys(roomSpecs).length === 0) {
    return <Loading />;
  }
  if (user.uid !== roomSpecs.owner) {
    return <RoomQRCode />;
  }
  return (
    <ConfigProvider theme={changeTheme ? darkRoomTheme : lightTheme}>
      <Layout>
        <Content>
          <Layout
            style={{
              height: "100vh",
              overflow: "hidden",
              zIndex: 1,
              position: "relative",
            }}
          >
            <Sider width={180}>
              <AsideMenu setTheme={setTheme} theme={changeTheme}></AsideMenu>
            </Sider>
            <Content>
              <Main></Main>
            </Content>
          </Layout>

          <motion.div
            initial={{
              y: 200,
              display: "none",
              position: "relative",
              zIndex: 2,
            }}
            animate={playing ? "show" : "closed"}
            variants={variantsControls}
          >
            <PlayerControls />
          </motion.div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
export default Room;
