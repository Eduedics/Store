import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Button,
  Form,
  Card,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Supplier = () => {
  const apiUrl = 'api/supplier';

  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [singleSupplier, setSingleSupplier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch suppliers');
        const data = await res.json();
        setSupplierData(data.content || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (newSupplier) => {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      if (!res.ok) throw new Error('Failed to create supplier');
      const created = await res.json();
      setSupplierData([...supplierData, created]);
      toast.success('Supplier created!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = async (id, updatedSupplier) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupplier),
      });
      if (!res.ok) throw new Error('Failed to update supplier');
      const updated = await res.json();
      setSupplierData(
        supplierData.map((s) => (s.supplierId === id ? updated : s))
      );
      toast.success('Supplier updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this supplier?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete supplier');
      setSupplierData(supplierData.filter((s) => s.supplierId !== id));
      toast.success('Supplier deleted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSupplier = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
    };
    if (isEditing) {
      handleEdit(editId, newSupplier);
      setIsEditing(false);
      setEditId(null);
    } else {
      handleCreate(newSupplier);
    }
    setForm({ name: '', email: '', phone: '', location: '' });
  };

  const handleEditClick = (supplier) => {
    setForm({
      name: supplier.supName,
      email: supplier.supMail,
      phone: supplier.supTel,
      location: supplier.supLocation,
    });
    setIsEditing(true);
    setEditId(supplier.supplierId);
  };

  const handleGetById = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      if (!res.ok) throw new Error('Not found!');
      const result = await res.json();
      setSingleSupplier(result);
      toast.success(`Fetched supplier: ${result.supName}`);
    } catch (err) {
      toast.error(err.message);
      setSingleSupplier(null);
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="text-center mb-4">Supplier Management</h2>

      <Card className="p-4 mb-4 shadow-sm">
        <h5 className="text-center p-5">{isEditing ? 'Edit Supplier' : 'Add Supplier'} </h5>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant={isEditing ? 'success' : 'primary'}>
            {isEditing ? 'Save Update' : 'Add Supplier'}
          </Button>{' '}
          {isEditing && (
            <Button
              variant="secondary"
              onClick={() => {
                setForm({ name: '', email: '', phone: '', location: '' });
                setIsEditing(false);
                setEditId(null);
              }}
            >
              ❌ Cancel
            </Button>
          )}
        </Form>
      </Card>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supplierData.map((s) => (
            <tr key={s.supplierId}>
              <td>{s.supplierId}</td>
              <td>{s.supName}</td>
              <td>{s.supMail}</td>
              <td>{s.supTel}</td>
              <td>{s.supLocation}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => handleGetById(s.supplierId)}
                >
                  Info
                </Button>{' '}
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleEditClick(s)}
                >
                  Edit
                </Button>{' '}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(s.supplierId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {singleSupplier && (
        <Card className="p-4 mb-4">
          <h5>📌 Selected Supplier Detail</h5>
          <p>
            <strong>ID:</strong> {singleSupplier.supplierId}
          </p>
          <p>
            <strong>Name:</strong> {singleSupplier.supName}
          </p>
          <p>
            <strong>Email:</strong> {singleSupplier.supMail}
          </p>
          <p>
            <strong>Phone:</strong> {singleSupplier.supTel}
          </p>
          <p>
            <strong>Location:</strong> {singleSupplier.supLocation}
          </p>
          <Button variant="secondary" onClick={() => setSingleSupplier(null)}>
          ❌ Close
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default Supplier;
