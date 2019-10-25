import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Game() {
    const params = useParams();

    useEffect(() => {
        console.log(params);
    }, [])

    return (
        <div>
            <p>{params.version}</p>
            <p>{params.gameId}</p>
        </div>
    )
}

export default Game;