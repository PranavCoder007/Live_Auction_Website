import React, { useState,useContext } from 'react';
import './Login.css';
import './Login.css';
import  './Afterlogin';
import { Link, useNavigate } from 'react-router-dom';
import { FirstNameContext } from '../App';
const Login = () => {
  const url = "http://localhost:8000/Login";
  const navigate= useNavigate();
  const {firstName,setFirstName} = useContext(FirstNameContext);
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isGuest) {
      alert('Logging in as Guest');
    } else {
      e.preventDefault();
      try {
        const response= await fetch(url,{
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({ email, username, password   }),
        });
        const data= await response.json();

        if(response.ok){
          setFirstName(username)
          navigate('/Afterlogin')
        }
        else{
          console.error(data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className='fade-in'>
    <div className="login">
      <h2>Login Page</h2>
      <form id="login" onSubmit={handleLogin}>
        <label htmlFor="email"><b>Email</b></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <br /><br />
        <label htmlFor="username"><b>Username</b></label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <br /><br />
        <label htmlFor="password"><b>Password</b></label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <br /><br />
        <input
          type="checkbox"
          id="guest"
          checked={isGuest}
          onChange={(e) => setIsGuest(e.target.checked)}
          // onClick={()=> navigate('/Search')}
        />
        <span>Log in as Guest</span>
        <br /><br />
        <input type="submit" value="Log In" />
      </form>
    </div>
    </div>
  );
};
export default Login;
