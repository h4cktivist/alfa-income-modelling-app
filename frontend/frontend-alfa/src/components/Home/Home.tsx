import './Home.scss'
//import {useEffect} from "react";
//import {getPosts} from "../../../api/requests.ts";
import {useNavigate} from "react-router";
import AppRoutes from "../../components/pages/routes.tsx";

import { useDispatch, useSelector } from 'react-redux';
import type {AppDispatch, RootState} from '../../redux/store.tsx'; // Импортируем типы для TypeScript
// Импортируем типы для TypeScript
import { setPageId } from '../../redux/slices/PageSlice.tsx'; // Импортируем экшен
function Home() {
    const nav = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    /*
    useEffect(() => {
        getPosts.then(res => console.log(res)).catch(err => console.log(err));
    }, [])*/
    const activeButtonId = useSelector((state: RootState) => state.page.pageId);

    const handleNavClick = (path: string,pageId: string) => {
        dispatch(setPageId(pageId)); // Отправляем экшен для установки ID
        nav(path);
    };
    return (
        <div className='home'>
            <div className='home-wrapper'>
                <div className='home-wrapper_content'>
                    <div className='title'>
                        <div>
                            <h2 className='title_text'>Расчет модели дохода</h2>
                        </div>
                        <div className='title-links'>
                            <div
                                className={`title-links__item ${activeButtonId === 'client-select' ? 'active' : ''}`}
                                onClick={() => handleNavClick('/all', 'client-select')}>Выбрать клиента</div>
                            <div
                                className={`title-links__item ${activeButtonId === 'client-add' ? 'active' : ''}`}
                                onClick={() => handleNavClick('/', 'client-add')}>Добавить клиента</div>
                        </div>
                    </div>
                    <div className='model'>
                            <AppRoutes/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;