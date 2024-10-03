// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import EventProgramPage from './pages/Events/Event';
import CreateEvents from './pages/Events/CreateEvents';
import ShowEvent from './pages/Events/ShowEvent';
import EditEvent from './pages/Events/EditEvent';
import DeleteEvent from './pages/Events/DeleteEvent';

import EventView from './pages/Events/EventView';
import AddEventParticipents from './pages/Events/AddEventParticipents'
import EventBookingList from './pages/Events/EventBookingList'
import EditEventBooking from './pages/Events/EditEventBooking'
import DeleteEventBooking from './pages/Events/DeleteEventBooking'

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component


const App = () => {
  return (
    <>
      <Header />
      <Routes>
      <Route path='/admin' element={<AdminLogin />} />
        <Route path='/admin/register' element={<AdminRegister />} />
        <Route path='/admin/dashboard' element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>

      <Routes>
      <Route path='/events' element={
        <ProtectedRoute>
          <EventProgramPage />
        </ProtectedRoute>
        }/>
        <Route path='/events/create' element={
          <ProtectedRoute>
          <CreateEvents />
        </ProtectedRoute>
          }/>
        <Route path='/events/details/:id' element={
          <ProtectedRoute>
          <ShowEvent />
        </ProtectedRoute>
          }/>
        <Route path='/events/edit/:id' element={
          <ProtectedRoute>
          <EditEvent />
        </ProtectedRoute>
          }/>
        <Route path='/events/delete/:id' element={
          <ProtectedRoute>
          <DeleteEvent />
        </ProtectedRoute>
          }/>
      </Routes>

      <Routes>
        <Route path='/eventViews' element={<EventView />}/>
        <Route path='/eventViews/eventParticipants' element={<AddEventParticipents />}/>
        <Route path='/eventBookingList' element={
          <ProtectedRoute>
          <EventBookingList />
        </ProtectedRoute>
          }/>
        <Route path='/sendEmail' element={
          <ProtectedRoute>
          <EventBookingList />
        </ProtectedRoute>
          }/>
        <Route path='/eventBookingList/edit/:id' element={
          <ProtectedRoute>
          <EditEventBooking />
        </ProtectedRoute>
          }/>
        <Route path='/eventBookingList/delete/:id' element={
          <ProtectedRoute>
          <DeleteEventBooking />
        </ProtectedRoute>
          }/>
      </Routes>

      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      
      
      
    </>
  );
};

export default App;
