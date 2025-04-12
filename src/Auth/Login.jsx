// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Container,
//   InputAdornment,
//   IconButton,
//   Divider,
//   useTheme,
//   Alert,
//   Checkbox,
//   FormControlLabel,
//   Snackbar,
//   Alert as MuiAlert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { Visibility, VisibilityOff, Lock, Code } from "@mui/icons-material";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Base_Url } from "../Base_Url/Base_Url";

// const SignIn = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [openEmailDialog, setOpenEmailDialog] = useState(false);
//   const [openOtpDialog, setOpenOtpDialog] = useState(false);
//   const [changePasswordData, setChangePasswordData] = useState({
//     email: "",
//     newPassword: "",
//     otp: "",
//   });


//   const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");


//   const handleSendOtp = async () => {
//     setIsLoading(true);
//     try {
//       await axios.get(
//         `http://localhost:8101/color-Code/auth/get-otp-for-password-change?email=${changePasswordData.email}`
//       );

//       setSnackbarMessage("OTP sent successfully!");
//       setSnackbarSeverity("success");
//       setOpenEmailDialog(false);
//       setOpenOtpDialog(true);
//     } catch (error) {
//       setSnackbarMessage("Failed to send OTP. Please try again.");
//       setSnackbarSeverity("error");
//     } finally {
//       setIsLoading(false);
//       setSnackbarOpen(true);
//     }
//   };

//   // New handler for password change with OTP
//   const handleSubmitNewPassword = async () => {
//     setIsLoading(true);

//     try {

//       // const formData = new FormData();

//       const formData = new FormData();
// formData.append("email", changePasswordData.email);
// formData.append("password", changePasswordData.newPassword);
// formData.append("otp", changePasswordData.otp);
//       await axios.post(
//         `${Base_Url}/color-Code/auth/change-password-by-itself`,
//         formData
//       );

//       setSnackbarMessage("Password changed successfully!");
//       setSnackbarSeverity("success");
//       setOpenOtpDialog(false);
//       setChangePasswordData({ email: "", newPassword: "", otp: "" });
//     } catch (error) {
//       setSnackbarMessage("Failed to change password. Please check OTP.");
//       setSnackbarSeverity("error");
//     } finally {
//       setIsLoading(false);
//       setSnackbarOpen(true);
//     }
//   };

//   const theme = useTheme();
//   const navigate = useNavigate();

//   const PRIMARY_COLOR = "#1976D2";
//   const SECONDARY_COLOR = "#0D47A1";
//   const ACCENT_COLOR = "#2196F3";
//   const BACKGROUND_COLOR = "#F5F9FF";

//   const handleSignUp = () => {
//     navigate("/sign-up");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault(); // Prevent default form submission

//     setIsLoading(true);
//     setError("");

//     try {
//       const res = await axios.post(
//         `${Base_Url}/color-Code/auth/login-with-email`,
//         formData
//       );

//       console.log(res);
//       // ✅ Save wdCode and password in localStorage
//       localStorage.setItem("email", res.data.email);
//       localStorage.setItem("password", formData.password);

//       // Show success snackbar
//       setSnackbarMessage("Login successful!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);

//       // Redirect
//       navigate("/Otp-verification");
//     } catch (error) {
//       // Handle error
//       setError("Login failed. Please check your credentials and try again.");
//       setSnackbarMessage("Login failed!");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         backgroundColor: BACKGROUND_COLOR,
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundImage:
//           "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.1) 100%)",
//         overflow: "hidden",
//       }}
//     >
//       <Container
//         maxWidth="lg"
//         sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", md: "row" },
//             gap: 4,
//             alignItems: "center",
//             justifyContent: "center",
//             mt: 4,
//             height: "100%",
//           }}
//         >
//           {/* Left Side - Info */}
//           <Box
//             sx={{
//               flex: 1,
//               textAlign: { xs: "center", md: "left" },
//               mb: { xs: 4, md: 0 },
//               pr: { md: 6 },
//             }}
//           >
//             <Typography
//               variant="h2"
//               sx={{
//                 fontSize: { xs: "2rem", md: "3.5rem" },
//                 fontWeight: "bold",
//                 mb: 3,
//                 fontFamily: "Montserrat, sans-serif",
//                 color: PRIMARY_COLOR,
//                 lineHeight: 1.2,
//               }}
//             >
//               Welcome Back
//             </Typography>
//             <Typography
//               variant="h5"
//               sx={{
//                 mb: 4,
//                 color: "text.secondary",
//                 fontSize: { xs: "1rem", md: "1.3rem" },
//                 lineHeight: 1.6,
//                 fontWeight: "bold",
//               }}
//             >
//               Access your dashboard and manage your business operations with our
//               intuitive platform.
//             </Typography>
//           </Box>

