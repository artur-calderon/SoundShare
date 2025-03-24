import styled from "styled-components";
import { Button } from "antd";

export const EditRoomContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const Buttons = styled(Button)`
  width: 100%;
  padding: 1rem;
  color: white;
  background-color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

export const QRCodeSection = styled.div`
  margin-top: 2rem;
`;

export const QRCodeInput = styled(Input)`
  margin-top: 1rem;
`;

export const QRCondeArea = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 2rem;
  svg {
    width: 10rem !important;
  }
`;

export const QRCodeContainer = styled.div`
  display: flex;
  gap: 1rem;

  justify-content: space-between;

  button {
    width: 10rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const genres = [
	"Rock",
	"Pop",
	"Jazz",
	"Hip Hop",
	"Classical",
	"Electronic",
	"Reggae",
];
