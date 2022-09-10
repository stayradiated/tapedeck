import { useRef, useState, useEffect } from 'react'
import type { Playlist } from '../../database.server'

import * as icons from '../icons'

type PlayerProps = {
  playlist: Playlist
}

const findLastIndex = <T,>(
  array: T[],
  predicate: (item: T) => boolean,
): number => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (predicate(array[i])) {
      return i
    }
  }

  return -1
}

const timestampToSeconds = (timestamp: string): number => {
  const [minutes, seconds] = timestamp.split(':')
  return Number.parseInt(minutes, 10) * 60 + Number.parseInt(seconds, 10)
}

const secondsToTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const modSeconds = Math.round(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${modSeconds
    .toString()
    .padStart(2, '0')}`
}

const Player = (props: PlayerProps) => {
  const { playlist } = props

  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const currentTrack = playlist.tracks[currentTrackIndex]

  const handlePauseEvent = () => {
    setIsPlaying(false)
  }

  const handlePlayEvent = () => {
    setIsPlaying(true)
  }

  const handleTimeUpdateEvent = () => {
    if (audioRef.current) {
      const { currentTime } = audioRef.current
      const currentTimestamp = secondsToTimestamp(currentTime)
      const trackIndex = findLastIndex(playlist.tracks, (track) => {
        return currentTimestamp >= track.timestamp
      })
      setCurrentTrackIndex(trackIndex)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('pause', handlePauseEvent)
      audioRef.current.addEventListener('play', handlePlayEvent)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdateEvent)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('pause', handlePauseEvent)
        audioRef.current.removeEventListener('play', handlePlayEvent)
        audioRef.current.removeEventListener(
          'timeupdate',
          handleTimeUpdateEvent,
        )
      }
    }
  }, [])

  const handleChangeTrackIndex = (index: number) => {
    console.log({ handleChangeTrackIndex: index })
    if (audioRef.current) {
      const track = playlist.tracks[index]
      audioRef.current.currentTime = timestampToSeconds(track.timestamp)
    }

    setCurrentTrackIndex(index)
  }

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      handleChangeTrackIndex(currentTrackIndex - 1)
    }
  }

  const handleNextTrack = () => {
    console.log({ currentTrackIndex, max: playlist.tracks.length })
    if (currentTrackIndex < playlist.tracks.length) {
      handleChangeTrackIndex(currentTrackIndex + 1)
    }
  }

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        void audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }

  return (
    <main className="player">
      <audio className="audio" src={playlist.audio} ref={audioRef} controls />

      <section className="playlist">
        <h1 className="playlist-name">{playlist.name}</h1>
        <h4 className="playlist-created-at">{playlist.createdAt}</h4>

        <div className="main-album-art">
          <img className="img" src={currentTrack.albumArt} />
        </div>

        <div className="current-track-metadata">
          <p className="artist">{currentTrack.artist}</p>
          <p className="title">{currentTrack.title}</p>
          <p className="album">
            {currentTrack.album} ({currentTrack.albumYear})
          </p>
        </div>

        <div className="controls">
          <button onClick={handlePreviousTrack} className="button prev">
            <icons.SkipToPrevious />
          </button>
          <button onClick={handleTogglePlay} className="button play-pause">
            {isPlaying ? <icons.Pause /> : <icons.Play />}
          </button>
          <button onClick={handleNextTrack} className="button next">
            <icons.SkipToNext />
          </button>
        </div>

        <div className="scroll-hint">
          <icons.ChevronUp />
        </div>
      </section>
      <section className="playlist-tracks">
        <ol className="track-list">
          {playlist.tracks.map((track, index) => {
            const handleClick = () => {
              handleChangeTrackIndex(index)
            }

            return (
              <li className="track-list-item">
                <button className="button" onClick={handleClick}>
                  <img className="album-art" src={track.albumArt} />
                  <span className="title">{track.title}</span>
                  <span className="artist">{track.artist}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}

export { Player }
