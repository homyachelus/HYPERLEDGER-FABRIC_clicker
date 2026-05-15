import './App.css';
import {useEffect, useState} from "react";
import {click, getClicked} from "./api/api.ts";

function App() {

    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);

    const getCount = async () => {
        const count = await getClicked();
        if (!count) return;
        setCount(count.click);

        setLoading(false);
    }

    const clicked = async () => {
        setLoading(true);

        try {
            await click();
            await getCount();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        getCount();
    }, []);

    return (
        <div>
            <h1>HYPERLEDGER-FABRIC</h1>
            <h2>КЛИКЕР НА ИНТЕРНЕТЕ</h2>

            {loading ? (<div>загрузка...</div>) : (
                <div>
                    <h3>Всего кликов: {count}</h3>

                    <button className="counter" onClick={clicked}>
                        тык
                    </button>
                </div>
            )}


        </div>
    )
}

export default App
