import React, { useState } from 'react';
import axios from 'axios';

const FormAddUser = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");

  const saveUser = async(e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', {
        name,
        email,
        password,
        confPassword,
        role
      });
      window.location.reload();
      onClose();
    } catch (error) {
      if(error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }

  return (
    <div>
      <form onSubmit={saveUser}>
        <p className='has-text-centered text-red-500'>{msg}</p>
        <div className="field">
          <label className='label'>Name</label>
          <div className="control">
            <input 
              className="input" 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Email</label>
          <div className="control">
            <input 
              className="input" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Password</label>
          <div className="control">
            <input 
              className="input" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Confirm Password</label>
          <div className="control">
            <input 
              className="input" 
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              placeholder="******"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Role</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className='button is-success'>Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormAddUser;