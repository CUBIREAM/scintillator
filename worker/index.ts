export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/diffs') {
      const listed = await env.VRT_R2_BUCKET.list({ prefix: 'runs/' })

      console.log(listed)

      const hashes = new Set<string>()
      for (const object of listed.objects) {
        const parts = object.key.split('/')
        if (parts.length >= 3 && parts[0] === 'runs' && parts[2] === 'diff') {
          hashes.add(parts[1])
        }
      }

      return Response.json(Array.from(hashes))
    }

    const matchDetail = url.pathname.match(/^\/api\/diffs\/([^/]+)$/)
    if (matchDetail) {
      const hash = matchDetail[1]
      const prefix = `runs/${hash}/diff/`
      const listed = await env.VRT_R2_BUCKET.list({ prefix })

      const files = listed.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
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
