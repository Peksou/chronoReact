import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import styles from '../styles/Chrono.module.css';
// import { set } from 'mongoose';

export default function Chrono() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [targetMinutes, setTargetMinutes] = useState(60) // objectif temps définit par l'utilisateur
    const [pendingTarget, setPendingTarget] = useState(targetMinutes); // pour gérer les changements d'objectif en cours de chrono
    const targetSeconds = targetMinutes * 60;
    const firstTarget = 1 //Math.floor(targetSeconds/4) // temps 1er checkpoint 
    const secondTarget = Math.floor(targetSeconds / 4); // temps 1er checkpoint
    const miTarget = Math.floor(targetSeconds / 2); // temps mi parcours 2e checkpoint 
    const lastTarget = Math.floor(3 * (targetSeconds / 4)); // temps dernière heure dernier checkpoint
    const progressPercent = Math.min((elapsedSeconds / targetSeconds) * 100, 100); // Pourcentage de progression
    const intervalRef = useRef(null);
    const audioRef = useRef(null); // Ref pour gérer l'audio
    const totalTimeRef = useRef(0); // Ref pour stocker le temps total écoulé
    const [displayTotalTime, setDisplayTotalTime] = useState(0); // État pour afficher le temps total

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

    // Remise à zéro du chrono
    const handleReset = () => {
        setElapsedSeconds(0);
        setIsRunning(false);
        totalTimeRef.current = 0;


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

    // Compteur temps total écoulé (même en pause ou reset)
    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                totalTimeRef.current += 1;
                setDisplayTotalTime((prev) => prev + 1);
            }, 1000)
        }
        return () => clearInterval(interval);
    }, [isRunning]);


    // animation objectif atteint 
    useEffect(() => {
        if (elapsedSeconds === targetSeconds) {
            setIsRunning(false);
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

        <main className={styles.container}>

            {/* Chronomètre */}
            <section>
                <h1>⏱️ Chronomètre de Motivation ⏱️</h1>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className={styles.chrono}>{formatTime(elapsedSeconds)}</div>
                <p>🎯 Objectif actuel : {Math.floor(targetMinutes / 60)}h {Math.floor(targetMinutes % 60)}min {Math.floor(targetSeconds % 60)}s</p>

                <div className={styles.buttons}>
                    <div className={styles.startPause} >
                        <button
                            aria-label={isRunning ? 'Mettre en pause le chronomètre' : elapsedSeconds > 0 ? 'Reprendre le chronomètre' : 'Démarrer le chronomètre'} className={styles.startPauseBtn}
                            onClick={() => setIsRunning(!isRunning)}
                        >
                            {isRunning ? 'Pause' : elapsedSeconds > 0 ? 'Reprendre' : 'Démarrer'}
                        </button>
                    </div>
                    <div className={styles.reset} >
                        <button aria-label='Remettre le chronomètre à zéro' className={styles.resetBtn} onClick={handleReset} >Remise à zéro</button>
                    </div>
                </div>
            </section>
            <section>

                <div aria-live='polite' role='status'>
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
                </div>
                <div aria-live='polite' role='alert'>
                    {elapsedSeconds >= targetSeconds && (
                        <p className={styles.success} >🎉 Bravoooo, objectif atteint ! 🎉</p>
                    )}
                </div>
            </section>

            <section className={styles.configSection}>
                <h2>Paramétrer votre objectif</h2>

                {/* Sélection rapide */}
                <div className={styles.quickSelect}>
                    <p>⏳ Choisissez une durée :</p>
                    <div className={styles.buttonsGroup}>
                        {[5, 20, 30, 60, 120].map((min) => (
                            <button
                                key={min}
                                type="button"
                                onClick={() => setPendingTarget(min)}
                                className={`${styles.quickSelectBtn} ${pendingTarget === min ? styles.active : ''}`}
                            >
                                {min >= 60 ? `${Math.floor(min / 60)}h${min % 60 !== 0 ? min % 60 + 'min' : ''}` : `${min}min`}
                            </button>
                        ))}
                    </div>

                    {/* Validation rapide */}
                    <button
                        className={styles.validateQuickBtn}
                        onClick={() => {
                            setTargetMinutes(pendingTarget);
                            setElapsedSeconds(0);
                            setIsRunning(false);
                        }}
                    >
                        ✅ Valider la durée prédéfinie
                    </button>
                </div>

                {/* Formulaire personnalisé */}
                <form
                    className={styles.advancedForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const hours = parseInt(e.target.hours.value) || 0;
                        const minutes = parseInt(e.target.minutes.value) || 0;
                        const seconds = parseInt(e.target.seconds.value) || 0;
                        const total = hours * 3600 + minutes * 60 + seconds;

                        if (total > 0) {
                            setTargetMinutes(total / 60);
                            setElapsedSeconds(0);
                            setIsRunning(false);
                        }
                    }}
                >
                    <p>⏱️ Ou personnalisez la :</p>

                    <div className={styles.timeInputs}>
                        <label>
                            Heures :
                            <input type="number" name="hours" min="0" defaultValue="0" />
                        </label>
                        <label>
                            Minutes :
                            <input type="number" name="minutes" min="0" max="59" defaultValue="0" />
                        </label>
                        <label>
                            Secondes :
                            <input type="number" name="seconds" min="0" max="59" defaultValue="0" />
                        </label>
                    </div>
                    {/* Validation personnalisée */}
                    <button
                        className={styles.validateBtn}
                        onClick={() => {
                            setTargetMinutes(pendingTarget);
                            setElapsedSeconds(0);
                            setIsRunning(false);
                        }}
                    >
                        ✅ Valider la durée personalisée
                    </button>
                </form>

                <p>🧮 Temps total de travail effectif : {formatTime(displayTotalTime)}</p>

            </section>


        </main >
    )
}