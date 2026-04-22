import { create } from 'zustand'
import { DEEPSEEK_API_URL, HEADERS } from './constants'
//  从浏览器的 localStorage 里读取历史记录，返回一个数组。

// 为什么放在组件外面（store 文件的最顶层）？
// 原因1：这个函数只需要执行一次
// 原因2：保持 store 干净
// 原因3：可以在任何地方复用
const loadHistoryFromStorage = () => {
  try {
    // 从浏览器硬盘里读取 key 为 'history' 的数据
    const history = localStorage.getItem('history')
    if (history) {
      const parsedHistory = JSON.parse(history)
      // 检查转出来的东西是不是数组（防止数据被篡改）
      return Array.isArray(parsedHistory) ? parsedHistory : []
    }
  }
  // 如果解析失败（比如 JSON 格式错了），返回空数组
  catch (error) {
    console.error('初始化历史记录失败:', error)
  }
  return []
}
// set修改 get获取
const useStore = create((set, get) => ({
  question: '',
  response: [],
  isLoading: false,
  recentHistory: loadHistoryFromStorage(),
  darkMode: 'dark',

  // 这啥78语法？  这里实际上简写了  set({ question: question })
  setQuestion: (question) => set({ question }),

  setDarkMode: (darkMode) => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // 修改store里的状态
    set({ darkMode })
  },
  // 把用户的问题添加到历史记录。
  // 逻辑不懂？
  addToHistory: (q) => {
    // 这句啥意思  // 直接从 get() 返回的对象里取出 recentHistory 
    // get() 是 Zustand 提供的函数，返回整个 store 对象。
    const { recentHistory } = get()
    try {
      if (localStorage.getItem('history')) {
        let history = JSON.parse(localStorage.getItem('history'))
        // includes是哪里的语法
        if (!history.includes(q)) {
          history = [q, ...history]
          localStorage.setItem('history', JSON.stringify(history))
          set({ recentHistory: history })
        }
      } else {
        localStorage.setItem('history', JSON.stringify([q]))
        set({ recentHistory: [q] })
      }
    } catch (error) {
      console.error('存储历史记录失败:', error)
      if (!recentHistory.includes(q)) {
        set({ recentHistory: [q, ...recentHistory] })
      }
    }
  },
  // 所以状态管理的本质是什么？先改变数据然后改变状态吗
  // 更新状态是告诉让别人用的时候能用到最新的数据
  clearHistory: () => {
    localStorage.setItem('history', JSON.stringify([]))
    set({ recentHistory: [] })
  },
  clearSelectedHistory: (selectedItem) => {
    let history = JSON.parse(localStorage.getItem('history'))
    // 筛选不等于 selectedItem 的项
    history = history.filter(item => item !== selectedItem)
    set({ recentHistory: history })
    localStorage.setItem('history', JSON.stringify(history))
  },

  askQuestion: async (questionText, addToHistory = true) => {
    const { question, response, addToHistory: addToHist } = get()
    const q = questionText || question
    if (!q.trim()) return

    if (addToHistory) {
      addToHist(q)
    }

    set({ isLoading: true })

    try {
      const fetchResponse = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: q }
          ],
          stream: false
        })
      })

      if (!fetchResponse.ok) {
        throw new Error(`API Error: ${fetchResponse.status}`)
      }

      const data = await fetchResponse.json()
      const dataString = data.choices[0].message.content
      const dataArray = dataString.split('###').map(item => item.trim())

      set((state) => ({
        response: [...state.response, { type: 'q', text: q }, { type: 'a', text: dataArray }]
      }))
      if (!questionText) set({ question: '' })
    } catch (error) {
      set({ response: [...response, { type: 'error', text: ['错误: ' + error.message] }] })
    } finally {
      set({ isLoading: false })
    }
  }
}))

export default useStore