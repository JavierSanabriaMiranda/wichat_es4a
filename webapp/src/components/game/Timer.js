import React, {useState, useEffect} from 'react';

/**
 * React component to represent a timer whose time is decremented every second.
 * @param {Number} initialTime - The initial time in seconds.
 * @param {Function} onTimeUp - A callback function to be executed when the time reaches 0.
 * @returns A timer that decrements the time every second.
 */
const Timer = ({initialTime, onTimeUp}) => {

    const [timeLeft, setTimeLeft] = useState(initialTime);
    const className = timeLeft <= 5 ? "game-timer-warning-minus-5" : (timeLeft <= 10 ? "game-timer-warning-minus-10" : "game-timer");

    useEffect(() => {
        //console.log(`Time left: ${timeLeft}`);

        if (timeLeft <= 0) {
            if (onTimeUp) onTimeUp(); // Execute the callback function when the time reaches 0
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer); // Clean up the timer when the component is unmounted
    }, [timeLeft, onTimeUp]);
    
    return (
        <div className={className}>
            {timeLeft}s
        </div>
    )
}

export default Timer