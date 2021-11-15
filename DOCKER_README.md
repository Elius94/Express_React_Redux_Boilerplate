
```
# Docker build images
docker build . -f Dockerfile_pm2 -t pm2:latest

# Docker run containers
docker run -d -p 80:9001 pm2

# Docker compose
docker-compose up -d
```
