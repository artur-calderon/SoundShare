import { Routes, Route , Navigate} from "react-router-dom";

import {Home} from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import {UserHome} from "./pages/UserHome";
import {MyRooms} from "./pages/My Rooms";
import {SearchRooms} from "./pages/SearchRooms";
import {UserProfile} from "./pages/UserProfile";
import {EditRoomPage} from "./pages/EditRoom";
import {Room} from "./pages/Room";
import {CreateRoom} from "./pages/CreateRoom";

export function Router(){
	return (
		<Routes>
			<Route path='/' element={<Home/>}/>
			<Route path='/login' element={<Login/>}/>
			<Route path='/signup' element={<SignUp/>}/>
			<Route path='/app' element={<UserHome/>}>
				<Route path='/app' element={<SearchRooms/>}/>
				<Route path='/app/myrooms' element={<MyRooms/>}/>
				<Route path='/app/profile' element={<UserProfile/>}/>
				<Route path='/app/createroom' element={<CreateRoom/>}/>
				<Route path='/app/editroom/:id' element={<EditRoomPage/>}/>
			</Route>

			<Route path="/room/:id" element={<Room />} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>)
}