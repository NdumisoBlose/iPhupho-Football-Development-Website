window.addEventListener("load", async () => {

  if (!window.supabaseClient) return

  const container = document.getElementById('gallery')
  if (!container) return

  const { data, error } = await window.supabaseClient
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  container.innerHTML = ""

  data.forEach(img => {
    const el = document.createElement('img')
    el.src = img.image_url
    el.loading = "lazy"
    container.appendChild(el)
  })
})
