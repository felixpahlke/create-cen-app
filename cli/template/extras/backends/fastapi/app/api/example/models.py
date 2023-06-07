from enum import Enum
from fastapi.responses import FileResponse
from pydantic import BaseModel


class HelloResponse(BaseModel):
    message: str
