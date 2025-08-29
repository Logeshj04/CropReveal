# Crop AI - Docker Setup

This project is a full-stack application with a FastAPI backend and React frontend, containerized using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

1. **Clone and navigate to the project directory:**
   ```bash
   cd "E:\Visual Studio\Crop AI"
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Docker Commands

### Development
```bash
# Start services in development mode
docker-compose up

# Start services in background
docker-compose up -d

# Rebuild and start services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
```

### Production
```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose up -d
```

## Architecture

- **Backend**: FastAPI application running on port 8000
- **Frontend**: React application served by Nginx on port 3000
- **Network**: Both services communicate through a Docker bridge network

## Environment Variables

Create a `.env` file in the backend directory for environment-specific configurations:

```env
# Example .env file
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url_here
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If ports 3000 or 8000 are in use, modify the ports in `docker-compose.yml`

2. **Build failures**: Clear Docker cache and rebuild:
   ```bash
   docker system prune -a
   docker-compose build --no-cache
   ```

3. **Permission issues**: Ensure Docker has access to the project directory

### Logs and Debugging

```bash
# View container status
docker-compose ps

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# View detailed logs
docker-compose logs -f backend
```

## Development Workflow

1. Make code changes in your local files
2. For backend changes: The container will auto-reload (development mode)
3. For frontend changes: Rebuild the container:
   ```bash
   docker-compose up --build frontend
   ```

## Stopping the Application

```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers, and remove volumes
docker-compose down -v
```
