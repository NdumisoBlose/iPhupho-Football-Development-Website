window.addEventListener("DOMContentLoaded", async () => {

  // Protect dashboard page only
  const isDashboard =
    window.location.pathname.includes("admin-dashboard.html")

  if (isDashboard) {

    const { data, error } =
      await window.supabaseClient.auth.getSession()

    if (error) {
      console.error(error)
      return
    }

    // No session → redirect to login
    if (!data.session) {
      window.location.replace("admin-login.html")
      return
    }
  }

})
