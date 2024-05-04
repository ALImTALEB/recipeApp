import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import toast from "react-hot-toast";

const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
       const res = await newRequest.post("/auth/login", {
        username,
        password
      })
      localStorage.setItem("currentUser", JSON.stringify(res.data))
      navigate("/")
    } catch (err) {
      setError(err)
    }
  }


  useEffect( () => {
    if (error) {
      toast.error(error?.response?.data?.message)
    }

  }, [error] )


  return (

    <form className="register" onSubmit={handleSubmit}>
    <label>username</label>
    <input type='text' placeholder='username' onChange={ (e) => setUsername(e.target.value) } />

    <label>password</label>
    <input type='password' placeholder='********' onChange={ (e) => setPassword(e.target.value) } />


    <button type='submit'>{ "login" }</button>
 <Link className="jcp"  to="/register">create new account?</Link>
</form>

  )
}

export default Login