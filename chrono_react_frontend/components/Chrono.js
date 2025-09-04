import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from '../styles/Chrono.module.css';

export default function Chrono() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const audioRef = useRef(null); // Ref pour gérer l'audio
    // const targetSeconds = 30; // pour le test
    const targetSeconds = 1 * 3600; // objetcif temps : 5 heures /jours
    const firstTarget = 1 //Math.floor(targetSeconds/4) // temps 1er checkpoint 
    const secondTarget = Math.floor(targetSeconds / 4); // temps 1er checkpoint
    const miTarget = Math.floor(targetSeconds / 2); // temps mi parcours 2e checkpoint 
    const lastTarget = Math.floor(3 * (targetSeconds / 4)); // temps dernière heure dernier checkpoint
    const progressPercent = Math.min((elapsedSeconds / targetSeconds) * 100, 100); // Pourcentage de progression

    // Gestion du chrono
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);

            // Reprendre l'audio si en pause
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(error => {
                    console.error("Erreur lors de la reprise de l'audio", error);
                });
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // Mettre l'audio en pause si en cours de lecture
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleReset = () => {
        setElapsedSeconds(0);
        setIsRunning(false);

        // Arrêter et supprimer complètement l'audio en cours
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null; // Supprimer la référence à l'audio
        }
    };

    // animation audios étapes chrono 
    useEffect(() => {
        if (elapsedSeconds === firstTarget) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio('/Rocky_motivation.mp3');
            audioRef.current.play().catch(error => {
                console.log("Erreur de lecture de l'audio Rocky", error);
            });
        } else if (elapsedSeconds === secondTarget) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio('/Dont_give_up.mp3');
            audioRef.current.play().catch(error => {
                console.log("Erreur de lecture de l'audio Denzel", error);
            });
        } else if (elapsedSeconds === miTarget) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio('/Dont_give_up.mp3');
            audioRef.current.play().catch(error => {
                console.log("Erreur de lecture de l'audio Denzel", error);
            });
        } else if (elapsedSeconds === lastTarget) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio('/DenzelW_motivation.mp3');
            audioRef.current.play().catch(error => {
                console.log("Erreur de lecture de l'audio Denzel", error);
            });
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

    // formatage du temps en hh:mm:ss
    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).toString().padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).toString().padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        return `${hours}:${minutes}:${s}`;
    }

    // --- JSX --- //
    return (
        <div className={styles.container}>
            <h1>⏱️ Chronomètre de Coding ⏱️</h1>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className={styles.chrono}>{formatTime(elapsedSeconds)}</div>
            <div className={styles.buttons}>
                <div className={styles.startPause} >
                    <button
                        className={styles.startPauseBtn}
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? 'Pause' : elapsedSeconds > 0 ? 'Reprendre' : 'Démarrer'}
                    </button>
                </div>
                <div className={styles.reset} >
                    <button className={styles.resetBtn} onClick={handleReset} >Remise à zéro</button>
                </div>

            </div>
            {isRunning && (
                <p className={styles.inProgress}>Chronomètre en cours...</p>
            )}
            {!isRunning && elapsedSeconds > 0 && elapsedSeconds < targetSeconds && (
                <p className={styles.inProgress}>Chronomètre en pause...</p>
            )}
            {elapsedSeconds >= firstTarget && elapsedSeconds < miTarget && (
                <p className={styles.success} > Lets gooooo !!!!</p>
            )}
            {elapsedSeconds >= miTarget && elapsedSeconds < secondTarget && (
                <p className={styles.success} > On avance bien là ! !</p>
            )}
            {elapsedSeconds >= miTarget && elapsedSeconds < lastTarget && (
                <p className={styles.success} > Encore une petite moitiée !</p>
            )}
            {elapsedSeconds >= lastTarget && elapsedSeconds < targetSeconds && (
                <p className={styles.success} > Allé dernière ligne droite, t'y es presque !</p>
            )}
            {elapsedSeconds >= targetSeconds && (
                <p className={styles.success} >🎉 Bravoooo, objectif atteint ! 🎉</p>
            )}

        </div>
    )
}