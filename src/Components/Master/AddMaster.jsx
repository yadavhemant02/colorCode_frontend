

// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     Button,
//     CircularProgress,
//     Alert,
//     Card,
//     Tooltip,
//     IconButton,
//     Fade,
//     Chip,
//     Divider,
//     Menu,
//     MenuItem,
//     ListItemIcon,
//     ListItemText,
//     Skeleton,
//     useTheme,
//     useMediaQuery,
//     alpha
// } from '@mui/material';
// import {
//     Visibility as VisibilityIcon,
//     Add as AddIcon,
//     Refresh as RefreshIcon,
//     Block as BlockIcon,
//     FilterList as FilterListIcon,
//     MoreVert as MoreVertIcon,
//     Edit as EditIcon,
//     DeleteOutline as DeleteIcon,
//     CheckCircleOutline as ActiveIcon,
//     ErrorOutline as InactiveIcon,
//     NoPhotography as NoDataIcon
// } from '@mui/icons-material';
// import AddJobDrawer from './Master';
// import AppNavBar from '../AppNavBar';
// import axios from 'axios';
// import EnhancedSearchBar from './EnhancedSearchBar';
// import { Base_Url } from '../../Base_Url/Base_Url';
// // import EnhancedSearchBar from './EnhancedSearchBar'; // Import the new search bar component

// const ShowInventoryList = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
//     const [openDrawer, setOpenDrawer] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [searchParams, setSearchParams] = useState({ query: '', field: 'all', filter: 'all' });
//     const [filteredData, setFilteredData] = useState([]);
//     const [anchorEl, setAnchorEl] = useState(null);
//     const [filterAnchorEl, setFilterAnchorEl] = useState(null);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [colorData, setColorData] = useState([]);
//     const [allProducts, setAllProducts] = useState([]);
    
//     // Color palette - Modern Blues with accent colors
//     const COLORS = {
//         primary: '#1e40af',      // Deeper blue
//         primaryLight: '#3b82f6', // Brighter blue
//         secondary: '#dbeafe',    // Very light blue
//         accent: '#10b981',       // Emerald green for actions
//         danger: '#ef4444',       // Red for negative actions
//         warning: '#f59e0b',      // Amber for warnings
//         background: '#f8fafc',   // Very light blue-gray
//         surface: '#ffffff',      // White
//         textPrimary: '#1e293b',  // Dark slate
//         textSecondary: '#64748b', // Slate
//         border: '#e2e8f0'        // Light gray-blue
//     };

//     // Handler for search
//     const handleSearch = (params) => {
//         setSearchParams(params);
//         applyFilters(params);
//     };

//     // Apply filters to data
//     const applyFilters = (params = searchParams) => {
//         if (!colorData.length) return;
        
//         let filtered = [...colorData];
        
//         // Apply search query
//         if (params.query) {
//             const query = params.query.toLowerCase();
            
//             // Filter based on field selection
//             if (params.field === 'product') {
//                 filtered = filtered.filter(item => 
//                     item.brandName && item.brandName.toLowerCase().includes(query)
//                 );
//             } else if (params.field === 'color') {
//                 filtered = filtered.filter(item => 
//                     item.colorName && item.colorName.toLowerCase().includes(query)
//                 );
//             } else if (params.field === 'code') {
//                 filtered = filtered.filter(item => 
//                     item.colorCode && item.colorCode.toLowerCase().includes(query)
//                 );
//             } else {
//                 // Search all fields
//                 filtered = filtered.filter(item => 
//                     (item.brandName && item.brandName.toLowerCase().includes(query)) ||
//                     (item.colorName && item.colorName.toLowerCase().includes(query)) ||
//                     (item.colorCode && item.colorCode.toLowerCase().includes(query))
//                 );
//             }
//         }
        
//         // Apply status filter
//         if (params.filter && params.filter !== 'all') {
//             filtered = filtered.filter(item => item.status === params.filter);
//         }
        
//         setFilteredData(filtered);
//     };

//     // Fetch data from API
//     const getApiData = async() => {
//         try {
//             setIsLoading(true);
//             setError(null);
            
//             const response = await axios.get(`${Base_Url}/color-Code/inventory/add-inventory`);
//             const colors = response;

//             console.log(colors.data,"llllllllllll");
            
//             // Convert API data to proper product format
//             const products = colors.data.map((color, index) => ({
//                 id: `PRD-${(index + 1).toString().padStart(3, '0')}`,
//                 name: 'Cigarette Pack',
//                 status: 'active',
//                 category: 'Tobacco',
//                 colorName: color.colorName,
//                 colorCode: color.colorCode,
//                 brandName: color.brandName || 'Standard Pack'
//             }));
            
