import { fetchRocks } from "@/lib/api"

export default async function Rocks({ params }: { params: { slug: string } }) {
  const rocks = await fetchRocks().catch((error) => {
    console.error("Failed to load rocks:", error)
    return []
  })

  console.log("All rocks:", rocks)
  console.log("Looking for slug:", params.slug)
  console.log("Sample rock structure:", rocks[0])

  // Try to find by slug first, then by ID as fallback
  const rock = rocks.find((rock) => {
    // Check if slug matches
    if (rock.slug === params.slug) return true
    // Check if ID matches (in case slug is the ID)
    if (String(rock.id) === params.slug) return true
    // Check if slug is in the URL
    if (rock.url && rock.url.includes(params.slug)) return true
    return false
  })

  console.log("Found rock:", rock)

  if (!rock) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-medium">Rock not found</h1>
        <p>Slug: {params.slug}</p>
        <p>Total rocks: {rocks.length}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">{rock.name}</h1>
      <p>ID: {rock.id}</p>
      <p>Slug: {rock.slug || "No slug"}</p>
    </div>
  )
}
