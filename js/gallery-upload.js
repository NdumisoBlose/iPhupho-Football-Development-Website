// ─────────────────────────────────────────────
//  GALLERY UPLOAD — gallery-upload.js
//  Handles: drag-and-drop / click-to-select,
//  batch upload (images + videos) to Supabase
//  Storage + gallery_images table, and delete.
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  const dropZone  = document.getElementById("dropZone")
  const fileInput = document.getElementById("uploadInput")
  const uploadBtn = document.getElementById("uploadBtn")

  // Guard: upload UI is admin-only
  if (!dropZone || !fileInput || !uploadBtn) {
    console.log("Upload UI not found (admin only)")
    return
  }

  let selectedFiles = []

  // ── FILE SELECTION ──────────────────────────

  // Click on drop zone → open file picker
  dropZone.addEventListener("click", () => {
    fileInput.click()
  })

  // File picker selection
  fileInput.addEventListener("change", (e) => {
    selectedFiles = filterMedia(Array.from(e.target.files))
    updateDropZoneLabel()
  })

  // ── DRAG AND DROP ───────────────────────────

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropZone.classList.add("active")
  })

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("active")
  })

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault()
    dropZone.classList.remove("active")

    selectedFiles = filterMedia(Array.from(e.dataTransfer.files))
    // Sync the native input so any form validation still works
    fileInput.files = e.dataTransfer.files
    updateDropZoneLabel()
  })

  // ── UPLOAD ──────────────────────────────────

  uploadBtn.addEventListener("click", async () => {

    if (selectedFiles.length === 0) {
      alert("No files selected. Please choose at least one image or video.")
      return
    }

    uploadBtn.disabled = true
    uploadBtn.textContent = "Uploading…"

    let successCount = 0
    let failCount    = 0

    for (const file of selectedFiles) {

      // Unique file name to avoid collisions in the bucket
      const fileName = `${Date.now()}-${file.name}`

      // 1. Upload file to Supabase Storage
      const { error: uploadError } = await window.supabaseClient
        .storage
        .from("gallery")
        .upload(fileName, file)

      if (uploadError) {
        console.error(`Upload failed for "${file.name}":`, uploadError)
        failCount++
        continue
      }

      // 2. Retrieve the public URL
      const { data: urlData } = window.supabaseClient
        .storage
        .from("gallery")
        .getPublicUrl(fileName)

      // 3. Save record to the gallery_images table
      // Note: only image_url is inserted — add file_name + mime_type columns
      // to gallery_images if you want full video-vs-image rendering support.
      const { error: dbError } = await window.supabaseClient
        .from("gallery_images")
        .insert([{
          image_url: urlData.publicUrl,
        }])

      if (dbError) {
        console.error(`DB insert failed for "${file.name}":`, dbError)
        failCount++
        continue
      }

      successCount++
    }

    // Reset state
    selectedFiles = []
    fileInput.value = ""
    uploadBtn.disabled = false
    uploadBtn.textContent = "Upload"
    updateDropZoneLabel()

    if (failCount === 0) {
      alert(`Batch upload complete — ${successCount} file(s) uploaded.`)
    } else {
      alert(`Upload finished: ${successCount} succeeded, ${failCount} failed. Check the console for details.`)
    }

    // Refresh admin gallery
    loadAdminGallery()
  })

  // ── HELPERS ─────────────────────────────────

  // Only accept image/* and video/* files
  function filterMedia(files) {
    return files.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"))
  }

  // Give the user feedback about how many files are queued
  function updateDropZoneLabel() {
    const label = dropZone.querySelector(".drop-label") // optional element
    if (!label) return
    label.textContent = selectedFiles.length > 0
      ? `${selectedFiles.length} file(s) ready to upload`
      : "Click or drag files here"
  }

})

// ─────────────────────────────────────────────
//  ADMIN GALLERY — load & render
// ─────────────────────────────────────────────

async function loadAdminGallery() {

  const container = document.getElementById("adminGallery")
  if (!container) return

  const { data, error } = await window.supabaseClient
    .from("gallery_images")
    .select("*")
    .order("id", { ascending: false })   // newest first

  if (error) {
    console.error("Failed to load gallery:", error)
    return
  }

  container.innerHTML = ""

  data.forEach(item => {

    const card = document.createElement("div")
    card.className = "admin-card"

    // Detect video by URL extension (mp4, mov, webm, ogg, avi)
    const videoExts = /\.(mp4|mov|webm|ogg|avi)(\?|$)/i
    let media
    if (videoExts.test(item.image_url)) {
      media = document.createElement("video")
      media.src      = item.image_url
      media.controls = true
      media.muted    = true
    } else {
      media = document.createElement("img")
      media.src = item.image_url
      media.alt = "Gallery image"
    }

    const btn = document.createElement("button")
    btn.innerText = "Delete"
    btn.onclick   = () => deleteMedia(item.id, item.image_url)

    card.appendChild(media)
    card.appendChild(btn)
    container.appendChild(card)
  })
}

document.addEventListener("DOMContentLoaded", loadAdminGallery)

// ─────────────────────────────────────────────
//  DELETE — removes from Storage + DB
// ─────────────────────────────────────────────

async function deleteMedia(id, fileNameOrUrl) {

  // Prefer the stored file_name column; fall back to parsing the URL
  const fileName = fileNameOrUrl.includes("/")
    ? fileNameOrUrl.split("/").pop()
    : fileNameOrUrl

  // 1. Remove from Supabase Storage
  const { error: storageError } = await window.supabaseClient
    .storage
    .from("gallery")
    .remove([fileName])

  if (storageError) {
    console.error("Storage delete failed:", storageError)
    return
  }

  // 2. Remove record from DB
  const { error: dbError } = await window.supabaseClient
    .from("gallery_images")
    .delete()
    .eq("id", id)

  if (dbError) {
    console.error("DB delete failed:", dbError)
    return
  }

  // 3. Refresh the admin gallery UI
  loadAdminGallery()
}