//             setColorData(products);
//             setAllProducts(products);
//             setFilteredData(products);
//             setIsLoading(false);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Failed to load products. Please try again.");
//             setIsLoading(false);
//         }
//     };

//     // Initial data load
//     useEffect(() => {
//         getApiData();
//     }, []);

//     // Handle actions
//     const handleDrawerOpen = () => setOpenDrawer(true);
//     const handleDrawerClose = () => setOpenDrawer(false);

//     const handleMenuOpen = (event, row) => {
//         setAnchorEl(event.currentTarget);
//         setSelectedRow(row);
//     };

//     const handleMenuClose = () => {
//         setAnchorEl(null);
//         setSelectedRow(null);
//     };

//     const handleFilterOpen = (event) => {
//         setFilterAnchorEl(event.currentTarget);
//     };

//     const handleFilterClose = () => {
//         setFilterAnchorEl(null);
//     };
    
//     // Handle product added
//     const handleProductAdded = (newProduct) => {
//         const productId = `PRD-${(allProducts.length + 1).toString().padStart(3, '0')}`;
//         const productWithDefaults = {
//             ...newProduct,
//             id: productId,
//             name: 'Cigarette Pack',
//             status: 'active',
//             category: 'Tobacco'
//         };
        
//         setColorData(prev => [productWithDefaults, ...prev]);
//         setAllProducts(prev => [productWithDefaults, ...prev]);
        
//         // Apply current filters to updated data
//         applyFilters();
//     };

//     // Renderer methods
//     const renderStatusBadge = (status) => (
//         <Chip
//             icon={status === 'active' ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
//             label={status === 'active' ? 'Active' : 'Inactive'}
//             size="small"
//             sx={{
//                 backgroundColor: status === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
//                 color: status === 'active' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
//                 fontWeight: 600,
//                 '& .MuiChip-icon': {
//                     color: status === 'active' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
//                 }
//             }}
//         />
//     );
    
//     const renderActionsMenu = (row) => (
//         <>
//             <IconButton
//                 size="small"
//                 onClick={(event) => handleMenuOpen(event, row)}
//                 sx={{ color: COLORS.textSecondary }}
//             >
//                 <MoreVertIcon fontSize="small" />
//             </IconButton>
            
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleMenuClose}
//                 elevation={3}
//                 anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'right',
//                 }}
//                 transformOrigin={{
//                     vertical: 'top',
//                     horizontal: 'right',
//                 }}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 2,
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                         mt: 1,
//                         minWidth: 180
//                     }
//                 }}
//             >
//                 <MenuItem onClick={handleMenuClose}>
//                     <ListItemIcon>
//                         <VisibilityIcon fontSize="small" sx={{ color: COLORS.primaryLight }} />
//                     </ListItemIcon>
//                     <ListItemText primary="View Details" />
//                 </MenuItem>
//                 <MenuItem onClick={handleMenuClose}>
//                     <ListItemIcon>
//                         <EditIcon fontSize="small" sx={{ color: COLORS.warning }} />
//                     </ListItemIcon>
//                     <ListItemText primary="Edit Product" />
//                 </MenuItem>
//                 <Divider />
//                 <MenuItem onClick={handleMenuClose}>
//                     <ListItemIcon>
//                         {selectedRow?.status === 'active' ? (
//                             <BlockIcon fontSize="small" sx={{ color: COLORS.danger }} />
//                         ) : (
//                             <ActiveIcon fontSize="small" sx={{ color: COLORS.accent }} />
//                         )}
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={selectedRow?.status === 'active' ? "Deactivate" : "Activate"} 
//                     />
//                 </MenuItem>
//                 <MenuItem onClick={handleMenuClose}>
//                     <ListItemIcon>
//                         <DeleteIcon fontSize="small" sx={{ color: COLORS.danger }} />
//                     </ListItemIcon>
//                     <ListItemText primary="Delete" />
//                 </MenuItem>
//             </Menu>
//         </>
//     );

//     const renderEmptyState = () => (
//         <Box sx={{ 
//             textAlign: 'center', 
//             py: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             gap: 2
//         }}>
//             <NoDataIcon sx={{ fontSize: 60, color: COLORS.textSecondary, opacity: 0.4 }} />
//             <Typography variant="h6" sx={{ color: COLORS.textSecondary, fontWeight: 500 }}>
//                 No products found
//             </Typography>
//             <Typography variant="body2" sx={{ color: COLORS.textSecondary, maxWidth: 400 }}>
//                 {searchParams.query ? 
//                     "No products match your search criteria. Try different keywords or clear your search." : 
//                     "You haven't added any products yet. Click the 'New Product' button to get started."}
//             </Typography>
//             <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={handleDrawerOpen}
//                 sx={{
//                     mt: 2,
//                     borderRadius: 2,
//                     textTransform: 'none',
//                     bgcolor: COLORS.primary,
//                     '&:hover': { bgcolor: COLORS.primaryLight }
//                 }}
//             >
//                 Add New Product
//             </Button>
//         </Box>
//     );

