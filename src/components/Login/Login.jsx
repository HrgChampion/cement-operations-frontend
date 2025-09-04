import { TextField, Button, Box, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { login,signup } from '../../services/auth'
import { useLocation } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname === "/signup" ? "Sign Up" : "Login";

  const handleLogin = async(e) => {
    e.preventDefault()
    const res = await login({ email, password });
    if (res.access_token) {
      navigate('/dashboard')
      setEmail("");
      setPassword("");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  }

  const handleSignup = async(e) => {
    e.preventDefault()
   const res = await signup({ email, password });
   if(res.id){
    navigate('/login')
    setEmail("");
    setPassword("");
   } else {
      alert("Signup failed. Please check your credentials.");
   }
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      className='login-container'
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: 320 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {currentPath==="Login" && "Login" || "Sign Up"}
        </Typography>
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField id="outlined-password" label="Password" variant="outlined" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button variant="contained" type="submit" fullWidth className='login-button' onClick={(e)=> currentPath==="Login" ?  handleLogin(e):handleSignup(e)}>
          {currentPath==="Login" && "Login" || "Sign Up"}
          </Button>
         { currentPath==="Login" ? <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            Don't have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/signup')}>Sign Up</span>
          </Typography> : <Typography align="center" variant="body2" sx={{ mt: 2 }}>
            Already have an account? <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
          </Typography>}
        </Box>
        
      </Paper>
    </Box>
  )
}

export default Login