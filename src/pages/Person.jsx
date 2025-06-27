import { useState, useEffect, useMemo } from 'react';
// import { debounce } from 'lodash';

import {
  ToastContainer,
  toast
} from 'react-toastify';
import {
  Table,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  InputGroup
} from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Person() {
  const apiUrl = '/api/person';

  const [allPersons, setAllPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    personType: '',
    active: false,
  });
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [singlePerson, setSinglePerson] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // const debouncedSearch =useMemo(()=>{
  //   debounce((query) => {
  //   setSearchQuery(query);
  //   setCurrentPage(1);
  // }, 300);
  // },[]) 
  // useEffect(() => {
  //   return () => debouncedSearch.cancel();
  // }, [debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(apiUrl);
        const data = Array.isArray(res.data.content) ? res.data.content : res.data || [];
        setAllPersons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return allPersons.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPersons, searchQuery]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // debouncedSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required!');
      return false;
    }
    if (!formData.personType.trim()) {
      toast.error('Person Type is required!');
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setFormData({ id: 0, name: '', personType: '', active: false });
    setIsUpdateMode(false);
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.post(apiUrl, formData);
      const updated = [...allPersons, res.data];
      if ((updated.length % rowsPerPage === 0) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

      setAllPersons(updated);
      toast.success('Added successfully!');
      clearForm();
    } catch (err) {
      toast.error('Error adding: ' + err.message);
    }
  };

  const handleEditClick = (entry) => {
    setFormData(entry);
    setIsUpdateMode(true);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.put(`${apiUrl}/${formData.id}`, formData);
      const updated = allPersons.map((p) =>
        p.id === formData.id ? res.data : p
      );
      setAllPersons(updated);
      toast.success('Updated successfully!');
      clearForm();
    } catch (err) {
      toast.error('Error updating: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      const updated = allPersons.filter((p) => p.id !== id);
      setAllPersons(updated);
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error('Error deleting: ' + err.message);
    }
  };

  const handleGetById = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/${id}`);
      setSinglePerson(res.data);
      toast.success(`Fetched Person: ${res.data.name}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setSinglePerson(null);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  
  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Person Management</h2>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      <Card className="p-4 shadow-sm mt-4">
        <h4 className="mb-3">{isUpdateMode ? 'Update Person' : 'Add New Person'}</h4>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Person Type</Form.Label>
                <Form.Control
                  type="text"
                  name="personType"
                  value={formData.personType}
                  onChange={handleChange}
                  placeholder="Enter person type"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant={isUpdateMode ? 'success' : 'primary'}
              onClick={isUpdateMode ? handleUpdate : handleAdd}
            >
              {isUpdateMode ? '💾 Save Update' : '➕ Add New'}
            </Button>
            {isUpdateMode && (
              <Button type="button" variant="secondary" onClick={clearForm}>
                ❌ Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Person Type</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.personType}</td>
              <td>{p.active ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleGetById(p.id)}
                >
                  Info
                </Button>{' '}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEditClick(p)}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between mb-4">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {singlePerson && (
        <Card className="p-4 shadow-sm mb-4">
          <h5>📌 Selected Person Detail</h5>
          <p><strong>ID:</strong> {singlePerson.id}</p>
          <p><strong>Name:</strong> {singlePerson.name}</p>
          <p><strong>Person Type:</strong> {singlePerson.personType}</p>
          <p><strong>Active:</strong> {singlePerson.active ? 'Yes' : 'No'}</p>
          <Button variant="secondary" onClick={() => setSinglePerson(null)}>
           ❌ Close
          </Button>
        </Card>
      )}
    </Container>
  );
}

export default Person;
