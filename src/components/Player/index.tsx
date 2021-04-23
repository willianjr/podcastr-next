import Image from 'next/image'
import { useContext, useEffect, useRef } from 'react'
import Slider from 'rc-slider'

import { PlayerContext } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import 'rc-slider/assets/index.css'
import formatRelativeWithOptions from 'date-fns/esm/fp/formatRelativeWithOptions/index'

export function Player(){ 
    const audioRef = useRef<HTMLAudioElement>(null)
    const {
        episodeList, 
        currentEpisodeIndex,
        isPlaying, 
        togglePlay,
        setPlayingState} = useContext(PlayerContext)  
    const episode = episodeList[currentEpisodeIndex]
    useEffect(()=>{
        if(!audioRef.current)
        {
            return
        }

        if(isPlaying)
        {
            audioRef.current.play() 
        }
        else
        {
            audioRef.current.pause ()
            //console.log(audioRef.current.currentTime,audioRef.current.duration)
        }

    },[isPlaying])
    return(
        <div className={styles.container}>
            <header>
                <img src="/assets/playing.svg" alt="Tocando Agora"/>
                <strong>Tocando agora : <small>{episode?.title}</small></strong>
            </header>
            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                    width={592}
                    height={592}
                    src={episode.thumbnail}
                    objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : 
            (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir!</strong>
                </div>
            )}
            
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{background:'#04d361'}}
                                railStyle={{background:'#9f75ff'}}
                                handleStyle={{borderColor:'#04d361', borderWidth:4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                        
                    </div>                
                    <span>00:00</span>
                </div>
                { episode && 
                    (
                        <audio
                            src={episode.url}
                            ref={audioRef}
                            autoPlay
                            onPlay={()=>setPlayingState(true)}
                            onPause={()=>setPlayingState(false)}
                           
                            
                            
                        />

                    )
                }
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/assets/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/assets/play-previous.svg" alt="Tocar Anterior"/>
                    </button>
                    <button type="button" disabled={!episode} className={styles.playButton} onClick={()=>togglePlay()}>
                        { isPlaying ? (
                            <img src="/assets/pause.svg" alt="Pause"/>
                            ) : (
                            <img src="/assets/play.svg" alt="Player"/>
                        )}
                        
                        
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/assets/play-next.svg" alt="Trocar Próximo"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/assets/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

        </div>
    )
}