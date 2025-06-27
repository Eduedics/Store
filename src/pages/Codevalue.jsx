import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  InputGroup,
  Row,
  Col
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Codevalue() {
  const apiUrl = 'api/v1/code-value';

  const [codeValuesData, setCodeValuesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    codeType: '',
    codeValue: '',
    active: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchCodeValues = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const list = Array.isArray(data.content) ? data.content : data || [];
      if (!Array.isArray(list)) throw new Error('Invalid data format from API');
      setCodeValuesData(list);
      setFilteredData(list);
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodeValues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = isEditing
        ? await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          })
        : await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
      if (!response.ok) throw new Error('Network response was not ok');

      toast.success(isEditing ? 'Updated successfully!' : 'Added successfully!');
      setFormData({ codeType: '', codeValue: '', active: false });
      setIsEditing(false);
      setId(null);
      fetchCodeValues();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpdate = (id) => {
    const codeValueToUpdate = codeValuesData.find((cv) => cv.id === id);
    if (codeValueToUpdate) {
      setFormData({
        codeType: codeValueToUpdate.codeType,
        codeValue: codeValueToUpdate.codeValue,
        active: codeValueToUpdate.active
      });
      setIsEditing(true);
      setId(id);
    }
  };

  const handleCancelUpdate = () => {
    setIsEditing(false);
    setId(null);
    setFormData({ codeType: '', codeValue: '', active: false });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network response was not ok');
      toast.success('Deleted successfully!');
      fetchCodeValues();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = codeValuesData.filter((cv) =>
      cv.codeType.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
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

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h2 className="text-center mb-4">Code Value Management</h2>
    <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by code type..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>
      <Card className="p-4 shadow-sm mb-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Code Type</Form.Label>
                <Form.Control
                  type="text"
                  name="codeType"
                  value={formData.codeType}
                  onChange={handleChange}
                  required
                  placeholder="Enter code type"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Code Value</Form.Label>
                <Form.Control
                  type="text"
                  name="codeValue"
                  value={formData.codeValue}
                  onChange={handleChange}
                  required
                  placeholder="Enter code value"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Active</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="active"
                  label="Is Active"
                  checked={formData.active}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button type="submit" variant={isEditing ? 'success' : 'primary'}>
              {isEditing ? 'Save Update' : 'Add New'}
            </Button>
            {isEditing && (
              <Button type="button" variant="secondary" onClick={handleCancelUpdate}>
                ❌ Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <Card className="p-4 shadow-sm">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code Type</th>
              <th>Code Value</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((cv) => (
              <tr key={cv.id}>
                <td>{cv.id}</td>
                <td>{cv.codeType}</td>
                <td>{cv.codeValue}</td>
                <td>{cv.active ? 'Yes' : 'No'}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdate(cv.id)}
                  >
                    Edit
                  </Button>{' '}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(cv.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between mt-3">
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
      </Card>
    </Container>
  );
}
