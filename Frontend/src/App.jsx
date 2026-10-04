import Navbar from './components/Navbar';
import { Router } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Event from './pages/Event.jsx';
import Home from './pages/Home.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Footer from './components/Footer.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
const App = () => {
  return (
    <div>
    
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/events/:id' element={<EventDetail/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/admin' element={<AdminDashboard/>}></Route>
        <Route path='/events' element={<Event/>}></Route>
      </Routes>
     <Footer></Footer>
    </div>
  )
}

export default App
