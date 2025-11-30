import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import os
from typing import List, Dict, Any

class PredictionService:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self._load_model()
        
        self.cols_to_drop = [
            'w', 'dt', 
            'hdb_bki_total_max_overdue_sum', 'hdb_bki_total_ip_max_limit', 
            'hdb_bki_total_ip_max_outstand', 'hdb_bki_total_auto_max_limit', 
            'hdb_bki_total_micro_max_overdue', 'hdb_bki_active_cc_max_overdue',
            'hdb_bki_active_pil_max_limit', 'hdb_bki_active_pil_max_limit',
        ]
        
        self.categorical_columns = ['gender', 'adminarea', 'city_smart_name', 'addrref', 'incomeValueCategory']
        
        self.median_columns = [
            'gender', 'incomeValueCategory', 'curbal_usd_amt_cm_avg', 'pil', 
            'bki_total_auto_cnt', 'blacklist_flag', 'bki_total_oth_cnt', 'hdb_ovrd_sum', 
            'avg_fdep_db_turn', 'hdb_bki_total_ip_cnt', 'days_to_last_transaction', 
            'acard', 'other_credits_count', 'winback_cnt', 'bki_active_auto_cnt',
            'loanacc_rur_amt_cm_avg', 'avg_fdep_cr_turn', 'client_active_flag', 
            'nonresident_flag', 'days_after_last_request', 'loanacc_rur_amt_curr_v2',
            'hdb_bki_total_active_products', 'hdb_bki_total_micro_cnt', 
            'hdb_bki_active_pil_cnt', 'hdb_bki_total_pil_cnt', 'accountsalary_out_flag',
            'express_rur_amt_cm_avg', 'loanacc_rur_amt_cm_avg_inc_v2', 
            'cred_dda_rur_amt_3m_avg'
        ]

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                print(f"Model loaded from {self.model_path}")
            except Exception as e:
                print(f"Failed to load model: {e}")
        else:
            print(f"Model file not found at {self.model_path}")

    def _fix_comma_numbers(self, df: pd.DataFrame) -> pd.DataFrame:
        df_processed = df.copy()
        for col in df_processed.columns:
            if pd.api.types.is_numeric_dtype(df_processed[col]):
                continue
            try:
                sample_values = df_processed[col].dropna().head(10)
                has_commas = any(isinstance(val, str) and ',' in str(val) for val in sample_values)
                if has_commas:
                    df_processed[col] = df_processed[col].astype(str).str.replace(',', '.')
                    df_processed[col] = pd.to_numeric(df_processed[col], errors='coerce')
            except:
                continue
        return df_processed

    def preprocess(self, data: List[Dict[str, Any]]) -> pd.DataFrame:
        df = pd.DataFrame(data)
        
        cols_to_drop_existing = [c for c in self.cols_to_drop if c in df.columns]
        df = df.drop(columns=cols_to_drop_existing)
        
        df = self._fix_comma_numbers(df)
        
        for col in self.categorical_columns:
            if col in df.columns:
                df[col] = df[col].fillna('Unknown')
                
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        for col in numeric_cols:
            if col in self.median_columns:
                median_val = df[col].median()
                df[col] = df[col].fillna(median_val if not pd.isna(median_val) else 0)
            else:
                mean_val = df[col].mean()
                df[col] = df[col].fillna(mean_val if not pd.isna(mean_val) else 0)

        for col in self.categorical_columns:
            if col in df.columns:
                df[col] = df[col].apply(lambda x: abs(hash(x)) % 1000) 
                
        return df

    def predict(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not self.model:
            return [{"client_id": d.get("id"), "predicted_income": 0, "significant_features": ["Model not loaded"]} for d in data]

        df_processed = self.preprocess(data)
        
        try:
            X = df_processed.drop(columns=['id', 'target'], errors='ignore')
            
            if hasattr(self.model, 'feature_names_in_'):
                missing_cols = set(self.model.feature_names_in_) - set(X.columns)
                for c in missing_cols:
                    X[c] = 0

                X = X[self.model.feature_names_in_]
            
            predictions = self.model.predict(X)
            
            feature_importance_list = []
            if hasattr(self.model, 'feature_importances_'):
                importances = self.model.feature_importances_
                feature_names = X.columns
                fi_df = pd.DataFrame({'feature': feature_names, 'importance': importances})
                fi_df = fi_df.sort_values('importance', ascending=False)
                feature_importance_list = fi_df['feature'].head(5).tolist()
            
            results = []
            for i, pred in enumerate(predictions):
                client_id = data[i].get('id')
                results.append({
                    "client_id": client_id,
                    "predicted_income": float(pred),
                    "significant_features": feature_importance_list
                })
                
            return results

        except Exception as e:
            print(f"Prediction error: {e}")
            return [{"client_id": d.get("id"), "predicted_income": 0, "significant_features": [f"Error: {str(e)}"]} for d in data]

prediction_service = PredictionService(os.path.join(os.path.dirname(__file__), '../../model_files/model_xgboost.pkl'))
