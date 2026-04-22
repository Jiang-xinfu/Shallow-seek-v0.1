import './index.css'
import './app.css'
import useStore from './store'
import Answer from './components/Answer.jsx'

function App() {
  // zustand解构
  const {
    question,
    setQuestion,
    response,
    isLoading,
    recentHistory,
    darkMode,
    setDarkMode,
    clearHistory,
    clearSelectedHistory,
    askQuestion
  } = useStore()

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // 这里传null为什么
      askQuestion(null, true)
    }
  }

  const handleHistoryClick = (item) => {
    askQuestion(item, false)
  }

  return (
    <div className={darkMode === 'dark' ? 'dark' : 'light'}>
      <div className={`grid grid-cols-5 h-screen text-center ${darkMode === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
        <select
          onChange={(e) => setDarkMode(e.target.value)}
          className={`fixed bottom-0 p-5 ${darkMode === 'dark' ? 'text-white' : 'text-zinc-800 bg-white border border-gray-200 rounded-lg'}`}
        >
          <option value="dark">深色模式</option>
          <option value="light">浅色模式</option>
        </select>
        {/* 左侧边栏 */}
        <div className={`col-span-1 ${darkMode === 'dark' ? 'bg-zinc-800' : 'bg-gray-100'}`}>
          {/* 左侧边栏头部 */}
          <div className={`p-2 border-b font-bold text-2xl flex justify-center ${darkMode === 'dark' ? 'text-white border-zinc-700' : 'text-zinc-800 border-gray-200'}`}>
            <span className='mr-2'>历史记录</span>
            <button onClick={clearHistory} className='cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={darkMode === 'dark' ? '#e3e3e3' : '#6b7280'}>
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </button>
          </div>
          {/* 历史记录 */}
          <ul className='text-left overflow-auto'>
            {recentHistory.length === 0 ? (
              <li className='text-zinc-500 p-2 text-sm pl-5'>暂无历史记录</li>
            ) : (
              recentHistory.map((item, index) => (
                <div key={index} className='flex justify-between pr-3 py-2'>
                  <li
                    onClick={() => handleHistoryClick(item)}
                    className={`w-full p-2 border-b last:border-0 hover:cursor-pointer truncate ${darkMode === 'dark' ? 'text-white border-zinc-700 hover:bg-zinc-700' : 'text-zinc-800 border-gray-200 hover:bg-gray-200'}`}
                  >
                    {item}
                  </li>
                  <button
                    onClick={() => clearSelectedHistory(item)}
                    className='cursor-pointer hover:bg-zinc-900 bg-zinc-700'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={darkMode === 'dark' ? '#e3e3e3' : '#6b7280'}>
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </ul>
        </div>
        {/* 右侧聊天区域 */}
        <div className={`col-span-4 p-10 flex flex-col h-full overflow-hidden ${darkMode === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <h1 className="ml-1 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient bg-[length:200%_200%] mb-8">
            我是Shallow seek，你可以问我任何问题
          </h1>

          <div className='flex-1 overflow-y-auto pr-2'>
            <div className={darkMode === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}>
              <ul className='space-y-4'>
                {response.map((item, index) => {
                  // 渲染问题
                  if (item.type === 'q') {
                    return (
                      <li key={index} className='flex justify-end'>
                        <div className='bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md'>
                          <div className='text-right font-medium'>{item.text}</div>
                        </div>
                      </li>
                    )
                  }
                  // 渲染回答
                  else if (item.type === 'a') {
                    return item.text.map((ansItem, ansIndex) => (
                      <li key={ansIndex} className='flex'>
                        <div className={`p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md ${darkMode === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                          <Answer ans={ansItem} totalresult={item.text.length} index={ansIndex} type={item.type} darkMode={darkMode} />
                        </div>
                      </li>
                    ))
                  }
                  // 渲染错误信息
                  else if (item.type === 'error') {
                    return (
                      <li key={index} className='flex'>
                        <div className={`p-4 rounded-2xl max-w-[80%] border ${darkMode === 'dark' ? 'bg-red-900/30 text-red-500 border-red-900/50' : 'bg-red-100 text-red-600 border-red-200'}`}>
                          错误: {item.text[0]}
                        </div>
                      </li>
                    )
                  }
                  return null
                })}
              </ul>
            </div>
          </div>
          {/* 输入框内容 */}
          <div className={`w-1/2 p-1 m-auto rounded-4xl border flex h-16 mt-6 ${darkMode === 'dark' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-800 border-gray-300'}`}>
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyPress}
              className='flex-1 h-full p-3 outline-none bg-transparent'
              placeholder='请输入搜索内容'
              disabled={isLoading}
            />
            <button
              onClick={() => askQuestion(null, true)}
              disabled={isLoading}
              className={`w-24 h-full transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed bg-blue-400 text-white rounded-r-4xl' : 'bg-blue-600 text-white hover:bg-blue-700 rounded-r-4xl'}`}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App