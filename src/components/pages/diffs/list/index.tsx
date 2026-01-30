import useSWR from 'swr'
import { Link } from 'wouter'
import { useLastViewed } from '../../../../hooks/useLastViewed'
import styles from './list.module.scss'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DiffsList = () => {
  const { data: hashes, error, isLoading } = useSWR<{ hash: string; time: string }[]>('/api/diffs', fetcher)
  const { lastViewedId } = useLastViewed('report')

  if (isLoading) {
    return <div className={styles.dashboardLayout}>Loading...</div>
  }

  if (error) {
    console.error('Failed to fetch diffs:', error)
    return <div className={styles.dashboardLayout}>Error loading data.</div>
  }

  return (
    <div className={styles.dashboardLayout}>
      <header className={styles.header}>
        <h1>Diff Reports</h1>
        <Link href="/">Back to Home</Link>
      </header>

      {!hashes || hashes.length === 0 ? (
        <div className={styles.card}>
          <p>No diff reports found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {hashes.map(({ hash, time }) => (
            <div key={hash} className={styles.card} style={{ position: 'relative' }}>
              {lastViewedId === hash && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  Last Viewed
                </div>
              )}
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Link href={`/diffs/${hash}`}>{hash.substring(0, 8)}...</Link>
                </h2>
              </div>
              <div className={styles.cardMeta}>
                <span>Time: {new Date(time).toLocaleString()}</span>
                <span>Hash: {hash}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
