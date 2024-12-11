import {useEffect, useRef} from "react";
import io from "socket.io-client";

export const useSocket = (uri,opts) => {
    const {current: socket} = useRef(io(uri,opts));

    useEffect(() => {
        return ()=>{
            if(socket)
                socket.close()
        }
    },[socket])

    return socket
}