//     const getTableHeaders = () => {
//         return [
//             'Sr. No.',
//             'Color Image',
//             'Status',
//             'Actions'
//         ];
//     };

//     // Helper function to determine text color based on background
//     const getContrastTextColor = (hexColor) => {
//         if (!hexColor || typeof hexColor !== 'string') return '#FFFFFF';
        
//         // Remove # if present
//         const hex = hexColor.replace('#', '');
        
//         // Convert to RGB
//         let r, g, b;
//         if (hex.length === 3) {
//             r = parseInt(hex[0] + hex[0], 16);
//             g = parseInt(hex[1] + hex[1], 16);
//             b = parseInt(hex[2] + hex[2], 16);
//         } else if (hex.length === 6) {
//             r = parseInt(hex.substring(0, 2), 16);
//             g = parseInt(hex.substring(2, 4), 16);
//             b = parseInt(hex.substring(4, 6), 16);
//         } else {
//             return '#FFFFFF';
//         }
        
//         // Calculate luminance - brighter colors have higher values
//         const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
//         // Return white for dark colors, black for light colors
//         return luminance > 0.5 ? '#000000' : '#FFFFFF';
//     };

//     return (
//         <>
//         <AppNavBar/>
//         <Box sx={{
//             p: { xs: 2, sm: 3 },
//             backgroundColor: COLORS.background,
//             borderRadius: '12px',
//             minHeight: '80vh',
//             display: 'flex',
//             flexDirection: 'column'
//         }}>
//             {/* Page Header */}
//             <Box sx={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center',
//                 mb: 3
//             }}>
//                 <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.textPrimary }}>
//                     Product Inventory
//                 </Typography>
                
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={handleDrawerOpen}
//                     sx={{
//                         borderRadius: 2,
//                         textTransform: 'none',
//                         bgcolor: COLORS.accent,
//                         '&:hover': { bgcolor: '#0ea271' },
//                         boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
//                         fontWeight: 500,
//                         display: { xs: 'none', sm: 'flex' }
//                     }}
//                 >
//                     New Product
//                 </Button>
//             </Box>
            
//             {/* Enhanced Search Bar */}
//             <EnhancedSearchBar 
//                 onSearch={handleSearch}
//                 colors={colorData}
//             />
            
//             {/* Error Alert */}
//             {error && (
//                 <Alert 
//                     severity="error" 
//                     sx={{ mb: 3, borderRadius: 2 }}
//                     action={
//                         <Button 
//                             color="inherit" 
//                             size="small" 
//                             startIcon={<RefreshIcon />}
//                             onClick={getApiData}
//                         >
//                             Retry
//                         </Button>
//                     }
//                 >
//                     {error}
//                 </Alert>
//             )}
            
//             {/* Products Card */}
//             <Card
//                 elevation={0}
//                 sx={{
//                     flex: 1,
//                     borderRadius: 3,
//                     bgcolor: COLORS.surface,
//                     border: `1px solid ${COLORS.border}`,
//                     overflow: 'hidden'
//                 }}
//             >
//                 {isLoading ? (
//                    <Box sx={{ p: 3 }}>
//                    <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
//                    {[1, 2, 3, 4, 5].map(item => (
//                        <Skeleton key={item} variant="rounded" width="100%" height={60} sx={{ my: 1 }} />
//                    ))}
//                </Box>
//            ) : filteredData.length === 0 ? (
//                renderEmptyState()
//            ) : (
//                <TableContainer sx={{ overflow: 'auto' }}>
//                    <Table sx={{ minWidth: 650 }}>
//                        <TableHead>
//                            <TableRow sx={{
//                                backgroundColor: COLORS.primary,
//                                '& th': {
//                                    color: 'white',
//                                    fontWeight: 600,
//                                    fontSize: '0.875rem',
//                                    padding: '16px',
//                                    whiteSpace: 'nowrap'
//                                }
//                            }}>
//                                {getTableHeaders().map((header, index) => (
//                                    <TableCell key={index} sx={{ color: 'inherit' }}>
//                                        {header}
//                                    </TableCell>
//                                ))}
//                            </TableRow>
//                        </TableHead>
//                        <TableBody>
//                            {filteredData.map((product, index) => (
//                                <TableRow 
//                                    key={product.id || index}
//                                    sx={{
//                                        '&:hover': { bgcolor: COLORS.secondary },
//                                        transition: 'background-color 0.2s ease'
//                                    }}
//                                >
//                                    <TableCell>{index + 1}</TableCell>
//                                    <TableCell>
//                                        <Box
//                                            sx={{ 
//                                                width: 100, 
//                                                height: 60, 
//                                                borderRadius: 2,
//                                                backgroundColor: product.colorCode,
//                                                display: 'flex',
//                                                alignItems: 'center',
//                                                justifyContent: 'center',
//                                                color: getContrastTextColor(product.colorCode),
//                                                fontWeight: 'bold',
//                                                fontSize: '0.7rem',
//                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                                            }}
//                                        >
//                                            {product.colorName}
//                                        </Box>
//                                    </TableCell>
//                                    <TableCell>{renderStatusBadge(product.status || 'active')}</TableCell>
//                                    <TableCell>{renderActionsMenu(product)}</TableCell>
//                                </TableRow>
//                            ))}
//                        </TableBody>
//                    </Table>
//                </TableContainer>
//            )}
//        </Card>

