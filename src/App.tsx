import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoginModal } from './components/LoginModal'
import { AppState, useApp } from './lib/app-state'
import { LessonPage } from './pages/LessonPage'
import { Panel } from './pages/Panel'

function Routed() {
  const { student } = useApp()
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Panel />} />
          <Route path="/clase/:id" element={<LessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      {!student && <LoginModal />}
    </>
  )
}

export default function App() {
  return (
    <AppState>
      <BrowserRouter>
        <Routed />
      </BrowserRouter>
    </AppState>
  )
}
