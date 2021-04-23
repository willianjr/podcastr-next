import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'

import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import 'rc-slider/assets/index.css'
import formatRelativeWithOptions from 'date-fns/esm/fp/formatRelativeWithOptions/index'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player(){ 
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)
    const {
        episodeList, 
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasPrevious,
        hasNext, 
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayingState} = usePlayer()  
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

    function setupPogressListener(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate',()=>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }
    function handleSeek(amount:number)
    {
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }
    function handleEpisodeEnded()
    {
        if (hasNext)
        {
            playNext()
        }
        else
        {
            clearPlayingState()
            setProgress(0)
        }
    }
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
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{background:'#04d361'}}
                                railStyle={{background:'#9f75ff'}}
                                handleStyle={{borderColor:'#04d361', borderWidth:4}}
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                
                                

                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                        
                    </div>                
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                { episode && 
                    (
                        <audio
                            src={episode.url}
                            ref={audioRef}
                            autoPlay
                            loop={isLooping}
                            onPlay={()=>setPlayingState(true)}
                            onPause={()=>setPlayingState(false)} 
                            onLoadedMetadata={setupPogressListener}
                            onEnded={handleEpisodeEnded}                           
                        />

                    )
                }
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length===1} onClick={()=>toggleShuffle()} className={isShuffling ? styles.isActive:''}>
                        <img src="/assets/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/assets/play-previous.svg" alt="Tocar Anterior"/>
                    </button>
                    <button type="button" disabled={!episode} className={styles.playButton} onClick={()=>togglePlay()}>
                        { isPlaying ? (
                            <img src="/assets/pause.svg" alt="Pause"/>
                            ) : (
                            <img src="/assets/play.svg" alt="Player"/>
                        )}                 
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/assets/play-next.svg" alt="Trocar Próximo"/>
                    </button>
                    <button type="button" disabled={!episode} onClick={()=>toggleLoop()} className={isLooping ? styles.isActive:''}>
                        <img src="/assets/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>

        </div>
    )
}