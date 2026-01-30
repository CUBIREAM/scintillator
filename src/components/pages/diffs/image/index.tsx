import { ImgComparisonSlider } from '@img-comparison-slider/react'
import useSWR from 'swr'
import { Link, useRoute } from 'wouter'
import styles from './image.module.scss'

interface FileObject {
  key: string
  size: number
  diffUrl: string
  currentUrl: string
  uploaded: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const DiffImage = () => {
  const [, params] = useRoute('/diffs/:hash/:filename')
  const hash = params?.hash
  const filename = params?.filename ? decodeURIComponent(params.filename) : ''

  const { data: files, error, isLoading } = useSWR<FileObject[]>(hash ? `/api/diffs/${hash}` : null, fetcher)

  if (isLoading) {
    return <div className={styles.dashboardLayout}>Loading image...</div>
  }

  if (error || !files) {
    return <div className={styles.dashboardLayout}>Error loading data.</div>
  }

  const file = files.find((f) => f.key.endsWith(`/${filename}`))

  if (!file) {
    return (
      <div className={styles.dashboardLayout}>
        <div className={styles.detailHeader}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link> / <Link href="/diffs">Diffs</Link> / <Link href={`/diffs/${hash}`}>{hash}</Link>{' '}
            / <span>Not Found</span>
          </div>
        </div>
        <p>File not found: {filename}</p>
        <Link href={`/diffs/${hash}`}>Back to Report</Link>
      </div>
    )
  }

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.detailHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/diffs">Diffs</Link> / <Link href={`/diffs/${hash}`}>{hash}</Link> /{' '}
          <span>{filename}</span>
        </div>
        <div className={styles.header}>
          <h1>{filename}</h1>
          <Link href={`/diffs/${hash}`}>Back to Report</Link>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <ImgComparisonSlider direction="vertical">
          <img slot="first" src={file.diffUrl} alt={filename} className={styles.diffImage} />
          <img slot="second" src={file.currentUrl} alt={filename} className={styles.diffImage} />
        </ImgComparisonSlider>
      </div>
      <div className={styles.metaSection}>
        <h2 className={styles.metaTitle}>Image Metadata</h2>
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <label>Filename</label>
            <span>{filename}</span>
          </div>
          <div className={styles.metaItem}>
            <label>Size</label>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>
          <div className={styles.metaItem}>
            <label>Uploaded</label>
            <span>{new Date(file.uploaded).toLocaleString()}</span>
          </div>
          <div className={styles.metaItem}>
            <label>Raw Source</label>
            <a href={file.currentUrl} target="_blank" rel="noopener noreferrer">
              Open Original
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
