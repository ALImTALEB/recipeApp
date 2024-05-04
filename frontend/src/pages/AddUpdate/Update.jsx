import { useNavigate, useParams } from "react-router-dom";
import "./Add.scss";

import { recipeCategories } from "../../components/Recipes/constants";
import { useReducer, useState, useEffect } from "react";
import { INITIAL_STATE, recipeReducer } from "../../reducers/recipeReducer";
import upload from "../../utils/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import toast from "react-hot-toast";
import Title from "../../components/Title";
import Loader from "../../components/Loader/Loader";

const Update = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [state, dispatch] = useReducer(recipeReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const { id } = useParams();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: [id],
    queryFn: () =>
      newRequest.get(`/recipes/${id}`).then((res) => {
        return res?.data;
      }),
  });

  const [res, setRes] = useState("");
  const [err, setErr] = useState("");
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleIng = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_INGREDIENT",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleIns = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_INSTRUCTION",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const coverImg = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { coverImg, images } });
    } catch (error) {
      console.log(error);
    }
  };

  const mutation = useMutation({
    mutationFn: (recipe) => {
      return newRequest.put(`/recipes/update/${id}`, recipe);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["recipes", "myrecipes"]);
      setRes(res?.data);
    },
    onError: (error) => {
      setErr(error?.response);
    },
  });
  console.log(res);
  console.log(err);

  console.log(state);
  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(state);

    navigate("/myrecipes");
  };

  useEffect(() => {
    if (data?.recipe) {
      dispatch({
        type: "SET_RECIPE",
        payload: {
          recipeName: data?.recipe?.recipeName,
          cat: data?.recipe?.cat,
          ingredients: data?.recipe?.ingredients,
          cookingInstructions: data?.recipe?.cookingInstructions,
          coverImg: data?.recipe?.coverImg,
          images: data?.recipe?.images,
        },
      });
    }

    if (err) {
      toast.error(err?.data?.message);
    }
    if (error) {
        toast.error(error?.data?.message)
    }
    if (res) {
      toast.success("Recipe successfully updated");
      refetch();
    }
  }, [data?.recipe, err, error, refetch, res]);

  return (
    <div action="" className="add">
      <Title title="Add Recipe" />
      <h2>Update Recipe</h2>
      {
        isPending ? <Loader />
        : error ? "something went wrong"
        :
        (
            <>

      <label>Recipe Name</label>
      <input
        type="text"
        name="recipeName"
        value={state.recipeName}
        onChange={handleChange}
      />

      <label>Category</label>
      <select name="cat" value={state.cat} onChange={handleChange}>
        <option>---</option>
        {recipeCategories?.map((cat) => (
          <option key={cat}> {cat} </option>
        ))}
      </select>

      <label>Ingredients</label>
      <form onSubmit={handleIng}>
        <input type="text" name="ingredients" />
        <button type="submit">add</button>
      </form>
      <div className="addedF">
        {state?.ingredients?.map((ing, i) => (
          <button
            onClick={() =>
              dispatch({ type: "REMOVE_INGREDIENT", payload: ing })
            }
            key={i}
          >
            {ing}
            <span>X</span>
          </button>
        ))}
      </div>

      <label>Cooking Instructions</label>
      <form onSubmit={handleIns}>
        <input type="text" name="cookingInstructions" />
        <button type="submit">add</button>
      </form>
      <div className="addedF">
        {state?.cookingInstructions?.map((ing, i) => (
          <button
            onClick={() =>
              dispatch({ type: "REMOVE_INSTRUCTION", payload: ing })
            }
            key={i}
          >
            {ing}
            <span>X</span>
          </button>
        ))}
      </div>
      <div className="images">
        <div className="imgInputs">
          <label>Cover Image</label>
          <div className="filee">
            <input
              onChange={(e) => setSingleFile(e.target.files[0])}
              type="file"
            />
            <img className="imgg" src={state.coverImg} />
          </div>

          <label>Images</label>
          <div className="file">
            <input
              multiple
              onChange={(e) => setFiles(e.target.files)}
              type="file"
            />
            <div className="jcpp">
              {state?.images?.map((img, i) => (
                <img key={i} className="imgg" src={img} />
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleUpload}>
          {uploading ? "uploading" : "Upload images"}
        </button>
      </div>

      <button onClick={handleSubmit}>Update</button>
            </>
        )
      }
    </div>
  );
};

export default Update;
