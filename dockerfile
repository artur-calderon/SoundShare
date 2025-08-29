# Dockerfile para SoundShare
# Multi-stage build para otimizar o tamanho da imagem final

# ========================================
# STAGE 1: Build do Frontend
# ========================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copia os arquivos de dependências do frontend
COPY frontend/package*.json ./
COPY frontend/pnpm-lock.yaml ./

# Instala as dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copia o código fonte do frontend
COPY frontend/ ./

# Build do frontend
RUN pnpm run build

# ========================================
# STAGE 2: Build do Backend
# ========================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/server

# Copia os arquivos de dependências do backend
COPY server/package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código fonte do backend
COPY server/ ./

# Build do backend
RUN npm run build

# ========================================
# STAGE 3: Imagem Final
# ========================================
FROM node:18-alpine AS production

# Instala dependências necessárias para o runtime
RUN apk add --no-cache dumb-init

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copia o backend buildado
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/dist ./server/dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/package*.json ./server/
COPY --from=backend-builder --chown=nodejs:nodejs /app/server/node_modules ./server/node_modules

# Copia o frontend buildado
COPY --from=frontend-builder --chown=nodejs:nodejs /app/frontend/dist ./frontend/dist

# Copia arquivos de configuração necessários
COPY --chown=nodejs:nodejs server/credentials.json ./server/credentials.json

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=1337

# Muda para o usuário não-root
USER nodejs

# Expõe a porta
EXPOSE 1337

# Usa dumb-init para gerenciar sinais do processo
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar o servidor
CMD ["node", "server/dist/index.js"]