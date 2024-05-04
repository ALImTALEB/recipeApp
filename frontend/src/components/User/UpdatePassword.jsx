import { useState } from "react";
import newRequest from "../../utils/newRequest";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdatePassword = () => {
  const [user, setUser] = useState({
    oldPassword: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const [isPendingg, setIsPending] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  console.log(user)

  const mutation = useMutation({
    mutationFn: (userr) => {
      setIsPending(true);
      return newRequest
        .put(`/users/password/update`, userr)
        .finally(() => setIsPending(false));
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["user"]);
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      setIsPending(false);
      toast.error(err?.response?.data?.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = {
      ...user,
    };

    await mutation.mutate(result);
  };

  return (
    <form className="register" onSubmit={handleSubmit}>
      <label>Old Password</label>
      <input
        type="password"
        name="oldPassword"
        placeholder="******"
        onChange={handleChange}
      />
      <label>New Password</label>
      <input
        type="password"
        name="password"
        placeholder="******"
        onChange={handleChange}
      />
    
      <button disabled={isPendingg} type="submit"> Update </button>
    </form>
  );
};

export default UpdatePassword;
