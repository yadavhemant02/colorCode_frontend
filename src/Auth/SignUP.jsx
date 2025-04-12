import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Grid,
  Snackbar,
  alpha,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  MailOutlined,
  Code,
  LockOutlined,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../Base_Url/Base_Url";
import AppNavBar from "../Components/AppNavBar";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    wdCode: "",
    password: "Welcome@123",
    role: "CC",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Enhanced color palette for more attractive UI
  const PRIMARY_COLOR = "#1976D2"; // Primary blue
  const SECONDARY_COLOR = "#0D47A1"; // Darker blue
  const ACCENT_COLOR = "#2196F3"; // Lighter blue
  const BACKGROUND_COLOR = "#F5F9FF"; // Very light blue background
  const SUCCESS_COLOR = "#4CAF50"; // Green for success states
  const GRADIENT = `linear-gradient(135deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate required fields
    if (!formData.wdCode || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation (at least 6 characters)
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    console.log(formData, "lllllllllllllllllllll");

    try {
      // Sending the form data in the POST request
      const res = await axios.post(
        `${Base_Url}/color-Code/auth/create`,
        formData
      );

      setFormData({
        email: "",
        wdCode: "",
        password: "Welcome@123",
        role: "CC",
      });
      

      // Handle success
      setSnackbarMessage("Account created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setIsLoading(false);

      // setTimeout(() => {
      //     setIsLoading(false);
      //     navigate('/');
      // }, 1500);
    } catch (err) {
      setSnackbarMessage(
        err.response?.data?.message || "An error occurred during registration"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <>
      <AppNavBar />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BACKGROUND_COLOR,
          py: { xs: 4, md: 8 },
          position: "relative",
          backgroundImage:
            "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Left Side - Brand Message */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                gap: 4,
                maxWidth: "500px",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: PRIMARY_COLOR,
                  lineHeight: 1.2,
                  fontSize: { md: "3rem", lg: "3.5rem" },
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                Welcome to Enable to Your CC
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: alpha(SECONDARY_COLOR, 0.8),
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Create to get access to our exclusive features and start
                managing your inventory with ease.
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: GRADIENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Enter your WD Code for verification
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: GRADIENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Provide your email for account access
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: GRADIENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Create a secure password and you're all set
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Side - Form */}
            <Paper
              elevation={6}
              sx={{
                flex: 1,
                p: { xs: 3, md: 6 },
                borderRadius: 4,
                bgcolor: "white",
                maxWidth: { xs: "100%", md: "480px" },
                boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "8px",
                  background: GRADIENT,
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: { xs: "1.75rem", md: "2rem" },
                  textAlign: "center",
                  fontWeight: 700,
                  color: SECONDARY_COLOR,
                }}
              >
                Create CC Account
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  color: alpha(SECONDARY_COLOR, 0.7),
                }}
              >
                Enter your details to get started
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "grid", gap: 3 }}>
                  <TextField
                    required
                    fullWidth
                    label="CC"
                    name="wdCode"
                    value={formData.wdCode}
                    onChange={handleChange}
                    variant="outlined"
                    onFocus={() => handleFocus("wdCode")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Code
                            sx={{
                              color:
                                focusedField === "wdCode"
                                  ? PRIMARY_COLOR
                                  : alpha(PRIMARY_COLOR, 0.7),
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 3px ${alpha(PRIMARY_COLOR, 0.2)}`,
                        },
                        "& fieldset": {
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                        fontWeight: 600,
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlined
                            sx={{
                              color:
                                focusedField === "email"
                                  ? PRIMARY_COLOR
                                  : alpha(PRIMARY_COLOR, 0.7),
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 3px ${alpha(PRIMARY_COLOR, 0.2)}`,
                        },
                        "& fieldset": {
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                        fontWeight: 600,
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{
                              color:
                                focusedField === "password"
                                  ? PRIMARY_COLOR
                                  : alpha(PRIMARY_COLOR, 0.7),
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff
                                sx={{ color: alpha(PRIMARY_COLOR, 0.7) }}
                              />
                            ) : (
                              <Visibility
                                sx={{ color: alpha(PRIMARY_COLOR, 0.7) }}
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&.Mui-focused": {
                          boxShadow: `0 0 0 3px ${alpha(PRIMARY_COLOR, 0.2)}`,
                        },
                        "& fieldset": {
                          borderWidth: 1.5,
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: PRIMARY_COLOR,
                        fontWeight: 600,
                      },
                    }}
                    helperText="Password must be at least 6 characters long"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                      mt: 2,
                      background: GRADIENT,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${SECONDARY_COLOR}, ${PRIMARY_COLOR})`,
                        transform: "translateY(-2px)",
                      },
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                      textTransform: "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <Divider sx={{ mt: 2, mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: alpha("#000", 0.5) }}
                    >
                      OR
                    </Typography>
                  </Divider>
                </Box>
              </form>
            </Paper>
          </Box>
        </Container>

        {/* Snackbar Component */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default SignUp;
