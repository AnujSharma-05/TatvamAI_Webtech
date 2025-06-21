import { RouterProvider } from 'react-router-dom';
import { router }from "./routes/routes";
import { AuthProvider } from './context/AuthContext';
import './App.css'

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* Add any global styles or components here */}
      <div className="app-container">
        {/* Your app content will be rendered here */}
      </div>
    </>
  )
}

export default App
