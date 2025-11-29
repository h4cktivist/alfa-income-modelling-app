import './NewClient.scss'
function NewClient() {
    return (
        <div className='new-client'>
            <div>
                <p className='new-client__title'>Добавьте нового клиента</p>
                <input type="file" accept=".csv"/>
            </div>
            <div className='new-client__calculate'>
                <p className='new-client__description'>Рассчитать модель дохода</p>
            </div>
        </div>
    )
}

export default NewClient;