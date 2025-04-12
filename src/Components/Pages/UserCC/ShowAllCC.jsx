import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  TablePagination,
  Container,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Divider,
  Stack,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Grid,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Search,
  Refresh,
  ContentCopy,
  Badge,
  LockReset,
  Visibility as VisibilityIcon,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import AppNavBar from "../../AppNavBar";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../../../Base_Url/Base_Url";

export default function ShowAllCC() {
  const [credentials, setCredentials] = useState([]);
  const [filteredCredentials, setFilteredCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Password change dialog states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // Snackbar for success/error messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Base_Url}/color-Code/auth/get-all-wd-credencials`
      );
      setCredentials(response.data);
      setFilteredCredentials(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setError("Failed to load credentials. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = credentials.filter(
        (cred) =>
          cred.wdCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cred.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCredentials(filtered);
      setPage(0);
    } else {
      setFilteredCredentials(credentials);
    }
  }, [searchTerm, credentials]);

  const navigate = useNavigate();
  const handleShowCode = (wdCode) => {
    navigate(`/show-all-cc/${wdCode}`);
  };

  const handleCopyCode = (wdCode) => {
    navigator.clipboard.writeText(wdCode);
    setCopiedId(wdCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCredentials();
    setRefreshing(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Password change handlers
  const handleOpenChangePassword = (credential) => {
    setSelectedCredential(credential);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setChangePasswordOpen(false);
    setSelectedCredential(null);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = async () => {
    // Validation
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters long");
      return;
    }

    setChangePasswordLoading(true);

    const formData = new FormData();
    formData.append("email", selectedCredential.email);
    formData.append("password", newPassword);

    try {
      const response = await axios.post(
        `${Base_Url}/color-Code/auth/change-password`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response, "llllllllll");
      // Update the local state if needed
      const updatedCredentials = credentials.map((cred) =>
        cred.id === selectedCredential.id
          ? { ...cred, password: newPassword }
          : cred
      );

      setCredentials(updatedCredentials);
      setFilteredCredentials(updatedCredentials);

      // Show success message
      setSnackbar({
        open: true,
        message: "Password updated successfully",
        severity: "success",
      });

      handleCloseChangePassword();
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to update password",
        severity: "error",
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && !refreshing) {
    return (
      <>
        <AppNavBar />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading credentials...
            </Typography>
          </Box>
        </Container>
      </>
    );
  }

  if (error && !refreshing) {
    return (
      <>
        <AppNavBar />
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Alert
            severity="error"
            sx={{ my: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavBar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Card elevation={3} sx={{ mb: 3, boxShadow: "none" }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "medium" }}
              >
                <Badge sx={{ mr: 1, verticalAlign: "middle" }} />
                Credential Management
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  placeholder="Search credentials..."
                  size="small"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Tooltip title="Refresh data">
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Refresh
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Paper
          elevation={3}
          sx={{ width: "100%", overflow: "hidden", position: "relative" }}
        >
          {refreshing && (
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Box
            sx={{
              p: 2,
              bgcolor: "#1976d2",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              User Credentials
            </Typography>
            <Chip
              label={`Total: ${filteredCredentials.length}`}
              color="primary"
              variant="outlined"
              sx={{ bgcolor: "white" }}
            />
          </Box>
          <Divider />
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      width: "10%",
                    }}
                  >
                    Sr. No.
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      width: "25%",
                    }}
                  >
                    WD Code
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      width: "35%",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#f5f5f5",
                      width: "30%",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCredentials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No credentials found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCredentials
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((credential, index) => (
                      <TableRow
                        key={credential.id}
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "#f8f9fa" },
                          "&:hover": { bgcolor: "#e3f2fd" },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ fontWeight: "medium", mr: 1 }}>
                              {credential.wdCode}
                            </Typography>
                            <Fade in={copiedId === credential.wdCode}>
                              <Chip
                                label="Copied!"
                                color="success"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Fade>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={credential.email}
                            variant="outlined"
                            size="small"
                            sx={{ maxWidth: "100%" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Show WD Code">
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<Visibility />}
                                onClick={() =>
                                  handleShowCode(credential.wdCode)
                                }
                              >
                                Show
                              </Button>
                            </Tooltip>
                            <Tooltip title="Change Password">
                              <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                startIcon={<LockReset />}
                                onClick={() =>
                                  handleOpenChangePassword(credential)
                                }
                              >
                                Password
                              </Button>
                            </Tooltip>
                            <Tooltip title="Copy WD Code">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() =>
                                  handleCopyCode(credential.wdCode)
                                }
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCredentials.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>

      <Dialog
        open={changePasswordOpen}
        onClose={handleCloseChangePassword}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 600,
          }}
        >
          <LockReset fontSize="small" />
          Update Password Credentials
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
          {selectedCredential && (
            <Box>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: "#f5f9ff",
                  borderRadius: 1,
                  border: "1px solid #e3f2fd",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  User Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        WD Code:
                      </Typography>
                      <Chip
                        size="small"
                        label={selectedCredential.wdCode}
                        color="primary"
                        sx={{ fontWeight: "medium" }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        User Code:
                      </Typography>
                      <Chip
                        size="small"
                        label={selectedCredential.userCode || "N/A"}
                        variant="outlined"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <TextField
                label="Email Address"
                fullWidth
                value={selectedCredential.email}
                disabled
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ mt: 2, mb: 1, fontWeight: 600 }}
              >
                Set New Password
              </Typography>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Clear error when user types
                    if (passwordError) setPasswordError("");
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                  label="New Password"
                />
              </FormControl>

              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel
                  htmlFor="confirm-password"
                  color={
                    confirmPassword && newPassword !== confirmPassword
                      ? "error"
                      : "primary"
                  }
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Clear error when user types
                    if (passwordError) setPasswordError("");
                  }}
                  error={confirmPassword && newPassword !== confirmPassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5 }}
                  >
                    Passwords don't match
                  </Typography>
                )}
              </FormControl>

              {passwordError && (
                <Alert
                  severity="error"
                  sx={{ mt: 2, animation: "fadeIn 0.3s" }}
                  variant="filled"
                >
                  {passwordError}
                </Alert>
              )}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "#fff9e9",
                  borderRadius: 1,
                  border: "1px solid #ffe0b2",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ color: "warning.main" }}>
                  <Visibility fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Password must be at least 5 characters long and should be kept
                  confidential.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2.5, justifyContent: "space-between" }}>
          <Button
            onClick={handleCloseChangePassword}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            color="primary"
            disabled={
              changePasswordLoading ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword ||
              newPassword.length < 5
            }
            startIcon={
              changePasswordLoading ? (
                <CircularProgress size={20} />
              ) : (
                <LockReset />
              )
            }
            sx={{
              borderRadius: "8px",
              px: 3,
              py: 1,
              boxShadow: 2,
            }}
          >
            {changePasswordLoading ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
