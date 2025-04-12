import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Tooltip,
  Grid,
  Chip,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  ColorLens as ColorLensIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Base_Url } from '../../Base_Url/Base_Url';

const AddCountProduct = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wdCode, setWdCode] = useState(localStorage.getItem("wdcode")); 
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [todayInputValues, setTodayInputValues] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [accessDenied, setAccessDenied] = useState(false);

  const navigate = useNavigate();

  // Check for authentication credentials
  useEffect(() => {
    if (!wdCode || !email) {
      setAccessDenied(true);
      setLoading(false);
      // Redirect after 3 seconds
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wdCode, email, navigate]);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    // return `${day}-${month}-${year}`;
    return `${year}-${month}-${day}`;
  };

  // Fetch data from API
  const fetchProducts = async () => {
    if (accessDenied) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Using the URL directly in axios call as requested
      const response = await axios.post(
        `${Base_Url}/color-Code/count/get-data-count-product?wdCode=${wdCode}`,
        '',
        { headers: { 'accept': '*/*' } }
      );
      
      // If API returns an array directly
      const productData = Array.isArray(response.data) ? response.data : [];
      
      // Initialize today's input values with product count (today's collection)
      const initialInputValues = {};
      productData.forEach((product, index) => {
        initialInputValues[index] = product.productCount || '';
      });
      
      setTodayInputValues(initialInputValues);
      setProducts(productData);
      setFilteredProducts(productData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (!accessDenied) {
      fetchProducts();
    }
  }, [wdCode, accessDenied]);

  // Apply search filter
  useEffect(() => {
    if (!products.length) return;
    
    if (searchTerm === '') {
      setFilteredProducts(products);
      return;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = products.filter(product => 
      product.colorName?.toLowerCase().includes(lowercasedSearch) ||
      product.productName?.toLowerCase().includes(lowercasedSearch) ||
      product.colorCode?.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Handle today's collection input change
  const handleTodayInputChange = (index, value) => {
    setTodayInputValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  // Handle update button click
  const handleUpdateClick = async (product, index) => {
    setSavingId(index);
    
    // Create the data object for the API request
    const updatedProductData = {
      colorCode: product.colorCode || '',
      colorName: product.colorName || '',
      productName: product.productName || '',
      todayDate: getCurrentDate(),
      productCount: parseInt(todayInputValues[index]) || 0,
      wdCode: wdCode || ''
    };
    
    try {
      // Make API call to update the product count
      const response = await axios.post(
        `${Base_Url}/color-Code/count/add-count-product`,
        updatedProductData,
        // { 
        //   headers: { 
        //     'accept': '*/*',
        //     'Content-Type': 'application/json'
        //   } 
        // }
      );
      
      console.log('API Response:', response.data);

      fetchProducts();
      
      // Update local state after successful API call
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...product,
        productCount: updatedProductData.productCount,
        todayDate: updatedProductData.todayDate
      };
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts.filter(p => 
        searchTerm === '' || 
        p.colorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.colorCode?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      // Show success message
      setSnackbarMessage(`Successfully updated ${product.colorName || 'product'}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
    } catch (err) {
      console.error('Error updating product count:', err);
      
      // Show error message
      setSnackbarMessage(`Failed to update ${product.colorName || 'product'}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSavingId(null);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Get contrasting text color based on background color
  const getContrastColor = (hexColor) => {
    if (!hexColor || !hexColor.startsWith('#')) return '#000000';
    
    // Remove hash sign if present
    const color = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Check for valid RGB values
    if (isNaN(r) || isNaN(g) || isNaN(b)) return '#000000';
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Handle logout
  const handleLogout = () => {
    // Show logout message
    setSnackbarMessage("Logging out...");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    
    // Clean up localStorage
    localStorage.removeItem("wdcode");
    localStorage.removeItem("email");
    
    // Redirect after short delay for smooth transition
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  // Render access denied screen
  if (accessDenied) {
    return (
      <Container maxWidth="sm" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh'
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            borderRadius: 3, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            width: '100%'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            You are not authorized to access this page. Please log in to continue.
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
            You will be redirected to the login page in a few seconds...
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate("/")}
            sx={{ 
              backgroundColor: 'white', 
              color: '#d32f2f', 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)'
              }
            }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section with Card-like Design */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute', 
            right: -50, 
            top: -50, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }} 
        />
        
        <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="800">
             Data Collection
            </Typography>
            {/* <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
              Manage your product catalog and color inventory
            </Typography> */}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Chip 
                icon={<InventoryIcon fontSize="small" />} 
                label={`Total Products: ${products.length}`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
              <Chip 
                icon={<ColorLensIcon fontSize="small" />} 
                label={`Warehouse: ${wdCode}`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
              <Chip 
                label={`Date: ${getCurrentDate()}`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
              <Chip 
                icon={<LogoutIcon fontSize="small" />}
                label={`User: ${email?.split('@')[0] || 'User'}`} 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                px: 7,
                py: 1,
                fontWeight: 'bold',
                backgroundColor: 'white',
                color: '#d32f2f',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f8f8f8',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                }
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filter section with improved styling */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by color name, product name, or color code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.1)',
              },
              '&:hover fieldset': {
                borderColor: '#2563eb',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2563eb',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchTerm('')}
                  edge="end"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Error message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
          }}
          action={
            <Button
              color="error"
              size="small"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={fetchProducts}
              variant="text"
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Data table with enhanced styling */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(to right, #2563eb, #1e40af)' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Sr. No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Color</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Collection Till Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Today's Collection</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} sx={{ color: '#2563eb' }} />
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                      Loading products...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <InventoryIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? "Try adjusting your search criteria" : "Add some products to get started"}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product, index) => (
                  <TableRow 
                    key={index} 
                    hover 
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{index + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 70,
                            height: 70,
                            backgroundColor: product.colorCode,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getContrastColor(product.colorCode),
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {product.colorName || 'Unknown Color'}
                          </Typography>
                          {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {product.colorCode || 'No code'}
                          </Typography> */}
                          {/* <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                            {product.productName || 'No product name'}
                          </Typography> */}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            bgcolor: 'rgba(16, 185, 129, 0.1)', 
                            color: 'rgb(16, 185, 129)', 
                            fontWeight: 'bold',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 5,
                            display: 'inline-block'
                          }}
                        >
                          {product.productCount || 0}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField
                        disabled={product.todayDate !== null || "Golden Yellow"!=product.colorName}
                        variant="outlined"
                        size="small"
                        // value={''}
                        onChange={(e) => handleTodayInputChange(index, e.target.value)}
                        placeholder= {product.todayDate !== null ? "you already filled count":"Enter today's count"} //"Enter today's count"
                        type="number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.todayDate || getCurrentDate()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={savingId === index ? <CircularProgress size={16} /> : <EditIcon fontSize="small" />}
                        size="small"
                        onClick={() => handleUpdateClick(product, index)}
                        disabled={product.todayDate !== null || "Golden Yellow"!=product.colorName}
                        sx={{
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          color: '#2563eb',
                          fontWeight: 600,
                          border: '1px solid rgba(37, 99, 235, 0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(37, 99, 235, 0.2)',
                            border: '1px solid rgba(37, 99, 235, 0.3)',
                          },
                          borderRadius: 1.5,
                          transition: 'all 0.2s'
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Product count footer */}
        <Divider />
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="text"
            startIcon={<RefreshIcon />}
            onClick={fetchProducts}
            sx={{ color: '#2563eb' }}
          >
            Refresh Data
          </Button>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProducts.length} of {products.length} products
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for update success/error notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%',
            fontWeight: 'medium',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddCountProduct;
