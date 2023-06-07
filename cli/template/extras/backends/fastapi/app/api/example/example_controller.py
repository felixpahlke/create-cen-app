from fastapi import APIRouter, status

from app.api.example.models import HelloResponse

router = APIRouter(
    prefix="/api/example",
    tags=["example"]
)


@router.get("/hello",
            summary="say hello",
            description="endpoint that says hello",
            response_model=HelloResponse,
            status_code=status.HTTP_200_OK,
            )
async def hello():

    return HelloResponse(message="Hello from FastAPI!")
