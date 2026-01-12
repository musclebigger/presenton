docker build -f Dockerfile.dev -t presenton:dev .

docker run -d -p 5000:80 -v ${PWD}:/app --name presenton-dev presenton:dev

不缓存
docker build -f Dockerfile.dev -t presenton:dev --no-cache .