import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({email:"",password:""})

  const handleSubmit = async (e) => {
    e.preventDefault();// this is a synthetic event
    const resp = await fetch("http://localhost:5000/api/loginuser", {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({email:credentials.email,password:credentials.password})
    })
    const js = await resp.json();
    console.log(js);
    if(js.message !== 'successful') {
      alert('Enter Valid Credentials');
    }
    if(js.message === 'successful') {
      localStorage.setItem('authToken', js.authToken)
      navigate('/');
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials ,[e.target.name]:e.target.value});
  }

  return (
    <div><div className='container'>
    <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" name='email' value={credentials.email} onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={credentials.password} onChange={onChange} />
  </div>
  <button type="submit" className="m-3 btn btn-success">Submit</button>
  <Link to="/createuser" className='m-3 btn btn-danger'>I'm a New User</Link>
</form>
</div></div>
  )
}
