
import { useEffect, useState } from "react"
import "./Register.scss"
import newRequest from "../../utils/newRequest"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import upload from "../../utils/upload"

const Register = () => {
  
  const [file, setFile] = useState("")
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [errRegister, setErrRegister] = useState("")

  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser( {...user, [e.target.name]: e.target.value} )
  }



  const handleSubmit = async (e) => {
    e.preventDefault()

    const url = await upload(file)

    try {
      await newRequest.post("auth/register", {
        ...user,
        img: url
      })
      navigate("/login")
    } catch (error) {
      setErrRegister(error)
    }
  }

  useEffect( () => {

    if (errRegister) {
      toast.error(errRegister?.response?.data?.message)
    }
  }, [ errRegister] )

  return (
    <form className="register" onSubmit={handleSubmit}>
        <label>username</label>
        <input type='text' name="username" placeholder='username' onChange={handleChange} />

        <label>email</label>
        <input type='email' name="email" placeholder='user@gmail.com' onChange={handleChange} />

        <label>password</label>
        <input type='password' name="password" placeholder='********' onChange={handleChange} />

        <label>profilePic</label>
        <div className="file">
        <input type='file' onChange={ e => setFile(e.target.files[0]) } />
        </div>

        <button type='submit'>Register</button>
    </form>
  )
}

export default Register