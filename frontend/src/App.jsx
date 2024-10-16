// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import EventProgramPage from './pages/Event';
import CreateEvents from './pages/CreateEvents';
import ShowEvent from './pages/ShowEvent';
import EditEvent from './pages/EditEvent';
import DeleteEvent from './pages/DeleteEvent';

import EventView from './pages/EventView';
import AddEventParticipents from './pages/AddEventParticipents'
import EventBookingList from './pages/EventBookingList'
import EditEventBooking from './pages/EditEventBooking'
import DeleteEventBooking from './pages/DeleteEventBooking'

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component

import CreateReturns from './pages/Return Products/CreateReturn';
import DeleteReturn from './pages/Return Products/DeleteReturn';
import EditReturn from './pages/Return Products/EditReturn';
import ReturnProduct from './pages/Return Products/ReturnProduct';
import ShowReturn from './pages/Return Products/ShowReturn';
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
     
     <Routes>
      <Route path='/returns' element={
        <ProtectedRoute>
          <ReturnProduct/>
        </ProtectedRoute>
      } />
      <Route path='/returns/create' element={<CreateReturns/>} />
      <Route path='/returns/details/:id' element={
        <ProtectedRoute>
          <ShowReturn/>
        </ProtectedRoute>
   
      } />
      <Route path='/returns/edit/:id' element={
        <ProtectedRoute>
          <EditReturn/>
        </ProtectedRoute>
      } />
      <Route path='/returns/delete/:id' element={
        <ProtectedRoute>
          <DeleteReturn/>
        </ProtectedRoute>
      } />
    </Routes>
      
      
      
    </>
  );
};

export default App;
