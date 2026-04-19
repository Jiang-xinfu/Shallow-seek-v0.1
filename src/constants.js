export const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
}