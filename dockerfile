# ===============================
# Backend Node.js
# ===============================
FROM node:18-alpine

WORKDIR /server

COPY ./server ./
# Copia package.json e instala dependências
#COPY server/package*.json ./
RUN npm install

# Copia o código fonte
#COPY server/ ./
RUN npm run build

# Build do backend
#RUN npm run build

# Expõe a porta que o backend vai rodar
EXPOSE 1337

# Inicia a aplicação
CMD ["node", "dist/index.js"]
