import type {
  LinksFunction,
  MetaFunction,
  LoaderFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import type { Playlist } from '../database.server'
import { getPlaylist } from '../database.server'

import { Player, styles as playerStyles } from '../components/player'

type LoaderData = {
  playlistId?: string
  playlist?: Playlist
  error?: string
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: playerStyles },
]

export const meta: MetaFunction = ({ data }) => {
  console.log({ data })

  return {
    charset: 'utf-8',
    title: data?.playlist?.name ?? 'Playlist Not Found',
    viewport:
      'width=device-width,initial-scale=1,maximum-scale=1,shrink-to-fit=no',
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id: playlistId } = params
  if (!playlistId) {
    return json<LoaderData>({ error: 'No Playlist ID specified' })
  }

  const playlist = await getPlaylist(playlistId)
  console.log({ playlist })

  if (playlist instanceof Error) {
    return json<LoaderData>({ playlistId, error: playlist.message })
  }

  return json<LoaderData>({
    playlistId,
    playlist,
  })
}

export default () => {
  const { playlist, error } = useLoaderData<LoaderData>()

  if (error) {
    return <p>Error: {error}</p>
  }

  if (!playlist) {
    return <p>No Playlist Found</p>
  }

  return <Player playlist={playlist} />
}
