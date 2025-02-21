import React, {useState, useEffect} from 'react';
import './game.css';

const Timer = ({initialTime, onTimeUp}) => {

    const [timeLeft, setTimeLeft] = useState(initialTime);
    const className = timeLeft <= 5 ? "gameTimerWarningMinus5" : (timeLeft <= 10 ? "gameTimerWarningMinus10" : "gameTimer");

    useEffect(() => {
        console.log(`Time left: ${timeLeft}`);

        if (timeLeft <= 0) {
            if (onTimeUp) onTimeUp(); // Ejecuta una acción cuando el tiempo llega a 0
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Limpia el temporizador cuando el componente se desmonta
    }, [timeLeft, onTimeUp]);
    
    return (
        <div className={className}>
            {timeLeft}s
        </div>
    )
}

export default Timer