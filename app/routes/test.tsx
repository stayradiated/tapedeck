import type { LinksFunction } from '@remix-run/node'

import styles from '../components/styles.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
]

const route = () => {
  return  (
    <div id="tridiv">
      <div className="scene">
        <div className="shape cuboid-1 cub-1">
          <div className="face ft"></div>
          <div className="face bk"></div>
          <div className="face rt"></div>
          <div className="face lt"></div>
          <div className="face bm"></div>
          <div className="face tp"></div>
        </div>
      </div>
    </div>
  )
}

export default route
