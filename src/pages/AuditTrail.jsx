import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Container, Table, Card, Spinner, Form, InputGroup, Button } from 'react-bootstrap';

const AuditTrail = () => {
  const API_URL = 'api/v1/audit-trail';

  const [auditData, setAuditData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAuditTrailData = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const fetchedData = Array.isArray(data.content) ? data.content : data || [];
        setAuditData(fetchedData);
        setFilteredData(fetchedData);
      } catch (err) {
        setError(err.message);
        toast.error(err.message)
      } finally {
        setLoading(false);
      }
    };

    fetchAuditTrailData();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = auditData.filter((item) =>
      item.name.toLowerCase().includes(query)
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

  // if (error)
  //   return (
  //     <Container className="mt-5 text-center text-danger">
  //       <h4>Error: {error}</h4>
  //     </Container>
  //   );

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Audit Trail</h2>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      <Card className="p-4 shadow-sm">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {auditData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {filteredData.length > rowsPerPage && (
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
      )}
      </Card>
    </Container>
  );
};

export default AuditTrail;
