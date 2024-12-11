import { Container, InfoRoom } from "./styles.js";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import { BoomBox, Podcast, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoomStats() {
  const { roomSpecs } = useStore();
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [roomOnline, setRoomOnline] = useState(false);
  useEffect(() => {
    if (Object.keys(roomSpecs).length > 0) {
      setRoomLoaded(!roomLoaded);
    }
    if (roomSpecs.online) {
      setRoomOnline(true);
    } else {
      setRoomOnline(false);
    }
  }, [roomSpecs]);

  return (
    <Container>
      <h3>Informações da Sala</h3>
      <InfoRoom>
        <span>
          <BoomBox />
          Nome da Sala: <h3>{roomLoaded ? roomSpecs.name : "Carregando..."}</h3>
        </span>
        <span>
          {" "}
          <Podcast />
          Sala: {roomOnline ? "Online" : "Offline"}
        </span>
        <span>
          {" "}
          <User />
          Users Online: 3{" "}
        </span>

        {/*<Statistic title="Users Online" value={3} />*/}
      </InfoRoom>
    </Container>
  );
}
