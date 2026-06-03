document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn")

  if (!loginBtn) return

  loginBtn.addEventListener("click", async () => {

    const email =
      document.getElementById("email").value

    const password =
      document.getElementById("password").value

    const { data, error } =
      await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      })

    if (error) {
      console.error(error)
      alert("Login failed")
      return
    }

    alert("Login successful")

    window.location.href = "admin-dashboard.html"

  })

})
