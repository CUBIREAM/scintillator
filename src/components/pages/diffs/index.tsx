import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import styles from './diffs.module.scss'

export const DiffsList = () => {
  const [hashes, setHashes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/diffs')
      .then((res) => res.json())
      .then((data) => {
        setHashes(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch diffs:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Diff Reports</h1>
      <div className={styles.list}>
        {hashes.length === 0 ? (
          <p>No diff reports found.</p>
        ) : (
          hashes.map((hash) => (
            <div key={hash} className={styles.item}>
              <Link href={`/diffs/${hash}`}>Report: {hash}</Link>
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  )
}
