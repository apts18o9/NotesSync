import React from 'react'
import Home from './pages/Home/Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'

import Modal from 'react-modal';

// Set the app element to the root div
Modal.setAppElement('#root');
const routes = (
  <Router>
    <Routes>
      <Route path="dashboard" exact element={<Home />} />
      <Route path="login" exact element={<Login />} />
      <Route path="signup" exact element={<SignUp />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
