import React from 'react'
import styles from './footer.css'

export default () => (
  <footer className={styles.root}>
    <p>
      Data from <a href="http://bin.arnastofnun.is/" target="_blank">Beygingarlýsing íslensks nútímamáls</a> and <a href="https://github.com/vthorsteinsson/Reynir" target="_blank">Reynir</a>.
    </p>
    <p>
      tala.islensku is an experimental project by <a href="http://davidblurton.com" target="_blank">David Blurton</a>.
    </p>
    <p>
      Follow <a href="https://twitter.com/talaislensku">@talaislensku</a> for updates.
    </p>
  </footer>
)
