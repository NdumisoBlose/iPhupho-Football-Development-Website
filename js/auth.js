window.addEventListener("load", async () => {

  const session = JSON.parse(
    localStorage.getItem("session")
  )

  if (!session) {
    window.location.href = "admin-login.html"
    
  }

  await window.supabaseClient.auth.setSession(session)
})
