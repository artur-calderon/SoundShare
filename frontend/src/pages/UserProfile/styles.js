import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #000;
`;

export const UserName = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-top: 15px;
`;

export const UserBio = styled.p`
  font-size: 1rem;
  color: #555;
  text-align: center;
  margin: 10px 0;
  max-width: 400px;
`;

export const InfoSection = styled.div`
  width: 100%;
  height: 30rem;
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const InfoTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
`;

export const InfoItem = styled.div`
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
`;
