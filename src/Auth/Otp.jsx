import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  ArrowBack,
  Timer,
  CheckCircle,
  Email,
  Refresh,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../Base_Url/Base_Url";

// Custom styled Alert component to ensure proper color
const CustomAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Define colors
  const PRIMARY_COLOR = "#1976D2";
  const SECONDARY_COLOR = "#0D47A1";
  const ACCENT_COLOR = "#2196F3";
  const BACKGROUND_COLOR = "#F5F9FF";
  const SUCCESS_COLOR = "#4caf50"; // Green color for success
  const ERROR_COLOR = "#f44336"; // Red color for errors

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Reset success message after a delay
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pastedData)) return;

    const pastedOtp = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    const lastFilledIndex = newOtp.findIndex((val) => val === "") - 1;
    const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 5;
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  // Function to generate/resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0 || resendLoading) return;

    setResendLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${Base_Url}ITCApp/user/generate-otp-with-wdCode`,
        { wdCode: email }
      );

      if (response.data && response.data.status === 200) {
        setResendSuccess(true);
        setTimeLeft(30); // Reset timer
      } else {
        setError(response.data?.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("OTP Resend Error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Failed to resend OTP");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    // Get wdCode and password from localStorage
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    try {
      const response = await axios.post(
        `${Base_Url}/color-Code/auth/login-with-otp`,
        {
          email: email,
          password: password,
          otp: otpString,
        }
      );

      localStorage.setItem("wdcode", response.data.wdCode);

      // Store user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));

      // Show success notification and set success state
      setVerificationSuccess(true);
      setShowSuccessMessage(true);

      // Navigate to the next page
      if (response.data.role === "CC") {
        navigate("/add_count_product");
      } else {
        navigate("/Add-Master");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      if (err.response) {
        setError(err.response.data?.message || "Verification failed");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (!username || !domain) return email;

    const maskedUsername =
      username.charAt(0) +
      "*".repeat(username.length > 2 ? username.length - 2 : 1) +
      (username.length > 1 ? username.charAt(username.length - 1) : "");

    return `${maskedUsername}@${domain}`;
  };

  // Call the OTP generation API when component mounts
  useEffect(() => {
    if (email) {
      handleResendOtp();
    }
  }, []);

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: BACKGROUND_COLOR,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)",
        position: "relative",
      }}
    >
      {/* Success notification - explicitly setting colors */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <CustomAlert
          severity="success"
          onClose={handleCloseSuccessMessage}
          sx={{
            width: "100%",
            backgroundColor: SUCCESS_COLOR,
            color: "white",
            fontWeight: "bold",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          OTP Verified Successfully!
        </CustomAlert>
      </Snackbar>

      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          position: "absolute",
          top: { xs: 20, md: 40 },
          left: { xs: 20, md: 40 },
          bgcolor: "white",
          color: PRIMARY_COLOR,
          px: 3,
          py: 1,
          borderRadius: 2,
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
          "&:hover": {
            bgcolor: "white",
            transform: "translateX(-5px)",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          },
          transition: "all 0.3s ease",
        }}
      >
        Back
      </Button>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 6, md: 2 },
          }}
        >
          {/* Left Side - Info */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              mb: { xs: 4, md: 0 },
              pr: { md: 6 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3.5rem" },
                fontWeight: "bold",
                mb: 3,
                fontFamily: "Montserrat, sans-serif",
                color: PRIMARY_COLOR,
                lineHeight: 1.2,
              }}
            >
              Verify Your Account
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: "text.secondary",
                fontSize: { xs: "1.1rem", md: "1.1rem" },
                lineHeight: 1.6,
                fontWeight: "bold",
              }}
            >
              We've sent a verification code to your email address. Please check
              your inbox and enter the code below.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 3,
                bgcolor: "rgba(25, 118, 210, 0.08)",
                borderRadius: 2,
                border: "1px solid rgba(25, 118, 210, 0.2)",
                maxWidth: { md: "80%" },
                mx: { xs: "auto", md: 0 },
                mb: { xs: 4, md: 0 },
              }}
            >
              <Email sx={{ color: PRIMARY_COLOR, fontSize: 28 }} />
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  Sent to:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: SECONDARY_COLOR }}
                >
                  {maskEmail(email)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "block" },
                mt: 6,
                textAlign: "left",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2, fontWeight: "bold" }}
              >
                Didn't receive the verification code?
              </Typography>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  margin: 0,
                  color: "text.secondary",
                }}
              >
                <li>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "bold", fontSize: "12px" }}
                  >
                    Check your spam or junk folder
                  </Typography>
                </li>
                <li>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: "bold", fontSize: "12px" }}
                  >
                    Make sure your email address is correct
                  </Typography>
                </li>
              </ul>
            </Box>
          </Box>

          {/* Right Side - OTP Form */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              bgcolor: "white",
              maxWidth: { xs: "100%", md: "500px" },
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "8px",
                background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`,
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "1.75rem", md: "2rem" },
                textAlign: "center",
                fontWeight: 600,
                color: verificationSuccess ? SUCCESS_COLOR : SECONDARY_COLOR,
              }}
            >
              {verificationSuccess
                ? "Verification Successful!"
                : "Enter Verification Code"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              {verificationSuccess
                ? "Redirecting you to the dashboard..."
                : "Enter the 6-digit code we sent to your email"}
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    color: ERROR_COLOR,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {resendSuccess && !error && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    color: SUCCESS_COLOR,
                  },
                }}
              >
                OTP sent successfully to your email
              </Alert>
            )}

            {verificationSuccess && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  my: 4,
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 80,
                    color: SUCCESS_COLOR,
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ color: SUCCESS_COLOR }}>
                  OTP Verified Successfully
                </Typography>
              </Box>
            )}

            {!verificationSuccess && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 0.5, sm: 1 },
                    justifyContent: "center",
                    mb: 4,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  {otp.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      variant="outlined"
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "1.5rem",
                          padding: "12px",
                          width: "36px",
                          height: "36px",
                        },
                      }}
                      sx={{
                        width: { xs: "48px", sm: "52px" },
                        height: { xs: "48px", sm: "52px" },
                        "& .MuiOutlinedInput-root": {
                          height: "100%",
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: PRIMARY_COLOR,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: PRIMARY_COLOR,
                            borderWidth: 2,
                          },
                          backgroundColor: "rgba(25, 118, 210, 0.03)",
                        },
                        mb: { xs: index > 2 ? 1 : 0, sm: 0 },
                      }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={isLoading || otp.join("").length !== 6}
                  sx={{
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { bgcolor: SECONDARY_COLOR },
                    py: 1.5,
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircle />
                    )
                  }
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Divider
                  sx={{
                    my: 2,
                    "&::before, &::after": {
                      borderColor: "rgba(25, 118, 210, 0.2)",
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: "0.9rem",
                    }}
                  >
                    <Timer sx={{ color: PRIMARY_COLOR }} />
                    Expires in{" "}
                    <Box component="span" sx={{ fontWeight: "bold", ml: 0.5 }}>
                      {timeLeft}s
                    </Box>
                  </Typography>

                  <Button
                    variant="text"
                    disabled={timeLeft > 0 || resendLoading}
                    onClick={handleResendOtp}
                    startIcon={
                      resendLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Refresh />
                      )
                    }
                    sx={{
                      color: timeLeft > 0 ? "text.disabled" : PRIMARY_COLOR,
                      textTransform: "none",
                      fontWeight: "medium",
                      fontSize: "0.9rem",
                    }}
                  >
                    {resendLoading ? "Sending..." : "Resend OTP"}
                  </Button>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 3,
                    color: "text.secondary",
                    textAlign: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  This code will expire in 10 minutes
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default OtpVerification;
