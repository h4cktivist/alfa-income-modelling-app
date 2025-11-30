import axios from 'axios';
import './NewClient.scss'
import React, { useRef, useState } from "react";
import { postClientsURL } from "../../../api/requests.ts";
interface Prediction {
    client_id: number;
    predicted_income: number;
    significant_features: string[];
}

interface ApiResponse {
    message: string;
    predictions: Prediction[];
}

function NewClient() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setSelectedFile(file);
                setMessage('');
            } else {
                setMessage('Пожалуйста, выберите CSV файл');
                setSelectedFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('Пожалуйста, выберите файл');
            return;
        }

        setUploading(true);
        setMessage('');
        setResponseData(null); // Сбрасываем предыдущий ответ

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post(
                postClientsURL,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setMessage(`Файл успешно загружен`);

            // Сбрасываем выбор файла после успешной загрузки
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Сохраняем данные для отображения в блоке
            const responseData = response.data;
            setResponseData(responseData);

            // Логируем для отладки
            console.log('Ответ от сервера:', responseData);

        } catch (error: any) {
            console.error('Ошибка загрузки:', error);
            setMessage(`Ошибка: ${error.response?.data?.message || error.message}`);
        } finally {
            setUploading(false);
        }
    };

    // Обработчик сброса выбора
    const handleReset = () => {
        setSelectedFile(null);
        setMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className='new-client'>
                <div className='new-client__download'>
                    <h2 className='new-client__title'>Добавьте нового клиента</h2>
                    <p>Загрузка CSV файла</p>
                    <input
                        className='file-input'
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        disabled={uploading}
                    />
                    <div style={{ marginBottom: '15px' }}>
                        <button
                            className='submit-button'
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            {uploading ? 'Загрузка...' : 'Отправить'}
                        </button>

                        <button className='reset-button' onClick={handleReset}>Сбросить</button>
                    </div>

                    {message && (
                        <div>{message}</div>
                    )}
                    {selectedFile && (
                        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <p><strong>Выбран файл:</strong> {selectedFile.name}</p>
                            <p><strong>Размер:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                            <p><strong>Тип:</strong> {selectedFile.type || 'text/csv'}</p>
                        </div>
                    )}
                </div>
                <div className='new-client__calculate'>
                    {responseData && responseData.predictions && (
                        <div className="response-block">
                            <h3>Результаты прогнозирования:</h3>
                            <div className="predictions-list">
                                {responseData.predictions.map((prediction, index) => (
                                    <div key={index} className="prediction-item" style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <p><strong>ID клиента:</strong> {prediction.client_id}</p>
                                        <p><strong>Прогнозируемый доход:</strong> {prediction.predicted_income} руб.</p>
                                        <p><strong>Значимые признаки:</strong> {prediction.significant_features.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export default NewClient;


