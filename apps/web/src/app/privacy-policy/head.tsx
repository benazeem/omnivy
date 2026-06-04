import { getSiteUrl } from '@/lib/site'

export default function Head() {
  const siteUrl = getSiteUrl()

  return (
    <>
      <title>Privacy Policy | Omnivy</title>
      <meta
        name="description"
        content="Read how Omnivy handles identity data, clipped content, settings, and cloud provider access."
      />
      <link rel="canonical" href={`${siteUrl}/privacy-policy`} />
    </>
  )
}