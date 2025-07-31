/**
 * 애플리케이션 진입점 (Entry Point)
 * - React 앱을 브라우저의 DOM에 마운트하는 역할
 * - index.html의 'root' div에 App 컴포넌트를 렌더링
 * - StrictMode로 개발 중 잠재적 문제들을 감지
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // 전역 CSS 스타일 (Tailwind CSS 포함)
import App from './App.jsx'  // 메인 App 컴포넌트

// React 18의 새로운 createRoot API 사용
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
