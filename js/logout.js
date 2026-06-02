window.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("logoutBtn")
  if (!btn) return

  btn.addEventListener("click", async () => {

    await window.supabaseClient.auth.signOut()

    localStorage.clear()

    window.location.replace("admin-login.html")
  })

})
