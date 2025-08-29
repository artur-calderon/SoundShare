# SoundShare - Docker Setup

Este documento explica como executar o projeto SoundShare usando Docker.

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (vem com Docker Desktop)
- Arquivo `server/credentials.json` do Firebase configurado

## 🚀 Execução Rápida

### 1. Produção
```bash
# Build e execução da aplicação
docker-compose up --build

# A aplicação estará disponível em: http://localhost:1337
```

### 2. Desenvolvimento
```bash
# Execução em modo desenvolvimento com hot reload
docker-compose --profile dev up --build

# Frontend: http://localhost:3000 (com hot reload)
# Backend: http://localhost:1338
```

## 🏗️ Estrutura dos Arquivos Docker

- **Dockerfile**: Build de produção multi-stage
- **Dockerfile.dev**: Build de desenvolvimento
- **docker-compose.yml**: Orquestração dos serviços
- **.dockerignore**: Otimização do build

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto ou configure no `docker-compose.yml`:

```bash
# APIs Externas
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id

# Configurações da Aplicação
NODE_ENV=production
PORT=1337
```

### Firebase Credentials

Certifique-se de que o arquivo `server/credentials.json` está presente e configurado corretamente.

## 📱 Serviços Disponíveis

### Serviço Principal (Produção)
- **Porta**: 1337
- **URL**: http://localhost:1337
- **Descrição**: Aplicação completa com frontend e backend

### Serviço de Desenvolvimento
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:1338
- **Hot Reload**: Ativado para desenvolvimento

### Serviços Opcionais

#### Redis (Cache)
```bash
docker-compose --profile cache up redis
```
- **Porta**: 6379
- **Uso**: Cache e sessões

#### PostgreSQL (Banco de Dados)
```bash
docker-compose --profile database up postgres
```
- **Porta**: 5432
- **Database**: soundshare
- **Usuário**: soundshare_user
- **Senha**: soundshare_password

## 🛠️ Comandos Úteis

### Build da Imagem
```bash
# Build da imagem de produção
docker build -t soundshare:latest .

# Build da imagem de desenvolvimento
docker build -f Dockerfile.dev -t soundshare:dev .
```

### Execução de Serviços Específicos
```bash
# Apenas a aplicação principal
docker-compose up soundshare

# Apenas Redis
docker-compose --profile cache up redis

# Apenas PostgreSQL
docker-compose --profile database up postgres
```

### Logs e Debugging
```bash
# Ver logs de todos os serviços
docker-compose logs

# Ver logs de um serviço específico
docker-compose logs soundshare

# Logs em tempo real
docker-compose logs -f soundshare
```

### Limpeza
```bash
# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes
docker-compose down -v

# Remover imagens não utilizadas
docker system prune -a
```

## 🔍 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar processos usando a porta
netstat -ano | findstr :1337

# Parar o processo ou alterar a porta no docker-compose.yml
```

### Problema: Erro de permissão
```bash
# Rebuild da imagem
docker-compose down
docker-compose up --build
```

### Problema: Dependências não instaladas
```bash
# Limpar cache e rebuild
docker-compose down
docker system prune -f
docker-compose up --build
```

## 📊 Monitoramento

### Status dos Containers
```bash
docker-compose ps
```

### Uso de Recursos
```bash
docker stats
```

### Inspeção de Container
```bash
docker-compose exec soundshare sh
```

## 🚀 Deploy

### Build para Produção
```bash
# Build da imagem otimizada
docker build -t soundshare:production .

# Execução em produção
docker run -d -p 1337:1337 --name soundshare-prod soundshare:production
```

### Push para Registry
```bash
# Tag da imagem
docker tag soundshare:latest your-registry/soundshare:latest

# Push para registry
docker push your-registry/soundshare:latest
```

## 📝 Notas Importantes

1. **Segurança**: A aplicação roda como usuário não-root dentro do container
2. **Performance**: Build multi-stage otimiza o tamanho da imagem final
3. **Desenvolvimento**: Hot reload disponível no modo desenvolvimento
4. **Persistência**: Volumes Docker para dados persistentes
5. **Networking**: Rede isolada para comunicação entre serviços

## 🤝 Contribuição

Para contribuir com melhorias no setup Docker:

1. Teste as mudanças localmente
2. Atualize a documentação
3. Verifique compatibilidade com diferentes ambientes
4. Teste build e execução em CI/CD

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `docker-compose logs`
2. Consulte a documentação oficial do Docker
3. Verifique se todas as dependências estão configuradas
4. Teste em um ambiente limpo
