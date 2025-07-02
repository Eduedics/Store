import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Table, InputGroup, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StockEntries() {
  // API endpoints
  const api_urls = {
    StockEntries: '/api/stock-entries',
    itemData: '/api/items',
    uomData: '/api/uom',
    packagingData: '/api/packaging',
    storeData: '/api/stores',
    supplierData: '/api/supplier'
  };

  // Empty form template
  const getEmptyForm = () => ({
    itemsData: {
      id: null,
      name: "",
      description: "",
      itemType: "",
      itemCategory: "",
      reOrderLevel: 0,
      uomData: {
        id: null,
        name: "",
        symbol: "",
        active: false
      },
      packagingData: {
        id: null,
        pkgName: "",
        pkgSymbol: "",
        active: false
      },
      costPrice: 0,
      sellingPrice: 0,
      active: false
    },
    movementType: "",
    storeData: {
      id: null,
      storeName: "",
      storeLocation: "",
      active: false
    },
    destinationStoreData: {
      id: null,
      storeName: "",
      storeLocation: "",
      active: false
    },
    supplierData: {
      id: null,
      supName: "",
      supMail: "",
      supTel: "",
      supLocation: ""
    },
    quantity: 0,
    returnedQuantity: 0,
    orgPrice: 0,
    price: 0,
    discount: 0,
    amount: 0,
    refNo: "",
    issuedTo: "",
    transactionNo: "",
    batchNo: "",
    notes: "",
    transactionBy: {
      id: null,
      name: "",
      employeeNumber: "",
      department: {
        id: null,
        codeType: "",
        codeValue: "",
        active: false
      },
      personType: "",
      active: true
    },
    transactionDate: ""
  });

  // Axios instance
  const api = axios.create({
    baseURL: '/',
    headers: { 'Content-Type': 'application/json' }
  });

  // State management
  const [supplierData, setSupplierData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [packagingData, setPackagingData] = useState([]);
  const [stockEntriesData, setStockEntriesData] = useState([]);
  const [loading, setLoading] = useState({
    StockEntries: false,
    packaging: false,
    store: false,
    uom: false,
    item: false,
    supplier: false,
    form: false
  });
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Derived state
  const filteredData = useMemo(() => {
    return stockEntriesData.filter(entry => 
      entry.itemsData?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.refNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.transactionNo?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stockEntriesData, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredData.length / rowsPerPage), 
    [filteredData, rowsPerPage]
  );

  // Fetch all data
  const fetchAllData = async () => {
    await Promise.all([
      fetchStockEntries(),
      fetchItems(),
      fetchUOMs(),
      fetchPackaging(),
      fetchStores(),
      fetchSuppliers()
    ]);
  };

  // Fetch functions
  const fetchStockEntries = async () => {
    setLoading(prev => ({ ...prev, StockEntries: true }));
    try {
      const res = await api.get(api_urls.StockEntries);
      const data = res.data;
      const fetchedData = Array.isArray(data.content) ? data.content : data || [];
      setStockEntriesData(fetchedData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch stock entries');
    } finally {
      setLoading(prev => ({ ...prev, StockEntries: false }));
    }
  };

  const fetchItems = async () => {
    setLoading(prev => ({ ...prev, item: true }));
    try {
      const res = await api.get(api_urls.itemData);
      setItemData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(prev => ({ ...prev, item: false }));
    }
  };

  const fetchUOMs = async () => {
    setLoading(prev => ({ ...prev, uom: true }));
    try {
      const res = await api.get(api_urls.uomData);
      setUomData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch UOMs');
    } finally {
      setLoading(prev => ({ ...prev, uom: false }));
    }
  };

  const fetchPackaging = async () => {
    setLoading(prev => ({ ...prev, packaging: true }));
    try {
      const res = await api.get(api_urls.packagingData);
      setPackagingData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch packaging data');
    } finally {
      setLoading(prev => ({ ...prev, packaging: false }));
    }
  };

  const fetchStores = async () => {
    setLoading(prev => ({ ...prev, store: true }));
    try {
      const res = await api.get(api_urls.storeData);
      setStoreData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(prev => ({ ...prev, store: false }));
    }
  };

  const fetchSuppliers = async () => {
    setLoading(prev => ({ ...prev, supplier: true }));
    try {
      const res = await api.get(api_urls.supplierData);
      setSupplierData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(prev => ({ ...prev, supplier: false }));
    }
  };

  // const fetchStockEntryById = async (id) => {
  //   setLoading(prev => ({ ...prev, form: true }));
  //   try {
  //     const res = await api.get(`${api_urls.StockEntries}/${id}`);
  //     setFormData(res.data);
  //     setEditing(true);
  //     setEditId(id);
  //     toast.success('Stock entry loaded for editing');
  //   } catch (err) {
  //     setError(err.message);
  //     toast.error('Failed to fetch stock entry details');
  //   } finally {
  //     setLoading(prev => ({ ...prev, form: false }));
  //   }
  // };

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(prev => ({ ...prev, form: true }));
    
    try {
      let response;
      if (editing) {
        response = await api.put(`${api_urls.StockEntries}/${editId}`, formData);
        setStockEntriesData(prev => 
          prev.map(entry => entry.id === editId ? response.data : entry)
        );
        toast.success('Stock entry updated successfully!');
      } else {
        response = await api.post(api_urls.StockEntries, formData);
        setStockEntriesData(prev => [...prev, response.data]);
        toast.success('Stock entry added successfully!');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelect = (type, selectedItem) => {
    switch (type) {
      case 'item':
        setFormData(prev => ({
          ...prev,
          itemsData: selectedItem
        }));
        break;
      case 'uom':
        setFormData(prev => ({
          ...prev,
          itemsData: {
            ...prev.itemsData,
            uomData: selectedItem
          }
        }));
        break;
      case 'packaging':
        setFormData(prev => ({
          ...prev,
          itemsData: {
            ...prev.itemsData,
            packagingData: selectedItem
          }
        }));
        break;
      case 'store':
        setFormData(prev => ({
          ...prev,
          storeData: selectedItem
        }));
        break;
      case 'destinationStore':
        setFormData(prev => ({
          ...prev,
          destinationStoreData: selectedItem
        }));
        break;
      case 'supplier':
        setFormData(prev => ({
          ...prev,
          supplierData: selectedItem
        }));
        break;
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock entry?')) return;
    
    setLoading(prev => ({ ...prev, StockEntries: true }));
    try {
      await api.delete(`${api_urls.StockEntries}/${id}`);
      setStockEntriesData(prev => prev.filter(entry => entry.id !== id));
      if (editId === id) resetForm();
      toast.success('Stock entry deleted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      toast.error(`Error deleting stock entry: ${errorMsg}`);
    } finally {
      setLoading(prev => ({ ...prev, StockEntries: false }));
    }
  };

  const resetForm = () => {
    setFormData(getEmptyForm());
    setEditing(false);
    setEditId(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <Container className="mt-4">
      
      <h2 className="text-center mb-4">Stock Entries Management</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {typeof error === 'string' ? error : error.message}
        </Alert>
      )}

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by item name, reference or transaction number..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          disabled={loading.StockEntries}
        />
        <Form.Select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{ maxWidth: '150px', marginLeft: '1rem' }}
          disabled={loading.StockEntries}
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </Form.Select>
      </InputGroup>

      <Card className="p-4 shadow-sm mb-4">
        <h4 className='text-info'>{editing ? 'Edit Stock Entry' : '➕ Add New Stock Entry'}</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item</Form.Label>
                <Form.Select
                  value={formData.itemsData.id || ''}
                  onChange={(e) => {
                    const selectedItem = itemData.find(item => item.id === e.target.value);
                    if (selectedItem) handleSelect('item', selectedItem);
                  }}
                  disabled={loading.item || loading.form}
                  required
                >
                  <option value="">Select Item</option>
                  {itemData.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
                {loading.item && <small className="text-muted">Loading items...</small>}
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>UOM</Form.Label>
                <Form.Select
                  value={formData.itemsData.uomData.id || ''}
                  onChange={(e) => {
                    const selectedUOM = uomData.find(uom => uom.id === e.target.value);
                    if (selectedUOM) handleSelect('uom', selectedUOM);
                  }}
                  disabled={loading.uom || loading.form}
                  required
                >
                  <option value="">Select UOM</option>
                  {uomData.map(uom => (
                    <option key={uom.id} value={uom.id}>{uom.name} ({uom.symbol})</option>
                  ))}
                </Form.Select>
                {loading.uom && <small className="text-muted">Loading UOMs...</small>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Packaging</Form.Label>
                <Form.Select
                  value={formData.itemsData.packagingData.id || ''}
                  onChange={(e) => {
                    const selectedPackaging = packagingData.find(pkg => pkg.id === e.target.value);
                    if (selectedPackaging) handleSelect('packaging', selectedPackaging);
                  }}
                  disabled={loading.packaging || loading.form}
                  required
                >
                  <option value="">Select Packaging</option>
                  {packagingData.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.pkgName} ({pkg.pkgSymbol})</option>
                  ))}
                </Form.Select>
                {loading.packaging && <small className="text-muted">Loading packaging...</small>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Movement Type</Form.Label>
                <Form.Select
                  name="movementType"
                  value={formData.movementType}
                  onChange={handleChange}
                  disabled={loading.form}
                  required
                >
                  <option value="">Select Movement Type</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                  <option value="RETURN">Return</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Store</Form.Label>
                <Form.Select
                  value={formData.storeData.id || ''}
                  onChange={(e) => {
                    const selectedStore = storeData.find(store => store.id === e.target.value);
                    if (selectedStore) handleSelect('store', selectedStore);
                  }}
                  disabled={loading.store || loading.form}
                  required
                >
                  <option value="">Select Store</option>
                  {storeData.map(store => (
                    <option key={store.id} value={store.id}>{store.storeName}</option>
                  ))}
                </Form.Select>
                {loading.store && <small className="text-muted">Loading stores...</small>}
              </Form.Group>
            </Col>

            {formData.movementType === 'TRANSFER' && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination Store</Form.Label>
                  <Form.Select
                    value={formData.destinationStoreData.id || ''}
                    onChange={(e) => {
                      const selectedStore = storeData.find(store => store.id === e.target.value);
                      if (selectedStore) handleSelect('destinationStore', selectedStore);
                    }}
                    disabled={loading.store || loading.form}
                    required
                  >
                    <option value="">Select Destination Store</option>
                    {storeData.map(store => (
                      <option key={store.id} value={store.id}>{store.storeName}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            {formData.movementType === 'PURCHASE' && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Supplier</Form.Label>
                  <Form.Select
                    value={formData.supplierData.id || ''}
                    onChange={(e) => {
                      const selectedSupplier = supplierData.find(supplier => supplier.id === e.target.value);
                      if (selectedSupplier) handleSelect('supplier', selectedSupplier);
                    }}
                    disabled={loading.supplier || loading.form}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {supplierData.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.supName}</option>
                    ))}
                  </Form.Select>
                  {loading.supplier && <small className="text-muted">Loading suppliers...</small>}
                </Form.Group>
              </Col>
            )}

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={loading.form}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={loading.form}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Reference No</Form.Label>
                <Form.Control
                  type="text"
                  name="refNo"
                  value={formData.refNo}
                  onChange={handleChange}
                  disabled={loading.form}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Transaction Date</Form.Label>
                <Form.Control
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  disabled={loading.form}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button 
              type="submit" 
              variant={editing ? 'success' : 'primary'}
              disabled={loading.form}
            >
              {loading.form ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Processing...</span>
                </>
              ) : editing ? 'Update Entry' : ' ➕ Add Entry'}
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
        <h4 className="mb-3">Stock Entries List</h4>
        {loading.StockEntries && !stockEntriesData.length ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <p>Loading stock entries...</p>
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Store Name</th>
                  <th>Movement Type</th>
                  <th>Reference No</th>
                  <th>Transsaction Date</th>
                  <th>TransactionNo</th>
                  <th>price</th>
                  <th>discount</th>
                  <th>Description</th>
                  <th>Selling Price</th>
                  <th>Cost Price</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((entry, index) => (
                    <tr key={entry.id}>
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{entry.itemsData?.name}</td>
                      <td>{entry.quantity} {entry.itemsData?.uomData?.symbol}</td>
                      <td>{entry.storeData?.storeName}</td>
                      <td>{entry.movementType}</td>
                      <td>{entry.refNo}</td>
                      <td>{entry.transactionDate}</td>
                      <td>{entry.transactionNo}</td>
                      <td>{entry.price}</td>
                      <td>{entry.discount}</td>
                      <td>{entry.itemData?.description}</td>
                      <td>{entry.itemsData?.sellingPrice}</td>  
                      {/* <td>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => fetchStockEntryById(entry.id)}
                          disabled={loading.form}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(entry.id)}
                          disabled={loading.StockEntries}
                        >
                          Delete
                        </Button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No stock entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {filteredData.length > rowsPerPage && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="outline-primary"
                  disabled={currentPage === 1 || loading.StockEntries}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <span className="text-muted">
                  Page {currentPage} of {totalPages} ({filteredData.length} entries)
                </span>
                <Button
                  variant="outline-primary"
                  disabled={currentPage === totalPages || loading.StockEntries}
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

export default StockEntries;