import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.example import example_controller

openapi_tags = [
    {
        "name": "ops",
        "description": "Operational endpoints like health checks, readiness probe, etc."
    }
]

app = FastAPI(
    docs_url="/api/docs",
    openapi_url="/api/v1/openapi.json",
    openapi_tags=openapi_tags)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(example_controller.router)


@app.on_event("startup")
async def startup():
    pass


@app.on_event("shutdown")
async def shutdown():
    pass


if __name__ == "__main__":
    uvicorn.run("app.main:app",
                host="0.0.0.0",
                port=4000,
                reload=True)
