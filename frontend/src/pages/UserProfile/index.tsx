import {
	ProfileContainer,
	ProfileHeader,
	ProfileImage,
	UserName,
	UserBio,
	InfoSection,
	InfoTitle,
	InfoItem,
} from "./styles.ts";
import {userContext} from "../../contexts/UserContext.tsx";

export function UserProfile() {
	const {user}  = userContext();
	return (
		<ProfileContainer>
			<ProfileHeader>
				<ProfileImage
					src={
						user.image && 'image' in user ? user.image :
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
