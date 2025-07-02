import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Inventory() {
    const apiUrl = '/api/inventory';
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState({
        inventory: true,
        movementTypes: false,
        update: false
    });
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [movementTypes, setMovementTypes] = useState([]);

    const api = axios.create({
        baseURL: '/',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const fetchInventoryMovementData = async () => {
        setLoading(prev => ({ ...prev, movementTypes: true }));
        try {
            const response = await api.get(`${apiUrl}/movement-types`);
            setMovementTypes(response.data);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to fetch movement types');
        } finally {
            setLoading(prev => ({ ...prev, movementTypes: false }));
        }
    };

    const fetchInventoryData = async () => {
        setLoading(prev => ({ ...prev, inventory: true }));
        try {
            const response = await api.get(apiUrl);
            setInventoryData(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.message);
            toast.error(`${err.message},{toastId:'Failed to fetch inventory data'}`);
        } finally {
            setLoading(prev => ({ ...prev, inventory: false }));
        }
    };

    useEffect(() => {
        fetchInventoryData();
        fetchInventoryMovementData();
    }, []);

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditFormData({
            quantity: item.quantity,
            movementType: item.movementType,
            notes: item.notes || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditFormData({});
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateInventoryItem = async (id) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            const response = await api.put(`${apiUrl}/${id}`, editFormData);
            setInventoryData(prevData =>
                prevData.map(item => (item.id === id ? response.data : item))
            );
            toast.success('Inventory item updated successfully!');
            setEditingId(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            setError(errorMsg);
            toast.error(`Update failed: ${errorMsg}`);
        } finally {
            setLoading(prev => ({ ...prev, update: false }));
        }
    };

    return (
        <Container className="mt-4">

            <h2 className="mb-4 text-center ">Inventory Management</h2>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {loading.inventory ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading inventory data...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Movement Type</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.length > 0 ? (
                            inventoryData.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.itemName || 'N/A'}</td>
                                    {editingId === item.id ? (
                                        <>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity"
                                                    value={editFormData.quantity}
                                                    onChange={handleEditFormChange}
                                                    disabled={loading.update}
                                                />
                                            </td>
                                            <td>
                                                {loading.movementTypes ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <Form.Select
                                                        name="movementType"
                                                        value={editFormData.movementType}
                                                        onChange={handleEditFormChange}
                                                        disabled={loading.update}
                                                    >
                                                        {movementTypes.map(type => (
                                                            <option key={type.id} value={type.id}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                )}
                                            </td>
                                            <td colSpan={2}>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => updateInventoryItem(item.id)}
                                                        disabled={loading.update}
                                                    >
                                                        {loading.update ? (
                                                            <Spinner as="span" size="sm" animation="border" />
                                                        ) : 'Save'}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={handleCancelEdit}
                                                        disabled={loading.update}
                                                    >
                                                      ❌  Cancel
                                                    </Button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {movementTypes.find(t => t.id === item.movementType)?.name || 'N/A'}
                                            </td>
                                            <td>{new Date(item.updatedAt).toLocaleString()}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleEditClick(item)}
                                                    disabled={loading.update}
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    No inventory items found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default Inventory;