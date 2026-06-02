// ==============================
// CMS DASHBOARD CONTROLLER
// ==============================

window.addEventListener("load", async () => {

  // ==============================
  // 1. AUTH VALIDATION
  // ==============================

  const session = JSON.parse(
    localStorage.getItem("session")
  )

  if (!session) {
    window.location.href = "admin-login.html"
    return
  }

  await window.supabaseClient.auth.setSession(session)

  // ==============================
  // 2. UI ELEMENTS
  // ==============================

  const dropZone = document.getElementById("dropZone")
  const uploadInput = document.getElementById("uploadInput")
  const gallery = document.getElementById("gallery")
  const uploadStatus = document.getElementById("uploadStatus")

  // safety check
  if (
    !dropZone ||
    !uploadInput ||
    !gallery
  ) {
    console.error("Dashboard UI missing")
    return
  }

  // ==============================
  // 3. OPEN FILE PICKER
  // ==============================

  dropZone.addEventListener("click", () => {
    uploadInput.click()
  })

  // ==============================
  // 4. DRAGOVER EFFECT
  // ==============================

  dropZone.addEventListener("dragover", e => {

    e.preventDefault()

    dropZone.classList.add("dragover")
  })

  // ==============================
  // 5. DRAG LEAVE EFFECT
  // ==============================

  dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover")
  })

  // ==============================
  // 6. HANDLE FILE DROP
  // ==============================

  dropZone.addEventListener("drop", async e => {

    e.preventDefault()

    dropZone.classList.remove("dragover")

    const files = [...e.dataTransfer.files]

    for (const file of files) {
      await uploadCompressedImage(file)
    }

    await loadGallery()
  })

  // ==============================
  // 7. HANDLE FILE PICKER
  // ==============================

  uploadInput.addEventListener("change", async () => {

    const files = [...uploadInput.files]

    for (const file of files) {
      await uploadCompressedImage(file)
    }

    await loadGallery()
  })

  // ==============================
  // 8. IMAGE COMPRESSION + UPLOAD
  // ==============================

  async function uploadCompressedImage(file) {

    try {

      uploadStatus.textContent =
        `Compressing ${file.name}...`

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      // compress image
      const compressedFile =
        await imageCompression(
          file,
          options
        )

      uploadStatus.textContent =
        `Uploading ${file.name}...`

      const fileName =
        `${Date.now()}-${compressedFile.name}`

      // ==============================
      // STORAGE UPLOAD
      // ==============================

      const { error: uploadError } =
        await window.supabaseClient.storage
          .from("gallery")
          .upload(fileName, compressedFile)

      if (uploadError) {
        console.error(uploadError)
        uploadStatus.textContent =
          "Upload failed"
        return
      }

      // ==============================
      // GET PUBLIC URL
      // ==============================

      const { data } =
        window.supabaseClient.storage
          .from("gallery")
          .getPublicUrl(fileName)

      // ==============================
      // SAVE DATABASE RECORD
      // ==============================

      const { error: dbError } =
        await window.supabaseClient
          .from("gallery_images")
          .insert([
            {
              image_url: data.publicUrl,
              title: file.name,
              category: "general"
            }
          ])

      if (dbError) {
        console.error(dbError)
        uploadStatus.textContent =
          "Database insert failed"
        return
      }

      uploadStatus.textContent =
        "Upload successful"

    } catch (err) {

      console.error(err)

      uploadStatus.textContent =
        "Unexpected error"
    }
  }

  // ==============================
  // 9. LOAD GALLERY
  // ==============================

  async function loadGallery() {

    const { data, error } =
      await window.supabaseClient
        .from("gallery_images")
        .select("*")
        .order("uploaded_at", {
          ascending: false
        })

    if (error) {
      console.error(error)
      return
    }

    gallery.innerHTML = ""

    data.forEach(img => {

      // ==============================
      // CARD
      // ==============================

      const card =
        document.createElement("div")

      card.className = "gallery-card"

      card.innerHTML = `
        <img src="${img.image_url}" />

        <input
          type="text"
          value="${img.title || ""}"
          placeholder="Image title"
        />

        <select>
          <option value="general">
            General
          </option>

          <option value="training">
            Training
          </option>

          <option value="matches">
            Matches
          </option>

          <option value="events">
            Events
          </option>
        </select>

        <button>
          Delete Image
        </button>
      `

      // ==============================
      // ELEMENTS
      // ==============================

      const titleInput =
        card.querySelector("input")

      const categorySelect =
        card.querySelector("select")

      const deleteBtn =
        card.querySelector("button")

      categorySelect.value =
        img.category || "general"

      // ==============================
      // UPDATE TITLE
      // ==============================

      titleInput.addEventListener(
        "change",
        async () => {

          await window.supabaseClient
            .from("gallery_images")
            .update({
              title: titleInput.value
            })
            .eq("id", img.id)
        }
      )

      // ==============================
      // UPDATE CATEGORY
      // ==============================

      categorySelect.addEventListener(
        "change",
        async () => {

          await window.supabaseClient
            .from("gallery_images")
            .update({
              category: categorySelect.value
            })
            .eq("id", img.id)
        }
      )

      // ==============================
      // DELETE IMAGE
      // ==============================

      deleteBtn.addEventListener(
        "click",
        async () => {

          const confirmed =
            confirm(
              "Delete this image?"
            )

          if (!confirmed) return

          const fileName =
            img.image_url
              .split("/")
              .pop()

          // delete storage file
          await window.supabaseClient
            .storage
            .from("gallery")
            .remove([fileName])

          // delete db record
          await window.supabaseClient
            .from("gallery_images")
            .delete()
            .eq("id", img.id)

          await loadGallery()
        }
      )

      // ==============================
      // APPEND CARD
      // ==============================

      gallery.appendChild(card)
    })
  }

  // ==============================
  // 10. INITIAL LOAD
  // ==============================

  await loadGallery()

})
