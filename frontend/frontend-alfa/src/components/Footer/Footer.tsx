import './Footer.scss'

function Footer() {
    return (
            <div className='footer'>
                <div className='footer_wrapper'>
                    <div className='footer_links'>
                        <div className='footer-description'>
                            <div>
                                <img className='footer-img'
                                     src='https://alfabank.servicecdn.ru/site-upload/54/3a/11500/D07_WhyBest-apr2025_dark.png'/>
                            </div>
                            <div className='footer-description__text'>
                                <h3>О проекте</h3>
                                <p>Веб-приложение для моделирования дохода, разрабатываемое в рамках хакатона
                                    Changellenge Hack&Change 2025 для Альфа Банка</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default Footer;