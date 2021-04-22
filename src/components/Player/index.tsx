import styles from './styles.module.scss'

export function Player(){   
    return(
        <div className={styles.container}>
            <header>
                <img src="/assets/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora</strong>
            </header>
            <div className={styles.emptyPlayer}>
                <strong>Selecione um podcast para ouvir!</strong>
            </div>
            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        <div className={styles.emptySlider}/>
                    </div>
                    
                    <span>00:00</span>
                </div>
                <div className={styles.buttons}>
                    <button type="button">
                        <img src="/assets/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button">
                        <img src="/assets/play-previous.svg" alt="Tocar Anterior"/>
                    </button>
                    <button type="button" className={styles.playButton}>
                        <img src="/assets/play.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button">
                        <img src="/assets/play-next.svg" alt="Trocar Próximo"/>
                    </button>
                    <button type="button">
                        <img src="/assets/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

        </div>
    )
}