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

// import RefundPage from './pages/RefundPage'
// import CreateRefund from './pages/CreateRefund'
// import EditRefund from './pages/EditRefund'
// import DeleteRefund from './pages/DeleteRefund'
// import ShowRefund from './pages/ShowRefund'
// import UserRefunds from './pages/RefundUserPage'

import RefundPage from './pages/Refund/RefundPage'
import CreateRefund from './pages/Refund/CreateRefund'
import EditRefund from './pages/Refund/EditRefund'
import DeleteRefund from './pages/Refund/DeleteRefund'
import ShowRefund from './pages/Refund/ShowRefund'
import UserRefunds from './pages/Refund/RefundUserPage'
import RefundLandingPage from './pages/Refund/RefundLandingPage';


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
      <Routes>
      <Route path='/refundLanding' element={<RefundLandingPage/>}></Route>
        <Route path='/userRefunds' element={<UserRefunds/>}></Route>
      </Routes>
      <Routes>
        <Route path='/refunds'element={
          <ProtectedRoute>
            <RefundPage/>
          </ProtectedRoute>
        }/>
        <Route path='/refunds/create'element={
          <ProtectedRoute>
            <CreateRefund/>
          </ProtectedRoute>
        }/>
         <Route path='/refunds/details/:id'element={
          <ProtectedRoute>
            <ShowRefund/>
          </ProtectedRoute>
        }/>
        <Route path='/refunds/edit/:id'element={
          <ProtectedRoute>
            <EditRefund/>
          </ProtectedRoute>
        }/>
        <Route path='/refunds/delete/:id'element={
          <ProtectedRoute>
            <DeleteRefund/>
          </ProtectedRoute>
        }/>
      </Routes>    
    </>
  );
};

export default App;
