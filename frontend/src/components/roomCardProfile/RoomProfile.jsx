import { talkToApi } from "../../utils/utils.js";
import { useEffect, useState } from "react";
import { ConfigProvider, Modal } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Pencil } from "lucide-react";

import { Card } from "./styles.js";
import InventoryItem from "./inventoryItem/InventoryItem.jsx";
import InventorySlot from "./inventoryItem/InventorySlot.jsx";
// Sample inventory data
const initialItems = [
  {
    id: 1,
    x: 0,
    y: 0,
    width: 3,
    height: 2,
    image:
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGM4a2lnc2xmbG1tYXlhOXpmY2hpeHR1OGU5ejd2dTU5Z2o5YzRrOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/axuYBdrWJrJJUGGsTf/giphy.gif",
  },
  {
    id: 2,
    x: 3,
    y: 1,
    width: 2,
    height: 1,
    image:
      "https://media.giphy.com/media/C6Nmq5zXW4HTuZdCSG/giphy.gif?cid=790b76114c8kigslflmmaya9zfchixtu8e9z7vu59gj9c4k8&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  },
  {
    id: 3,
    x: 3,
    y: 1,
    width: 1,
    height: 1,
    image:
      "https://userimages04.imvu.com/userdata/148632483/badge_50a8ced0bc184f013e1f966aa5ef25db.gif?_t=7596518598524004616",
  },
  {
    id: 6,
    x: 3,
    y: 1,
    width: 1,
    height: 1,
    image:
      "https://userimages05.imvu.com/userdata/148632483/badge_a0593d5edf6afcd5313ddc2312793416.gif?_t=11847614191625692358",
  },
  {
    id: 4,
    x: 3,
    y: 1,
    width: 1,
    height: 1,
    image:
      "https://userimages04.imvu.com/userdata/148632483/badge_98ad351cd4aac3c7995e0e550f6ee585.gif?_t=7786542276057936789",
  },
  {
    id: 5,
    x: 3,
    y: 1,
    width: 1,
    height: 1,
    image:
      "https://userimages02.imvu.com/userdata/148632483/badge_a52baaf9eea7de8a154057b8a79791df.gif?_t=5575431575261300385",
  },
  // Add more items as needed
];

export function RoomProfile({ roomID, token, openModal, closeModal }) {
  const [roomInfo, setRoomInfo] = useState({});
  const [items, setItems] = useState(initialItems);
  const [numRows, setNumRows] = useState(3);
  const [numCols, setNumCols] = useState(9);
  const slotSize = 50;

  const gifs = [
    {
      id: 1,
      src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGM4a2lnc2xmbG1tYXlhOXpmY2hpeHR1OGU5ejd2dTU5Z2o5YzRrOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/axuYBdrWJrJJUGGsTf/giphy.gif",
      alt: "Gif",
    },
    {
      id: 2,
      src: "https://media.giphy.com/media/C6Nmq5zXW4HTuZdCSG/giphy.gif?cid=790b76114c8kigslflmmaya9zfchixtu8e9z7vu59gj9c4k8&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      alt: "Gif",
    },
    {
      id: 3,
      src: "https://media.giphy.com/media/QxLyXUCjoweU3D7RVw/giphy.gif?cid=ecf05e470xtn4yt8ftknb8rria7jgihtn1rvtae3jvkodoez&ep=v1_gifs_search&rid=giphy.gif&ct=g",
      alt: "Gif",
    },
    {
      id: 4,
      src: "https://media.giphy.com/media/H27tRClziNXajDcfmM/giphy.gif?cid=ecf05e47jzshqotv9phf6dx0726uv04q71ohtpszxctnb0cm&ep=v1_stickers_search&rid=giphy.gif&ct=s",
      alt: "Gif",
    },
  ];
  const handleOk = () => {
    closeModal(false);
  };
  const handleCancel = () => {
    closeModal(false);
  };

  // Move item in the grid
  const moveItem = (id, x, y) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // Limita a posição para não ultrapassar os limites do inventário
          const newX = Math.min(Math.max(0, x), numCols - item.width);
          const newY = Math.min(Math.max(0, y), numRows - item.height);
          return { ...item, x: newX, y: newY };
        }
        return item;
      }),
    );
  };

  function getRoomProfile() {
    const response = talkToApi("get", "room", `/${roomID}`, " ", token);
    response.then((res) => {
      // cover: "https://firebasestorage.googleapis.com/v0/b/delivery-bot-fe36a.appspot.com/o/rock.jpg?alt=media&token=515d7958-5a96-4c37-a168-0769c50b021a";
      // description: "Rock é top";
      // genres: ["XNZcxgkuU0aKnnll2mtM"];
      // id: "Evv6GpZ47jqZaXc9REgq";
      // name: "Rock is Life";
      // online: true;
      // owner: "zFrO2zkoKKTjguVS4Vcy";
      setRoomInfo(res.data);
    });
  }

  useEffect(() => {
    getRoomProfile();
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            // contentBg: "#f0f0f0",
          },
        },
      }}
    >
      <Modal
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Card $cover={roomInfo.cover}>
          <div className="header">
            <div className="cover"></div>
            <div className="info">
              <div className="title">
                <h3>{roomInfo.name}</h3>
                <Pencil size={20} className="editIcon" />
              </div>
              <div className="badges-vip">
                <img
                  src="https://userimages01.imvu.com/userdata/325411079/badge_70a8562e83f2324bb98f1d849a67ceec.gif?_t=15158730245083815811"
                  alt="vip"
                />
                {/*<img*/}
                {/*  src="https://media.giphy.com/media/TJbFT1Xyk1teJZhaob/giphy.gif?cid=790b7611oa6ydlr5j1dc9mdkh9q8cetkrpz4599l4yuxo0yg&ep=v1_stickers_search&rid=giphy.gif&ct=s"*/}
                {/*  alt="vip"*/}
                {/*/>*/}
              </div>
            </div>
          </div>
          <div className="descriptionHeader">
            <span>Descrição</span>
            <div>{roomInfo.description}</div>
          </div>
          <div className="badges">
            <span>Badges</span>
            <DndProvider backend={HTML5Backend}>
              {/*TODO:Salvar a posição dos badges no banco de dados*/}
              <div
                className="inventory"
                style={{
                  width: numCols * slotSize,
                  height: numRows * slotSize,
                  position: "relative",
                }}
              >
                {[...Array(numRows)].map((_, row) => (
                  <div className="inventory-row" key={row}>
                    {[...Array(numCols)].map((_, col) => (
                      <InventorySlot
                        key={`${row}-${col}`}
                        x={col}
                        y={row}
                        items={items}
                        moveItem={moveItem}
                        slotSize={slotSize}
                      />
                    ))}
                  </div>
                ))}
                {items.map((item) => (
                  <InventoryItem
                    key={item.id}
                    item={item}
                    moveItem={moveItem}
                    slotSize={slotSize}
                  />
                ))}
              </div>
            </DndProvider>
          </div>
        </Card>
      </Modal>
    </ConfigProvider>
  );
}
