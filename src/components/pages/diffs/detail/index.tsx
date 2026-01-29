import useSWR from 'swr'
import { Link, useRoute } from 'wouter'
import styles from './detail.module.scss'

interface FileObject {
  key: string
  size: number
  url: string
  uploaded: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DiffDetail = () => {
  const [, params] = useRoute('/diffs/:hash')
  const hash = params?.hash

  const { data: files, error, isLoading } = useSWR<FileObject[]>(hash ? `/api/diffs/${hash}` : null, fetcher)

  if (isLoading) {
    return <div className={styles.dashboardLayout}>Loading details...</div>
  }

  if (error || !files) {
    console.error('Failed to fetch diff details:', error)
    return <div className={styles.dashboardLayout}>Error loading details.</div>
  }

  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const formattedSize = (totalSize / 1024 / 1024).toFixed(2) // MB

  // Filter for image files
  const imageFiles = files.filter((file) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.key))

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.detailHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/diffs">Diffs</Link> / <span>{hash}</span>
        </div>
        <div className={styles.header} style={{ marginBottom: 0 }}>
          <h1>Report Detail</h1>
          <Link href="/diffs">Back to List</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.label}>Total Files</div>
          <div className={styles.value}>{files.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Total Size</div>
          <div className={styles.value}>{formattedSize} MB</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>Hash</div>
          <div className={styles.value} style={{ fontSize: '1rem', wordBreak: 'break-all' }}>
            {hash}
          </div>
        </div>
      </div>

      {/* Image Grid Section */}
      {imageFiles.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Diff Images
          </h2>
          <div className={styles.imageGrid}>
            {imageFiles.map((file) => (
              <div key={file.key} className={styles.imageCard}>
                <div className={styles.imagePreview}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    <img src={file.url} alt={file.key.split('/').pop()} loading="lazy" />
                  </a>
                </div>
                <div className={styles.imageMeta}>
                  <div className={styles.imageName} title={file.key.split('/').pop()}>
                    {file.key.split('/').pop()}
                  </div>
                  <div className={styles.imageSize}>{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-main)' }}>
        All Files
      </h2>
      <div className={styles.fileList}>
        <div className={styles.tableHeader}>
          <div>Filename</div>
          <div>Size</div>
          <div>Uploaded</div>
        </div>
        {files.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No files found for this report.
          </div>
        ) : (
          files.map((file) => (
            <div key={file.key} className={styles.tableRow}>
              <div className={styles.fileName}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {file.key.split('/').pop()}
                </a>
              </div>
              <div className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
              <div className={styles.fileDate}>{new Date(file.uploaded).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
