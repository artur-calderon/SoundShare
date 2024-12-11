import {
  ProfileContainer,
  ProfileHeader,
  ProfileImage,
  UserName,
  UserBio,
  InfoSection,
  InfoTitle,
  InfoItem,
} from "./styles.js";
import { userContext } from "../../contexts/zustand-context/UserContext.js";

export default function UserProfile() {
  const { user } = userContext((store) => {
    return { user: store.user };
  });
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileImage
          src={
            user.photoURL ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          }
          alt="User Profile"
        />
        <UserName>{user.name}</UserName>
        <UserBio>Sem dados</UserBio>
      </ProfileHeader>
      <InfoSection>
        <InfoTitle>About Me</InfoTitle>
        <InfoItem>
          <strong>Email:</strong> {user.email}
        </InfoItem>
        <InfoItem>
          <strong>Location:</strong> Sem dados
        </InfoItem>
        <InfoItem>
          <strong>Joined:</strong> Sem dados
        </InfoItem>
      </InfoSection>
    </ProfileContainer>
  );
}