//        {/* Form Drawer */}
//        <AddJobDrawer
//            isOpen={openDrawer}
//            onClose={handleDrawerClose}
//            onProductAdded={handleProductAdded}
//        />

//        {/* Floating Action Buttons */}
//        <Box
//            sx={{
//                position: 'fixed',
//                bottom: 24,
//                right: 24,
//                display: { xs: 'block', sm: 'none' }
//            }}
//        >
//            <Tooltip title="Add New Product" arrow placement="left">
//                <Fade in={true}>
//                    <IconButton
//                        onClick={handleDrawerOpen}
//                        sx={{
//                            width: 56,
//                            height: 56,
//                            backgroundColor: COLORS.accent,
//                            color: 'white',
//                            '&:hover': {
//                                backgroundColor: '#0ea271',
//                                transform: 'scale(1.05)'
//                            },
//                            transition: 'all 0.2s ease',
//                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
//                        }}
//                    >
//                        <AddIcon fontSize="medium" />
//                    </IconButton>
//                </Fade>
//            </Tooltip>
//        </Box>
//    </Box>
//    </>
// );
// };

// export default ShowInventoryList;




import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Card,
    Tooltip,
    IconButton,
    Fade,
    Chip,
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    useTheme,
    useMediaQuery,
    alpha,
    TextField,
    InputAdornment,
    Grid,
    FormControl,
    Select,
    InputLabel,
    Badge,
    Collapse,
    Autocomplete
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Block as BlockIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    DeleteOutline as DeleteIcon,
    CheckCircleOutline as ActiveIcon,
    ErrorOutline as InactiveIcon,
    NoPhotography as NoDataIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    ColorLens as ColorLensIcon,
    Palette as PaletteIcon
} from '@mui/icons-material';
import AddJobDrawer from './Master';
import AppNavBar from '../AppNavBar';
import axios from 'axios';
import { Base_Url } from '../../Base_Url/Base_Url';
import { motion } from 'framer-motion';
import {
    ViewModule as GridViewIcon,
    ViewList as ViewListIcon
} from '@mui/icons-material';

