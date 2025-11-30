import './Header.scss'

function Header() {
    return (
        <div className='header'>
            <div className='header_wrapper'>
                <div className='header_icon'>DMD</div>
                <div className='header_links'>
                    <a href='https://changellenge.com/championships/khakaton-hack-change-2025/' target="_blank" className='header_links__item'>Changellenge Hack&Change</a>
                    <a href='https://alfabank.ru/' target="_blank" className='header_links__item'>Альфа-Банк</a>
                </div>
                <div className='header_buttons'>
                    <form action="https://drive.google.com/file/d/1oaaAAkOfhqielUTkjkILwYUmtDwEgrCH/view"
                          target="_blank">
                        <button className='light-button'>Задание</button>
                    </form>
                    <form action="https://github.com/h4cktivist/alfa-income-modelling-app"
                          target="_blank">
                        <button className='main-button'>GitHub</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Header;