//           {/* Right Side - Form */}
//           <Paper
//             elevation={3}
//             sx={{
//               flex: 1,
//               p: { xs: 3, md: 5 },
//               borderRadius: 4,
//               bgcolor: "white",
//               maxWidth: { xs: "100%", md: "500px" },
//               boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
//               position: "relative",
//               overflow: "hidden",
//               "&::before": {
//                 content: '""',
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: "8px",
//                 background: `linear-gradient(90deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`,
//               },
//             }}
//           >
//             <Typography
//               variant="h4"
//               sx={{
//                 mb: 4,
//                 fontFamily: "Montserrat, sans-serif",
//                 fontSize: { xs: "1.75rem", md: "2rem" },
//                 textAlign: "center",
//                 fontWeight: 600,
//                 color: SECONDARY_COLOR,
//               }}
//             >
//               Sign In
//             </Typography>

//             {error && (
//               <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit}>
//               <Box sx={{ display: "grid", gap: 3 }}>
//                 {/* WD Code Field */}
//                 <TextField
//                   required
//                   fullWidth
//                   label="CC"
//                   name="email"
//                   type="text"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Code sx={{ color: PRIMARY_COLOR }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 <TextField
//                   required
//                   fullWidth
//                   label="Password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   variant="outlined"
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Lock sx={{ color: PRIMARY_COLOR }} />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton
//                           onClick={() => setShowPassword(!showPassword)}
//                           edge="end"
//                         >
//                           {showPassword ? (
//                             <VisibilityOff sx={{ color: PRIMARY_COLOR }} />
//                           ) : (
//                             <Visibility sx={{ color: PRIMARY_COLOR }} />
//                           )}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 {/* <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={rememberMe}
//                         onChange={(e) => setRememberMe(e.target.checked)}
//                         sx={{
//                           "&.Mui-checked": {
//                             color: PRIMARY_COLOR,
//                           },
//                         }}
//                       />
//                     }
//                     label="Remember me"
//                   />
//                   <Link
//                     to="/forgot-password"
//                     style={{
//                       textDecoration: "none",
//                       color: PRIMARY_COLOR,
//                       fontWeight: 500,
//                     }}
//                   >
//                     Forgot Password?
//                   </Link>
//                 </Box> */}

// <Box
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       flexWrap: "wrap",
//     }}
//   >
//     <FormControlLabel
//       control={<Checkbox />}
//       label="Remember me"
//     />
//     <Box sx={{ display: "flex", gap: 2 }}>

// <Button
//     onClick={() => {
//       setOpenEmailDialog(true);
//       setChangePasswordData({ email: "", newPassword: "", otp: "" });
//     }}
//     sx={{
//       color: PRIMARY_COLOR,
//       fontWeight: 500,
//       textTransform: "none",
//     }}
//   >
//     Change Password
//   </Button>
//     </Box>
//   </Box>

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   size="large"
//                   disabled={isLoading}
//                   sx={{
//                     mt: 2,
//                     bgcolor: PRIMARY_COLOR,
//                     "&:hover": { bgcolor: SECONDARY_COLOR },
//                     py: 1.5,
//                     fontSize: "1rem",
//                     fontWeight: 600,
//                     borderRadius: 2,
//                     boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
//                     textTransform: "none",
//                   }}
//                 >
//                   {isLoading ? "Signing In..." : "Sign In"}
//                 </Button>

