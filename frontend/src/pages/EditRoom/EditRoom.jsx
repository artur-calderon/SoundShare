import { useEffect, useRef, useState } from "react";
import {
  Title,
  EditRoomContainer,
  Input,
  FormGroup,
  Label,
  Textarea,
  CheckboxGroup,
  CheckboxLabel,
  QRCodeSection,
  QRCodeInput,
  genres,
  Buttons,
  QRCondeArea,
  QRCodeContainer,
} from "./styles.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { talkToApi } from "../../utils/utils.js";
import { userContext } from "../../contexts/zustand-context/UserContext.js";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import {
  getDownloadURL,
  ref,
  storage,
  uploadBytes,
} from "../../Services/firebase.js";

export default function EditRoomPage() {
  const [name, setName] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [tableNumbers, setTableNumbers] = useState("");
  const [table, setTable] = useState([]);

  const { id } = useParams();
  const qr = useRef({});

  const { user } = userContext();
  const { roomSpecs, getInfoRoom } = useStore((store) => {
    return {
      getInfoRoom: store.getInfoRoom,
      roomSpecs: store.roomSpecs,
    };
  });

  useEffect(() => {
    getInfoRoom(id, user.accessToken).then((res) => console.log(res));
  }, [getInfoRoom, id, user.accessToken]);

  const handleDownload = (t) => {
    const svg = qr.current[t].querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.download = `table ${t}.png`;
      link.href = pngFile;
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };
  async function handleFile(file) {
    if (!file) return;
    const storageRef = ref(storage, file.target.files[0].name);
    await uploadBytes(storageRef, file.target.files[0])
      .then(() => {
        getDownloadURL(storageRef).then((url) => {
          setCover(url);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tableNumbers) {
      const tables = Array.from(
        tableNumbers.split(",").map((num) => num.trim()),
      );
      setTable(tables);
    }

    const info = {
      name,
      cover: cover,
      description,
      selectedGenres,
    };

    const updateRoom = await talkToApi(
      "put",
      "/room/",
      id,
      { info },
      user.accessToken,
    );
    if (updateRoom.status === 200) {
      return toast.success("Sala atualizada com sucesso");
    } else {
      return toast.error(updateRoom.response?.data?.message);
    }
  };

  return (
    <EditRoomContainer>
      <Title>Editar Sala</Title>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce"
      />
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Nome da Sala</Label>
          <Input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Capa da Sala</Label>
          <Input type="file" accept="image/*" onChange={handleFile} />
        </FormGroup>

        <FormGroup>
          <Label>Descrição</Label>
          <Textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Gêneros Musicais</Label>
          <CheckboxGroup>
            {genres.map((genre) => (
              <CheckboxLabel key={genre}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <QRCodeSection>
          <Label>Números das Mesas (separados por vírgula)</Label>
          <QRCodeInput
            type="text"
            value={tableNumbers}
            onChange={(e) => setTableNumbers(e.target.value)}
          />
        </QRCodeSection>
        {Array.isArray(table)
          ? table?.map((t) => {
              return (
                <QRCondeArea key={t}>
                  <QRCodeContainer ref={(el) => (qr.current[t] = el)}>
                    <QRCode
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      value={`${import.meta.env.VITE_API}/room/${id}&table=${t}`}
                      viewBox={`0 0 256 256`}
                    />
                    <h3>Mesa: {t}</h3>
                    <Buttons onClick={() => handleDownload(t)}>Baixar</Buttons>
                  </QRCodeContainer>
                </QRCondeArea>
              );
            })
          : null}
        <Buttons type="primary" htmlType="submit">
          Salvar Alterações
        </Buttons>
      </form>
    </EditRoomContainer>
  );
}
