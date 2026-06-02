window.addEventListener("DOMContentLoaded", () => {

  const uploadBtn = document.getElementById("uploadBtn")
  const uploadInput = document.getElementById("uploadInput")
  const status = document.getElementById("uploadStatus")

  // SAFETY CHECK (prevents null errors)
  if (!uploadBtn || !uploadInput) {
    console.warn("Upload elements not found (expected in admin only)")
    return
  }

  uploadBtn.addEventListener("click", async () => {

    const file = uploadInput.files[0]

    if (!file) {
      alert("Please select a file")
      return
    }

    const fileName = `${Date.now()}-${file.name}`

    // -------------------------
    // 1. UPLOAD TO STORAGE
    // -------------------------
    const { error: uploadError } =
      await window.supabaseClient
        .storage
        .from("gallery")
        .upload(fileName, file)

    if (uploadError) {
      console.error(uploadError)
      status.textContent = "Upload failed"
      return
    }

    // -------------------------
    // 2. GET PUBLIC URL
    // -------------------------
    const { data } =
      window.supabaseClient
        .storage
        .from("gallery")
        .getPublicUrl(fileName)

    // -------------------------
    // 3. INSERT INTO DATABASE
    // -------------------------
    const { error: dbError } =
      await window.supabaseClient
        .from("gallery_images")
        .insert([
          {
            image_url: data.publicUrl
          }
        ])

    if (dbError) {
      console.error(dbError)
      status.textContent = "Database insert failed"
      return
    }

    status.textContent = "Upload successful"

    // -------------------------
    // 4. REFRESH CMS GALLERY
    // -------------------------
    if (typeof loadGallery === "function") {
      loadGallery()
    }

  })
})