//                 <Divider
//                   sx={{
//                     my: 2,
//                     "&::before, &::after": {
//                       borderColor: "rgba(25, 118, 210, 0.2)",
//                     },
//                     color: "text.secondary",
//                   }}
//                 >
//                   OR
//                 </Divider>

//                 <Typography
//                   sx={{
//                     textAlign: "center",
//                     color: "text.secondary",
//                     mt: 2,
//                   }}
//                 >
//                   Don't have an account?{" "}
//                   <Button
//                     onClick={handleSignUp}
//                     variant="text"
//                     sx={{
//                       color: PRIMARY_COLOR,
//                       fontWeight: 600,
//                       "&:hover": {
//                         bgcolor: "transparent",
//                         textDecoration: "underline",
//                       },
//                       p: 0,
//                       ml: 0.5,
//                       minWidth: "auto",
//                     }}
//                   >
//                     Sign Up
//                   </Button>
//                 </Typography>
//               </Box>
//             </form>
//           </Paper>
//         </Box>
//       </Container>

//       {/* Snackbar for Success/Error Messages */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <MuiAlert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </MuiAlert>
//       </Snackbar>
// {/* 
//       <Dialog
//     open={openChangePasswordDialog}
//     onClose={() => setOpenChangePasswordDialog(false)}
//   >
//     <DialogTitle>Change Password</DialogTitle>
//     <DialogContent>
//       <TextField
//         autoFocus
//         margin="dense"
//         label="Email"
//         fullWidth
//         value={changePasswordData.email}
//         onChange={(e) =>
//           setChangePasswordData({
//             ...changePasswordData,
//             email: e.target.value,
//           })
//         }
//       />
//       <TextField
//         margin="dense"
//         label="New Password"
//         type="password"
//         fullWidth
//         value={changePasswordData.newPassword}
//         onChange={(e) =>
//           setChangePasswordData({
//             ...changePasswordData,
//             newPassword: e.target.value,
//           })
//         }
//       />
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={() => setOpenChangePasswordDialog(false)}>Cancel</Button>
//       <Button
//         onClick={handleChangePassword}
//         disabled={isLoading}
//         sx={{ color: PRIMARY_COLOR }}
//       >
//         {isLoading ? "Updating..." : "Submit"}
//       </Button>
//     </DialogActions>
//   </Dialog> */}
//    <Dialog
//     open={openEmailDialog}
//     onClose={() => setOpenEmailDialog(false)}
//   >
//     <DialogTitle>Get OTP for Password Change</DialogTitle>
//     <DialogContent>
//       <TextField
//         autoFocus
//         margin="dense"
//         label="Email"
//         fullWidth
//         value={changePasswordData.email}
//         onChange={(e) =>
//           setChangePasswordData({
//             ...changePasswordData,
//             email: e.target.value,
//           })
//         }
//       />
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
//       <Button
//         onClick={handleSendOtp}
//         disabled={isLoading}
//         sx={{ color: PRIMARY_COLOR }}
//       >
//         {isLoading ? "Sending..." : "Send OTP"}
//       </Button>
//     </DialogActions>
//   </Dialog>

//   // Add the OTP Dialog
//   <Dialog
//     open={openOtpDialog}
//     onClose={() => setOpenOtpDialog(false)}
//   >
//     <DialogTitle>Change Password with OTP</DialogTitle>
//     <DialogContent>
//       <TextField
//         margin="dense"
//         label="New Password"
//         type="password"
//         fullWidth
//         value={changePasswordData.newPassword}
//         onChange={(e) =>
//           setChangePasswordData({
//             ...changePasswordData,
//             newPassword: e.target.value,
//           })
//         }
//       />
//       <TextField
//         margin="dense"
//         label="OTP"
//         fullWidth
//         value={changePasswordData.otp}
//         onChange={(e) =>
//           setChangePasswordData({
//             ...changePasswordData,
//             otp: e.target.value,
//           })
//         }
//       />
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={() => setOpenOtpDialog(false)}>Cancel</Button>
//       <Button
//         onClick={handleSubmitNewPassword}
//         disabled={isLoading}
//         sx={{ color: PRIMARY_COLOR }}
//       >
//         {isLoading ? "Updating..." : "Submit"}
//       </Button>
//     </DialogActions>
//   </Dialog>
//     </Box>
//   );
// };

