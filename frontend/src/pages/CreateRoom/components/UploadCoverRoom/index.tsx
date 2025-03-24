import {Button, Image,  Upload, type UploadFile, type UploadProps} from "antd";

import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";


// @ts-ignore
export function UploadCoverRoom({setSelectedFile}){

	const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);



	const handlePreview = async (file: UploadFile) => {
		if(!file.url && !file.preview){
			const reader = new FileReader();
			reader.readAsDataURL(file.originFileObj as File);
			reader.onload = () => setPreviewImage(reader.result as string);
			reader.onerror = (error) => console.log(error);
		}else{
			setPreviewImage(file.url as string);
		}
		setPreviewOpen(true)
	}

	const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) =>{
		setFileList(newFileList.slice(-1))
		setSelectedFile(newFileList.length > 0 ? newFileList[0].originFileObj : null)

	}//permitir apenas 1 imagem


	return(
		<>
			<Upload
				listType={'picture-card'}
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				beforeUpload={() => false} //impede o upload automático
				maxCount={1}
			>
				{fileList.length < 1 && (
						<Button style={{ border: 0, background: "none" }}>
							<PlusOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</Button>
					)}
			</Upload>
			{previewOpen && (
				<Image
					wrapperStyle = {{display:"none"}}
					preview = {{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewOpen(false)
					}}
					src={previewImage}
				/>
			)}
		</>
	)
}