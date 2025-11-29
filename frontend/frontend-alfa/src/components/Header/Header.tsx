import './Header.scss'

function Header() {
    return (
        <div className='header'>
            <div className='header_wrapper'>
                <div className='header_icon'>DMD</div>
                <div className='header_links'>
                    <div className='header_links__item'>Changellenge Hack&Change</div>
                    <div className='header_links__item'>Альфа-Банк</div>
                </div>
                <div className='header_buttons'>
                    <button className='light-button'>Задание</button>
                    <button className='main-button'>GitHub</button>
                </div>
            </div>
        </div>
    )
}

export default Header;