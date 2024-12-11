import { Flex, Menu, Switch } from "antd";
import { menuItems } from "./menuItens.jsx";
import { Power, PowerOff } from "lucide-react";
import { border } from "../themes/darkRoomTheme.js";
import HeaderC from "./Header.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Alert from "./Alert.jsx";
import { useStore } from "../contexts/zustand-context/PlayerContext.js";

function AsideMenu() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(true);
  const { changeRoomToOffline, roomSpecs } = useStore();
  useEffect(() => {
    if (roomSpecs.online === true) {
      setAlert(true);
    } else setAlert(false);
  }, [roomSpecs]);

  const roomToOnOrOffline = useMemo(() => {
    return <Alert msm={alert ? "Sala Online" : "Sala Offiline"} type="info" />;
  }, [alert]);

  function menuClick(click) {
    const { key } = click;
    switch (key) {
      case "sair":
        changeRoomToOffline(false);
        localStorage.removeItem("insideRoom");
        navigate("/app");
    }
  }
  return (
    <>
      <Flex
        vertical="vertical"
        style={{
          height: "100%",
          borderRight: `0.01px solid ${border}`,
        }}
      >
        {roomToOnOrOffline}
        <HeaderC />
        <Flex
          style={{ width: "100%", padding: "1rem 0" }}
          justify="center"
          align="center"
          horizontal="horizontal"
          gap={10}
        >
          <PowerOff size={20} />
          <Switch defaultChecked onChange={changeRoomToOffline} />
          <Power size={20} />
        </Flex>
        <div
          style={{ padding: "0 1rem", borderBottom: `0.01px solid ${border}` }}
        ></div>
        {/*<SearchMusic/>*/}
        <Menu mode="inline" items={menuItems} onClick={menuClick} />
      </Flex>
    </>
  );
}
export default AsideMenu;
