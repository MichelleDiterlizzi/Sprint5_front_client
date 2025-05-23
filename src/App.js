import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <div>
            <h1>Welcome to Event Manager</h1>
            <p>This is the home page.</p>
          </div>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
