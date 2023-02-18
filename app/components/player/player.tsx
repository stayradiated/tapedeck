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

  const [hasPlayed, setHasPlayed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const remainingTime = duration - currentTime

  const currentTrack = playlist.tracks[currentTrackIndex]

  const handlePauseEvent = () => {
    setIsPlaying(false)
  }

  const handlePlayEvent = () => {
    setIsPlaying(true)
    setHasPlayed(true)
  }

  const handleTimeUpdateEvent = () => {
    if (audioRef.current) {
      const { currentTime } = audioRef.current
      const currentTimestamp = secondsToTimestamp(currentTime)
      const trackIndex = findLastIndex(playlist.tracks, (track) => {
        return currentTimestamp >= track.timestamp
      })

      setCurrentTime(currentTime)
      setCurrentTrackIndex(trackIndex)
    }
  }

  const handleDurationChangeEvent = () => {
    if (audioRef.current) {
      const { duration } = audioRef.current
      setDuration(Math.round(duration))
    }
  }

  const handleProgressEvent = () => {
    if (audioRef.current) {
      const { buffered } = audioRef.current
      const value = buffered.length > 0 ? buffered.end(buffered.length - 1) : 0
      setBuffered(value)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      handleDurationChangeEvent()
      handleTimeUpdateEvent()
    }
  }, [audioRef.current])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('pause', handlePauseEvent)
      audioRef.current.addEventListener('play', handlePlayEvent)
      audioRef.current.addEventListener('timeupdate', handleTimeUpdateEvent)
      audioRef.current.addEventListener(
        'durationchange',
        handleDurationChangeEvent,
      )
      audioRef.current.addEventListener('progress', handleProgressEvent)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('pause', handlePauseEvent)
        audioRef.current.removeEventListener('play', handlePlayEvent)
        audioRef.current.removeEventListener(
          'timeupdate',
          handleTimeUpdateEvent,
        )
        audioRef.current.removeEventListener(
          'durationchange',
          handleDurationChangeEvent,
        )
        audioRef.current.removeEventListener('progress', handleProgressEvent)
      }
    }
  }, [])

  const handleChangeTrackIndex = (index: number) => {
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
          <img
            className="img"
            src={
              !hasPlayed && playlist.coverArt
                ? playlist.coverArt
                : currentTrack.albumArt
            }
          />
        </div>

        <div className="timeline">
          <div className="progress-bar">
            <div
              className="progress-bar-buffered"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
            <div
              className="progress-bar-inner"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="current-time">
            {secondsToTimestamp(currentTime)}
          </span>
          <span className="remaining-time">
            -{secondsToTimestamp(remainingTime)}
          </span>
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
              <li className="track-list-item" key={index}>
                <button className="button" onClick={handleClick}>
                  <img className="album-art" src={track.albumArt} />
                  <span className="title">{track.title}</span>
                  <span className="artist">{track.artist}</span>
                  <span className="timestamp">{track.timestamp}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </section>
      {playlist.external?.spotify && (
        <div className="external-links">
          <a
            className="spotify-link"
            target="_blank"
            rel="noopener"
            href={playlist.external.spotify}
          >
            <div className="spotify-logo">
              <icons.Spotify />
            </div>
            Listen on Spotify
          </a>
        </div>
      )}
    </main>
  )
}

export { Player }
