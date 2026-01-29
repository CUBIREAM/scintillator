import { useEffect, useState } from 'react'
import { Link, useRoute } from 'wouter'
import styles from './diffs.module.scss'

interface FileObject {
  key: string
  size: number
  uploaded: string
}

export const DiffDetail = () => {
  const [, params] = useRoute('/diffs/:hash')
  const hash = params?.hash
  const [files, setFiles] = useState<FileObject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hash) return

    fetch(`/api/diffs/${hash}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch diff details:', err)
        setLoading(false)
      })
  }, [hash])

  if (loading) {
    return <div className={styles.container}>Loading details...</div>
  }

  return (
    <div className={styles.container}>
      <Link href="/diffs" className={styles.backLink}>
        &larr; Back to List
      </Link>
      <h1 className={styles.title}>Report Detail: {hash}</h1>
      <div className={styles.list}>
        {files.length === 0 ? (
          <p>No files found for this report.</p>
        ) : (
          files.map((file) => (
            <div key={file.key} className={styles.item}>
              <div>{file.key.split('/').pop()}</div>
              <div className={styles.meta}>
                Size: {file.size} bytes | Uploaded: {new Date(file.uploaded).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