// export default SignIn;



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
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Lock, 
  Code, 
  Email, 
  VpnKey, 
  LockReset, 
  Password 
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../Base_Url/Base_Url";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    email: "",
    newPassword: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const PRIMARY_COLOR = "#1976D2";
  const SECONDARY_COLOR = "#0D47A1";
  const ACCENT_COLOR = "#2196F3";
  const BACKGROUND_COLOR = "#F5F9FF";
  const GRADIENT = `linear-gradient(90deg, ${PRIMARY_COLOR}, ${ACCENT_COLOR})`;

  const handleSendOtp = async () => {
    if (!changePasswordData.email) {
      setSnackbarMessage("Please enter your email address");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await axios.get(
        `http://localhost:8101/color-Code/auth/get-otp-for-password-change?email=${changePasswordData.email}`
      );

      setSnackbarMessage("OTP sent successfully!");
      setSnackbarSeverity("success");
      setOpenEmailDialog(false);
      setOpenOtpDialog(true);
    } catch (error) {
      setSnackbarMessage("Failed to send OTP. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSubmitNewPassword = async () => {
    if (!changePasswordData.newPassword || !changePasswordData.otp) {
      setSnackbarMessage("Please fill in all required fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", changePasswordData.email);
      formData.append("password", changePasswordData.newPassword);
      formData.append("otp", changePasswordData.otp);
      
      await axios.post(
        `${Base_Url}/color-Code/auth/change-password-by-itself`,
        formData
      );

      setSnackbarMessage("Password changed successfully!");
      setSnackbarSeverity("success");
      setOpenOtpDialog(false);
      setChangePasswordData({ email: "", newPassword: "", otp: "" });
    } catch (error) {
      setSnackbarMessage("Failed to change password. Please check OTP.");
      setSnackbarSeverity("error");
    } finally {
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${Base_Url}/color-Code/auth/login-with-email`,
        formData
      );

      localStorage.setItem("email", res.data.email);
      localStorage.setItem("password", formData.password);

      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      navigate("/Otp-verification");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      setSnackbarMessage("Login failed!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Enhanced Dialog styles
  const dialogStyle = {
    paper: {
      borderRadius: 10, 
      padding: 2,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      overflow: "hidden",
    },
    title: {
      position: "relative",
      textAlign: "center",
      fontWeight: 600,
      paddingTop: 3,
      paddingBottom: 2,
      fontSize: "1.5rem",
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        width: "80px",
        height: "4px",
        transform: "translateX(-50%)",
        background: GRADIENT,
        borderRadius: "2px",
      },
    },
    content: {
      paddingTop: 3,
      paddingBottom: 2,
      paddingLeft: 3,
      paddingRight: 3,
    },
    actions: {
      padding: 3,
    },
    iconHeader: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 2,
    },
    avatar: {
      background: GRADIENT,
      width: 70,
      height: 70,
      marginBottom: 2,
    },
    button: {
      textTransform: "none",
      borderRadius: 28,
      padding: "10px 24px",
      fontWeight: 600,
      boxShadow: "0 4px 10px rgba(25, 118, 210, 0.25)",
    },
    cancelButton: {
      color: "#757575",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      }
    },
    actionButton: {
      background: GRADIENT,
      color: "white",
      "&:hover": {
        boxShadow: "0 6px 12px rgba(25, 118, 210, 0.35)",
      }
    }
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
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
            height: "100%",
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
              Welcome Back
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.3rem" },
                lineHeight: 1.6,
                fontWeight: "bold",
              }}
            >
              Access your dashboard and manage your business operations with our
              intuitive platform.
            </Typography>
          </Box>

          {/* Right Side - Form */}
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
                background: GRADIENT,
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "1.75rem", md: "2rem" },
                textAlign: "center",
                fontWeight: 600,
                color: SECONDARY_COLOR,
              }}
            >
              Sign In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "grid", gap: 3 }}>
                {/* WD Code Field */}
                <TextField
                  required
                  fullWidth
                  label="CC"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Code sx={{ color: PRIMARY_COLOR }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: PRIMARY_COLOR }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: PRIMARY_COLOR }} />
                          ) : (
                            <Visibility sx={{ color: PRIMARY_COLOR }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{ 
                          "&.Mui-checked": { 
                            color: PRIMARY_COLOR 
                          } 
                        }}
                      />}
                      label="Remember me"
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                          onClick={() => {
                            setOpenEmailDialog(true);
                            setChangePasswordData({ email: "", newPassword: "", otp: "" });
                          }}
                          sx={{
                            color: PRIMARY_COLOR,
                            fontWeight: 500,
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                            }
                          }}
                        >
                          Change Password
                        </Button>
                    </Box>
                  </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    bgcolor: PRIMARY_COLOR,
                    "&:hover": { bgcolor: SECONDARY_COLOR },
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
                    textTransform: "none",
                  }}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <Divider
                  sx={{
                    my: 2,
                    "&::before, &::after": {
                      borderColor: "rgba(25, 118, 210, 0.2)",
                    },
                    color: "text.secondary",
                  }}
                >
                  OR
                </Divider>

                <Typography
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    mt: 2,
                  }}
                >
                  Don't have an account?{" "}
                  <Button
                    onClick={handleSignUp}
                    variant="text"
                    sx={{
                      color: PRIMARY_COLOR,
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                      p: 0,
                      ml: 0.5,
                      minWidth: "auto",
                    }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ 
            width: "100%",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)"
          }}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Email Dialog - Enhanced */}
      <Dialog
        open={openEmailDialog}
        onClose={() => setOpenEmailDialog(false)}
        PaperProps={{
          sx: dialogStyle.paper
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={dialogStyle.title}>Password Recovery</DialogTitle>
        <DialogContent sx={dialogStyle.content}>
          <Box sx={dialogStyle.iconHeader}>
            <Avatar sx={dialogStyle.avatar}>
              <VpnKey sx={{ fontSize: 36 }} />
            </Avatar>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Enter your email address to receive a one-time password for changing your password.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            fullWidth
            variant="outlined"
            value={changePasswordData.email}
            onChange={(e) =>
              setChangePasswordData({
                ...changePasswordData,
                email: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: PRIMARY_COLOR }} />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={dialogStyle.actions}>
          <Button 
            onClick={() => setOpenEmailDialog(false)}
            sx={{
              ...dialogStyle.button,
              ...dialogStyle.cancelButton
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendOtp}
            disabled={isLoading}
            sx={{
              ...dialogStyle.button,
              ...dialogStyle.actionButton
            }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Sending" : "Send OTP"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP Dialog - Enhanced */}
      <Dialog
        open={openOtpDialog}
        onClose={() => setOpenOtpDialog(false)}
        PaperProps={{
          sx: dialogStyle.paper
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={dialogStyle.title}>Reset Password</DialogTitle>
        <DialogContent sx={dialogStyle.content}>
          <Box sx={dialogStyle.iconHeader}>
            <Avatar sx={dialogStyle.avatar}>
              <LockReset sx={{ fontSize: 36 }} />
            </Avatar>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Enter the OTP sent to your email and create a new password.
          </Typography>
          
          <TextField
            margin="dense"
            label="One-Time Password (OTP)"
            fullWidth
            variant="outlined"
            value={changePasswordData.otp}
            onChange={(e) =>
              setChangePasswordData({
                ...changePasswordData,
                otp: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKey sx={{ color: PRIMARY_COLOR }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            value={changePasswordData.newPassword}
            onChange={(e) =>
              setChangePasswordData({
                ...changePasswordData,
                newPassword: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Password sx={{ color: PRIMARY_COLOR }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: PRIMARY_COLOR }} />
                    ) : (
                      <Visibility sx={{ color: PRIMARY_COLOR }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={dialogStyle.actions}>
          <Button 
            onClick={() => setOpenOtpDialog(false)}
            sx={{
              ...dialogStyle.button,
              ...dialogStyle.cancelButton
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitNewPassword}
            disabled={isLoading}
            sx={{
              ...dialogStyle.button,
              ...dialogStyle.actionButton
            }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? "Updating" : "Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignIn;

