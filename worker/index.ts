export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/diffs') {
      const listed = await env.VRT_R2_BUCKET.list({ prefix: 'runs/' })

      const hashesMap = new Map<string, { hash: string; time: string }>()

      for (const object of listed.objects) {
        const parts = object.key.split('/')
        if (parts.length >= 3 && parts[0] === 'runs' && parts[2] === 'diff') {
          const hashVal = parts[1]
          if (!hashesMap.has(hashVal)) {
            hashesMap.set(hashVal, { hash: hashVal, time: object.uploaded.toISOString() })
          }
        }
      }

      return Response.json(Array.from(hashesMap.values()))
    }

    const matchDetail = url.pathname.match(/^\/api\/diffs\/([^/]+)$/)
    if (matchDetail) {
      const hash = matchDetail[1]
      const prefix = `runs/${hash}/diff/`
      const listed = await env.VRT_R2_BUCKET.list({ prefix })

      const files = listed.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        diffUrl: `${env.BUCKET_ORIGIN}/${obj.key}`,
        currentUrl: `${env.BUCKET_ORIGIN}/${obj.key.replace('/diff/', '/current/')}`,
        uploaded: obj.uploaded
      }))

      return Response.json(files)
    }

    const matchNew = url.pathname.match(/^\/api\/diffs\/([^/]+)\/new$/)
    if (matchNew) {
      const hash = matchNew[1]
      const currentPrefix = `runs/${hash}/current/`
      const referencePrefix = 'references/'

      const [currentListed, referenceListed] = await Promise.all([
        env.VRT_R2_BUCKET.list({ prefix: currentPrefix }),
        env.VRT_R2_BUCKET.list({ prefix: referencePrefix })
      ])

      const referenceFiles = new Set(
        referenceListed.objects
          .filter((obj) => obj.key.startsWith(referencePrefix))
          .map((obj) => obj.key.slice(referencePrefix.length))
      )

      const newFiles = currentListed.objects
        .filter((obj) => {
          const filename = obj.key.replace(currentPrefix, '')
          return !referenceFiles.has(filename)
        })
        .map((obj) => ({
          key: obj.key,
          size: obj.size,
          currentUrl: `${env.BUCKET_ORIGIN}/${obj.key}`,
          uploaded: obj.uploaded,
          isNew: true
        }))

      return Response.json(newFiles)
    }

    if (url.pathname === '/api/references') {
      const listed = await env.VRT_R2_BUCKET.list({ prefix: 'references/' })

      const files = listed.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        url: `${env.BUCKET_ORIGIN}/${obj.key}`,
        uploaded: obj.uploaded
      }))

      return Response.json(files)
    }

    if (url.pathname.startsWith('/api/')) {
      return Response.json({
        name: 'Cloudflare'
      })
    }

    return new Response(null, { status: 404 })
  }
} satisfies ExportedHandler<Env>
