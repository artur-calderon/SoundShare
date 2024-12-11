import {
  Space,
  Input,
  Flex,
  Card,
  Button,
  Modal,
  Form,
  Select,
  Upload,
  Spin,
} from "antd";
import { LogIn, Info } from "lucide-react";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../contexts/zustand-context/UserContext.js";
import {
  storage,
  uploadBytes,
  ref,
  getDownloadURL,
} from "../../Services/firebase.js";
import { talkToApi } from "../../utils/utils.js";
import Alert from "../Alert.jsx";
import { RoomProfile } from "../roomCardProfile/RoomProfile.jsx";

export default function SearchRooms() {
  const { Meta } = Card;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myRooms, setMyRooms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [alertMessage, setAlertMessage] = useState({});
  const navigate = useNavigate();
  const [showRoomProfile, setShowRoomProfile] = useState(false);
  const [roomid, setRoomid] = useState("");

  const { user } = userContext((store) => {
    return {
      user: store.user,
    };
  });
  useEffect(() => {
    try {
      const response = talkToApi("get", "/room", " ", {}, user.accessToken);
      response.then((res) => {
        const myRooms = res.data.filter((room) => room.owner === user.uid);
        setMyRooms(myRooms);
      });
    } catch (e) {
      console.log(e);
    }
  }, [user.uid, user.accessToken]);

  useEffect(() => {
    try {
      const res = talkToApi("get", "/genre", " ", {}, user.accessToken);
      res.then((res) => {
        setGenres(res?.data);
      });
    } catch (e) {
      console.log(e);
    }
  }, [user.accessToken]);

  function changeRoomToOnline(roomID) {
    // Muda o status da sala para online e redireciona o usuário para ela
    const info = { online: true };
    const res = talkToApi(
      "put",
      "/room",
      `/${roomID}`,
      { info },
      user.accessToken,
    );
    res
      .then(() => {
        navigate(`/room/${roomID}`);
      })
      .catch((e) => console.log(e));
  }
  function openProfileRoom(id) {
    setRoomid(id);
    setShowRoomProfile(!showRoomProfile);
  }

  function ModalCreateRoom() {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [file, setFile] = useState(null);

    async function HandleCreateRoom(values) {
      let genres = [];
      genres.push(values.genero);

      await axios({
        method: "POST",
        url: `${import.meta.env.VITE_API}/room`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        data: {
          info: {
            name: values.nomedasala,
            description: values.descricao,
            cover: file,
            genres: genres,
            owner: user.uid,
          },
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status === 2001) {
            setAlertMessage({
              message: "Sala Criada com Sucesso!",
              type: "success",
            });
          }
        })
        .catch((e) => {
          setAlertMessage({ message: e.response.data.message, type: "error" });
        });
    }
    async function handleFile(file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((url) => {
            setFile(url);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    function cancelModal() {
      setAlertMessage({});
      setIsModalVisible(false);
    }
    return (
      <Modal
        title="Crie sua Sala"
        open={isModalVisible}
        onCancel={() => cancelModal()}
        footer={null}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            maxWidth: 600,
            width: "50rem",
          }}
          form={form}
          onFinish={HandleCreateRoom}
        >
          <Form.Item label="Nome da Sala" name="nomedasala">
            <Input />
          </Form.Item>
          <Form.Item label="Gênero" name="genero">
            <Select>
              {genres.map((genre) => (
                <Select.Option key={genre.id} value={genre.id}>
                  {genre.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Descrição" name="descricao">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Capa" valuePropName="fileList">
            <Upload
              action={handleFile}
              listType="picture-card"
              accept="image/png, image/jpeg"
              maxCount={1}
              multiple
            >
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Criar Sala
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
  return (
    <>
      <Space
        style={{
          marginBottom: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        {Object.hasOwn(alertMessage, "message") && (
          <Alert msm={alertMessage.message} type={alertMessage.type} />
        )}
        {isModalVisible && <ModalCreateRoom />}

        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Criar Sala
        </Button>
        <h3>Suas Salas</h3>
        <Flex direction="column" justify="center" gap="1rem">
          {myRooms.length > 0 ? (
            myRooms.map((room) => (
              <Card
                key={room.id}
                style={{
                  width: 240,
                }}
                cover={<img alt="example" src={room.cover} />}
              >
                <Meta title={room.name} description={room.description} />
                <Meta
                  description={room.genres === genres.id ? genres.name : null}
                />
                <Flex
                  style={{
                    width: "100%",
                    padding: "0.1rem",
                    marginTop: "1rem",
                  }}
                  justify="space-between"
                >
                  {/*TODO: ADicionar um put para passando online true para o back*/}

                  <LogIn
                    strokeWidth={1.5}
                    size={15}
                    onClick={() => changeRoomToOnline(room.id)}
                  />

                  <Info
                    strokeWidth={1.5}
                    size={15}
                    onClick={() => navigate(`/app/editroom/${room.id}`)}
                  />
                </Flex>
              </Card>
            ))
          ) : (
            <h3>
              Carregando Salas... <Spin />
            </h3>
          )}
        </Flex>
        {showRoomProfile && (
          <RoomProfile
            roomID={roomid}
            openModal={showRoomProfile}
            closeModal={setShowRoomProfile}
            token={user.accessToken}
          />
        )}
      </Space>
    </>
  );
}
