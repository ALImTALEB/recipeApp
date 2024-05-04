import "./User.scss"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import Loader from '../Loader/Loader'
import { useState } from "react"
import toast from "react-hot-toast"

const User = () => {

    const params=  useParams()
    const [isPendingg, setIsPending] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const { isPending, error, data } = useQuery({
        queryKey: [params.id],
        queryFn: () =>
          newRequest.get(`/users/${params.id}`).then((res) => {
            return res?.data;
          }),
      });

      const mutation = useMutation({
        mutationFn: () => {
          setIsPending(true);
          return newRequest
            .delete(`/users/delete/${params.id}`)
            .finally(() => setIsPending(false));
        },
        onSuccess: (res) => {
          queryClient.invalidateQueries(["user"]);
          toast.success(res?.data?.message);
          localStorage.setItem("currentUser", null)
          navigate("/")
        },
        onError: (err) => {
          setIsPending(false);
          toast.error(err?.response?.data?.message);
        },
      });

      const handleDelete = () => {
        mutation.mutate()
      }


  return (
    <div className="userDetails">
    {
        isPending ? <Loader />
        : error ? "something went wrong"
        : (

      <><div className="user">

                              <div className="left">
                                  <img src={data?.user?.img || '../images/user.png'} alt='' />
                              </div>
                              <div className="right">
                                  <h3> {data?.user?.username} </h3>
                                  <h3>{data?.user?.email}</h3>
                              </div>
                          </div><div className="update">
                                  <div className="left">
                                      <Link className='link' to={`/update/profile/${data?.user?._id}`}>
                                          <h5>Update Profile</h5>
                                      </Link>
                                  </div>
                                  <div className="right">
                                  <Link className="link" to="/update/password" >
                                      <h5>Update password</h5>
                                  </Link>
                                  </div>
                                  <button disabled={isPendingg} className="right">
                                  <Link  className="link"  onClick={handleDelete} >
                                      <h5>Delete Account</h5>
                                  </Link>
                                  </button>
                              </div></>
        )
    }

    </div>
  )
}

export default User