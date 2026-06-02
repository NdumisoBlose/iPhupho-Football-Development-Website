console.log("Supabase loading...")

const supabaseUrl = "https://veslqfjrjfzridzwavzu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlc2xxZmpyamZ6cmlkendhdnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzU1MDUsImV4cCI6MjA5NTkxMTUwNX0.Zp9y_cLr0ipTW6NRKVgl74YgTC6XszdrrkHXPJPDoWw"

function initSupabase() {

  if (!window.supabase) {
    console.error("Supabase CDN missing")
    return
  }

  const client = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
  )

  window.supabaseClient = client

  console.log("Supabase READY:", window.supabaseClient)
}

window.addEventListener("load", initSupabase)
