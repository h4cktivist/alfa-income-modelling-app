import axios from "axios";

const FIRST_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const ALL_CLIENTS = '/api/v1/clients';
const UPLOAD_CSV = '/api/v1/clients/predict/upload_csv';
export const PREDICT_id_URL = `${FIRST_API_URL}/api/v1/clients/predict?client_id=`

export const getAllClients = async () => {
    try {
        const res = await axios({ url: `${FIRST_API_URL}${ALL_CLIENTS}`, method: 'GET', params: {} });
        console.log(res.data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data.errorText)
        } else if (error instanceof Error) {
            console.log(error.message)
        }
    }
}


export const postClientsURL = `${FIRST_API_URL}${UPLOAD_CSV}`;
