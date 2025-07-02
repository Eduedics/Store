import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sequence = () => {
  const apiUrl = 'api/v1/sequence';

  const [sequences, setSequences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: '',
    format: '',
    startingNumber: 0,
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    try {
      const res = await fetch(apiUrl);
      // if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setSequences(data.content || []);
    } catch (err) {
      setError(err.message);
      toast.error( "failed to fetch sequence data,")
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'startingNumber' ? parseInt(value) || 0 : value,
    });
  };

  const clearForm = () => {
    setForm({
      name: '',
      format: '',
      startingNumber: 0,
    });
    setEditing(false);
    setEditId(null);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Sequence name is required!');
      return false;
    }
    if (!form.format.trim()) {
      toast.error('Format is required!');
      return false;
    }
    if (isNaN(form.startingNumber) || form.startingNumber < 0) {
      toast.error('Starting number must be a valid number!');
      return false;
    }
    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch(editing ? `${apiUrl}/${editId}` : apiUrl, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const saved = await res.json();
      if (editing) {
        const updated = sequences.map((s) => (s.id === saved.id ? saved : s));
        setSequences(updated);
        toast.success('Updated successfully!');
      } else {
        const updated = [...sequences, saved];
        setSequences(updated);
        toast.success('Added successfully!');
      }
      clearForm();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleEdit = (sequence) => {
    setForm({
      name: sequence.name,
      format: sequence.format,
      startingNumber: sequence.number,
    });
    setEditing(true);
    setEditId(sequence.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sequence?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const updated = sequences.filter((s) => s.id !== id);
      setSequences(updated);
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error(`Error deleting: ${err.message}`);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sequences.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sequences.length / rowsPerPage);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // if (error) {
  //   return <div style={{ color: 'red' }}>Error: {error}</div>;
  // }

  return (
    <Container className="mt-4">

      <h2 className="mb-4 text-center">Sequence Management</h2>

      <Card className="p-4 shadow-sm mb-4">
        <h4 className='text-info'>{editing ? 'Update Sequence' : '➕ Add New Sequence'}</h4>
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="seqName">
                <Form.Label>Sequence Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter sequence name"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="seqFormat">
                <Form.Label>Format</Form.Label>
                <Form.Control
                  type="text"
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                  placeholder="Enter format"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="seqStartingNumber">
                <Form.Label>Starting Number</Form.Label>
                <Form.Control
                  type="number"
                  name="startingNumber"
                  value={form.startingNumber}
                  onChange={handleChange}
                  placeholder="Enter starting number"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button
              type="button"
              variant={editing ? 'success' : 'primary'}
              onClick={handleAddOrUpdate}
            >
              {editing ? 'Save Update' : 'Add Sequence'}
            </Button>
            {editing && (
              <Button type="button" variant="secondary" onClick={clearForm}>
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
            <th>Sequence Name</th>
            <th>Format</th>
            <th>Starting Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.format}</td>
              <td>{s.number}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(s.id)}
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
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default Sequence;
