import { getFirestore } from "firebase-admin/firestore";
import { IChatMessage, ISendChatMessage, IEditChatMessage, IDeleteChatMessage } from "../interfaces/IChatMessage";

const db = getFirestore();

export class ChatService {
  private static readonly COLLECTION_NAME = "chat_messages";
  private static readonly MAX_CONTENT_LENGTH = 1000;
  private static readonly MAX_HISTORY_LIMIT = 50;

  /**
   * Envia uma nova mensagem de chat
   */
  static async sendMessage(messageData: ISendChatMessage): Promise<IChatMessage> {
    // Validações
    if (!messageData.content || messageData.content.trim().length === 0) {
      throw new Error("Conteúdo da mensagem não pode estar vazio");
    }

    if (messageData.content.length > this.MAX_CONTENT_LENGTH) {
      throw new Error(`Conteúdo da mensagem não pode exceder ${this.MAX_CONTENT_LENGTH} caracteres`);
    }

    // ✅ FUNÇÃO AUXILIAR: Converter para Firestore Timestamp
    const convertToFirestoreTimestamp = (date: Date | string | any) => {
      if (date instanceof Date) {
        return date;
      } else if (typeof date === 'string') {
        return new Date(date);
      } else {
        return new Date();
      }
    };

    // Criar objeto da mensagem
    const message: Omit<IChatMessage, 'id'> = {
      roomId: messageData.roomId,
      userId: messageData.userId,
      userName: messageData.userName,
      userImage: messageData.userImage,
      content: messageData.content.trim(),
      timestamp: convertToFirestoreTimestamp(messageData.timestamp),
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Salvar no Firestore
    const docRef = await db.collection(this.COLLECTION_NAME).add(message);
    
    // Retornar mensagem com ID
    return {
      ...message,
      id: docRef.id
    };
  }

  /**
   * Edita uma mensagem existente
   */
  static async editMessage(editData: IEditChatMessage): Promise<IChatMessage> {
    // Validações
    if (!editData.newContent || editData.newContent.trim().length === 0) {
      throw new Error("Novo conteúdo não pode estar vazio");
    }

    if (editData.newContent.length > this.MAX_CONTENT_LENGTH) {
      throw new Error(`Conteúdo da mensagem não pode exceder ${this.MAX_CONTENT_LENGTH} caracteres`);
    }

    // Buscar mensagem existente
    const messageRef = db.collection(this.COLLECTION_NAME).doc(editData.messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      throw new Error("Mensagem não encontrada");
    }

    const message = messageDoc.data() as IChatMessage;

    // Verificar se a mensagem pertence à sala correta
    if (message.roomId !== editData.roomId) {
      throw new Error("Mensagem não pertence à sala especificada");
    }

    // Verificar permissões (usuário deve ser o autor)
    if (message.userId !== editData.userId) {
      throw new Error("Usuário não tem permissão para editar esta mensagem");
    }

    // ✅ FUNÇÃO AUXILIAR: Converter para Firestore Timestamp
    const convertToFirestoreTimestamp = (date: Date | string | any) => {
      if (date instanceof Date) {
        return date;
      } else if (typeof date === 'string') {
        return new Date(date);
      } else {
        return new Date();
      }
    };

    // Atualizar mensagem
    const updateData = {
      content: editData.newContent.trim(),
      isEdited: true,
      editedAt: convertToFirestoreTimestamp(new Date()),
      updatedAt: convertToFirestoreTimestamp(new Date())
    };

    await messageRef.update(updateData);

    // Retornar mensagem atualizada
    return {
      ...message,
      ...updateData
    };
  }

  /**
   * Deleta uma mensagem
   */
  static async deleteMessage(deleteData: IDeleteChatMessage): Promise<void> {
    // Buscar mensagem existente
    const messageRef = db.collection(this.COLLECTION_NAME).doc(deleteData.messageId);
    const messageDoc = await messageRef.get();

    if (!messageDoc.exists) {
      throw new Error("Mensagem não encontrada");
    }

    const message = messageDoc.data() as IChatMessage;

    // Verificar se a mensagem pertence à sala correta
    if (message.roomId !== deleteData.roomId) {
      throw new Error("Mensagem não pertence à sala especificada");
    }

    // Verificar permissões (usuário deve ser o autor)
    if (message.userId !== deleteData.userId) {
      throw new Error("Usuário não tem permissão para deletar esta mensagem");
    }

    // Deletar mensagem
    await messageRef.delete();
  }

  /**
   * Busca histórico de mensagens de uma sala
   */
  static async getChatHistory(roomId: string): Promise<IChatMessage[]> {
    try {
      // ✅ DEBUG: Verificar se a coleção existe e tem dados
      const collectionRef = db.collection(this.COLLECTION_NAME);
      const collectionSnapshot = await collectionRef.limit(1).get();
      
      if (collectionSnapshot.empty) {
        console.log("📝 Coleção chat_messages está vazia - retornando array vazio");
        return [];
      }
      
      // ✅ DEBUG: Verificar estrutura do primeiro documento
      const firstDoc = collectionSnapshot.docs[0];
      const firstDocData = firstDoc.data();
      console.log("🔍 Estrutura do primeiro documento:", Object.keys(firstDocData));
      console.log("🔍 Campos específicos:", {
        roomId: firstDocData.roomId,
        roomid: firstDocData.roomid,
        userId: firstDocData.userId,
        timestamp: firstDocData.timestamp
      });
      
      // ✅ Tentar consulta com roomId (maiúsculo)
      const messagesRef = db.collection(this.COLLECTION_NAME)
        .where("roomId", "==", roomId)
        .orderBy("timestamp", "desc")
        .limit(this.MAX_HISTORY_LIMIT);

      const snapshot = await messagesRef.get();
      const messages: IChatMessage[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        
        // ✅ FUNÇÃO AUXILIAR: Converter timestamp para Date
        const convertTimestamp = (timestamp: any): Date => {
          if (timestamp && typeof timestamp.toDate === 'function') {
            // É um Firestore Timestamp
            return timestamp.toDate();
          } else if (typeof timestamp === 'string') {
            // É uma string ISO
            return new Date(timestamp);
          } else if (timestamp instanceof Date) {
            // Já é uma Date
            return timestamp;
          } else {
            // Fallback para data atual
            console.warn(`⚠️ Timestamp inválido: ${timestamp}, usando data atual`);
            return new Date();
          }
        };
        
        messages.push({
          id: doc.id,
          roomId: data.roomId,
          userId: data.userId,
          userName: data.userName,
          userImage: data.userImage,
          content: data.content,
          timestamp: convertTimestamp(data.timestamp),
          isEdited: data.isEdited || false,
          editedAt: data.editedAt ? convertTimestamp(data.editedAt) : undefined,
          createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : new Date()
        });
      });

      // Ordenar por timestamp (mais antiga primeiro para histórico)
      return messages.reverse();
      
    } catch (error) {
      console.error("❌ Erro detalhado em getChatHistory:", error);
      throw error;
    }
  }

  /**
   * Verifica se um usuário está em uma sala
   */
  static async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    // Esta função deve ser implementada de acordo com a lógica de salas do seu sistema
    // Por enquanto, retornamos true (assumindo que a validação é feita no socket)
    return true;
  }

  /**
   * Verifica se um usuário é moderador ou dono da sala
   */
  static async isUserModeratorOrOwner(roomId: string, userId: string): Promise<boolean> {
    // Esta função deve ser implementada de acordo com a lógica de permissões do seu sistema
    // Por enquanto, retornamos false (assumindo que apenas o autor pode editar/deletar)
    return false;
  }
}
