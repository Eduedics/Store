// import { useState,useEffect } from "react"
// import axios from 'axios'
// function Contact() {
//     const emptyForm =  
//         {
//             email: "",
//             telNo: "",
//             identificationNo: "",
//             personData: {
//                 name: "",
//                 personType: "",
//                 active: true
//             },
//             storeData: {
//                 storeName: "",
//                 storeLocation: "",
//                 active: true
//             }
//         } 
        
    // const api_url = {
    //     contact : 'api/contacts',
    //     store : 'api/store',
    //     person :'api/person'
    // }
    // const api = axios.create({
    //     baseURL:'/',
    //     headers:{'Content-Type':'application/json'}
    // })
//     // states
//     const [contactData,setContactData] = useState([])
//     const [loading,setLoading] =useState(false)
//     const [err,setErr] = useState(null)
//     const [formData,setFormData ] = useState(emptyForm)
//     const [editing,setEditing] = useState(false)
//     const [editId,setEditid] = useState(null)
//     // fetch
//     useEffect(()=>{
//         const fetchById = async (id)=>{
//             setLoading(true)
//             setEditing(true)
//             try {
//                 const res = await api.put(`${api_url.contact}/${id}`)
//                 setFormData(res.data)
//                 setEditing(true)
//                 setEditid(id)
//             } catch (error) {
//                 setErr(error.message)
//             }
//             finally{
//                 setLoading(false)
//             }
//         }
//         const fetchContact = async () => {
//             setLoading(true)
//             try {
//                 const res = await api.get(api_url.contact)
//                 const data = await res.data
//                 const fetchedData = Array.isArray(data.content)?data.content :data || []
//                 console.log(fetchedData)
//                 setContactData(fetchedData)
//                 setLoading(false)
//             } catch (err) {
//                 setErr(err)
//             }finally{
//                 setLoading(false)
//             }
//         }
//         fetchContact()
//         fetchById()
//     },[])
//     // 
//     const handleChange = (e) => {
//         const { name, value } = e.target;
        
//         if (name.includes('personData.')) {
//             const field = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 personData: {
//                     ...prev.personData,
//                     [field]: value
//                 }
//             }));
//         } else if (name.includes('storeData.')) {
//             const field = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 storeData: {
//                     ...prev.storeData,
//                     [field]: value
//                 }
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };
//      const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
        
//         if (name.includes('personData.')) {
//             const field = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 personData: {
//                     ...prev.personData,
//                     [field]: checked
//                 }
//             }));
//         } else if (name.includes('storeData.')) {
//             const field = name.split('.')[1];
//             setFormData(prev => ({
//                 ...prev,
//                 storeData: {
//                     ...prev.storeData,
//                     [field]: checked
//                 }
//             }));
//         }
//     };


//     const handleSubmit = async (e)=>{
//         e.preventDefault();
//         setLoading(true)
//         setErr(null)

//         try {
//             if(editing){
//                 let res = await api.put(`${api_url.contact}/${editId}`,formData)
//                 setContactData(pre=>(
//                     pre.map(item =>item.id === editId?res.data:item)
//                 ))
//             }else{
//                 const res = await api.post(api_url.contact,formData)
//                 const data = await res.data
//                 setContactData((pre)=>[...pre,data])
//             }
            
//             setFormData(emptyForm)
//         } catch (error) {
//             console.error("Failed to submit:", error);
//             setErr("Failed to add contact. Please try again.");
//         }
//         finally{
//             setLoading(false)
//         }
//     }

// // handle delete
//     const handleDelete = async(id)=>{
//         if(!window.confirm('Are you sure you want to delete this item'))
//             return
//         setLoading(true)
//         try {
//             let res = await api.delete(`${api_url.contact}/${id}`)
//             setContactData(pre =>
//                 pre.filter(contact => contact.id !== id)
//             )
//             if (editId===id){
//                 setFormData(emptyForm)
//             }
//         } catch (error) {
//             setErr(error.message)
//         }
//     }
    
//   return (
//       <div className="contact-container">
//             <h1>Contact Management</h1>
            
//             {err && <div className="error-message">{typeof err==='string'?err:err.message}</div>}
            
//             <div className="contact-form">
//                 <h2>{editing ? 'Edit Contact' : 'Add New Contact'}</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label>Email:</label>
//                         <input
//                             type="email"
//                             name = 'email'
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
                    
//                     <div className="form-group">
//                         <label>Telephone Number:</label>
//                         <input
//                             type="number"
//                             name="telNo"
//                             value={formData.telNo}
//                             onChange={handleChange}
//                             required
                            
//                         />
//                     </div>
                    
//                     <div className="form-group">
//                         <label>Identification Number:</label>
//                         <input
//                             type="number"
//                             name="identificationNo"
//                             value={formData.identificationNo}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
                    
//                     <h3>Person Data</h3>
//                     <div className="form-group">
//                         <label>Name:</label>
//                         <input
//                             type="text"
//                             name="personData.name"
//                             value={formData.personData.name}
//                             onChange={handleChange}
//                             required
                            
