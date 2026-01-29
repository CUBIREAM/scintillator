import { Link } from 'wouter'
import styles from './about.module.scss'

export const About = () => (
  <div className={styles.container}>
    <h1>About</h1>
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
    </nav>
  </div>
)
