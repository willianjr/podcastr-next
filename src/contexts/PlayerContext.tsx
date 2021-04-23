import {createContext, ReactNode, useContext, useState} from 'react'

type Episode ={
    title:string;
    members:string;
    thumbnail:string;
    duration:number;
    url:string;
}
type PlayerContextData ={
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying:boolean;
    isLooping:boolean;
    isShuffling:boolean;
    hasPrevious:boolean;
    hasNext:boolean;
    play: (episode:Episode)=>void;
    playList: (list:Episode[], index:number)=>void;
    togglePlay: ()=>void;
    toggleLoop: ()=>void;
    toggleShuffle: ()=>void;
    playNext: ()=>void;
    playPrevious: ()=>void;
    clearPlayingState: ()=>void;
    setPlayingState: (state:boolean)=>void;

}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children:ReactNode
}

export function PlayerContextProvider ({children}:PlayerContextProviderProps){
  
    const[episodeList, setEpisodeList] = useState([])
    const[currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0)
    const[isPlaying, setisPlaying] = useState(false)
    const[isLooping, setisLooping] = useState(false)
    const[isShuffling, setisShuffling] = useState(false)

    function play(episode:Episode){
        setEpisodeList([episode])
        setcurrentEpisodeIndex(0)
        setisPlaying(true)
    }
    function playList(list:Episode[], index:number){
        setEpisodeList(list)
        setcurrentEpisodeIndex(index)
        setisPlaying(true)
    }
    function togglePlay()
    {
        setisPlaying(!isPlaying)
    }
    function toggleLoop()
    {
        setisLooping(!isLooping)
    }
    function toggleShuffle()
    {
        setisShuffling(!isShuffling)
    }
    function setPlayingState(state:boolean)
    {
        setisPlaying(state)
    }
    function clearPlayingState()
    {
        setEpisodeList([])
        setcurrentEpisodeIndex(0)
    }
    const hasPrevious = currentEpisodeIndex>0
    const hasNext = isShuffling || (currentEpisodeIndex+1)<episodeList.length
    function playNext()
    {
        if(isShuffling){
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setcurrentEpisodeIndex(nextRandomEpisodeIndex)
        }
        else if(hasNext)
        {
            setcurrentEpisodeIndex(currentEpisodeIndex+1)
        }
        
    }
    function playPrevious()
    {
        if(hasPrevious)
        {
            setcurrentEpisodeIndex(currentEpisodeIndex-1)
        }
        
    }
    return(
        <PlayerContext.Provider value={{episodeList,currentEpisodeIndex, play, playList, isPlaying, togglePlay,isLooping, toggleLoop, isShuffling, toggleShuffle, setPlayingState,playNext,playPrevious,hasPrevious, hasNext,clearPlayingState}}>
        {children}
        </PlayerContext.Provider>  
    )
  
}

export const usePlayer=()=>{
    return useContext(PlayerContext)
}