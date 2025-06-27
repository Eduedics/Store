import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Uom from './pages/Uom.jsx' 
import Supplier from './pages/Supplier.jsx'  
import Store from './pages/Store.jsx' 
import Sequence from './pages/Sequence.jsx'
import Codevalue from './pages/Codevalue.jsx'
import PriceList from './pages/PriceList.jsx'
import AuditTrail from './pages/AuditTrail.jsx'
import Person from './pages/Person.jsx'
import Packaging from './pages/Packaging.jsx'
import Employee from './pages/Employee.jsx'
import Stock from './pages/StockEntries.jsx'
import Inventory from './pages/Inventory.jsx'

import Navbar from './components/SideBar.jsx';


import './App.css'
import Contact from './pages/Contact.jsx';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path="/uom" element={<Uom/>} />
          <Route path="/supplier" element={<Supplier/>} />
          <Route path="/store" element={<Store/>} />
          <Route path="/sequence" element={<Sequence/>} />
          <Route path="/codevalue" element={<Codevalue/>} />
          <Route path ="/pricelist" element={<PriceList mode ='pricelist'/>} />
          <Route path ="/item" element={<PriceList mode ='items'/>} />
          <Route path ='/audit' element= {<AuditTrail />} />
          <Route path = '/person' element = {<Person />} />
          <Route path="/packaging" element={<Packaging />} />
          <Route path = '/contact' element = {<Contact />} />
          <Route path ='/employee' element = {<Employee/>} />
          <Route path = '/stock' element = {<Stock />} />
          <Route path ='sidebar' element = {<Navbar />} />
          <Route path = '/inventory' element = {<Inventory />} />
         
        
        </Routes>
      </Router>
    </>
  )
}

export default App
