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
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Button,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  FilterAlt as FilterAltIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isWithinInterval, isValid } from 'date-fns';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Base_Url } from '../../../Base_Url/Base_Url';
import AppNavBar from '../../AppNavBar';

const ShowAllCCWdCode = () => {
  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Date filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateFilterActive, setDateFilterActive] = useState(false);

  const { wdCode } = useParams();

  // Fetch data from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${Base_Url}/color-Code/count/get-count-data-by-wdcode?wdCode=${wdCode}`);
      
      // Process data for consistency with the component
      const processedData = response.data.map(item => ({
        ...item,
        date: item.todayDate // Map todayDate to date field for consistency
      }));
      
      setProducts(processedData);
      setFilteredProducts(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply all filters (search and date range)
  useEffect(() => {
    let results = [...products];
    
    // Apply search filter
    if (searchTerm !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      results = results.filter(product => 
        (product.colorName && product.colorName.toLowerCase().includes(lowercasedSearch)) ||
        (product.productName && product.productName.toLowerCase().includes(lowercasedSearch)) ||
        (product.colorCode && product.colorCode.toLowerCase().includes(lowercasedSearch)) ||
        (product.wdCode && product.wdCode.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    // Apply date filter if active
    if (dateFilterActive && startDate && endDate && isValid(startDate) && isValid(endDate)) {
      results = results.filter(product => {
        try {
          const productDate = parseISO(product.date || product.todayDate);
          return isWithinInterval(productDate, { start: startDate, end: endDate });
        } catch (error) {
          // If date parsing fails, don't filter out the product
          return true;
        }
      });
    }
    
    setFilteredProducts(results);
  }, [searchTerm, products, dateFilterActive, startDate, endDate]);

  // Handle menu open
  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  // Apply date filter
  const handleApplyDateFilter = () => {
    if (startDate && endDate) {
      setDateFilterActive(true);
    }
  };

  // Reset date filter
  const handleResetDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateFilterActive(false);
  };

  // Get contrasting text color based on background color
  const getContrastColor = (hexColor) => {
    if (!hexColor) return '#000000';
    
    // Remove hash sign if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  return (
    <>
    <AppNavBar/>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <InventoryIcon sx={{ fontSize: 40, color: '#1e40af' }} />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Data Collection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your product catalog and inventory
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchProducts}
                  sx={{ 
                    bgcolor: '#1e40af', 
                    '&:hover': { bgcolor: '#1e3a8a' },
                    borderRadius: 2
                  }}
                >
                  Refresh Data
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Search Bar */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size='small'
                  placeholder="Search by color name, product name, color code or WD code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    sx: {
                      borderRadius: 2,
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: '#f1f5f9'
                      }
                    }
                  }}
                />
              </Grid>

              {/* Date Range Filter */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DateRangeIcon fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                bgcolor: '#f8fafc',
                                '&:hover': {
                                  bgcolor: '#f1f5f9'
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DateRangeIcon fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                              sx: {
                                borderRadius: 2,
                                bgcolor: '#f8fafc',
                                '&:hover': {
                                  bgcolor: '#f1f5f9'
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleApplyDateFilter}
                          disabled={!startDate || !endDate}
                          sx={{ 
                            bgcolor: dateFilterActive ? 'success.main' : '#1e40af',
                            borderRadius: 2,
                            minWidth: 0,
                            p: 1,
                            '&:hover': {
                              bgcolor: dateFilterActive ? 'success.dark' : '#1e3a8a'
                            }
                          }}
                        >
                          <FilterAltIcon fontSize="small" />
                        </Button>
                        {dateFilterActive && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleResetDateFilter}
                            sx={{ 
                              minWidth: 0, 
                              p: 1, 
                              borderRadius: 2,
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': {
                                borderColor: '#dc2626',
                                bgcolor: 'rgba(239, 68, 68, 0.04)'
                              }
                            }}
                          >
                            <CancelIcon fontSize="small" />
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {(dateFilterActive || searchTerm) && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {dateFilterActive && startDate && endDate && (
              <Chip
                label={`Date: ${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`}
                color="primary"
                variant="outlined"
                onDelete={handleResetDateFilter}
                sx={{ borderRadius: 1.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
              />
            )}
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                color="primary"
                variant="outlined"
                onDelete={() => setSearchTerm('')}
                sx={{ borderRadius: 1.5, bgcolor: 'rgba(59, 130, 246, 0.1)' }}
              />
            )}
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={fetchProducts}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Data Table */}
        <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1e40af' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Sr. No.</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>WD Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Product Count</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <CircularProgress size={40} sx={{ color: '#1e40af' }} />
                      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Loading products...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm || dateFilterActive ? "Try adjusting your search criteria or date range" : "Add some products to get started"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <TableRow key={product.id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell sx={{ py: 2 }}>{index + 1}</TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: product.colorCode || '#ccc',
                              borderRadius: '50%',
                              border: '2px solid #e5e7eb'
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {product.colorName}
                            </Typography>
                            {/* <Typography variant="caption" color="text.secondary">
                              {product.colorCode}
                            </Typography> */}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip 
                          label={product.wdCode} 
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(124, 58, 237, 0.1)', 
                            color: '#6d28d9',
                            fontWeight: 500,
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        {formatDate(product.todayDate)}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ color: 'rgb(16, 185, 129)', fontSize: 16 }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'rgb(16, 185, 129)'
                            }}
                          >
                            {product.productCount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, product)}
                          sx={{ 
                            bgcolor: '#f1f5f9',
                            '&:hover': { bgcolor: '#e2e8f0' }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Table Footer */}
          <Divider />
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length > 0 ? `Last updated: ${new Date().toLocaleString()}` : ''}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
              {(searchTerm || dateFilterActive) && " (filtered)"}
            </Typography>
          </Box>
        </Card>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
          PaperProps={{
            sx: {
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: 2
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" sx={{ color: '#3b82f6' }} />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: '#f59e0b' }} />
            </ListItemIcon>
            <ListItemText>Edit Product</ListItemText>
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            <ListItemText>Delete Product</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </>
  );
};

export default ShowAllCCWdCode;