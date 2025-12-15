# Docker Setup Guide - Collaborative Task Manager (CTM)

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

Run the entire application stack with a single command:

```bash
docker-compose up --build
```

This will:
- Build and start MongoDB on `localhost:27017`
- Build and start the Backend API on `localhost:4000`
- Build and start the Frontend on `localhost:3000`

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: mongodb://admin:password@localhost:27017

## Services

### MongoDB
- Container: `ctm-mongodb`
- Port: `27017`
- Database: `taskmanager`
- Username: `admin`
- Password: `password`
- Volumes: `mongodb_data`, `mongodb_config`

### Backend API
- Container: `ctm-backend`
- Port: `4000`
- Built from: `./backend/Dockerfile`
- Dependencies: MongoDB (waits for health check)

### Frontend
- Container: `ctm-frontend`
- Port: `3000`
- Built from: `./frontend/Dockerfile`
- Served via: Nginx
- Dependencies: Backend API

## Available Commands

### Start all services
```bash
docker-compose up
```

### Start with build
```bash
docker-compose up --build
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (clean slate)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild a specific service
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Execute command in a running container
```bash
# Access backend container
docker exec -it ctm-backend bash

# Access frontend container
docker exec -it ctm-frontend bash

# Access MongoDB container
docker exec -it ctm-mongodb mongosh
```

## File Structure

```
Collaborative Task Manager/
├── docker-compose.yml          # Main orchestration file
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore           # Files to exclude from Docker context
│   ├── package.json
│   ├── src/
│   └── ...
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── nginx.conf              # Nginx configuration
│   ├── .dockerignore           # Files to exclude from Docker context
│   ├── package.json
│   ├── src/
│   └── ...
└── README.md (this file)
```

## Environment Variables

### Backend (.env in docker-compose.yml)
- `PORT=4000` - Backend server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET=supersecretkey` - JWT secret key
- `NODE_ENV=production` - Node environment

### Frontend
- `VITE_API_URL` - Backend API URL (automatically set to `http://backend:4000/api`)

## Network

All services communicate through a custom Docker network named `ctm-network` using service names as hostnames:
- Backend connects to MongoDB using: `mongodb://admin:password@mongodb:27017`
- Frontend proxies API requests to: `http://backend:4000`

## Troubleshooting

### Port Already in Use
If you get "port already in use" error, change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### Container Won't Start
Check logs:
```bash
docker-compose logs -f service_name
```

### MongoDB Connection Issues
Ensure MongoDB is healthy before starting backend:
```bash
docker-compose logs mongodb
```

### Clear Everything and Start Fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Production Considerations

For production deployment:

1. **Update MongoDB credentials** in `docker-compose.yml`
2. **Use environment files** instead of hardcoding values
3. **Enable SSL/TLS** for production domains
4. **Add health checks** for all services (already included)
5. **Configure resource limits**:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```
6. **Use dedicated container registry** (Docker Hub, ECR, etc.)
7. **Implement proper logging and monitoring**

## Performance Tips

- Use multi-stage builds (already implemented in both Dockerfiles)
- Alpine Linux images for smaller image sizes
- Docker layer caching for faster builds
- Use .dockerignore to reduce context size

## Support

For issues with Docker setup, check:
- Docker documentation: https://docs.docker.com
- Docker Compose documentation: https://docs.docker.com/compose
- Application logs: `docker-compose logs`
