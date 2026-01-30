import useSWR from 'swr'
import { Link } from 'wouter'
import styles from './references.module.scss'

interface FileObject {
  key: string
  size: number
  url: string
  uploaded: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const ReferencesList = () => {
  const { data: files, error, isLoading } = useSWR<FileObject[]>('/api/references', fetcher)

  if (isLoading) {
    return <div className={styles.dashboardLayout}>Loading references...</div>
  }

  if (error || !files) {
    console.error('Failed to fetch references:', error)
    return <div className={styles.dashboardLayout}>Error loading data.</div>
  }

  // Filter for image files
  const imageFiles = files.filter((file) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.key))

  return (
    <div className={styles.dashboardLayout}>
      <header className={styles.header}>
        <h1>Reference Images</h1>
        <Link href="/">Back to Home</Link>
      </header>

      {/* Image Grid Section */}
      {imageFiles.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Gallery
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
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.key.split('/').pop()}
                    </a>
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
            No reference files found.
          </div>
        ) : (
          files.map((file) => (
            <div key={file.key} className={styles.tableRow}>
              <div className={styles.fileName}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.key.replace('references/', '')}
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
