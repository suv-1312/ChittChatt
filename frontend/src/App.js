import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import ChatProvider from './Context/ChatProvider';

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className='App'>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
        </div>
      </ChatProvider>
    </BrowserRouter>
  )
}

export default App;