//                         />
//                     </div>
                    
//                     <div className="form-group">
//                         <label>Person Type:</label>
//                         <select
//                             name="personData.personType"
//                             value={formData.personData.personType}
//                             onChange={handleChange}
//                         >
//                             <option value="SUPPLIER">Supplier</option>
//                             <option value="CUSTOMER">Customer</option>
//                             <option value="EMPLOYEE">Employee</option>
//                         </select>
//                     </div>
                    
//                     <div className="form-group checkbox">
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={formData.personData.active}
//                                 name="personData.active"
//                                 onChange={handleCheckboxChange}
//                             />
//                             Active
//                         </label>
//                     </div>
                    
//                     <h3>Store Data</h3>
//                     <div className="form-group">
//                         <label>Store Name:</label>
//                         <input
//                             type="text"
//                             name="storeData.storeName"
//                             value={formData.storeData.storeName}
//                             onChange={handleChange}
                            
//                         />
//                     </div>
                    
//                     <div className="form-group">
//                         <label>Store Location:</label>
//                         <input
//                             type="text"
//                             value={formData.storeData.storeLocation}
//                             name="storeData.storeLocation"
//                             onChange={handleChange}
                            
//                         />
//                     </div>
                    
//                     <div className="form-group checkbox">
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={formData.storeData.active}
//                                 name="storeData.active"
//                                 onChange={handleCheckboxChange}
//                             />
//                             Active
//                         </label>
//                     </div>
                    
//                     <button type="submit" disabled={loading}>
//                     {loading ? 'Processing...' : editing ? 'Update Contact' : 'Add Contact'}
//                     </button>
//                     {editing && (
//                     <button type="button" onClick={resetForm} disabled={loading}>
//                         Cancel
//                     </button>
// )}
//                 </form>
//             </div>
            
//             <div className="contact-list">
//             <h2>Contacts</h2>
//             {loading && !contactData.length ? (
//                 <p>Loading contacts...</p>
//             ) : (
//                 <ul>
//                 {contactData.map(contact => (
//                     <li key={contact.id}>
//                     <p>Email: {contact.email}</p>
//                     <p>Name: {contact.personData?.name}</p>
//                     <p>Store: {contact.storeData?.storeName}</p>
//                     <div className="action-buttons">
//                         <button onClick={() => fetchContactById(contact.id)}>
//                         Edit
//                         </button>
//                         <button onClick={() => handleDelete(contact.id)}>
//                         Delete
//                         </button>
//                     </div>
//                     </li>
//                 ))}
//                 </ul>
//             )}
//             </div>
//         </div>
//   )
// }

