window.addEventListener("DOMContentLoaded", async () => {

  const gallery = document.getElementById("gallery")
  if (!gallery) return

  window.loadGallery = async function () {

    const { data } =
      await window.supabaseClient
        .from("gallery_images")
        .select("*")

    gallery.innerHTML = ""

    data.forEach(img => {

      const div = document.createElement("div")

      div.innerHTML = `
        <img src="${img.image_url}" />
        <input value="${img.title || ''}" />
      `

      gallery.appendChild(div)
    })
  }

  await loadGallery()
})
