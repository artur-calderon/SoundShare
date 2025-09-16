# ===============================
# Backend e Frontend Node.js
# ===============================
FROM node:18-alpine

# Define o diretório de trabalho para o backend
WORKDIR /app/server

# Copia os arquivos do backend e instala dependências
COPY server/package*.json ./
RUN npm install

# Copia o restante do código do backend
COPY server/ ./

# Faz o build do backend
RUN npm run build

# Define o diretório de trabalho para o frontend
WORKDIR /app/frontend

# Copia os arquivos do frontend e instala dependências
COPY frontend/package*.json ./
RUN npm install

# Copia o restante do código do frontend
COPY frontend/ ./

# Faz o build do frontend
RUN npm run build

# Retorna ao diretório do backend para servir o frontend
WORKDIR /app/server

# Copia o build do frontend para o diretório público do backend (ajuste conforme necessário)
RUN mkdir -p ./public && cp -r /app/frontend/dist/* ./public/

# Expõe a porta que o backend vai rodar
EXPOSE 1337

# Inicia a aplicação
CMD ["node", "dist/index.js"]
