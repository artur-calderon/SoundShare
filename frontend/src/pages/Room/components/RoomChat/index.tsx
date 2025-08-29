import React, { useState, useEffect, useRef } from 'react';
import { 
	Card, 
	Input, 
	List, 
	Avatar, 
	Button, 
	Space, 
	Typography, 
	Divider, 
	Badge, 
	Tooltip, 
	Popover,
	message,
	Empty,
	Spin
} from 'antd';
import { 
	SendOutlined, 
	SmileOutlined, 
	UserOutlined, 
	MoreOutlined,
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import { useRoomStore } from '../../../../contexts/PlayerContext/useRoomStore';
import { useSocketStore } from '../../../../contexts/PlayerContext/useSocketStore';
import { userContext } from '../../../../contexts/UserContext';
import { ChatContainer, ChatHeader, ChatMessages, ChatInput, UserList, UserItem, MessageItem, MessageContent, MessageTime, MessageActions } from './styles';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ChatMessage {
	id: string;
	roomId: string;
	userId: string;
	userName: string;
	userImage: string;
	content: string;
	timestamp: Date | string;
	isEdited?: boolean;
	editedAt?: Date | string;
}

interface TypingUser {
	userId: string;
	userName: string;
	timestamp: Date;
}

export function RoomChat() {
	const { roomState, canModerate } = useRoomStore();
	const { 
		socket, 
		connected, 
		sendChatMessage, 
		editChatMessage, 
		deleteChatMessage, 
		requestChatHistory, 
		userTyping, 
		stopTyping 
	} = useSocketStore();
	const { user } = userContext();
	
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState('');
	
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<any>(null);
	const typingTimeoutRef = useRef<NodeJS.Timeout>();

	// Scroll para última mensagem
	const scrollToBottom = () => {
		const chatMessages = document.querySelector('.ant-list') as HTMLElement;
		if (chatMessages) {
			setTimeout(() => {
				chatMessages.scrollTop = chatMessages.scrollHeight;
			}, 100);
		}
	};

	// Carregar mensagens ao entrar na sala
	useEffect(() => {
		if (connected && roomState?.roomId) {
			loadChatHistory();
		}
	}, [connected, roomState?.roomId]);

	// Scroll automático para novas mensagens
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Configurar listeners de socket
	useEffect(() => {
		if (!socket) return;

		// Nova mensagem recebida
		socket.on('chatMessage', (message: ChatMessage) => {
			setMessages(prev => [...prev, message]);
		});

		// Mensagem editada
		socket.on('messageEdited', (editedMessage: ChatMessage) => {
			setMessages(prev => prev.map(msg => 
				msg.id === editedMessage.id ? editedMessage : msg
			));
		});

		// Mensagem deletada
		socket.on('messageDeleted', (messageId: string) => {
			setMessages(prev => prev.filter(msg => msg.id !== messageId));
		});

		// Usuário digitando
		socket.on('userTyping', (typingData: { userId: string; userName: string }) => {
			setTypingUsers(prev => {
				const existing = prev.find(t => t.userId === typingData.userId);
				if (existing) {
					return prev.map(t => 
						t.userId === typingData.userId 
							? { ...t, timestamp: new Date() }
							: t
					);
				} else {
					return [...prev, { ...typingData, timestamp: new Date() }];
				}
			});
		});

		// Usuário parou de digitar
		socket.on('userStoppedTyping', (userId: string) => {
			setTypingUsers(prev => prev.filter(t => t.userId !== userId));
		});

		// Histórico de chat carregado
		socket.on('chatHistory', (chatHistory: ChatMessage[]) => {
			setMessages(chatHistory);
			setIsLoading(false);
		});

		return () => {
			socket.off('chatMessage');
			socket.off('messageEdited');
			socket.off('messageDeleted');
			socket.off('userTyping');
			socket.off('userStoppedTyping');
			socket.off('chatHistory');
		};
	}, [socket]);

	// Limpar usuários digitando após 3 segundos
	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			setTypingUsers(prev => 
				prev.filter(t => now.getTime() - t.timestamp.getTime() < 3000)
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Carregar histórico do chat
	const loadChatHistory = () => {
		if (!roomState?.roomId) return;
		
		setIsLoading(true);
		requestChatHistory(roomState.roomId);
	};

	// Enviar mensagem
	const handleSendMessage = () => {
		if (!newMessage.trim() || !roomState?.roomId || !user.id) return;

		const messageData = {
			roomId: roomState.roomId,
			userId: user.id,
			userName: user.name,
			userImage: user.image,
			content: newMessage.trim(),
			timestamp: new Date()
		};

		sendChatMessage(messageData);
		setNewMessage('');
		setShowEmojiPicker(false);
		
		// Parar indicador de digitação
		stopTyping({ roomId: roomState.roomId, userId: user.id });
	};

	// Editar mensagem
	const handleEditMessage = (messageId: string, newContent: string) => {
		if (!roomState?.roomId || !user.id) return;

		editChatMessage({
			roomId: roomState.roomId,
			messageId,
			userId: user.id,
			newContent: newContent.trim()
		});

		setEditingMessageId(null);
		setEditContent('');
	};

	// Deletar mensagem
	const handleDeleteMessage = (messageId: string) => {
		if (!roomState?.roomId || !user.id) return;

		deleteChatMessage({
			roomId: roomState.roomId,
			messageId,
			userId: user.id
		});
	};

	// Indicador de digitação
	const handleTyping = () => {
		if (!roomState?.roomId || !user.id) return;

		userTyping({
			roomId: roomState.roomId,
			userId: user.id,
			userName: user.name
		});

		// Limpar timeout anterior
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Parar indicador após 1 segundo sem digitar
		typingTimeoutRef.current = setTimeout(() => {
			stopTyping({
				roomId: roomState.roomId,
				userId: user.id
			});
		}, 1000);
	};

	// Adicionar emoji
	const addEmoji = (emoji: string) => {
		setNewMessage(prev => prev + emoji);
		inputRef.current?.focus();
	};

	// Formatar timestamp
	const formatTime = (timestamp: Date | string) => {
		// Converter string para Date se necessário
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		
		// Verificar se a data é válida
		if (isNaN(date.getTime())) {
			return 'Data inválida';
		}
		
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Agora';
		if (minutes < 60) return `${minutes}m atrás`;
		if (hours < 24) return `${hours}h atrás`;
		if (days < 7) return `${days}d atrás`;
		
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: '2-digit'
		});
	};

	// Verificar se usuário pode editar/deletar mensagem
	const canModifyMessage = (message: ChatMessage) => {
		return message.userId === user.id || canModerate;
	};

	// Emojis populares
	const popularEmojis = ['😊', '😂', '❤️', '👍', '🎵', '🎉', '🔥', '💯', '👏', '🙌'];

	return (
		<ChatContainer>
			{/* Header do Chat */}
			<ChatHeader>
				<Space>
					<Text strong>💬 Chat da Sala</Text>
					<Badge count={roomState?.listeners || 0} showZero={false} />
				</Space>
			</ChatHeader>

			{/* Lista de Usuários Online */}
			<UserList>
				<Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px' }}>
					👥 Usuários Online ({roomState?.users?.length || 0})
				</Text>
				{roomState?.users?.map(user => (
					<UserItem key={user.id}>
						<Avatar 
							src={user.image} 
							icon={<UserOutlined />} 
							size="small"
						/>
						<Text>
							{user.name}
							{user.role === 'owner' && ' 👑'}
							{user.role === 'moderator' && ' 🛡️'}
						</Text>
					</UserItem>
				))}
			</UserList>

			<Divider style={{ margin: '12px 0' }} />

			{/* Mensagens */}
			<ChatMessages>
				{isLoading ? (
					<div style={{ textAlign: 'center', padding: '20px' }}>
						<Spin />
						<Text type="secondary">Carregando chat...</Text>
					</div>
				) : messages.length > 0 ? (
					<List
						dataSource={messages}
						renderItem={(message) => (
							<MessageItem key={message.id}>
								<List.Item.Meta
									avatar={
										<Avatar 
											src={message.userImage} 
											icon={<UserOutlined />}
											size="small"
										/>
									}
									title={
										<Space>
											<Text strong style={{ fontSize: '12px' }}>
												{message.userName}
											</Text>
											{message.isEdited && (
												<Text type="secondary" style={{ fontSize: '10px' }}>
													(editado)
												</Text>
											)}
										</Space>
									}
									description={
										<MessageContent>
											{editingMessageId === message.id ? (
												<Space direction="vertical" style={{ width: '100%' }}>
													<TextArea
														value={editContent}
														onChange={(e) => setEditContent(e.target.value)}
														autoSize={{ minRows: 1, maxRows: 3 }}
														onPressEnter={(e) => {
															if (!e.shiftKey) {
																handleEditMessage(message.id, editContent);
															}
														}}
													/>
													<Space>
														<Button 
															size="small" 
															type="primary"
															onClick={() => handleEditMessage(message.id, editContent)}
														>
															Salvar
														</Button>
														<Button 
															size="small"
															onClick={() => {
																setEditingMessageId(null);
																setEditContent('');
															}}
														>
															Cancelar
														</Button>
													</Space>
												</Space>
											) : (
												<Paragraph 
													style={{ margin: 0, fontSize: '13px' }}
													ellipsis={{ rows: 3, expandable: true }}
												>
													{message.content}
												</Paragraph>
											)}
											
											<MessageTime>
												{formatTime(message.timestamp)}
											</MessageTime>
											
											{canModifyMessage(message) && (
												<MessageActions>
													<Tooltip title="Editar">
														<Button
															type="text"
															size="small"
															icon={<EditOutlined />}
															onClick={() => {
																setEditingMessageId(message.id);
																setEditContent(message.content);
															}}
														/>
													</Tooltip>
													<Tooltip title="Deletar">
														<Button
															type="text"
															size="small"
															danger
															icon={<DeleteOutlined />}
															onClick={() => handleDeleteMessage(message.id)}
														/>
													</Tooltip>
												</MessageActions>
											)}
										</MessageContent>
									}
								/>
							</MessageItem>
						)}
					/>
				) : (
					<Empty
						description="Nenhuma mensagem ainda"
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				)}
				
				{/* Indicador de digitação */}
				{typingUsers.length > 0 && (
					<div style={{ padding: '8px 16px', fontStyle: 'italic' }}>
						<Text type="secondary" style={{ fontSize: '12px' }}>
							{typingUsers.map(u => u.userName).join(', ')} está digitando...
						</Text>
					</div>
				)}
				
				<div ref={messagesEndRef} />
			</ChatMessages>

			{/* Input de mensagem */}
			<ChatInput>
				<Space.Compact style={{ width: '100%' }}>
					<Popover
						content={
							<div style={{ textAlign: 'center' }}>
								{popularEmojis.map(emoji => (
									<Button
										key={emoji}
										type="text"
										style={{ fontSize: '20px', padding: '4px' }}
										onClick={() => addEmoji(emoji)}
									>
										{emoji}
									</Button>
								))}
							</div>
						}
						title="Emojis"
						trigger="click"
						open={showEmojiPicker}
						onOpenChange={setShowEmojiPicker}
					>
						<Button 
							icon={<SmileOutlined />}
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						/>
					</Popover>
					
					<TextArea
						ref={inputRef}
						value={newMessage}
						onChange={(e) => {
							setNewMessage(e.target.value);
							handleTyping();
						}}
						onPressEnter={(e) => {
							if (!e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
						placeholder="Digite sua mensagem..."
						autoSize={{ minRows: 1, maxRows: 3 }}
						style={{ flex: 1 }}
					/>
					
					<Button
						type="primary"
						icon={<SendOutlined />}
						onClick={handleSendMessage}
						disabled={!newMessage.trim()}
					/>
				</Space.Compact>
			</ChatInput>
		</ChatContainer>
	);
}
