import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  InputGroup
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Store() {
  const apiUrl = 'api/stores';

  const [storeData, setStoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [singleStore, setSingleStore] = useState(null);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch all stores
  const fetchStoreData = async () => {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setStoreData(data.content || []);
      setFilteredData(data.content || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single store by ID
  const fetchStoreById = async (id) => {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Could not fetch store by ID');
    const store = await res.json();
    setSingleStore(store);
    toast.success(`Store ${store.storeName} loaded!`);
  } catch (err) {
    toast.error(`Error fetching store: ${err.message}`);
    setSingleStore(null);
  }
};

  useEffect(() => {
    fetchStoreData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = storeData.filter((s) =>
      s.storeName.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (store) => {
    setForm({
      name: store.storeName,
      location: store.storeLocation,
      active: store.active,
    });
    setIsEditing(true);
    setEditId(store.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const updated = storeData.filter((s) => s.id !== id);
      setStoreData(updated);
      setFilteredData(updated);
      toast.success('Store deleted successfully');
    } catch (err) {
      toast.error(`Error deleting store: ${err.message}`);
    }
  };

  const handleCreate = async (newStore) => {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const created = await res.json();
      const updated = [...storeData, created];
      setStoreData(updated);
      setFilteredData(updated);
      toast.success('Store created successfully');
    } catch (err) {
      toast.error(`Error creating store: ${err.message}`);
    }
  };

  const handleUpdate = async (updatedStore) => {
    try {
      const res = await fetch(`${apiUrl}/${updatedStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const updated = await res.json();
      const newData = storeData.map((s) => (s.id === updated.id ? updated : s));
      setStoreData(newData);
      setFilteredData(newData);
      toast.success('Store updated successfully');
    } catch (err) {
      toast.error(`Error updating store: ${err.message}`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const storeObj = {
      storeName: form.name,
      storeLocation: form.location,
      active: form.active,
    };
    if (isEditing) {
      handleUpdate({ ...storeObj, id: editId });
    } else {
      handleCreate(storeObj);
    }
    // Reset
    setForm({ name: '', location: '', active: true });
    setIsEditing(false);
    setEditId(null);
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error) return <div style={{ color: 'red' }}>Error: {error.message}</div>;

  return (
    <Container className="mt-4">
      <ToastContainer />

      <h2 className="mb-4 text-center"> Store Management</h2>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by store name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      <Card className="p-4 shadow-sm mb-4">
        <h4 className="text-center p-5">{isEditing ? ' Update Store' : ' Add New Store'}</h4>
        <Form onSubmit={handleFormSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="storeName">
                <Form.Label>Store Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter store name"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="storeLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
            </Col>
          </Row>
          <div className="d-flex gap-2 mx-auto">
            <Button type="submit" variant={isEditing ? 'success' : 'primary'}>
              {isEditing ? ' Save Update' : ' Add Store'}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setForm({ name: '', location: '', active: true });
                  setIsEditing(false);
                  setEditId(null);
                }}
              >
                ❌ Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Store Name</th>
            <th>Location</th>
            <th>Store Code</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((store) => (
            <tr key={store.id}>
              <td>{store.id}</td>
              <td>{store.storeName}</td>
              <td>{store.storeLocation}</td>
              <td>{store.storeCode}</td>
              <td>{store.active ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => fetchStoreById(store.id)}
                >
                  Info
                </Button>{' '}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(store)}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(store.id)}
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
      {singleStore && (
        <Card className="p-4 mb-4">
            <h5>📌 Selected Store Detail</h5>
            <p><strong>ID:</strong> {singleStore.id}</p>
            <p><strong>Name:</strong> {singleStore.storeName}</p>
            <p><strong>Location:</strong> {singleStore.storeLocation}</p>
            <p><strong>Code:</strong> {singleStore.storeCode}</p>
            <p><strong>Active:</strong> {singleStore.active ? 'Yes' : 'No'}</p>
            <Button variant="secondary" onClick={() => setSingleStore(null)}>Close</Button>
        </Card>
        )}
    </Container>
  );
}
