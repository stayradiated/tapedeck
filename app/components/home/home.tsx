import { Link } from '@remix-run/react'

import type { Playlist } from '../../database.server'

type HomeProps = {
  playlists: Playlist[]
}

const Home = (props: HomeProps) => {
  const { playlists } = props

  return (
    <main className="home">
      <h1>Tapedeck</h1>

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link to={`./${playlist.id}`} className="playlist-link">
              {playlist.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export { Home }
