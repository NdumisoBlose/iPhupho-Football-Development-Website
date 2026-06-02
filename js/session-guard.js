window.addEventListener("DOMContentLoaded", async () => {

  // Listen for ALL auth state changes
  window.supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      // SESSION EXPIRED OR USER SIGNED OUT
      if (!session) {

        console.warn("Session expired or invalid")

        // Clear local fallback session
        localStorage.removeItem("session")

        // Redirect to login
        window.location.href = "admin-login.html"
      }

    }
  )

  // SAFETY CHECK ON PAGE LOAD
  const { data } =
    await window.supabaseClient.auth.getSession()

  if (!data.session) {

    localStorage.removeItem("session")

    window.location.href = "admin-login.html"
  }

})
