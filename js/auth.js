window.addEventListener("DOMContentLoaded", async () => {

  const isDashboard =
    window.location.pathname.includes("admin-dashboard.html")

  if (!isDashboard) return

  const { data, error } =
    await window.supabaseClient.auth.getSession()

  if (error) {
    console.error(error)
    return
  }

  if (!data.session) {
    window.location.replace("admin-login.html")
  }

})
