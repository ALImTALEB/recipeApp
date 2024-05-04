import { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import upload from "../../utils/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

const UpdateProfile = () => {
  const params = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: [params.id],
    queryFn: () =>
      newRequest.get(`/users/${params.id}`).then((res) => {
        return res?.data;
      }),
  });

  const [file, setFile] = useState("");
  const [newFile, setNewFile] = useState("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    img: data?.user?.img,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPendingg, setIsPending] = useState(false);
  const [uploadd, setUploadd] = useState(false);


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: (userr) => {
        setIsPending(true)
      return newRequest.put(`/users/me/update`, userr)
      .finally(() => setIsPending(false));
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["user", "currentUser"]);
      toast.success(res?.data?.message);
      localStorage.setItem("currentUser", JSON.stringify(res.data))
      navigate(`/me/${data?.user?._id}`)
    },
    onError: (err) => {
        setIsPending(false)
        toast.error(err?.response?.data?.message);
    }
  });

  const uploadImg = async () => {
    setUploadd(true)
    const url = await upload(file);
    if (url) {
        setUploadd(false)
    }
    setNewFile(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = {
      ...user,
      img: newFile || user.img,
    };

     await mutation.mutate(result);

    
  };

  useEffect(() => {
    if (data?.user) {
      setUser({
        username: data?.user?.username,
        email: data?.user?.email,
        img: data?.user?.img,
      });
    }

  }, [data?.user]);

  return (
      <form className="register" onSubmit={handleSubmit}>
      {
          isPending ? <Loader />
          : error ? "something went wrong"
          : (
      <><label>username</label><input
                              type="text"
                              value={user?.username}
                              name="username"
                              placeholder="username"
                              onChange={handleChange} /><label>email</label><input
                                  type="email"
                                  value={user?.email}
                                  name="email"
                                  placeholder="user@gmail.com"
                                  onChange={handleChange} /><label>profilePic</label><div className="file">
                                  <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                                  <img
                                      style={{ height: "50px", width: "50px" }}
                                      src={newFile || user?.img} />
                                  <button
                                      disabled={uploadd}
                                      onClick={(e) => {
                                          e.preventDefault();
                                          uploadImg();
                                      } }
                                  >
                                      upload
                                  </button>
                              </div><button disabled={isPendingg} type="submit"> {isPendingg ? "updating.." : "update"} </button></>
  
          )
    }
    </form>
  );
};

export default UpdateProfile;
