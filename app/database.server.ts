import * as z from 'zod'
import { errorBoundary } from '@stayradiated/error-boundary'

const fileUrl = (directory: string, filename: string): string =>
  `https://cat.stayradiated.com/tapedeck/${directory}/${filename}`

const playlistUrl = (filename: string): string => fileUrl('playlist', filename)

const albumArtUrl = (filename: string): string => fileUrl('albumart', filename)

const audioUrl = (filename: string): string => fileUrl('audio', filename)

const expandUrls = (playlist: Readonly<Playlist>): Playlist => ({
  ...playlist,
  audio: audioUrl(playlist.audio),
  tracks: playlist.tracks.map((track) => ({
    ...track,
    albumArt: albumArtUrl(track.albumArt),
  })),
})

const trackSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  albumArt: z.string(),
  albumYear: z.number(),
  timestamp: z.string(),
})

const playlistSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  audio: z.string(),
  tracks: z.array(trackSchema),
})

type Track = z.infer<typeof trackSchema>
type Playlist = z.infer<typeof playlistSchema>

const getPlaylist = async (playlistId: string): Promise<Playlist | Error> => {
  const url = playlistUrl(playlistId + '.json')

  const playlist = await errorBoundary(async () => {
    const response = await fetch(url)
    if (response.status >= 400) {
      throw new Error(`Could not find playlist with ID "${playlistId}"`)
    }

    if (response.headers.get('content-type') !== 'application/json') {
      throw new Error(
        `Playlist with ID "${playlistId}" is not a valid JSON file.`,
      )
    }

    const body = (await response.json()) as unknown
    const parsedBody = playlistSchema.parse(body)
    return parsedBody
  })

  if (playlist instanceof Error) {
    return playlist
  }

  return expandUrls(playlist)
}

export { getPlaylist }
export type { Playlist, Track }
