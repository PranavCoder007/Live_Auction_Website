import React,{useContext} from 'react';
import './Afterlogin.css';
import './Search';
import './Forms';
import { FirstNameContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
const FrontendPage = () => {
  
  const navigate = useNavigate();
  const {firstName,setFirstName} = useContext(FirstNameContext);
  return (
    <div className="frontend-page">
      <h1>Hello {firstName}</h1>
      <div className="button-container">
        <button className="create-button" onClick={()=>navigate('/Forms')}>Create</button>
        <button className="search-button" onClick={()=>navigate('/Search')}>Search</button>
      </div>
    </div>
  );
};

export default FrontendPage;
