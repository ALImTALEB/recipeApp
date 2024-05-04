import { useNavigate } from "react-router-dom";
import "./Add.scss";

import { recipeCategories } from "../../components/Recipes/constants";
import { useReducer, useState, useEffect } from "react";
import { INITIAL_STATE, recipeReducer } from "../../reducers/recipeReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import toast from "react-hot-toast";
import Title from "../../components/Title";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [state, dispatch] = useReducer(recipeReducer, INITIAL_STATE);
  const navigate = useNavigate()

  const [res, setRes] = useState("")
  const [err, setErr] = useState("")
  const queryClient = useQueryClient()

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleIng = (e) => {
    e.preventDefault()
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
      return newRequest.post(`/recipes/add`, recipe)
    },
    onSuccess: (res) => {
        queryClient.invalidateQueries(["recipes"])
        setRes(res?.data)
    },
    onError: (error) => {
      setErr(error?.response)
    },
  
  }) 

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(state)

      navigate("/myrecipes")

  }

  useEffect( () => {
    if (err) {
      toast.error(err?.data?.message)
    }
    if (res) {
      toast.success("Recipe successfully created")
    }
  }, [err, res] )

  return (
    <div action="" className="add">
    <Title title="Add Recipe" />
      <label>Recipe Name</label>
      <input type="text" name="recipeName" onChange={handleChange} />

      <label>Category</label>
      <select name="cat" onChange={handleChange}>
      <option defaultChecked >---</option>
        {recipeCategories?.map((cat) => (
          <option key={cat}> {cat} </option>
        ))}
      </select>

        <label>Ingredients</label>
      <form onSubmit={handleIng} >
        <input type="text" name="ingredients"/>
        <button  type="submit">add</button>
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
          <div className="file">
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

      <button onClick={ handleSubmit }>Create</button>
    </div>
  );
};

export default Add;
