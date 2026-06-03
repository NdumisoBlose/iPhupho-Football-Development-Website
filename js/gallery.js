window.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("gallery")

  if (!container) return

  const { data, error } =
    await window.supabaseClient
      .from("gallery_images")
      .select("*")
      .order("uploaded_at", { ascending: false })

  if (error) {
    console.error(error)
    
  }

  container.innerHTML = ""

  data.forEach(img => {

    const el = document.createElement("img")

    el.src = img.image_url
    el.loading = "lazy"

    container.appendChild(el)
  })
})
