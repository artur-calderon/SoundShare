import styled from "styled-components";

export const Container = styled.form`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
	
	input {
		width: 40rem;
	}
`;

export const Label = styled.label`
  display: block;
  width: 100%;
  margin-top: 10px;
  font-weight: bold;
`;

export const Divider = styled.hr`
  margin: 20px 0;
`;

export const QRCodeSection = styled.div`
  margin-top: 10px;
`;