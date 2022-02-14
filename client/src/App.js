import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Header from './components/headers/Header';
import Pages from './components/mainpages/Pages';
import ButtonBackToTop from './components/buttonBackToTop/ButtonBackToTop';
import Footer from './components/footer/Footer'
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop>
          <Header />
          <div className="App"> <Pages /></div>
          <ButtonBackToTop />
          <Footer />
        </ScrollToTop>
      </Router>
    </DataProvider>
  );
}

export default App;
