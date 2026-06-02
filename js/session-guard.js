let isRedirecting = false

window.addEventListener("DOMContentLoaded", async () => {

  const { data } =
    await window.supabaseClient.auth.getSession()

  if (!data.session && !isRedirecting) {

    isRedirecting = true

    console.warn("No session - redirecting")

    window.location.replace("admin-login.html")
    return
  }

  window.supabaseClient.auth.onAuthStateChange(
    (event, session) => {

      if (!session && !isRedirecting) {

        isRedirecting = true

        console.warn("Session lost - redirecting")

        window.location.replace("admin-login.html")
      }

    }
  )

})
