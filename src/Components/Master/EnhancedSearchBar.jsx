import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    InputBase,
    IconButton,
    Divider,
    Chip,
    Collapse,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Fade,
    Tooltip,
    alpha,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    ColorLens as ColorIcon,
    TextFields as TextIcon, 
    Code as CodeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Tune as TuneIcon
} from '@mui/icons-material';

const EnhancedSearchBar = ({ 
    onSearch, 
    colors = [], 
    initialQuery = '', 
    className 
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [expanded, setExpanded] = useState(false);
    const [searchField, setSearchField] = useState('all');
    const [searchBy, setSearchBy] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    // Color palette
    const COLORS = {
        primary: '#1e40af',      // Deeper blue
        primaryLight: '#3b82f6', // Brighter blue
        secondary: '#dbeafe',    // Very light blue
        accent: '#10b981',       // Emerald green for actions
        background: '#f8fafc',   // Very light blue-gray
        surface: '#ffffff',      // White
        textPrimary: '#1e293b',  // Dark slate
        textSecondary: '#64748b', // Slate
        border: '#e2e8f0'        // Light gray-blue
    };

    // Handle search submission
    const handleSearch = () => {
        if (query.trim() === '') return;
        
        if (recentSearches.indexOf(query) === -1) {
            setRecentSearches(prev => [query, ...prev].slice(0, 5));
        }
        
        onSearch && onSearch({
            query,
            field: searchField,
            filter: searchBy
        });
    };

    // Handle clear search
    const handleClear = () => {
        setQuery('');
        onSearch && onSearch({
            query: '',
            field: searchField,
            filter: searchBy
        });
    };

    // Handle key press (Enter)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Handle filter menu
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setSearchField(filter);
        setSelectedFilter(filter);
        handleFilterClose();
    };

    // Get filter icon and label
    const getFilterInfo = () => {
        switch (searchField) {
            case 'product':
                return { icon: <TextIcon fontSize="small" />, label: 'Product' };
            case 'color':
                return { icon: <ColorIcon fontSize="small" />, label: 'Color' };
            case 'code':
                return { icon: <CodeIcon fontSize="small" />, label: 'Code' };
            default:
                return { icon: <SearchIcon fontSize="small" />, label: 'All' };
        }
    };

    // Effect to trigger search on change
    useEffect(() => {
        if (query === '') {
            onSearch && onSearch({
                query: '',
                field: searchField,
                filter: searchBy
            });
        }
    }, [query, searchField, searchBy]);

    const filterInfo = getFilterInfo();

    return (
        <Box className={className} sx={{ width: '100%', mb: 3 }}>
            <Paper
                elevation={isFocused ? 3 : 1}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${isFocused ? COLORS.primaryLight : COLORS.border}`,
                    '&:hover': {
                        boxShadow: isFocused ? 3 : 2
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: '2px 8px',
                        backgroundColor: isFocused ? alpha(COLORS.secondary, 0.5) : 'transparent',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    <Tooltip title="Search Filter">
                        <IconButton 
                            onClick={handleFilterClick}
                            size="medium"
                            edge="start"
                            sx={{ 
                                color: searchField !== 'all' ? COLORS.primary : COLORS.textSecondary,
                                mr: 1
                            }}
                            aria-label="search filter"
                        >
                            {filterInfo.icon}
                        </IconButton>
                    </Tooltip>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleFilterClose}
                        elevation={3}
                        PaperProps={{
                            sx: {
                                borderRadius: 2,
                                minWidth: 180,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }
                        }}
                    >
                        <MenuItem 
                            onClick={() => handleFilterSelect('all')}
                            selected={searchField === 'all'}
                        >
                            <ListItemIcon>
                                <SearchIcon 
                                    fontSize="small" 
                                    sx={{ color: searchField === 'all' ? COLORS.primary : COLORS.textSecondary }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Search All" />
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleFilterSelect('product')}
                            selected={searchField === 'product'}
                        >
                            <ListItemIcon>
                                <TextIcon 
                                    fontSize="small" 
                                    sx={{ color: searchField === 'product' ? COLORS.primary : COLORS.textSecondary }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="Product Name" />
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleFilterSelect('color')}
                            selected={searchField === 'color'}
                        >
                            <ListItemIcon>
                                <ColorIcon 
                                    fontSize="small"
                                    sx={{ color: searchField === 'color' ? COLORS.primary : COLORS.textSecondary }}
                                />
                            </ListItemIcon>
                            <ListItemText primary="Color Name" />
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleFilterSelect('code')}
                            selected={searchField === 'code'}
                        >
                            <ListItemIcon>
                                <CodeIcon 
                                    fontSize="small"
                                    sx={{ color: searchField === 'code' ? COLORS.primary : COLORS.textSecondary }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Color Code" />
                        </MenuItem>
                    </Menu>
                    
                    <InputBase
                        sx={{ 
                            ml: 1, 
                            flex: 1,
                            fontSize: '1rem',
                            color: COLORS.textPrimary,
                            '& .MuiInputBase-input': {
                                py: 1.5,
                            }
                        }}
                        placeholder={`Search by ${filterInfo.label.toLowerCase()}`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        inputProps={{ 'aria-label': 'search products' }}
                    />
                    
                    {query && (
                        <IconButton 
                            size="small" 
                            aria-label="clear" 
                            onClick={handleClear}
                            sx={{ color: COLORS.textSecondary }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                    
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    
                    <Tooltip title="Advanced Search">
                        <IconButton 
                            aria-label="advanced search" 
                            onClick={() => setExpanded(!expanded)}
                            sx={{ 
                                color: expanded ? COLORS.primary : COLORS.textSecondary,
                                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Tooltip>
                    
                    <IconButton 
                        color="primary" 
                        aria-label="search" 
                        onClick={handleSearch}
                        sx={{
                            bgcolor: COLORS.primary,
                            color: 'white',
                            ml: 1,
                            borderRadius: 2,
                            '&:hover': {
                                bgcolor: COLORS.primaryLight,
                            }
                        }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Box>
                
                <Collapse in={expanded} timeout="auto">
                    <Box sx={{ p: 2, backgroundColor: alpha(COLORS.background, 0.7) }}>
                        <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                mb: 1.5, 
                                fontWeight: 600, 
                                color: COLORS.textPrimary,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <TuneIcon fontSize="small" sx={{ color: COLORS.primary }} />
                            Advanced Search Options
                        </Typography>
                        
                        <FormControl component="fieldset" sx={{ mb: 1 }}>
                            <Typography variant="caption" sx={{ color: COLORS.textSecondary, mb: 0.5 }}>
                                Search Criteria:
                            </Typography>
                            <RadioGroup 
                                row 
                                value={searchBy} 
                                onChange={(e) => setSearchBy(e.target.value)}
                                sx={{ ml: 1 }}
                            >
                                <FormControlLabel 
                                    value="all" 
                                    control={<Radio size="small" sx={{ color: COLORS.textSecondary }} />} 
                                    label="All" 
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                                />
                                <FormControlLabel 
                                    value="active" 
                                    control={<Radio size="small" sx={{ color: COLORS.textSecondary }} />} 
                                    label="Active Only" 
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                                />
                                <FormControlLabel 
                                    value="inactive" 
                                    control={<Radio size="small" sx={{ color: COLORS.textSecondary }} />} 
                                    label="Inactive Only" 
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                                />
                            </RadioGroup>
                        </FormControl>
                        
                        {colors.length > 0 && (
                            <>
                                <Typography variant="caption" sx={{ color: COLORS.textSecondary, mb: 0.5, display: 'block' }}>
                                    Quick Color Filters:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 1 }}>
                                    {colors.slice(0, 8).map((color, index) => (
                                        <Chip
                                            key={index}
                                            label={color.colorName}
                                            onClick={() => {
                                                setQuery(color.colorName);
                                                setSearchField('color');
                                                handleSearch();
                                            }}
                                            sx={{
                                                backgroundColor: alpha(color.colorCode, 0.2),
                                                color: COLORS.textPrimary,
                                                borderRadius: '16px',
                                                '&:hover': {
                                                    backgroundColor: alpha(color.colorCode, 0.3),
                                                }
                                            }}
                                            avatar={
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: '50%',
                                                        backgroundColor: color.colorCode,
                                                        display: 'inline-block',
                                                        mr: 0.5,
                                                        border: '1px solid rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            }
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </Collapse>
                
                {recentSearches.length > 0 && isFocused && (
                    <Fade in={isFocused}>
                        <Box sx={{ p: 1.5, borderTop: `1px solid ${COLORS.border}` }}>
                            <Typography variant="caption" sx={{ color: COLORS.textSecondary, display: 'block', mb: 1 }}>
                                Recent searches:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {recentSearches.map((search, index) => (
                                    <Chip
                                        key={index}
                                        label={search}
                                        size="small"
                                        onClick={() => {
                                            setQuery(search);
                                            handleSearch();
                                        }}
                                        sx={{ 
                                            backgroundColor: alpha(COLORS.secondary, 0.5),
                                            '&:hover': {
                                                backgroundColor: COLORS.secondary,
                                            }
                                        }}
                                        deleteIcon={<ClearIcon fontSize="small" />}
                                        onDelete={() => {
                                            setRecentSearches(prev => prev.filter(item => item !== search));
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Paper>
        </Box>
    );
};

export default EnhancedSearchBar;