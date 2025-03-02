import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

function App() {
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [token, setToken] = useState("");
  const [tiktokUsername, setTiktokUsername] = useState("ethan");
  const [generalInfo, setGeneralInfo] = useState('{"name":"ethan"}');
  const [cashflowFile, setCashflowFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post(`${API_BASE_URL}/signup`, {
            email: signupEmail,
            password: signupPassword
        });
        setResponseMessage(`Signup Successful: ${data.message}`);
    } catch (err) {
        setResponseMessage(err.response?.data?.detail || "Signup Failed!");
    }
  };

const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post(`${API_BASE_URL}/login`, {
            email: loginEmail,
            password: loginPassword
        });
        if (data.access_token) {
            setToken(data.access_token);
            setResponseMessage("Login successful! Token received.");
        } else {
            throw new Error("No access token received");
        }
    } catch (err) {
        setResponseMessage(err.response?.data?.detail || "Login Failed!");
    }
  };


  const handleAPIRequest = async (endpoint, method = "POST", body = {}, isFile = false) => {
    if (!token) {
      setResponseMessage("Unauthorized: Please log in first.");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (!isFile) headers["Content-Type"] = "application/json";

      console.log(`Making API call to: ${endpoint}`);
      console.log(`Using Token: ${token}`); // Debugging token

      const response = await axios({
        method,
        url: `${API_BASE_URL}/${endpoint}`,
        headers,
        data: isFile ? body : JSON.stringify(body),
      });

      setResponseMessage(`Success: ${JSON.stringify(response.data)}`);
    } catch (err) {
      console.error("API Error:", err.response?.data);
      setResponseMessage(err.response?.data?.detail || "API Request Failed!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mock API Frontend</h1>
      <p><strong>Response:</strong> {responseMessage}</p>

      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
        <button type="submit">Signup</button>
      </form>

      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleAPIRequest("update_digital", "POST", tiktokUsername) }}>
        <h2>Update TikTok Username</h2>
        <input type="text" placeholder="TikTok Username" value={tiktokUsername} onChange={(e) => setTiktokUsername(e.target.value)} />
        <button type="submit">Update Digital</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); handleAPIRequest("update_general_info", "POST", JSON.parse(generalInfo)) }}>
        <h2>Update General Info</h2>
        <textarea placeholder='{"key": "value"}' value={generalInfo} onChange={(e) => setGeneralInfo(e.target.value)} rows="4" cols="50" />
        <button type="submit">Update General Info</button>
      </form>

      <button onClick={(e) => { e.preventDefault(); handleAPIRequest("apply", "POST",{})}}>Apply</button>
      <button onClick={(e) => { e.preventDefault(); handleAPIRequest("train", "POST",{})}}>Train</button>
      <button onClick={(e) => { e.preventDefault(); handleAPIRequest("me", "GET",{})}}>Get Data</button>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (!cashflowFile) return setResponseMessage("No file selected.");
        const formData = new FormData();
        formData.append("file", cashflowFile);
        handleAPIRequest("upload_cashflow", "POST", formData, true);
      }}>
        <h2>Upload Cashflow</h2>
        <input type="file" onChange={(e) => setCashflowFile(e.target.files[0])} />
        <button type="submit">Upload Cashflow</button>
      </form>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (!documentFile) return setResponseMessage("No file selected.");
        const formData = new FormData();
        formData.append("file", documentFile);
        handleAPIRequest("upload_official_document", "POST", formData, true);
      }}>
        <h2>Upload Official Document</h2>
        <input type="file" onChange={(e) => setDocumentFile(e.target.files[0])} />
        <button type="submit">Upload Document</button>
      </form>

      
    </div>
  );
}

export default App;