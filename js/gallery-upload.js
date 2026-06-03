window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("uploadBtn")
  const input = document.getElementById("uploadInput")

  if (!btn || !input) return

  btn.addEventListener("click", async () => {

    const file = input.files[0]
    if (!file) return alert("Select a file")

    const fileName = `${Date.now()}-${file.name}`

    // upload to storage
    const { error: uploadError } =
      await window.supabaseClient.storage
        .from("gallery")
        .upload(fileName, file)

    if (uploadError) return console.error(uploadError)

    // public URL
    const { data } =
      window.supabaseClient.storage
        .from("gallery")
        .getPublicUrl(fileName)

    // database insert
    const { error: dbError } =
      await window.supabaseClient
        .from("gallery_images")
        .insert([{ image_url: data.publicUrl }])

    if (dbError) return console.error(dbError)

    alert("Upload successful")
  })
})
