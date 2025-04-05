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
import {userContext} from "./contexts/UserContext.tsx";
import {useEffect} from "react";

export function Router(){
	const {user} = userContext()
	const {persistUserLogged} = userContext()
	useEffect(() => {
		persistUserLogged()
	}, [persistUserLogged]);
	
	return (
		<Routes>
			<Route path='/' element={<Home/>}/>
			<Route path='/login' element={user.id === '' ? <Login/> : <Navigate to='/app'/> }/>
			<Route path='/signup' element={user.id === '' ? <SignUp/> : <Navigate to='/app'/>}/>
			<Route path='/app' element={user.id === '' ? <Navigate to='/login'/> : <UserHome/>}>
				<Route path='/app' element={ <SearchRooms/>}/>
				<Route path='/app/myrooms' element={<MyRooms/>}/>
				<Route path='/app/profile' element={<UserProfile/>}/>
				<Route path='/app/createroom' element={<CreateRoom/>}/>
				<Route path='/app/editroom/:id' element={<EditRoomPage/>}/>
			</Route>

			<Route path="/room/:id" element={user.id === '' ? <Navigate to='/login'/> : <Room />} />
			<Route path="/room/*" element={<Navigate to='/app'/>} />
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>)
}