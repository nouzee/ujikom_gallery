import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../features/authSlice';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isError, isSuccess, isLoading, message} = useSelector((state) => state.auth);

    useEffect(() => {
      if (user || isSuccess) {
        navigate("/home");
      }
      if (isSuccess || user) {
        dispatch(reset());
      }
    }, [user, isSuccess, dispatch, navigate]);
    

    const auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({email, password}));
    }

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
            <div className="columns is-centered">
                <div className="column is-4">
                    
                    <form onSubmit={auth} className='box'>
                        {isError && <p className='has-text-centered'>{message}</p>}
                    <h1 className="title is-2">Sign In</h1>
                        <div className="field">
                            <label className='label'>Email</label>
                            <div className="control">
                                <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Email"/>
                            </div>
                        </div>
                        <div className="field">
                            <label className='label'>Password</label>
                            <div className="control">
                                <input className="input" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="*********"/>
                            </div>
                        </div>
                        <div className="field mt-5">
                            <button type='submit' className='button is-success is-fullwidth'>
                                {isLoading ? "Loading..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Login;