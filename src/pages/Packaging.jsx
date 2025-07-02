import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Spinner,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Packaging() {
  const [packagingData, setPackagingData] = useState([]);                                                                                          
  const [formData, setFormData] = useState({
    id: null,
    pkgName: '',
    pkgSymbol: '',
    active: false,
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const apiUrl = '/api/packaging';

  useEffect(() => {
    let didCancel = false
    const fetchData = async () => {
      try {
        const res = await axios.get(apiUrl);
        const data = Array.isArray(res.data.content)
          ? res.data.content
          : res.data || [];
        if(!didCancel)setPackagingData(data);
      } catch (err) {
        setError(err.message);
        if(!didCancel)toast.error('Failed to fetch data',{toastId:'fetch-error'});
      } finally {
        if(!didCancel)setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({ id: null, pkgName: '', pkgSymbol: '', active: false });
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.pkgName.trim() || !formData.pkgSymbol.trim()) {
        toast.error('Name and Symbol are required');
        return;
      }

      if (editing) {
        const res = await axios.put(`${apiUrl}/${formData.id}`, formData);
        setPackagingData((prev) =>
          prev.map((pkg) => (pkg.id === formData.id ? res.data : pkg))
        );
        toast.success('Updated successfully!');
      } else {
        const res = await axios.post(apiUrl, formData);
        setPackagingData((prev) => [...prev, res.data]);
        toast.success('Added successfully!');
      }
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (pkg) => {
    setFormData(pkg);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this packaging?')) return;
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setPackagingData((prev) => prev.filter((pkg) => pkg.id !== id));
      toast.success('Deleted successfully!');
      if (formData.id === id) resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(packagingData.length / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return packagingData.slice(start, start + rowsPerPage);
  }, [packagingData, currentPage]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
    
      <h3 className="text-center mb-4">Packaging Management</h3>

      <Card className="p-4 shadow-sm mb-4">
        <h5 className='text-info'>{editing ? 'Update Packaging' : ' ➕ Add New Packaging'}</h5>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Package Name</Form.Label>
                <Form.Control
                  type="text"
                  name="pkgName"
                  value={formData.pkgName}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Package Symbol</Form.Label>
                <Form.Control
                  type="text"
                  name="pkgSymbol"
                  value={formData.pkgSymbol}
                  onChange={handleChange}
                  placeholder="Enter symbol"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mt-3">
              <Form.Check
                type="checkbox"
                label="Active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button type="submit" variant={editing ? 'success' : 'primary'}>
              {editing ? 'Save Update' : '➕ Add'}
            </Button>
            {editing && (
              <Button variant="secondary" onClick={resetForm}>
                ❌ Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Package Name</th>
            <th>Package Symbol</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.pkgName}</td>
              <td>{pkg.pkgSymbol}</td>
              <td>{pkg.active ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleEdit(pkg)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(pkg.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
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
    </Container>

  );
}

export default Packaging;
