window.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn")

  if (!logoutBtn) {
    console.warn("Logout button not found")
    return
  }

  logoutBtn.addEventListener("click", async () => {

    // 1. Supabase logout
    const { error } =
      await window.supabaseClient.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return
    }

    // 2. Clear local session storage
    localStorage.removeItem("session")

    // 3. Redirect to login
    window.location.href = "admin-login.html"
  })

})
