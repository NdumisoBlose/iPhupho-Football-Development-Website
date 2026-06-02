window.addEventListener("load", async () => {

  // HARD SAFETY CHECK
  if (!window.supabaseClient) {
    console.error("Supabase not ready")
    return
  }

  const container = document.getElementById('gallery')
  if (!container) return

  const { data, error } = await window.supabaseClient
    .from('gallery_images')
    .select('*')

  if (error) {
    console.error(error)
    return
  }

  container.innerHTML = data.map(img => `
    <img src="${img.image_url}" />
  `).join('')
})
