SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
DOCKER_ENGINE=${1:-podman}

$DOCKER_ENGINE build -t python_fastapi_template:latest "$SCRIPT_DIR"/..
