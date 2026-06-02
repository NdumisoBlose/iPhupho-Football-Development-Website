document.addEventListener("DOMContentLoaded", () => {

  const uploadBtn = document.getElementById('uploadBtn')
  const uploadInput = document.getElementById('uploadInput')

  if (!uploadBtn || !uploadInput) {
    console.error("Upload elements missing")
    
  }

  uploadBtn.addEventListener('click', async () => {

    const file = uploadInput.files[0]
    if (!file) return alert("Select a file")

    const fileName = `${Date.now()}-${file.name}`

    // 1. Upload to Storage
    const { error: uploadError } = await window.supabaseClient.storage
      .from('gallery')
      .upload(fileName, file)

    if (uploadError) {
      console.error(uploadError)
      return alert("Upload failed")
    }

    // 2. Get Public URL
    const { data } = window.supabaseClient.storage
      .from('gallery')
      .getPublicUrl(fileName)

    // 3. Insert into DB
    const { error: dbError } = await window.supabaseClient
      .from('gallery_images')
      .insert([{ image_url: data.publicUrl }])

    if (dbError) {
      console.error(dbError)
      return alert("Database insert failed")
    }

    alert("Upload successful")
    const container = document.getElementById('gallery')

const newImage = document.createElement('img')
newImage.src = data.publicUrl
newImage.loading = "lazy"

container.prepend(newImage)
  })

})
