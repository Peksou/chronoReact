import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from '../styles/Chrono.module.css';

export default function Chrono() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const targetSeconds = 1; // 1 seconde pour le test
    // const targetSeconds = 6 * 3600; // 6 heures

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);

    }, [isRunning]);

    useEffect(() => {
        if (elapsedSeconds === targetSeconds) {
            confetti({
                particleCount: 1500,
                startVelocity: 30,
                spread: 360,
                origin: { y: 0.5 },
                drift: 0.4,
                gravity: 0.2,

            })
            const audio = new Audio('/success.mp3');
            audio.play().catch(error =>{
                console.error("erreur de lecture de l'audio", error);
            })
        }
    }, [elapsedSeconds]);

    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).toString().padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).toString().padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        return `${hours}:${minutes}:${s}`;
    }


    // --- JSX ---
    return (
        <div className={styles.container}>
            <h1>⏱️ Chronomètre de Coding ⏱️</h1>
            <div className={styles.chrono}>{formatTime(elapsedSeconds)}</div>
            <div className={styles.buttons}>
            <div className={styles.startPause} >
                <button className={styles.startPauseBtn} onClick={() => setIsRunning(true)} >Start</button>
                <button className={styles.startPauseBtn} onClick={() => setIsRunning(false)} >Pause</button>
                </div>
                <div className={styles.reset} >
                <button className={styles.resetBtn} onClick={() => { setElapsedSeconds(0); setIsRunning(false) }} >Remise à zéro</button>
                </div>

            </div>
            {isRunning && (
                <p className={styles.inProgress}>Chronomètre en cours...</p>
            )}
            {!isRunning && elapsedSeconds > 0 && elapsedSeconds < targetSeconds && (
                <p className={styles.inProgress}>Chronomètre en pause...</p>
            )}
            {elapsedSeconds >= targetSeconds && (
                <p className={styles.success} >🎉 Bravo, objectif atteint ! 🎉</p>
            )}

        </div>
    )
}