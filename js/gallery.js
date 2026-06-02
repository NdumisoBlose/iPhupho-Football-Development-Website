document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById('gallery')
  if (!container) return

  const { data, error } = await window.supabaseClient
    .from('gallery_images')
    .select('*')

  if (error) {
    console.error(error)
    
  }

  container.innerHTML = data.map(img => `
    <img src="${img.image_url}" loading="lazy" />
  `).join('')
})
