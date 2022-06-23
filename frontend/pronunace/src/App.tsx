import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BaseTemplate from './components/PageLayout/BaseTemplate';
import DashboardPage from './pages/DashboardPage';
import ChallengesPage from './pages/ChallengesPage';
import PracticeWordsPage from './pages/PracticeWordsPage';
import PracticeSentencesPage from './pages/PracticeSentencesPage';
import LogoutPage from './pages/LogoutPage';
import RecorderTestPage from './pages/RecorderTestPage';


const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
            <BaseTemplate>
              <Routes>
                <Route element={<PrivateRoute><HomePage /></PrivateRoute>} path="/" />
                <Route element={<LoginPage />} path="/login" />
                <Route element={<LogoutPage />} path="/logout" />
                <Route element={<PrivateRoute><DashboardPage /></PrivateRoute>} path="/dashboard" />
                <Route element={<PrivateRoute><ChallengesPage /></PrivateRoute>} path="/challenges" />
                <Route element={<PrivateRoute><PracticeWordsPage /></PrivateRoute>} path="/practice-words" />
                <Route element={<PrivateRoute><PracticeSentencesPage /></PrivateRoute>} path="/practice-sentences" />
                <Route element={<RecorderTestPage />} path="/test" />
              </Routes>
            </BaseTemplate>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
