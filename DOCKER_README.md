


```
# Docker build images
docker build . -f Dockerfile_frontend -t webapp_frontend:latest
docker build . -f Dockerfile_backend -t webapp_backend:latest

# Docker run containers
docker run -d -p 80:5000 webapp_frontend
docker run -d -p 9001:9001  webapp_backend

# Docker compose
docker-compose up -d
```
