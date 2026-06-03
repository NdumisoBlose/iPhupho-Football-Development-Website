window.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("gallery")

  if (!container) {
    console.error("Gallery container missing")
    return
  }

  const { data, error } =
    await window.supabaseClient
      .from("gallery_images")
      .select("*")
      .order("uploaded_at", { ascending: false })

  if (error) {
    console.error("Failed to load gallery:", error)
    return
  }

  container.innerHTML = ""

  data.forEach(item => {

    const img = document.createElement("img")

    img.src = item.image_url
    img.alt = item.title || "Gallery image"
    img.loading = "lazy"

    container.appendChild(img)
  })
})
