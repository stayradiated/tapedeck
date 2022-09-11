import type { LinksFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { errorListBoundary } from '@stayradiated/error-boundary'

import type { Playlist } from '../database.server'
import { getIndex, getPlaylist } from '../database.server'
import { Home, styles as homeStyles } from '../components/home'

type LoaderData = {
  playlists?: Playlist[]
  error?: string
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: homeStyles },
]

export const loader: LoaderFunction = async () => {
  const index = await getIndex()
  if (index instanceof Error) {
    return json<LoaderData>({ error: index.message })
  }

  const playlists = await errorListBoundary(async () =>
    Promise.all(
      index.playlists.map(async (playlistId) => {
        const playlist = await getPlaylist(playlistId)
        return playlist
      }),
    ),
  )

  if (playlists instanceof Error) {
    return json<LoaderData>({ error: playlists.message })
  }

  return json<LoaderData>({
    playlists,
  })
}

const route = () => {
  const { playlists, error } = useLoaderData<LoaderData>()

  if (typeof error === 'string' || !playlists) {
    return <p>{error ?? 'Could not load playlists.'}</p>
  }

  return <Home playlists={playlists} />
}

export default route
