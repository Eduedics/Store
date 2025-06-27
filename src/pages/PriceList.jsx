import { useState, useEffect, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Table, Button, Form, Container, Row, Col, Card, Spinner, InputGroup } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const PriceList = ({ mode = 'pricelist' }) => {
  // Constants
  const API_URLS = {
    pricelist: '/api/pricelist',
    items: '/api/items',
    uom: '/api/uom',          // UOM API endpoint
    packaging: '/api/packaging' // Packaging API endpoint
  };
  const ROWS_PER_PAGE = 5;

  // Base form structure
  const getBaseForm = () => ({
    id: 0,
    item: {
      name: '',
      description: '',
      itemType: 'INVENTORY',
      itemCategory: 'ANIMAL',
      reOrderLevel: 0,
      uomData: { id: 0, name: '', symbol: '', active: true },
      packagingData: { id: 0, pkgName: '', pkgSymbol: '', active: true },
      costPrice: 0,
      sellingPrice: 0,
      active: true
    },
    price: mode === 'pricelist' ? 0 : null
  });

  // State
  const [formData, setFormData] = useState(getBaseForm());
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState({
    main: true,
    uom: false,
    packaging: false,
    form: false
  });
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [uomOptions, setUomOptions] = useState([]);
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Derived state
  const filteredData = useMemo(() => {
    return dataList.filter(item => 
      item.item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataList, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = useMemo(() => 
    Math.ceil(filteredData.length / ROWS_PER_PAGE), 
    [filteredData]
  );

  // Data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, main: true, uom: true, packaging: true }));
        
        // Fetch all data in parallel
        const [mainData, uoms, packagings] = await Promise.all([
          fetchData(API_URLS[mode]),
          fetchData(API_URLS.uom),
          fetchData(API_URLS.packaging)
        ]);

        setDataList(normalizeData(mainData));
        setUomOptions(uoms.content || uoms || []);
        setPackagingOptions(packagings.content || packagings || []);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(prev => ({ ...prev, main: false, uom: false, packaging: false }));
      }
    };

    fetchInitialData();
  }, [mode]);

  // Helper functions
  const fetchData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  const normalizeData = (data) => {
    const fetchedData = Array.isArray(data.content) ? data.content : data || [];
    return fetchedData.map(entry => ({
      ...entry,
      item: {
        ...getBaseForm().item,
        ...(entry.item || {})
      }
    }));
  };

  // Handle UOM selection
  const handleUomSelect = (uomId) => {
    const selectedUom = uomOptions.find(uom => uom.id === uomId);
    if (selectedUom) {
      setFormData(prev => ({
        ...prev,
        item: {
          ...prev.item,
          uomData: {
            id: selectedUom.id,
            name: selectedUom.name,
            symbol: selectedUom.symbol,
            active: selectedUom.active
          }
        }
      }));
    }
  };

  // Handle Packaging selection
  const handlePackagingSelect = (packagingId) => {
    const selectedPackaging = packagingOptions.find(pkg => pkg.id === packagingId);
    if (selectedPackaging) {
      setFormData(prev => ({
        ...prev,
        item: {
          ...prev.item,
          packagingData: {
            id: selectedPackaging.id,
            pkgName: selectedPackaging.pkgName,
            pkgSymbol: selectedPackaging.pkgSymbol,
            active: selectedPackaging.active
          }
        }
      }));
    }
  };

  // Event handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
      }
      
      current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
      return newData;
    });
  };

  const clearForm = () => {
    setFormData(getBaseForm());
    setIsUpdateMode(false);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.item.name.trim()) errors.push('Item name is required');
    if (!formData.item.itemType.trim()) errors.push('Item type is required');
    if (!formData.item.uomData.id) errors.push('Unit of Measure is required');
    if (!formData.item.packagingData.id) errors.push('Packaging is required');
    if (isNaN(formData.item.costPrice)) errors.push('Cost price must be a number');
    if (isNaN(formData.item.sellingPrice)) errors.push('Selling price must be a number');
    if (mode === 'pricelist' && isNaN(formData.price)) errors.push('Price must be a number');

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      item: {
        ...formData.item,
        costPrice: Number(formData.item.costPrice),
        sellingPrice: Number(formData.item.sellingPrice),
        reOrderLevel: Number(formData.item.reOrderLevel),
        // Ensure we only send the ID for relationships
        uomData: { id: formData.item.uomData.id },
        packagingData: { id: formData.item.packagingData.id }
      },
      price: mode === 'pricelist' ? Number(formData.price) : undefined
    };

    try {
      setLoading(prev => ({ ...prev, form: true }));
      
      const method = isUpdateMode ? 'PUT' : 'POST';
      const url = isUpdateMode ? `${API_URLS[mode]}/${formData.id}` : API_URLS[mode];
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      const updatedList = isUpdateMode
        ? dataList.map(item => item.id === result.id ? result : item)
        : [...dataList, result];

      setDataList(updatedList);
      toast.success(`${isUpdateMode ? 'Updated' : 'Added'} successfully!`);
      clearForm();
    } catch (err) {
      toast.error(`Error ${isUpdateMode ? 'updating' : 'adding'}: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleEditClick = (entry) => {
    setFormData({
      ...entry,
      item: {
        ...entry.item,
        costPrice: String(entry.item.costPrice),
        sellingPrice: String(entry.item.sellingPrice),
        reOrderLevel: String(entry.item.reOrderLevel),
        // Ensure uomData and packagingData are properly set
        uomData: entry.item.uomData || getBaseForm().item.uomData,
        packagingData: entry.item.packagingData || getBaseForm().item.packagingData
      },
      price: mode === 'pricelist' ? String(entry.price) : undefined
    });
    setIsUpdateMode(true);
  };

  const handleGetById = async (id) => {
    try {
      setLoading(prev => ({ ...prev, main: true }));
      const data = await fetchData(`${API_URLS[mode]}/${id}`);
      toast.info(`Fetched item: ${data.item?.name || 'N/A'}`);
      
      setFormData({
        ...getBaseForm(),
        ...data,
        id,
        item: {
          ...getBaseForm().item,
          ...(data.item || {}),
          // Ensure uomData and packagingData are properly set
          uomData: data.item?.uomData || getBaseForm().item.uomData,
          packagingData: data.item?.packagingData || getBaseForm().item.packagingData
        }
      });
      
      setIsUpdateMode(false);
    } catch (err) {
      toast.error('Error fetching item: ' + err.message);
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setLoading(prev => ({ ...prev, main: true }));
      const response = await fetch(`${API_URLS[mode]}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setDataList(dataList.filter(item => item.id !== id));
      toast.success('Deleted successfully!');
    } catch (err) {
      toast.error('Error deleting: ' + err.message);
    } finally {
      setLoading(prev => ({ ...prev, main: false }));
    }
  };

  // Render functions
  const renderForm = () => (
    <Card className="p-4 shadow-sm mt-4">
      <h4 className="mb-3">{isUpdateMode ? 'Update Entry' : 'add New Entry'}</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="itemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="item.name"
                value={formData.item.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="itemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="item.description"
                value={formData.item.description}
                onChange={handleChange}
                placeholder="Enter item description"
                disabled={loading.form}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="itemType">
              <Form.Label>Item Type</Form.Label>
              <Form.Control
                as="select"
                name="item.itemType"
                value={formData.item.itemType}
                onChange={handleChange}
                required
                disabled={loading.form}
              >
                <option value="INVENTORY">Inventory</option>
                <option value="SERVICE">Service</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="itemCategory">
              <Form.Label>Item Category</Form.Label>
              <Form.Control
                as="select"
                name="item.itemCategory"
                value={formData.item.itemCategory}
                onChange={handleChange}
                required
                disabled={loading.form}
              >
                <option value="ANIMAL">Animal</option>
                <option value="EQUIPMENT">Equipment</option>
                <option value="SUPPLY">Supply</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="itemReOrderLevel">
              <Form.Label>Re-Order Level</Form.Label>
              <Form.Control
                type="number"
                name="item.reOrderLevel"
                value={formData.item.reOrderLevel}
                onChange={handleChange}
                min="0"
                disabled={loading.form}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="uomSelect">
              <Form.Label>Unit of Measure</Form.Label>
              <Form.Select
                value={formData.item.uomData.id || ''}
                onChange={(e) => handleUomSelect(Number(e.target.value))}
                disabled={loading.uom || loading.form}
                required
              >
                <option value="">Select UOM</option>
                {uomOptions.map(uom => (
                  <option key={uom.id} value={uom.id}>
                    {uom.name} ({uom.symbol})
                  </option>
                ))}
              </Form.Select>
              {loading.uom && <small>Loading UOM options...</small>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="packagingSelect">
              <Form.Label>package size</Form.Label>
              <Form.Select
                value={formData.item.packagingData.id || ''}
                onChange={(e) => handlePackagingSelect(Number(e.target.value))}
                disabled={loading.packaging || loading.form}
                required
              >
                <option value="">Select Packaging</option>
                {packagingOptions.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.pkgName} ({pkg.pkgSymbol})
                  </option>
                ))}
              </Form.Select>
              {loading.packaging && <small>Loading packaging options...</small>}
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="costPrice">
              <Form.Label>Cost Price</Form.Label>
              <Form.Control
                type="number"
                name="item.costPrice"
                value={formData.item.costPrice}
                onChange={handleChange}
                placeholder="Enter cost price"
                min="0"
                step="0.01"
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="sellingPrice">
              <Form.Label>Selling Price</Form.Label>
              <Form.Control
                type="number"
                name="item.sellingPrice"
                value={formData.item.sellingPrice}
                onChange={handleChange}
                placeholder="Enter selling price"
                min="0"
                step="0.01"
                required
                disabled={loading.form}
              />
            </Form.Group>
          </Col>
          {mode === 'pricelist' && (
            <Col md={4}>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading.form}
                />
              </Form.Group>
            </Col>
          )}
        </Row>

        <div className="d-flex gap-2">
          <Button 
            type="submit" 
            variant={isUpdateMode ? 'success' : 'primary'}
            disabled={loading.form || loading.uom || loading.packaging}
          >
            {loading.form ? 'Processing...' : isUpdateMode ? '💾 Save Update' : '➕ Add New'}
          </Button>
          {isUpdateMode && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={clearForm}
              disabled={loading.form}
            >
              ❌ Cancel
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );

  const renderTable = () => (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>UOM</th>
            <th>Packaging</th>
            <th>Cost</th>
            <th>Price</th>
            {mode === 'pricelist' && <th>List Price</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item.name}</td>
                <td>{item.item.itemType}</td>
                <td>{item.item.itemCategory}</td>
                <td>{item.item.uomData?.symbol || 'N/A'}</td>
                <td>{item.item.packagingData?.pkgSymbol || 'N/A'}</td>
                <td>${Number(item.item.costPrice).toFixed(2)}</td>
                <td>${Number(item.item.sellingPrice).toFixed(2)}</td>
                {mode === 'pricelist' && <td>${Number(item.price).toFixed(2)}</td>}
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => handleGetById(item.id)} 
                    className="me-2"
                    disabled={loading.main}
                  >
                    Info
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleEditClick(item)} 
                    className="me-2"
                    disabled={loading.main}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(item.id)}
                    disabled={loading.main}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={mode === 'pricelist' ? 11 : 10} className="text-center">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {filteredData.length > ROWS_PER_PAGE && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            variant="outline-secondary"
            disabled={currentPage === 1 || loading.main}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages} ({filteredData.length} items)
          </span>
          <Button
            variant="outline-secondary"
            disabled={currentPage === totalPages || loading.main}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );

  const renderItemDetails = () => (
    formData.id && !isUpdateMode && (
      <Card className="mb-4">
        <Card.Header>📌 Item Details</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}><strong>Name:</strong> {formData.item.name}</Col>
            <Col md={6}><strong>Type:</strong> {formData.item.itemType}</Col>
            <Col md={6}><strong>Category:</strong> {formData.item.itemCategory}</Col>
            <Col md={6}><strong>UOM:</strong> {formData.item.uomData?.name || 'N/A'} ({formData.item.uomData?.symbol || 'N/A'})</Col>
            <Col md={6}><strong>Packaging:</strong> {formData.item.packagingData?.pkgName || 'N/A'} ({formData.item.packagingData?.pkgSymbol || 'N/A'})</Col>
            <Col md={6}><strong>Cost:</strong> ${Number(formData.item.costPrice).toFixed(2)}</Col>
            <Col md={6}><strong>Price:</strong> ${Number(formData.item.sellingPrice).toFixed(2)}</Col>
            {mode === 'pricelist' && (
              <Col md={6}><strong>List Price:</strong> ${Number(formData.price).toFixed(2)}</Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    )
  );

  // Main render
  if (loading.main) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
      <p>Loading data...</p>
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <div className="alert alert-danger">Error: {error}</div>
    </Container>
  );

  return (
    <Container className="mt-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <h2 className="mb-4 text-center">
        {mode === 'pricelist' ? 'Price List Management' : 'Inventory Item Management'}
      </h2>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by item name..."
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search items"
          disabled={loading.main}
        />
      </InputGroup>

      {renderForm()}
      {renderTable()}
      {renderItemDetails()}
    </Container>
  );
};

export default PriceList;