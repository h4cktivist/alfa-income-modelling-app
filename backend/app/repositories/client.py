from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, List

from app.models.client import Client as ClientModel
from app.schemas.client import ClientCreate


class ClientRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[ClientModel]:
        result = await self.db.execute(select(ClientModel))
        return result.scalars().all()

    async def get_by_id(self, client_id: int) -> Optional[ClientModel]:
        result = await self.db.execute(select(ClientModel).where(ClientModel.id == client_id))
        return result.scalars().first()

    async def create(self, client_data: ClientCreate) -> ClientModel:
        db_client = ClientModel(**client_data.dict())
        self.db.add(db_client)
        await self.db.commit()
        await self.db.refresh(db_client)
        return db_client

    async def update(self, db_client: ClientModel, client_data: dict) -> ClientModel:
        for key, value in client_data.items():
            setattr(db_client, key, value)
        await self.db.commit()
        await self.db.refresh(db_client)
        return db_client

    async def delete(self, db_client: ClientModel) -> None:
        await self.db.delete(db_client)
        await self.db.commit()

    async def upsert_batch(self, clients_data: List[dict]) -> None:
        for data in clients_data:
            client_id = data.get('id')
            if not client_id:
                continue
            
            existing_client = await self.get_by_id(client_id)
            if existing_client:
                for key, value in data.items():
                    setattr(existing_client, key, value)
            else:
                new_client = ClientModel(**data)
                self.db.add(new_client)
        
        await self.db.commit()

    async def create_batch(self, clients_data: List[dict]) -> List[ClientModel]:
        new_clients = []
        for data in clients_data:
            if 'id' in data:
                del data['id']
            
            client = ClientModel(**data)
            self.db.add(client)
            new_clients.append(client)
        
        await self.db.commit()
        
        for client in new_clients:
            await self.db.refresh(client)
            
        return new_clients
