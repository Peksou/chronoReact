import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from '../styles/Chrono.module.css';

export default function Chrono() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const targetSeconds = 10; // pour le test
    // const targetSeconds = 6 * 3600; // objetcif temps : 6 heures
    const firstTarget = Math.floor(targetSeconds/4) // temps 1er checkpoint 
    const miTarget = targetSeconds/2; // temps mi parcours 2e checkpoint 
    const lastTarget = Math.floor(3 * (targetSeconds /4)); // temps dernière heure dernier checkpoint

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    // animation audios étapes chrono 
    useEffect(() => {
        if (elapsedSeconds === firstTarget) {
            const audioRocky = new Audio('/Rocky_motivation.mp3')
            audioRocky.play().catch(error => {
                console.log("erreur de lecture de l'audio Rocky", error);
            })
        } else if (elapsedSeconds === miTarget) {
            const audioDenzel = new Audio('/Dont_give_up.mp3')
            audioDenzel.play().catch(error => {
                console.log("erreur de lecture de l'audio Denzel", error)
            })
        }else if (elapsedSeconds === lastTarget) {
            const audioDenzel = new Audio('/DenzelW_motivation.mp3')
            audioDenzel.play().catch(error => {
                console.log("erreur de lecture de l'audio Denzel", error)
            })
        }
    }, [elapsedSeconds]);


    // animation objectif atteint 
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
            audio.play().catch(error => {
                console.error("erreur de lecture de l'audio success", error);
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
            {elapsedSeconds >= firstTarget && elapsedSeconds < miTarget && (
                <p className={styles.success} > On avance bien là !</p>
            )}
            {elapsedSeconds >= miTarget && elapsedSeconds < lastTarget && (
                <p className={styles.success} > Encore une petite moitiée !</p>
            )}
            {elapsedSeconds >= lastTarget && elapsedSeconds < targetSeconds && (
                <p className={styles.success} > Allé dernière ligne droite, t'y es presque !</p>
            )}
            {elapsedSeconds >= targetSeconds && (
                <p className={styles.success} >🎉 Bravo, objectif atteint ! 🎉</p>
            )}

        </div>
    )
}