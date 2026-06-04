import { getSiteUrl } from '@/lib/site'

export default function Head() {
  const siteUrl = getSiteUrl()

  return (
    <>
      <title>Terms of Service | Omnivy</title>
      <meta
        name="description"
        content="Review the terms that apply to Omnivy Web Clipper and its connected cloud services."
      />
      <link rel="canonical" href={`${siteUrl}/terms-of-service`} />
    </>
  )
}