document.addEventListener("DOMContentLoaded", () => {

  const uploadBtn = document.getElementById("uploadBtn")
  const uploadInput = document.getElementById("uploadInput")

  if (!uploadBtn || !uploadInput) {
    console.log("Upload elements not found (expected in admin only)")
    return
  }

  uploadBtn.addEventListener("click", async () => {

    const file = uploadInput.files[0]
    if (!file) return

    const fileName = `${Date.now()}-${file.name}`

    const { error: uploadError } =
      await window.supabaseClient.storage
        .from("gallery")
        .upload(fileName, file)

    if (uploadError) {
      console.error(uploadError)
      return
    }

    const { data } =
      window.supabaseClient.storage
        .from("gallery")
        .getPublicUrl(fileName)

    await window.supabaseClient
      .from("gallery_images")
      .insert([{ image_url: data.publicUrl }])

    alert("Upload successful")
  })

})
