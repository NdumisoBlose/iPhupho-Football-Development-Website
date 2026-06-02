window.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn")

  if (!logoutBtn) return

  logoutBtn.addEventListener("click", async () => {

    // Sign out
    await window.supabaseClient.auth.signOut()

    // Clear storage
    localStorage.clear()

    // IMPORTANT: kill any running loops
    window.stop()

    // Redirect safely
    window.location.replace("admin-login.html")
  })

})
