import React, { useState, useEffect } from "react";
import {
    Box,
    Drawer,
    Typography,
    TextField,
    Button,
    Snackbar,
    Alert,
    Grid,
    InputAdornment,
    IconButton,
    Paper,
    alpha
} from "@mui/material";
import { 
    ColorLens as ColorIcon, 
    ProductionQuantityLimits as ProductIcon,
    Close as CloseIcon,
    CheckCircleOutline as CheckIcon
} from "@mui/icons-material";
import axios from "axios";
import { Base_Url } from "../../Base_Url/Base_Url";

const AddProductDrawer = ({ isOpen, onClose }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [productName, setProductName] = useState('clasic');
    const [colorName, setColorName] = useState('');
    const [colorCode, setColorCode] = useState('');
    const [isAutoGeneratedColor, setIsAutoGeneratedColor] = useState(false);

    // Color palette - professional blue theme
    const PRIMARY_COLOR = '#1976D2';
    const SECONDARY_COLOR = '#0D47A1';
    const ACCENT_COLOR = '#2196F3';
    const BACKGROUND_COLOR = '#F5F9FF';

    // Color mapping for automatic color code generation
    const colorMap = {
        // Basic colors
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#008000',
        'yellow': '#FFFF00',
        'black': '#000000',
        'white': '#FFFFFF',
        'orange': '#FFA500',
        'purple': '#800080',
        'brown': '#A52A2A',
        'pink': '#FFC0CB',
        'gray': '#808080',
        'grey': '#808080',
        
        // Multi-word colors
        'maroon red': '#800000',
        'golden yellow': '#FFDF00',
        'navy blue': '#000080',
        'forest green': '#228B22',
        'hot pink': '#FF69B4',
        'deep purple': '#301934',
        'light blue': '#ADD8E6',
        'sky blue': '#87CEEB',
        'stardust blue': '#4682B4', // Using steel blue for stardust blue
        'royal blue': '#4169E1',
        'lime green': '#32CD32',
        'olive green': '#808000',
        'mint green': '#98FB98',
        'light grey': '#D3D3D3',
        'dark grey': '#A9A9A9',
        'light red': '#FF6347', // Tomato color
        'dark red': '#8B0000',
        'coral red': '#FF7F50',
        'baby blue': '#89CFF0',
        'midnight blue': '#191970',
        'turquoise blue': '#40E0D0',
        'silver': '#C0C0C0',
        'gold': '#FFD700',
        'bronze': '#CD7F32',
        'ivory': '#FFFFF0',
        'teal': '#008080',
        'maroon': '#800000',
        'crimson': '#DC143C',
        'lavender': '#E6E6FA',
        'indigo': '#4B0082',
        'aqua': '#00FFFF',
        'magenta': '#FF00FF',
        'tan': '#D2B48C',
        'beige': '#F5F5DC',
        'khaki': '#F0E68C',
        'salmon': '#FA8072',
        'chocolate': '#D2691E',
        'charcoal': '#36454F',
    };

    // Safe way to convert RGB to Hex
    const rgbToHex = (rgb) => {
        try {
            if (!rgb || !rgb.startsWith('rgb')) return rgb;
            
            // Extract the RGB values
            const rgbValues = rgb.match(/\d+/g);
            if (!rgbValues || rgbValues.length !== 3) return null;
            
            // Convert to hex
            return '#' + rgbValues.map(val => {
                const hex = parseInt(val).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('').toUpperCase();
        } catch (err) {
            console.error("Error converting RGB to Hex:", err);
            return null;
        }
    };

    // Update color code when color name changes
    useEffect(() => {
        if (!colorName.trim()) {
            setColorCode('');
            setIsAutoGeneratedColor(false);
            return;
        }

        // Normalize color name (lowercase and trim)
        const normalizedColorName = colorName.trim().toLowerCase();
        
        // Check if the color exists in our custom map
        if (colorMap[normalizedColorName]) {
            setColorCode(colorMap[normalizedColorName].toUpperCase());
            setIsAutoGeneratedColor(true);
            return;
        }
        
        // Try browser's color interpretation as fallback
        try {
            const tempElement = document.createElement('div');
            tempElement.style.color = normalizedColorName;
            document.body.appendChild(tempElement);
            
            const computedColor = window.getComputedStyle(tempElement).color;
            document.body.removeChild(tempElement);
            
            // Skip if the browser couldn't interpret the color name
            if (computedColor === 'rgb(0, 0, 0)' && normalizedColorName !== 'black') {
                setIsAutoGeneratedColor(false);
                return;
            }
            
            // Convert RGB to Hex
            const hexColor = rgbToHex(computedColor);
            if (hexColor) {
                setColorCode(hexColor);
                setIsAutoGeneratedColor(true);
            }
        } catch (err) {
            console.error("Error processing color:", err);
            setIsAutoGeneratedColor(false);
        }
    }, [colorName]);

    const handleAddProduct = async() => {
        if (productName && colorName && colorCode) {
            // Create product object
            const product = {
                productName:"clasic",
                colorName,
                colorCode: colorCode.startsWith('#') ? colorCode : `#${colorCode.replace('#', '')}`,
            };

            const response = await axios.post(`${Base_Url}/color-Code/inventory/add-inventory`,product);
            
            // Log product details to console
            console.log('Product added:', product);
            
            setOpenSnackbar(true);
            
            // Reset form fields after successful addition
            setProductName('');
            setColorName('');
            setColorCode('');
            setIsAutoGeneratedColor(false);
            
            // Optional: Close drawer after successful submission with a slight delay
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    // Handle color code manual change
    const handleColorCodeChange = (e) => {
        setColorCode(e.target.value);
        setIsAutoGeneratedColor(false);
    };

    // Ensure color code is properly formatted
    const formatColorCode = (code) => {
        // Remove any non-hex characters
        let cleanCode = code.replace(/[^a-fA-F0-9]/g, '');
        
        // Add # if missing
        if (!cleanCode.startsWith('#')) {
            cleanCode = '#' + cleanCode;
        }
        
        return cleanCode;
    };

    // Safe color preview that handles errors
    const getSafeColorPreview = () => {
        try {
            // Ensure we have a valid hex color for preview
            if (colorCode && (colorCode.startsWith('#') || /^[0-9A-Fa-f]{6}$/.test(colorCode))) {
                const formattedColor = colorCode.startsWith('#') ? colorCode : `#${colorCode}`;
                return formattedColor;
            }
            return '#FFFFFF'; // Default white if invalid
        } catch (err) {
            return '#FFFFFF';
        }
    };

    return (
        <Drawer 
            anchor="right" 
            open={isOpen} 
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    backgroundImage: `linear-gradient(135deg, ${alpha(PRIMARY_COLOR, 0.02)} 0%, ${alpha(ACCENT_COLOR, 0.08)} 100%)`,
                    boxShadow: `-5px 0 25px ${alpha(PRIMARY_COLOR, 0.15)}`,
                    border: 'none'
                }
            }}
        >
            <Box
                sx={{
                    width: { xs: '100%', sm: 500 },
                    height: "100%",
                    padding: { xs: 2, sm: 3 },
                    mt: "64px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={12}
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        borderRadius: 4,
                        padding: { xs: 3, sm: 4 },
                        backgroundColor: "#fff",
                        boxShadow: `0 12px 24px ${alpha(PRIMARY_COLOR, 0.12)}`,
                        position: "relative",
                        overflow: "hidden",
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`,
                        }
                    }}
                >
                    <IconButton 
                        onClick={onClose} 
                        sx={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            color: alpha('#000', 0.6),
                            backgroundColor: alpha('#f5f5f5', 0.8),
                            '&:hover': {
                                backgroundColor: alpha('#f0f0f0', 0.95),
                                color: PRIMARY_COLOR,
                            },
                            transition: 'all 0.2s ease',
                            width: 36,
                            height: 36,
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                            sx={{
                                backgroundColor: alpha(PRIMARY_COLOR, 0.1),
                                borderRadius: '50%',
                                p: 1,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <ProductIcon sx={{ color: PRIMARY_COLOR }} />
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: "1.6rem", sm: "1.8rem" },
                                fontWeight: 700,
                                color: SECONDARY_COLOR,
                                fontFamily: '"Poppins", "Segoe UI", sans-serif',
                            }}
                        >
                            Add New Product
                        </Typography>
                    </Box>
                    
                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            fontWeight: 400,
                        }}
                    >
                        Enter product details to add to your inventory
                    </Typography>

                    <Grid container spacing={3} sx={{ width: "100%" }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Color Name"
                                placeholder="Enter color name (e.g., Red, Golden Yellow, Maroon Red)"
                                fullWidth
                                required
                                value={colorName}
                                onChange={(e) => setColorName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ColorIcon sx={{ color: PRIMARY_COLOR }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': {
                                            borderColor: PRIMARY_COLOR,
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: PRIMARY_COLOR,
                                    },
                                }}
                                helperText={isAutoGeneratedColor ? "Color code generated automatically" : "Enter color code manually if needed"}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <TextField
                                label="Color Code"
                                placeholder="#RRGGBB"
                                fullWidth
                                required
                                value={colorCode}
                                onChange={handleColorCodeChange}
                                InputProps={{
                                    startAdornment: colorCode ? (
                                        <InputAdornment position="start">
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '4px',
                                                    backgroundColor: getSafeColorPreview(),
                                                    border: '1px solid #ddd',
                                                    mr: 1
                                                }}
                                            />
                                        </InputAdornment>
                                    ) : null,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': {
                                            borderColor: PRIMARY_COLOR,
                                            borderWidth: 2,
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: PRIMARY_COLOR,
                                    },
                                }}
                                helperText="Format: #RRGGBB (e.g., #FF0000 for red)"
                            />
                            
                            {colorCode && (
                                <Box 
                                    sx={{ 
                                        mt: 2, 
                                        p: 1.5, 
                                        borderRadius: 2, 
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f5f5f5',
                                        border: '1px solid #e0e0e0',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '4px',
                                            backgroundColor: getSafeColorPreview(),
                                            mr: 2,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                            border: '1px solid rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Preview: {colorName} ({colorCode})
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={!productName || !colorName || !colorCode}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`,
                                    transition: 'all 0.3s ease',
                                    boxShadow: `0 4px 12px ${alpha(PRIMARY_COLOR, 0.25)}`,
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`,
                                        boxShadow: `0 6px 16px ${alpha(PRIMARY_COLOR, 0.35)}`,
                                        transform: 'translateY(-2px)',
                                    },
                                    '&.Mui-disabled': {
                                        background: alpha('#e0e0e0', 0.7),
                                    }
                                }}
                                onClick={handleAddProduct}
                                endIcon={<CheckIcon />}
                            >
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                            Color names like 'Golden Yellow' and 'Stardust Blue' will be automatically converted to hex codes. 
                            You can also manually edit the color code if needed.
                        </Typography>
                    </Box>
                </Paper>
                
                {/* Optional: Additional helpful information */}
                <Box 
                    sx={{ 
                        mt: 3, 
                        width: '100%', 
                        maxWidth: 480,
                        display: { xs: 'none', sm: 'block' }
                    }}
                >
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            border: `1px solid ${alpha(PRIMARY_COLOR, 0.1)}`,
                            backgroundColor: alpha(BACKGROUND_COLOR, 0.8)
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ color: SECONDARY_COLOR, mb: 1, fontWeight: 600 }}>
                            Color Tips
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                            Enter color names like "Red", "Navy Blue", or "Golden Yellow" and the color code will be automatically generated. 
                            For custom colors or if automatic generation fails, you can manually enter the hex code (format: #RRGGBB).
                        </Typography>
                    </Paper>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="success"
                    sx={{
                        width: "100%",
                        backgroundColor: PRIMARY_COLOR,
                        color: "white",
                        borderRadius: 2,
                        boxShadow: `0 4px 12px ${alpha(PRIMARY_COLOR, 0.4)}`,
                    }}
                    onClose={() => setOpenSnackbar(false)}
                    icon={<CheckIcon fontSize="inherit" />}
                >
                    Product added successfully!
                </Alert>
            </Snackbar>
        </Drawer>
    );
};

export default AddProductDrawer;