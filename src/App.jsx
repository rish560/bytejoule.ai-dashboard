import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Category from './pages/Category';
import Parse from './pages/Parse';
import Extract from './pages/Extract';
import Classify from './pages/Classify';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enterprise" element={<Category />} />
          <Route path="/parse" element={<Parse />} />
          <Route path="/extract" element={<Extract />} />
          <Route path="/classify" element={<Classify />} />
          <Route path="/index" element={<Index />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
