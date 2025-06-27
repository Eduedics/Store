import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spinner
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Uom = () => {
  const apiUrl = '/api/uom';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    symbol: '',
    active: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [singleUom, setSingleUom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const result = await res.json();
        setData(result.content || result || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Name is required!');
      return false;
    }
    if (!form.symbol.trim()) {
      toast.error('Symbol is required!');
      return false;
    }
    return true;
  };

  const handleCreate = async (newUom) => {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUom)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const created = await res.json();
      setData([...data, created]);
      toast.success('Created successfully!');
    } catch (err) {
      toast.error('Error creating: ' + err.message);
    }
  };

  const handleUpdate = async (updatedUom) => {
    try {
      const res = await fetch(`${apiUrl}/${updatedUom.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUom)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const updated = await res.json();
      setData(data.map(item => item.id === updated.id ? updated : item));
      toast.success('Updated successfully!');
    } catch (err) {
      toast.error('Error updating: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this UOM?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setData(data.filter(item => item.id !== id));
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error('Error deleting: ' + err.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isEditing) {
      handleUpdate({ ...form, id: editId });
    } else {
      handleCreate(form);
    }
    clearForm();
  };

  const clearForm = () => {
    setForm({
      name: '',
      symbol: '',
      active: true
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditClick = (item) => {
    setForm({
      name: item.name,
      symbol: item.symbol,
      active: item.active
    });
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleGetById = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      if (!res.ok) throw new Error('Not found!');
      const result = await res.json();
      setSingleUom(result);
      toast.success(`Fetched UOM: ${result.name}`);
    } catch (err) {
      toast.error('Error fetching: ' + err.message);
      setSingleUom(null);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  if (error)
    return (
      <Container className="text-center mt-5 text-danger">
        Error: {error}
      </Container>
    );

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="mb-4 text-center">Unit of Measurement</h2>

      <Card className="p-4 shadow-sm mb-4">
        <h5>{isEditing ? 'Edit UOM' : 'Add UOM'}</h5>
        <Form onSubmit={handleFormSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter name"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Symbol</Form.Label>
                <Form.Control
                  value={form.symbol}
                  onChange={e => setForm({ ...form, symbol: e.target.value })}
                  placeholder="Enter symbol"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
              />
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button type="submit" variant={isEditing ? 'success' : 'primary'}>
              {isEditing ? 'Save Update' : 'Add UOM'}
            </Button>
            {isEditing && (
              <Button variant="secondary" onClick={clearForm}>
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
            <th>Name</th>
            <th>Symbol</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.symbol}</td>
              <td>{u.active ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleGetById(u.id)}
                >
                  Info
                </Button>{' '}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleEditClick(u)}
                >
                  Edit
                </Button>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {singleUom && (
        <Card className="p-4 shadow-sm mb-4">
          <h5>📌 Selected UOM Detail</h5>
          <p><strong>ID:</strong> {singleUom.id}</p>
          <p><strong>Name:</strong> {singleUom.name}</p>
          <p><strong>Symbol:</strong> {singleUom.symbol}</p>
          <p><strong>Active:</strong> {singleUom.active ? 'Yes' : 'No'}</p>
          <Button variant="secondary" onClick={() => setSingleUom(null)}>
           ❌ Close
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default Uom;
