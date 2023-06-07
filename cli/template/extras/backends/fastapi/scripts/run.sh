DOCKER_ENGINE=${1:-podman}

$DOCKER_ENGINE run \
  -p 4000:4000 \
  --name fastapi \
  --rm \
  -e "DATABASE_URL=sqlite:////opt/app-root/app/infrastructure/database/the_database.db" \
  python_fastapi_template:latest
