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

import Product from './pages/Product'
import CreateProducts from './pages/CreateProducts'
import DeleteProduct from './pages/DeleteProduct' 
import EditProduct from './pages/EditProduct'
import ShowProduct from './pages/ShowProduct'

import ProductView from './pages/ProductUser'
import ProductDetails from './pages/PurchaseForm';

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
      <Route path='/products' element={
        <ProtectedRoute>
          <Product />
        </ProtectedRoute>
        }/>
        <Route path='/products/create' element={
          <ProtectedRoute>
          <CreateProducts />
        </ProtectedRoute>
          }/>
        <Route path='/products/details/:id' element={
          <ProtectedRoute>
          <ShowProduct />
        </ProtectedRoute>
          }/>
        <Route path='/products/edit/:id' element={
          <ProtectedRoute>
          <EditProduct />
        </ProtectedRoute>
          }/>
        <Route path='/products/delete/:id' element={
          <ProtectedRoute>
          <DeleteProduct />
        </ProtectedRoute>
          }/>
      </Routes>

      <Routes>
      <Route path='/productViews' element={<ProductView />}/>
      <Route path='/productViews/purchaseForm' element={<ProductDetails />}/>
      </Routes>
      
    </>
  );
};

export default App;
