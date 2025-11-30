import './AllClients.scss'
import { useEffect, useState } from "react";
import { getAllClients } from "../../../api/requests.ts";
import { PREDICT_id_URL } from "../../../api/requests.ts";
import axios from "axios";

function AllClients() {

    const [clients, setClients] = useState<Client[]>([]);
    const [responseData, setResponseData] = useState<ServerResponse | null>(null);

    interface Client {
        id: number;
        gender: string;
        adminarea: string;
    }

    interface ServerResponse {
        client_id: number,
        publicList_income: number,
        significant_features: string[],
    }

    useEffect(() => {
        const loadClients = async () => {
            const data = await getAllClients();
            setClients(data || []);
        };

        loadClients().catch(err => console.log(err));
    }, []);

    const handleClick = async (clientId: number) => {
        try {
            const response = await axios.post(
                `${PREDICT_id_URL}${clientId}`,
                {}
            );
            setResponseData(response.data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div className='clients'>
            {clients.length === 0 ? (
                <p>Клиенты не найдены</p>
            ) : (
                <div className="clients__list">
                    {clients.map((client, index) => (
                        <div className='clients__item'
                            key={client.id || index}
                            onClick={() => handleClick(client.id)}
                        >
                            <p>ID клиента: {client.id};    Пол: {client.gender};  Область:  {client.adminarea};</p>
                        </div>
                    ))}
                </div>
            )}
            {responseData && (
                <div className='clients__data'>
                    <p><strong>ID клиента:</strong> {responseData.client_id}</p>
                    <p><strong>Прогнозируемый доход:</strong> {responseData.predicted_income} руб.</p>
                    <p><strong>Значимые признаки:</strong></p>
                    <div>
                        {responseData.significant_features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

}

export default AllClients;
