from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.client import Client, ClientCreate, PredictionResponse
from app.repositories.client import ClientRepository
from app.services.client import ClientService


router = APIRouter()


def get_client_service(db: AsyncSession = Depends(get_db)) -> ClientService:
    repository = ClientRepository(db)
    return ClientService(repository)


@router.post("/predict", response_model=PredictionResponse)
async def predict_income(
    client_id: int, 
    service: ClientService = Depends(get_client_service)
):
    return await service.predict_income(client_id)


@router.post("/predict/upload_csv")
async def upload_csv(
    file: UploadFile = File(...), 
    service: ClientService = Depends(get_client_service)
):
    return await service.process_csv_upload(file)


@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
async def create_client(
    client: ClientCreate, 
    service: ClientService = Depends(get_client_service)
):
    return await service.create_client(client)


@router.get("/", response_model=List[Client])
async def read_clients(
    service: ClientService = Depends(get_client_service)
):
    return await service.get_all_clients()


@router.get("/{client_id}", response_model=Client)
async def read_client(
    client_id: int, 
    service: ClientService = Depends(get_client_service)
):
    return await service.get_client(client_id)


@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: int,
    client_data: ClientCreate,
    service: ClientService = Depends(get_client_service)
):
    return await service.update_client(client_id, client_data)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: int,
    service: ClientService = Depends(get_client_service)
):
    await service.delete_client(client_id)
