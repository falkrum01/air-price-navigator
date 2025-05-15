
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add custom styles for the hero section and gradient text
const style = document.createElement('style');
style.textContent = `
  .hero-pattern {
    background-color: #0a3d62;
    position: relative;
  }
  
  .gradient-text {
    background: linear-gradient(90deg, #0a3d62, #60a3bc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