// export default Contact
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Table, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Contact() {
  const emptyForm = {
    id: 0,
    email: '',
    telNo: '',
    identificationNo: '',
    personData: {
      id: 0,
      name: '',
      personType: '',
      active: true,
    },
    storeData: {
      id: 0,
      storeName: '',
      storeLocation: '',
      active: true,
    },
  };

  const api_url = {
    contact: 'api/contacts',
    person: 'api/person',    // API endpoint for person data
    store: 'api/stores',      // API endpoint for store data
  };

  const api = axios.create({
    baseURL: '/',
    headers: { 'Content-Type': 'application/json' },
  });

  const [formData, setFormData] = useState(emptyForm);
  const [contactData, setContactData] = useState([]);
  const [personOptions, setPersonOptions] = useState([]);    // State for person dropdown
  const [storeOptions, setStoreOptions] = useState([]);      // State for store dropdown
  const [loading, setLoading] = useState({
    contacts: false,
    form: false,
    persons: false,
    stores: false
  });
  const [err, setErr] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchContacts();
    fetchPersonOptions();
    fetchStoreOptions();
  }, []);

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(prev => ({ ...prev, contacts: true }));
    try {
      const res = await api.get(api_url.contact);
      const data = res.data;
      const fetchedData = Array.isArray(data.content) ? data.content : data || [];
      setContactData(fetchedData);
    } catch (error) {
      setErr(error.message);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  // Fetch person options for dropdown
  const fetchPersonOptions = async () => {
    setLoading(prev => ({ ...prev, persons: true }));
    try {
      const res = await api.get(api_url.person);
      setPersonOptions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Failed to fetch person options');
    } finally {
      setLoading(prev => ({ ...prev, persons: false }));
    }
  };

  // Fetch store options for dropdown
  const fetchStoreOptions = async () => {
    setLoading(prev => ({ ...prev, stores: true }));
    try {
      const res = await api.get(api_url.store);
      setStoreOptions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Failed to fetch store options');
    } finally {
      setLoading(prev => ({ ...prev, stores: false }));
    }
  };

  // Handle person selection
  const handlePersonSelect = (personId) => {
    const selectedPerson = personOptions.find(p => p.id === personId);
    if (selectedPerson) {
      setFormData(prev => ({
        ...prev,
        personData: {
          id: selectedPerson.id,
          name: selectedPerson.name,
          personType: selectedPerson.personType,
          active: selectedPerson.active
        }
      }));
    }
  };

  // Handle store selection
  const handleStoreSelect = (storeId) => {
    const selectedStore = storeOptions.find(s => s.id === storeId);
    if (selectedStore) {
      setFormData(prev => ({
        ...prev,
        storeData: {
          id: selectedStore.id,
          storeName: selectedStore.storeName,
          storeLocation: selectedStore.storeLocation,
          active: selectedStore.active
        }
      }));
    }
  };

  const filteredData = useMemo(() => {
    return contactData.filter((c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.personData?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contactData, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / rowsPerPage), [filteredData, rowsPerPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('personData.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        personData: { ...prev.personData, [field]: value },
      }));
    } else if (name.includes('storeData.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        storeData: { ...prev.storeData, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name.includes('personData.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        personData: { ...prev.personData, [field]: checked },
      }));
    } else if (name.includes('storeData.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        storeData: { ...prev.storeData, [field]: checked },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));
    try {
      const res = isEditing
        ? await api.put(`${api_url.contact}/${formData.id}`, formData)
        : await api.post(api_url.contact, formData);

      const data = res.data;
      const updatedList = isEditing
        ? contactData.map((c) => (c.id === data.id ? data : c))
        : [...contactData, data];

      setContactData(updatedList);
      toast.success(`Contact ${isEditing ? 'updated' : 'added'} successfully!`);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} contact`);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await api.delete(`${api_url.contact}/${id}`);
      setContactData(contactData.filter((c) => c.id !== id));
      toast.success('Deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setIsEditing(false);
  };

  return (
  <Container className="mt-4">
    <h2 className="text-center mb-4">Contact Management</h2>

    <InputGroup className="mb-3 flex-column flex-md-row align-items-stretch">
      <Form.Control
        placeholder="Search by email or name..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />
      <Form.Select
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="mt-2 mt-md-0 ms-md-2"
        style={{ maxWidth: '150px' }}
      >
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
        <option value={20}>20 rows</option>
      </Form.Select>
    </InputGroup>

    <Card className="p-4 shadow-sm mb-4">
      <h4 className="text-info">
        {isEditing ? 'Update Contact' : ' ➕ Add New Contact'}
      </h4>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Telephone</Form.Label>
              <Form.Control
                type="tel"
                name="telNo"
                value={formData.telNo}
                onChange={handleChange}
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Identification No</Form.Label>
              <Form.Control
                type="number"
                name="identificationNo"
                value={formData.identificationNo}
                onChange={handleChange}
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Person</Form.Label>
              <Form.Select
                value={formData.personData.id || ''}
                onChange={(e) => handlePersonSelect(Number(e.target.value))}
                disabled={loading.persons || loading.form}
              >
                <option value="">Select Person</option>
                {personOptions.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.personType})
                  </option>
                ))}
              </Form.Select>
              {loading.persons && <small>Loading persons...</small>}
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Check
              type="checkbox"
              label="Person Active"
              name="personData.active"
              checked={formData.personData.active}
              onChange={handleCheckboxChange}
              disabled={loading.form}
              className="mb-3"
            />
          </Col>

          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Store</Form.Label>
              <Form.Select
                value={formData.storeData.id || ''}
                onChange={(e) => handleStoreSelect(Number(e.target.value))}
                disabled={loading.stores || loading.form}
              >
                <option value="">Select Store</option>
                {storeOptions.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.storeName} ({store.storeLocation})
                  </option>
                ))}
              </Form.Select>
              {loading.stores && <small>Loading stores...</small>}
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Check
              type="checkbox"
              label="Store Active"
              name="storeData.active"
              checked={formData.storeData.active}
              onChange={handleCheckboxChange}
              disabled={loading.form}
              className="mb-3"
            />
          </Col>
        </Row>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button
            type="submit"
            variant={isEditing ? 'success' : 'primary'}
            disabled={loading.form || loading.persons || loading.stores}
          >
            {loading.form
              ? 'Processing...'
              : isEditing
              ? 'Update Contact'
              : ' ➕ Add Contact'}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={loading.form}
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Card>

    <Card className="p-3">
      <h5>Contact List</h5>
      {loading.contacts ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Store</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((c) => (
                  <tr key={c.id}>
                    <td>{c.email}</td>
                    <td>{c.personData?.name}</td>
                    <td>{c.storeData?.storeName}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleEdit(c)}
                        className="me-2"
                        disabled={loading.form}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(c.id)}
                        disabled={loading.form}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredData.length > rowsPerPage && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3">
              <Button
                variant="outline-secondary"
                disabled={currentPage === 1 || loading.contacts}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages} ({filteredData.length} items)
              </span>
              <Button
                variant="outline-secondary"
                disabled={currentPage === totalPages || loading.contacts}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  </Container>
);


}

export default Contact;