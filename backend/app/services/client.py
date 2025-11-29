from fastapi import UploadFile, HTTPException
from typing import List
import pandas as pd
import io

from app.repositories.client import ClientRepository
from app.schemas.client import ClientCreate, PredictionResponse, Client as ClientSchema


class ClientService:
    def __init__(self, repository: ClientRepository):
        self.repository = repository

    async def get_all_clients(self) -> List[ClientSchema]:
        return await self.repository.get_all()

    async def get_client(self, client_id: int) -> ClientSchema:
        client = await self.repository.get_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client

    async def create_client(self, client_data: ClientCreate) -> ClientSchema:
        return await self.repository.create(client_data)

    async def update_client(self, client_id: int, client_data: ClientCreate) -> ClientSchema:
        client = await self.repository.get_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        update_data = client_data.dict(exclude_unset=True)
        return await self.repository.update(client, update_data)

    async def delete_client(self, client_id: int) -> None:
        client = await self.repository.get_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        await self.repository.delete(client)

    async def predict_income(self, client_id: int) -> PredictionResponse:
        client = await self.repository.get_by_id(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        predicted_income = 50000.0
        significant_features = ["age", "incomeValue"]
        
        return PredictionResponse(
            client_id=client_id,
            predicted_income=predicted_income,
            significant_features=significant_features
        )

    async def process_csv_upload(self, file: UploadFile) -> dict:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")
        
        content = await file.read()
        try:
            df = pd.read_csv(io.StringIO(content.decode('utf-8')), sep=';')
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading CSV: {str(e)}")
        
        clients_data = []
        
        for index, row in df.iterrows():
            client_data = row.to_dict()
            client_data = {k: (None if pd.isna(v) else v) for k, v in client_data.items()}
            
            if 'amount_by_category_90d__summarur_amt__sum__cashflowcategory_name__vydacha_nalichnyh_v_bankomate' in client_data:
                client_data['amt_90d_cash_withdrawal'] = client_data.pop('amount_by_category_90d__summarur_amt__sum__cashflowcategory_name__vydacha_nalichnyh_v_bankomate')
            if 'amount_by_category_90d__summarur_amt__sum__cashflowcategory_name__elektronnye_dengi' in client_data:
                client_data['amt_90d_electronic_money'] = client_data.pop('amount_by_category_90d__summarur_amt__sum__cashflowcategory_name__elektronnye_dengi')
            
            string_fields = [
                'incomeValueCategory', 'gender', 'adminarea', 'city_smart_name', 
                'dp_ewb_last_employment_position', 'addrref', 'dp_ewb_last_organization', 
                'period_last_act_ad'
            ]
            for field in string_fields:
                if field in client_data and client_data[field] is not None:
                    client_data[field] = str(client_data[field])

            clients_data.append(client_data)
            
        created_clients = await self.repository.create_batch(clients_data)
        
        predictions = []
        for client in created_clients:
            predictions.append({
                "client_id": client.id,
                "predicted_income": 50000.0,
                "significant_features": ["age", "incomeValue"]
            })
        
        return {"message": "Data processed successfully", "predictions": predictions}
