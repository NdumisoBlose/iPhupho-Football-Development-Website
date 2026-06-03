// gallery.js — public gallery renderer

window.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("gallery")

  if (!container) {
    console.error("Gallery container missing")
    return
  }

  const { data, error } = await window.supabaseClient
    .from("gallery_images")
    .select("*")
    .order("id", { ascending: false })

  if (error) {
    console.error("Failed to load gallery:", error)
    return
  }

  container.innerHTML = ""

  if (data.length === 0) {
    container.innerHTML = "<p>No media yet.</p>"
    return
  }

  // Detect video by URL extension
  const videoExts = /\.(mp4|mov|webm|ogg|avi)(\?|$)/i

  data.forEach(item => {

    const card = document.createElement("div")
    card.className = "gallery-card"

    if (videoExts.test(item.image_url)) {

      const video = document.createElement("video")
      video.src      = item.image_url
      video.controls = true
      video.muted    = true
      video.loop     = true
      video.playsInline = true
      video.loading  = "lazy"

      card.appendChild(video)

    } else {

      const img = document.createElement("img")
      img.src     = item.image_url
      img.alt     = item.title || "Gallery image"
      img.loading = "lazy"

      card.appendChild(img)
    }

    container.appendChild(card)
  })

})