import { useEffect } from 'react'
import useSWR from 'swr'
import { Link, useRoute } from 'wouter'
import { useLastViewed } from '../../../../hooks/useLastViewed'
import styles from './detail.module.scss'

interface FileObject {
  key: string
  size: number
  diffUrl?: string
  currentUrl: string
  uploaded: string
  isNew?: boolean
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DiffDetail = () => {
  const [, params] = useRoute('/diffs/:hash')
  const hash = params?.hash

  const { data: files, error, isLoading } = useSWR<FileObject[]>(hash ? `/api/diffs/${hash}` : null, fetcher)
  const {
    data: newFiles,
    error: newError,
    isLoading: isNewLoading
  } = useSWR<FileObject[]>(hash ? `/api/diffs/${hash}/new` : null, fetcher)
  const { markVisited: markReportVisited } = useLastViewed('report')
  const { lastViewedId: lastViewedImageKey } = useLastViewed('image')

  useEffect(() => {
    if (hash) {
      markReportVisited(hash)
    }
  }, [hash, markReportVisited])

  if (isLoading || isNewLoading) {
    return <div className={styles.dashboardLayout}>Loading details...</div>
  }

  if (error || newError || !files) {
    console.error('Failed to fetch diff details:', error || newError)
    return <div className={styles.dashboardLayout}>Error loading details.</div>
  }

  const allFiles = [...files, ...(newFiles || [])]
  const totalSize = allFiles.reduce((acc, file) => acc + file.size, 0)
  const formattedSize = (totalSize / 1024 / 1024).toFixed(2) // MB

  const imageFiles = files.filter((file) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.key))
  const newImageFiles = (newFiles || []).filter((file) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.key))

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
          <div className={styles.value}>{allFiles.length}</div>
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

      {imageFiles.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Diff Images
          </h2>
          <div className={styles.imageGrid}>
            {imageFiles.map((file) => {
              const isLastViewed = lastViewedImageKey === file.key
              return (
                <div
                  key={file.key}
                  className={styles.imageCard}
                  style={isLastViewed ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px var(--primary)' } : {}}
                >
                  <div className={styles.imagePreview}>
                    <Link href={`/diffs/${hash}/${encodeURIComponent(file.key.split('/').pop()!)}`}>
                      <img
                        className={styles.currentImage}
                        src={file.currentUrl}
                        alt={file.key.split('/').pop()}
                        loading="lazy"
                        style={{ cursor: 'pointer' }}
                      />
                      <img
                        className={styles.diffImage}
                        src={file.diffUrl}
                        alt={file.key.split('/').pop()}
                        loading="lazy"
                        style={{ cursor: 'pointer' }}
                      />
                    </Link>
                  </div>
                  <div className={styles.imageMeta}>
                    <div className={styles.imageName} title={file.key.split('/').pop()}>
                      {isLastViewed && (
                        <span
                          style={{
                            color: 'var(--primary)',
                            marginRight: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          ●
                        </span>
                      )}
                      <Link
                        href={`/diffs/${hash}/${encodeURIComponent(file.key.split('/').pop()!)}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {file.key.split('/').pop()}
                      </Link>
                    </div>
                    <div className={styles.imageSize}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {newImageFiles.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1rem', color: 'var(--text-main)' }}>
            New Components
          </h2>
          <div className={styles.imageGrid} style={{ marginBottom: '2rem' }}>
            {newImageFiles.map((file) => {
              const isLastViewed = lastViewedImageKey === file.key
              return (
                <div
                  key={file.key}
                  className={styles.imageCard}
                  style={isLastViewed ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 2px var(--primary)' } : {}}
                >
                  <div className={styles.imagePreview}>
                    <img
                      className={styles.currentImage}
                      src={file.currentUrl}
                      alt={file.key.split('/').pop()}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.imageMeta}>
                    <div className={styles.imageName} title={file.key.split('/').pop()}>
                      <span
                        style={{
                          background: '#e6fffa',
                          color: '#2c7a7b',
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          marginRight: '0.5rem',
                          fontWeight: 'bold',
                          verticalAlign: 'middle'
                        }}
                      >
                        NEW
                      </span>
                      {file.key.split('/').pop()}
                    </div>
                    <div className={styles.imageSize}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
              )
            })}
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
        {allFiles.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No files found for this report.
          </div>
        ) : (
          allFiles.map((file) => (
            <div key={file.key} className={styles.tableRow}>
              <div className={styles.fileName}>
                {file.isNew && (
                  <span
                    style={{
                      background: '#e6fffa',
                      color: '#2c7a7b',
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      marginRight: '0.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    NEW
                  </span>
                )}
                {/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.key) && !file.isNew ? (
                  <Link
                    href={`/diffs/${hash}/${encodeURIComponent(file.key.split('/').pop()!)}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {file.key.split('/').pop()}
                  </Link>
                ) : (
                  <a
                    href={file.isNew ? file.currentUrl : file.diffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {file.key.split('/').pop()}
                  </a>
                )}
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
