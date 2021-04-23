import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

type Episode ={
  id:string;
  title:string;
  members:string;
  thumbnail:string;
  publishedAt:string;
  duration:number;
  durationString:string;
  url:string;

}
type HomeProps = {
  latestEpisodes:Episode[],
  allEpisodes:Episode[]
  
}

export default function Home({latestEpisodes,allEpisodes}:HomeProps) {

  
  return (
    <div className={styles.homePage}>
      
      <section className={styles.latestEpisodes}>
      <h2>Últimos Lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode=>{
            return(
              <li key={episode.id}>
                <Image 
                    width={192}
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                    
                  />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                      <a>
                        {episode.title}
                      </a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationString}</span>
                  
                </div>
                <button type="button">
                    <img src="assets/play-green.svg" alt="Tocar Episódio"/>
                  </button>
              </li>
            )
          })}
        </ul>

      </section>
      <section className={styles.allEpisodes}>
      <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th style={{width:72}}></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th style={{width:100}}>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {allEpisodes.map(episode=>{
            return(
              <tr key={episode.id}>
                <td>
                  <Image 
                      width={120}
                      height={120} 
                      src={episode.thumbnail} 
                      alt={episode.title}
                      objectFit="cover"
                    />
                </td>
                <td><Link href={`/episodes/${episode.id}`}>
                      <a>
                        {episode.title}
                      </a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td>{episode.publishedAt}</td>
                <td>{episode.durationString}</td> 
                <td><button type="button">
                    <img src="assets/play-green.svg" alt="Tocar Episódio"/>
                  </button>
                </td>         
              </tr>
            )
          })}
          </tbody>
        </table>
      </section>
   
    
    </div>
   )
}

export const getStaticProps:GetStaticProps = async()=>{
  const { data } = await api.get('episodes',{
    params:{
      _limit:12,
      _order:'desc',
      _sort:'published-at'
    }
  })

  const episodes = data.map(episode=>{
    return {
        id: episode.id,
        title:episode.title,
        thumbnail:episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at),'d MMM yy', {locale:ptBR}),
        duration: Number(episode.file.duration),
        durationString: convertDurationToTimeString(Number(episode.file.duration)),
        url: episode.file.url
    }
  })
  
  const latestEpisodes = episodes.slice(0,2)
  const allEpisodes = episodes.slice(2,episodes.length)

  return {
    props:{
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60*60*8,
  }

}
