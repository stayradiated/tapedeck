import * as path from 'node:path'
import * as z from 'zod'
import { errorBoundary } from '@stayradiated/error-boundary'

const fileUrl = (...paths: string[]): string =>
  `https://cat.stayradiated.com/tapedeck/${path.join(...paths)}`

const playlistUrl = (filename: string): string => fileUrl('playlist', filename)

const albumArtUrl = (filename: string): string => fileUrl('albumart', filename)

const coverArtUrl = (filename: string): string => fileUrl('coverart', filename)

const audioUrl = (filename: string): string => fileUrl('audio', filename)

const expandUrls = (playlist: Readonly<Playlist>): Playlist => ({
  ...playlist,
  coverArt: playlist.coverArt ? coverArtUrl(playlist.coverArt) : undefined,
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
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  audio: z.string(),
  external: z
    .object({
      spotify: z.string().optional(),
    })
    .optional(),
  coverArt: z.string().optional(),
  tracks: z.array(trackSchema),
})

const indexSchema = z.object({
  playlists: z.array(z.string()),
})

type Track = z.infer<typeof trackSchema>
type Playlist = z.infer<typeof playlistSchema>
type Index = z.infer<typeof indexSchema>

const fetchJson = async <Z extends z.ZodType<unknown, any, unknown>>(
  url: string,
  schema: Z,
): Promise<z.infer<Z> | Error> => {
  return errorBoundary(async () => {
    console.log('fetch', url)

    const response = await fetch(url)
    if (response.status >= 400) {
      throw new Error(
        `Received ${response.status} code when trying to get "${url}"`,
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType !== 'application/json') {
      throw new Error(
        `Unexpected content type "${contentType ?? ''}" at "${url}"`,
      )
    }

    const body = (await response.json()) as unknown
    const parsedBody = schema.parse(body)
    return parsedBody
  })
}

const getIndex = async (): Promise<Index | Error> => {
  const index = await fetchJson(fileUrl('index.json'), indexSchema)
  return index
}

const getPlaylist = async (playlistId: string): Promise<Playlist | Error> => {
  const url = playlistUrl(playlistId + '.json')

  const playlist = await fetchJson(url, playlistSchema)
  if (playlist instanceof Error) {
    return playlist
  }

  return expandUrls(playlist)
}

export { getPlaylist, getIndex }
export type { Playlist, Track }
