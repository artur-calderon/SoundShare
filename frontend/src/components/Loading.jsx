import {Flex, Spin} from "antd";


export  function Loading() {
    return(
        <Flex
            style={{
                width:'100%',
                height:'100vh',
            }}
            justify='center'
            align='center'
        >
            <Spin size="large" />
        </Flex>
    )
}