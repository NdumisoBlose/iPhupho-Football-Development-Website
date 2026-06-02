// ONLY HERE
let redirecting = false

window.addEventListener("DOMContentLoaded", async () => {

  const { data } =
    await window.supabaseClient.auth.getSession()

  const session = data?.session

  if (!session && !redirecting) {
    redirecting = true
    window.location.replace("admin-login.html")
    return
  }

  window.supabaseClient.auth.onAuthStateChange((event, session) => {

    if (!session && !redirecting) {
      redirecting = true
      window.location.replace("admin-login.html")
    }

  })

})
const { data, error } = await window.supabaseClient.auth.getSession()

const session = data?.session

if (!session) {
  console.log("No active session")
  return
}

const token = session.access_token
