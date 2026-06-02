document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn")

  if (!loginBtn) return

  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { data, error } =
      await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      alert("Login failed")
      console.error(error)
      return
    }

    window.location.replace("admin-dashboard.html")
  })

})
