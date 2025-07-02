import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Table, InputGroup, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Employee() {
    // API endpoints
    const api_url = {
        employee: 'api/employees',
        department: 'api/v1/code-value',
    };

    // Axios instance
    const api = axios.create({
        baseURL: '/',
        headers: { 'Content-Type': 'application/json' }
    });

    // Empty form template
    const emptyForm = () => ({
        name: "",
        employeeNumber: "",
        department: {
            codeType: "",
            codeValue: "",
            active: true
        },
        personType: "SUPPLIER",
        active: true
    });

    // State management
    const [employeeData, setEmployeeData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState({
        employees: false,
        departments: false,
        form: false
    });
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState(emptyForm());
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Derived state
    const filteredData = useMemo(() => {
        return employeeData.filter(employee => 
            employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            employee.employeeNumber?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [employeeData, searchQuery]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    const totalPages = useMemo(() => 
        Math.ceil(filteredData.length / rowsPerPage), 
        [filteredData, rowsPerPage]
    );

    // Fetch all departments
    const fetchDepartments = async () => {
        setLoading(prev => ({ ...prev, departments: true }));
        try {
            const res = await api.get(api_url.department);
            setDepartmentData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch departments');
        } finally {
            setLoading(prev => ({ ...prev, departments: false }));
        }
    };

    // Fetch all employees
    const fetchEmployees = async () => {
        setLoading(prev => ({ ...prev, employees: true }));
        try {
            const res = await api.get(api_url.employee);
            const data = await res.data;
            const fetchedData = Array.isArray(data.content) ? data.content : data || [];
            setEmployeeData(fetchedData);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(prev => ({ ...prev, employees: false }));
        }
    };

    // Fetch single employee by ID
    const fetchEmployeeById = async (id) => {
        setLoading(prev => ({ ...prev, form: true }));
        try {
            const res = await api.get(`${api_url.employee}/${id}`);
            setFormData(res.data);
            setEditing(true);
            setEditId(id);
            toast.success('Employee loaded for editing');
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch employee details');
        } finally {
            setLoading(prev => ({ ...prev, form: false }));
        }
    };

    // Handle department selection
    const handleDepartmentChange = (e) => {
        const selectedDeptId = e.target.value;
        const selectedDept = departmentData.find(dept => dept.id === selectedDeptId);
        
        if (selectedDept) {
            setFormData(prev => ({
                ...prev,
                department: {
                    codeType: selectedDept.codeType,
                    codeValue: selectedDept.codeValue,
                    active: selectedDept.active
                }
            }));
        }
    };

    // Handle form submission (create/update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(prev => ({ ...prev, form: true }));
        
        try {
            let response;
            if (editing) {
                response = await api.put(`${api_url.employee}/${editId}`, formData);
                setEmployeeData(prev => 
                    prev.map(emp => emp.id === editId ? response.data : emp)
                );
                toast.success('Employee updated successfully!');
            } else {
                response = await api.post(api_url.employee, formData);
                setEmployeeData(prev => [...prev, response.data]);
                toast.success('Employee added successfully!');
            }
            resetForm();
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setError(errorMsg);
            toast.error(`Error: ${errorMsg}`);
        } finally {
            setLoading(prev => ({ ...prev, form: false }));
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Delete employee
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        
        setLoading(prev => ({ ...prev, employees: true }));
        try {
            await api.delete(`${api_url.employee}/${id}`);
            setEmployeeData(prev => prev.filter(emp => emp.id !== id));
            if (editId === id) resetForm();
            toast.success('Employee deleted successfully!');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            setError(errorMsg);
            toast.error(`Error deleting employee: ${errorMsg}`);
        } finally {
            setLoading(prev => ({ ...prev, employees: false }));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData(emptyForm());
        setEditing(false);
        setEditId(null);
    };

    // Initial data fetch
    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    // Main render
    return (
        <Container className="mt-4">
   
            <h2 className="text-center mb-4">Employee Management</h2>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {typeof error === 'string' ? error : error.message}
                </Alert>
            )}

            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Search by name or employee number..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    disabled={loading.employees}
                />
                <Form.Select
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    style={{ maxWidth: '150px', marginLeft: '1rem' }}
                    disabled={loading.employees}
                >
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                </Form.Select>
            </InputGroup>

            <Card className="p-4 shadow-sm mb-4">
                <h4 className='text-info'>{editing ? 'Edit Employee' : ' ➕ Add New Employee'}</h4>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.form}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Employee Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employeeNumber"
                                    value={formData.employeeNumber}
                                    onChange={handleChange}
                                    required
                                    disabled={loading.form}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <h5 className="mt-3">Department Details</h5>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Select
                                    value={departmentData.find(dept => 
                                        dept.codeType === formData.department.codeType && 
                                        dept.codeValue === formData.department.codeValue
                                    )?.id || ''}
                                    onChange={handleDepartmentChange}
                                    disabled={loading.departments || loading.form}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departmentData.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.codeType} - {dept.codeValue}
                                        </option>
                                    ))}
                                </Form.Select>
                                {loading.departments && <small className="text-muted">Loading departments...</small>}
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Person Type</Form.Label>
                                <Form.Select
                                    name="personType"
                                    value={formData.personType}
                                    onChange={handleChange}
                                    disabled={loading.form}
                                    required
                                >
                                    <option value="SUPPLIER">Supplier</option>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="EMPLOYEE">Employee</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Employee Active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleCheckboxChange}
                                    disabled={loading.form}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Button 
                            type="submit" 
                            variant={editing ? 'success' : 'primary'}
                            disabled={loading.form || loading.departments}
                        >
                            {loading.form ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Processing...</span>
                                </>
                            ) : editing ? 'Update Employee' : ' ➕ Add Employee'}
                        </Button>
                        
                        {editing && (
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

            <Card className="p-3 shadow-sm">
                <h4 className="mb-3">Employee List</h4>
                {loading.employees && !employeeData.length ? (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading employees...</p>
                    </div>
                ) : (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Employee #</th>
                                    <th>Department</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((employee, index) => (
                                        <tr key={employee.id}>
                                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.employeeNumber}</td>
                                            <td>{employee.department?.codeType}</td>
                                            <td>{employee.personType}</td>
                                            <td>
                                                <span className={`badge ${employee.active ? 'bg-success' : 'bg-secondary'}`}>
                                                    {employee.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm" 
                                                    onClick={() => fetchEmployeeById(employee.id)}
                                                    disabled={loading.form || loading.employees}
                                                    className="me-2"
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(employee.id)}
                                                    disabled={loading.employees}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No employees found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {filteredData.length > rowsPerPage && (
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <Button
                                    variant="outline-primary"
                                    disabled={currentPage === 1 || loading.employees}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-muted">
                                    Page {currentPage} of {totalPages} ({filteredData.length} employees)
                                </span>
                                <Button
                                    variant="outline-primary"
                                    disabled={currentPage === totalPages || loading.employees}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
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

export default Employee;