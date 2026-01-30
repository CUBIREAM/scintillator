import { Link } from 'wouter'
import styles from './home.module.scss'

export const Home = () => (
  <div className={styles.container}>
    <h1>Home</h1>
    <nav className={styles.nav}>
      <Link href="/about">About</Link>
      <br />
      <Link href="/diffs">Diff Reports</Link>
      <br />
      <Link href="/references">Reference Images</Link>
    </nav>
  </div>
)
