document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn =
    document.getElementById("logoutBtn")

  if (!logoutBtn) return

  logoutBtn.addEventListener("click", async () => {

    const { error } =
      await window.supabaseClient.auth.signOut()

    if (error) {
      console.error(error)
      alert("Logout failed")
      return
    }

    alert("Logged out successfully")

    window.location.replace("admin-login.html")

  })

})