// Enhanced Search Component with Advanced Filtering
const EnhancedSearchBar = ({ onSearch, colors, initialSearchParams }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [searchParams, setSearchParams] = useState(initialSearchParams || { 
        query: '', 
        field: 'all', 
        filter: 'all',
        colorType: 'all'
    });
    const [activeFilters, setActiveFilters] = useState(0);
    
    useEffect(() => {
        // Count active filters
        let count = 0;
        if (searchParams.query) count++;
        if (searchParams.field !== 'all') count++;
        if (searchParams.filter !== 'all') count++;
        if (searchParams.colorType !== 'all') count++;
        setActiveFilters(count);
    }, [searchParams]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedParams = { ...searchParams, [name]: value };
        setSearchParams(updatedParams);
        onSearch(updatedParams);
    };
    
    const handleSearchChange = (e) => {
        const value = e.target.value;
        const updatedParams = { ...searchParams, query: value || '' };
        setSearchParams(updatedParams);
        onSearch(updatedParams);
    };
    
    const handleClear = () => {
        const resetParams = { query: '', field: 'all', filter: 'all', colorType: 'all' };
        setSearchParams(resetParams);
        onSearch(resetParams);
    };
    
    return (
        <Card elevation={0} sx={{
            mb: 3,
            p: 2,
            borderRadius: '16px',
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            transition: 'all 0.3s ease'
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={expanded ? 12 : 10}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by color name, code or brand..."
                        value={searchParams.query}
                        onChange={handleSearchChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '&:hover': {
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                            endAdornment: searchParams.query && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => {
                                        const updatedParams = { ...searchParams, query: '' };
                                        setSearchParams(updatedParams);
                                        onSearch(updatedParams);
                                    }}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} md={expanded ? 12 : 2} sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant={activeFilters > 0 ? "contained" : "outlined"}
                        color="primary"
                        startIcon={<FilterListIcon />}
                        endIcon={
                            activeFilters > 0 ? (
                                <Badge badgeContent={activeFilters} color="error" sx={{ mr: 1 }}>
                                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </Badge>
                            ) : (
                                expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                            )
                        }
                        onClick={() => setExpanded(!expanded)}
                        sx={{ 
                            borderRadius: '12px', 
                            flexGrow: { xs: 1, md: 0 },
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        {activeFilters > 0 ? "Filters Applied" : "Filters"}
                    </Button>
                    
                    {activeFilters > 0 && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleClear}
                            sx={{ borderRadius: '12px', textTransform: 'none' }}
                        >
                            Clear All
                        </Button>
                    )}
                </Grid>
                
                <Grid item xs={12}>
                    <Collapse in={expanded}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="search-field-label">Search Field</InputLabel>
                                    <Select
                                        labelId="search-field-label"
                                        name="field"
                                        value={searchParams.field}
                                        onChange={handleChange}
                                        label="Search Field"
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="all">All Fields</MenuItem>
                                        <MenuItem value="product">Brand Name</MenuItem>
                                        <MenuItem value="color">Color Name</MenuItem>
                                        <MenuItem value="code">Color Code</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-filter-label">Status</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        name="filter"
                                        value={searchParams.filter}
                                        onChange={handleChange}
                                        label="Status"
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="all">All Statuses</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel id="color-type-label">Color Type</InputLabel>
                                    <Select
                                        labelId="color-type-label"
                                        name="colorType"
                                        value={searchParams.colorType}
                                        onChange={handleChange}
                                        label="Color Type"
                                        sx={{ borderRadius: '12px' }}
                                    >
                                        <MenuItem value="all">All Types</MenuItem>
                                        <MenuItem value="primary">Primary Colors</MenuItem>
                                        <MenuItem value="pastel">Pastel Colors</MenuItem>
                                        <MenuItem value="dark">Dark Colors</MenuItem>
                                        <MenuItem value="light">Light Colors</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </Card>
    );
};

const ShowInventoryList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({ query: '', field: 'all', filter: 'all', colorType: 'all' });
    const [filteredData, setFilteredData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [colorData, setColorData] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    
    // Modern Color palette with enhanced aesthetic
    const COLORS = {
        primary: '#2563eb',      // Vivid blue
        primaryLight: '#3b82f6', // Bright blue
        primaryDark: '#1e40af',  // Deep blue
        secondary: '#dbeafe',    // Very light blue
        accent: '#10b981',       // Emerald green for actions
        accentLight: '#d1fae5',  // Light emerald
        danger: '#ef4444',       // Red for negative actions
        dangerLight: '#fee2e2',  // Light red
        warning: '#f59e0b',      // Amber for warnings
        warningLight: '#fef3c7', // Light amber
        background: '#f8fafc',   // Very light blue-gray
        surface: '#ffffff',      // White
        textPrimary: '#1e293b',  // Dark slate
        textSecondary: '#64748b', // Slate
        border: '#e2e8f0',       // Light gray-blue
        highlight: '#f0f9ff'     // Extremely light blue for hover states
    };

    // Determine color type based on hexcode
    const determineColorType = (hexColor) => {
        if (!hexColor) return 'unknown';
        
        // Remove # if present
        const hex = hexColor.replace('#', '');
        
        // Convert to RGB
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return 'unknown';
        }
        
        // Calculate brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // Check if it's a primary color
        const isPrimary = 
            (r > 200 && g < 50 && b < 50) || // Red
            (r < 50 && g > 200 && b < 50) || // Green
            (r < 50 && g < 50 && b > 200);   // Blue
            
        if (isPrimary) return 'primary';
        if (brightness < 80) return 'dark';
        if (brightness > 200) return 'light';
        
        // Pastel check - high brightness but not completely white
        const saturation = Math.max(r, g, b) - Math.min(r, g, b);
        if (brightness > 180 && saturation < 80) return 'pastel';
        
        return 'unknown';
    };

    // Handler for search
    const handleSearch = (params) => {
        setSearchParams(params);
        applyFilters(params);
    };

    // Apply filters to data
    const applyFilters = (params = searchParams) => {
        if (!colorData.length) return;
        
        let filtered = [...colorData];
        
        // Apply search query
        if (params.query) {
            const query = params.query.toLowerCase();
            
            // Filter based on field selection
            if (params.field === 'product') {
                filtered = filtered.filter(item => 
                    item.brandName && item.brandName.toLowerCase().includes(query)
                );
            } else if (params.field === 'color') {
                filtered = filtered.filter(item => 
                    item.colorName && item.colorName.toLowerCase().includes(query)
                );
            } else if (params.field === 'code') {
                filtered = filtered.filter(item => 
                    item.colorCode && item.colorCode.toLowerCase().includes(query)
                );
            } else {
                // Search all fields
                filtered = filtered.filter(item => 
                    (item.brandName && item.brandName.toLowerCase().includes(query)) ||
                    (item.colorName && item.colorName.toLowerCase().includes(query)) ||
                    (item.colorCode && item.colorCode.toLowerCase().includes(query))
                );
            }
        }
        
        // Apply status filter
        if (params.filter && params.filter !== 'all') {
            filtered = filtered.filter(item => item.status === params.filter);
        }
        
        // Apply color type filter
        if (params.colorType && params.colorType !== 'all') {
            filtered = filtered.filter(item => item.colorType === params.colorType);
        }
        
        setFilteredData(filtered);
    };

    // Fetch data from API
    const getApiData = async() => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await axios.get(`${Base_Url}/color-Code/inventory/add-inventory`);
            const colors = response;
            
            // Convert API data to proper product format
            const products = colors.data.map((color, index) => {
                const colorType = determineColorType(color.colorCode);
                return {
                    id: `PRD-${(index + 1).toString().padStart(3, '0')}`,
                    name: 'Cigarette Pack',
                    status: 'active',
                    category: 'Tobacco',
                    colorName: color.colorName,
                    colorCode: color.colorCode,
                    brandName: color.brandName || 'Standard Pack',
                    colorType: colorType
                };
            });
            
            setColorData(products);
            setAllProducts(products);
            setFilteredData(products);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load products. Please try again.");
            setIsLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        getApiData();
    }, []);

    // Handle actions
    const handleDrawerOpen = () => setOpenDrawer(true);
    const handleDrawerClose = () => setOpenDrawer(false);

    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleFilterOpen = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };
    
    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'grid' : 'table');
    };
    
    // Handle product added
    const handleProductAdded = (newProduct) => {
        const productId = `PRD-${(allProducts.length + 1).toString().padStart(3, '0')}`;
        const colorType = determineColorType(newProduct.colorCode);
        
        const productWithDefaults = {
            ...newProduct,
            id: productId,
            name: 'Cigarette Pack',
            status: 'active',
            category: 'Tobacco',
            colorType: colorType
        };
        
        setColorData(prev => [productWithDefaults, ...prev]);
        setAllProducts(prev => [productWithDefaults, ...prev]);
        
        // Apply current filters to updated data
        applyFilters();
    };

    // Renderer methods
    const renderStatusBadge = (status) => (
        <Chip
            icon={status === 'active' ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
            label={status === 'active' ? 'Active' : 'Inactive'}
            size="small"
            sx={{
                backgroundColor: status === 'active' ? COLORS.accentLight : COLORS.dangerLight,
                color: status === 'active' ? COLORS.accent : COLORS.danger,
                fontWeight: 600,
                '& .MuiChip-icon': {
                    color: status === 'active' ? COLORS.accent : COLORS.danger,
                }
            }}
        />
    );
    
    const renderColorTypeBadge = (colorType) => {
        let color, icon, label;
        
        switch(colorType) {
            case 'primary':
                color = COLORS.primary;
                icon = <PaletteIcon fontSize="small" />;
                label = 'Primary';
                break;
            case 'pastel':
                color = '#f9a8d4'; // Pink pastel
                icon = <ColorLensIcon fontSize="small" />;
                label = 'Pastel';
                break;
            case 'dark':
                color = '#1e293b'; // Dark slate
                icon = <ColorLensIcon fontSize="small" />;
                label = 'Dark';
                break;
            case 'light':
                color = '#e2e8f0'; // Light gray
                icon = <ColorLensIcon fontSize="small" />;
                label = 'Light';
                break;
            default:
                color = COLORS.textSecondary;
                icon = <ColorLensIcon fontSize="small" />;
                label = 'Other';
        }
        
        return (
            <Chip
                icon={icon}
                label={label}
                size="small"
                sx={{
                    backgroundColor: alpha(color, 0.1),
                    color: color,
                    fontWeight: 500,
                    '& .MuiChip-icon': {
                        color: color,
                    }
                }}
            />
        );
    };
    
    const renderActionsMenu = (row) => (
        <>
            <IconButton
                size="small"
                onClick={(event) => handleMenuOpen(event, row)}
                sx={{ 
                    color: COLORS.textSecondary,
                    '&:hover': {
                        backgroundColor: alpha(COLORS.primary, 0.1)
                    }
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                elevation={3}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        mt: 1,
                        minWidth: 180
                    }
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" sx={{ color: COLORS.primaryLight }} />
                    </ListItemIcon>
                    <ListItemText primary="View Details" />
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" sx={{ color: COLORS.warning }} />
                    </ListItemIcon>
                    <ListItemText primary="Edit Product" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        {selectedRow?.status === 'active' ? (
                            <BlockIcon fontSize="small" sx={{ color: COLORS.danger }} />
                        ) : (
                            <ActiveIcon fontSize="small" sx={{ color: COLORS.accent }} />
                        )}
                    </ListItemIcon>
                    <ListItemText 
                        primary={selectedRow?.status === 'active' ? "Deactivate" : "Activate"} 
                    />
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{ color: COLORS.danger }} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </Menu>
        </>
    );

    const renderEmptyState = () => (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ 
                textAlign: 'center', 
                py: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <NoDataIcon sx={{ fontSize: 80, color: COLORS.textSecondary, opacity: 0.4 }} />
            </motion.div>
            <Typography variant="h5" sx={{ color: COLORS.textSecondary, fontWeight: 600 }}>
                No products found
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.textSecondary, maxWidth: 500 }}>
                {searchParams.query || searchParams.filter !== 'all' || searchParams.colorType !== 'all' ? 
                    "No products match your search criteria. Try adjusting your filters or clear the search." : 
                    "You haven't added any products yet. Click the button below to get started."}
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleDrawerOpen}
                sx={{
                    mt: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    bgcolor: COLORS.accent,
                    fontWeight: 500,
                    px: 4,
                    py: 1.2,
                    '&:hover': { 
                        bgcolor: alpha(COLORS.accent, 0.9),
                        boxShadow: `0 8px 16px ${alpha(COLORS.accent, 0.3)}`
                    },
                    boxShadow: `0 4px 12px ${alpha(COLORS.accent, 0.2)}`
                }}
            >
                Add New Product
            </Button>
        </Box>
    );

    // Helper function to determine text color based on background
    const getContrastTextColor = (hexColor) => {
        if (!hexColor || typeof hexColor !== 'string') return '#FFFFFF';
        
        // Remove # if present
        const hex = hexColor.replace('#', '');
        
        // Convert to RGB
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return '#FFFFFF';
        }
        
        // Calculate luminance - brighter colors have higher values
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return white for dark colors, black for light colors
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };
    
    // Render grid view
    const renderGridView = () => (
        <Grid container spacing={3}>
            {filteredData.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || index}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: `1px solid ${COLORS.border}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box
                                sx={{ 
                                    height: 140, 
                                    backgroundColor: product.colorCode,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: getContrastTextColor(product.colorCode),
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    position: 'relative'
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        textShadow: getContrastTextColor(product.colorCode) === '#FFFFFF' 
                                            ? '0 2px 4px rgba(0,0,0,0.3)' 
                                            : 'none'
                                    }}
                                >
                                    {product.colorName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        bgcolor: alpha(getContrastTextColor(product.colorCode) === '#FFFFFF' ? '#000' : '#fff', 0.2),
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >
                                    {product.colorCode}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ p: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>Brand:</strong> {product.brandName}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {renderStatusBadge(product.status)}
                                        {renderColorTypeBadge(product.colorType)}
                                    </Box>
                                    {renderActionsMenu(product)}
                                </Box>
                            </Box>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
    
    // Render table view
    const renderTableView = () => (
        <TableContainer sx={{ overflow: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{
                        backgroundColor: COLORS.primaryDark,
                        '& th': {
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            padding: '16px',
                            whiteSpace: 'nowrap'
                        }
                    }}>
                        <TableCell>Sr. No.</TableCell>
                        <TableCell>Color Preview</TableCell>
                        {/* <TableCell>Brand Name</TableCell> */}
                        <TableCell>Color Name</TableCell>
                        <TableCell>Color Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((product, index) => (
                        <TableRow 
                            key={product.id || index}
                            component={motion.tr}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            sx={{
                                '&:nth-of-type(odd)': { bgcolor: alpha(COLORS.secondary, 0.3) },
                                '&:hover': { bgcolor: COLORS.highlight },
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Box
                                    sx={{ 
                                        width: 100, 
                                        height: 60, 
                                        borderRadius: 2,
                                        backgroundColor: product.colorCode || '#cccccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: getContrastTextColor(product.colorCode),
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            position: 'absolute', 
                                            bottom: 4, 
                                            right: 4,
                                            bgcolor: alpha('#000000', 0.2),
                                            color: getContrastTextColor(product.colorCode),
                                            px: 0.5,
                                            borderRadius: 0.5,
                                            fontSize: '0.65rem'
                                        }}
                                    >
                                        {/* {product.colorCode} */}
                                    </Typography>
                                </Box>
                            </TableCell>
                            {/* <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {product.brandName}
                                </Typography>
                            </TableCell> */}
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {product.colorName}
                                </Typography>
                            </TableCell>
                            <TableCell>{renderColorTypeBadge(product.colorType)}</TableCell>
                            <TableCell>{renderStatusBadge(product.status || 'active')}</TableCell>
                            <TableCell>{renderActionsMenu(product)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <>
        <AppNavBar/>
        <Box sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Page Header */}
            <Box 
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 2
                }}
            >
                <Box>
                    {/* <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.primaryDark, mb: 0.5 }}>
                        
                    </Typography> */}
                    {/* <Typography variant="body1" color="text.secondary">
                        Manage your product colors and inventory
                    </Typography> */}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title={viewMode === 'table' ? 'Switch to Grid View' : 'Switch to Table View'}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={toggleViewMode}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                borderColor: COLORS.border,
                                color: COLORS.textPrimary,
                                '&:hover': { borderColor: COLORS.primary },
                                display: { xs: 'none', md: 'flex' }
                            }}
                        >
                            {viewMode === 'table' ? 'Grid View' : 'Table View'}
                        </Button>
                    </Tooltip>
                    
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleDrawerOpen}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            bgcolor: COLORS.accent,
                            '&:hover': { 
                                bgcolor: alpha(COLORS.accent, 0.9),
                                boxShadow: `0 8px 16px ${alpha(COLORS.accent, 0.3)}`
                            },
                            boxShadow: `0 4px 12px ${alpha(COLORS.accent, 0.2)}`,
                            fontWeight: 500,
                            display: { xs: 'none', sm: 'flex' }
                        }}
                    >
                        Add New Product
                    </Button>
                </Box>
            </Box>
            
            {/* Enhanced Search Bar */}
            <EnhancedSearchBar 
                onSearch={handleSearch}
                colors={colorData}
                initialSearchParams={searchParams}
            />
            
            {/* Error Alert */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3, 
                        borderRadius: 2, 
                        boxShadow: '0 2px 10px rgba(239, 68, 68, 0.15)' 
                    }}
                    action={
                        <Button 
                            color="inherit" 
                            size="small" 
                            startIcon={<RefreshIcon />}
                            onClick={getApiData}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}
            
            {/* Products Display */}
            <Card
                elevation={0}
                sx={{
                    flex: 1,
                    borderRadius: 3,
                    bgcolor: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    overflow: 'hidden'
                }}
            >
                {isLoading ? (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Skeleton variant="text" width="30%" height={40} />
                            <Skeleton variant="rounded" width={120} height={40} />
                        </Box>
                        
                        {viewMode === 'table' ? (
                            // Table skeleton
                            <>
                                <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 1 }} />
                                {[1, 2, 3, 4, 5].map(item => (
                                    <Skeleton key={item} variant="rounded" width="100%" height={60} sx={{ my: 1 }} />
                                ))}
                            </>
                        ) : (
                            // Grid skeleton
                            <Grid container spacing={3}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                                        <Skeleton variant="rounded" width="100%" height={240} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                ) : filteredData.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 2 
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                Showing <strong>{filteredData.length}</strong> of <strong>{allProducts.length}</strong> products
                            </Typography>
                            
                            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                                <IconButton 
                                    color="primary" 
                                    onClick={toggleViewMode}
                                    sx={{ bgcolor: alpha(COLORS.primary, 0.1) }}
                                >
                                    {viewMode === 'table' ? <GridViewIcon /> : <ViewListIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                        
                        {viewMode === 'table' ? renderTableView() : renderGridView()}
                    </Box>
                )}
            </Card>

            {/* Form Drawer */}
            <AddJobDrawer
                isOpen={openDrawer}
                onClose={handleDrawerClose}
                onProductAdded={handleProductAdded}
            />

            {/* Floating Action Buttons */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'block', sm: 'none' }
                }}
            >
                <Tooltip title="Add New Product" arrow placement="left">
                    <Fade in={true}>
                        <IconButton
                            onClick={handleDrawerOpen}
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: COLORS.accent,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: alpha(COLORS.accent, 0.9),
                                    transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease',
                                boxShadow: `0 4px 14px ${alpha(COLORS.accent, 0.4)}`
                            }}
                        >
                            <AddIcon fontSize="medium" />
                        </IconButton>
                    </Fade>
                </Tooltip>
            </Box>
        </Box>
        </>
    );
};


export default ShowInventoryList;