console.log("Loading Supabase...")

const supabaseUrl = "https://veslqfjrjfzridzwavzu.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlc2xxZmpyamZ6cmlkendhdnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzU1MDUsImV4cCI6MjA5NTkxMTUwNX0.Zp9y_cLr0ipTW6NRKVgl74YgTC6XszdrrkHXPJPDoWw"

// initialize client
const client = window.supabase.createClient(supabaseUrl, supabaseKey)

if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase CDN not loaded correctly")
    return
  }
// expose globally
window.supabaseClient = client

console.log("Supabase ready:", window.supabaseClient)
}

// run safely after page load
window.addEventListener("DOMContentLoaded", initSupabase)
console.log("Supabase initialized successfully")
