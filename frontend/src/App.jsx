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

import Product from './pages/Product/Product'
import CreateProducts from './pages/Product/CreateProducts'
import DeleteProduct from './pages/Product/DeleteProduct' 
import EditProduct from './pages/Product/EditProduct'
import ShowProduct from './pages/Product/ShowProduct'

import LandingPage from './pages/Product/LandingPage';
import ProductView from './pages/Product/ProductUser'
import ProductDetails from './pages/Product/PurchaseForm'
import PurchaseList from './pages/Product/PurchaseList'
import EditPurchase from './pages/Product/EditPurchase'
import DeletePurchase from './pages/Product/DeletePurchase';

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
      <Route path='/shop' element={<LandingPage />} />
      <Route path='/productViews' element={<ProductView />}/>
      <Route path='/productViews/purchaseForm' element={<ProductDetails />}/>
      <Route path='/purchaseList' element={
          <ProtectedRoute>
          <PurchaseList />
        </ProtectedRoute>
          }/>
          <Route path='/sendEmail' element={
          <ProtectedRoute>
          <PurchaseList />
        </ProtectedRoute>
          }/>
        <Route path='/purchaseList/edit/:id' element={
          <ProtectedRoute>
          <EditPurchase />
        </ProtectedRoute>
          }/>
        <Route path='/purchaseList/delete/:id' element={
          <ProtectedRoute>
          <DeletePurchase />
        </ProtectedRoute>
          }/>
      </Routes>
      
    </>
  );
};

export default App;
