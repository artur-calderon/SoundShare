# ===============================
# Backend Node.js
# ===============================
FROM node:18-alpine

WORKDIR /app

# Copia package.json e instala dependências
COPY server/package*.json ./
RUN npm ci --only=production

# Copia o código fonte
COPY server/ ./

# Build do backend
RUN npm run build

# Expõe a porta que o backend vai rodar
EXPOSE 1337

# Inicia a aplicação
CMD ["node", "dist/index.js"]
