
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./MyRecipes.scss"
import newRequest from "../../utils/newRequest";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import Title from "../../components/Title";

const MyRecipes = () => {
  const queryClient = useQueryClient()

  const currentUser = JSON.parse(localStorage.getItem("currentUser")).user;
  const [res, setRes] = useState("")

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["myrecipes"],
    queryFn: () =>
      newRequest.get(`/recipes?user=${currentUser._id}`).then((res) => {
        return res?.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/recipes/${id}`)
    },
    onSuccess: (res) => {
        queryClient.invalidateQueries(["recipes"])
        setRes(res?.data?.message)
    },
  }) 

  const handleDelete = async (recipeId) => {
    await mutation.mutate(recipeId)
  }

  useEffect( () => {
    refetch()
    if(res) {
      toast.success(res)
    }
  }, [refetch, res] )

  return (
    <div className="orders">
    <Title title="My Recipes" />
        <div className="container">
          <div className="title">
            <h1>My Recipes</h1>
          </div>
              {
                isPending ? <Loader /> :
                error ? "something went wrong"
                : (<table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Ratings</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {data?.recipes?.map( (recipe, i) => (
                  <tr key={i} >
                  <td>
                  <Link className="link" to={`/recipes/${recipe?._id}`}>

                    <img className="img" src={recipe?.coverImg} alt='' />
                    </Link>
                  </td>
                  <td>
                  <Link className="link" to={`/recipes/${recipe?._id}`}>
                   {recipe?.recipeName} 
                  </Link>
                   </td>
                  <td>
                  {recipe?.ratings || "null" }
                  </td>
                  <td>
                    {recipe?.createdAt?.toString().split('T')[0]}
                  </td>
                  <td className="td">
                  <Link  to={`/update/${recipe._id}`} >
                    <img className="edit" src='/images/edit.png' alt='' />
                  </Link>
                    <img className="delete" onClick={ () => handleDelete(recipe?._id) } src='/images/trash.png' alt='' />
                  </td>
                </tr>
                ) )}
                
            </tbody>

          </table>)
              }
        </div>
    
  </div>
  )
}

export default MyRecipes