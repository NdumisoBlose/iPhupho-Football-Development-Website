window.addEventListener("DOMContentLoaded", async () => {

  const gallery = document.getElementById("gallery")
  if (!gallery) return

  window.loadGallery = async () => {

    const { data } =
      await window.supabaseClient
        .from("gallery_images")
        .select("*")

    gallery.innerHTML = ""

    data.forEach(img => {
      const el = document.createElement("img")
      el.src = img.image_url
      gallery.appendChild(el)
    })
  }

  await loadGallery()
})
