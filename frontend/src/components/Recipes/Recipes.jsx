import "./Recipes.scss";
import RecipeCard from "../RecipeCard/RecipeCard";

import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { recipeCategories } from "./constants";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast"

const Recipe = () => {
  let {search} = useLocation()
  let [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const rating = searchParams.get("ratings")

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["recipes"],
    queryFn: () =>
      newRequest.get(`/recipes${search}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    refetch()

    if (error) {
      toast.error(error.message)
    }

  }, [error, refetch, search]);

  //handle category filter
  const handleClick = (checkbox) => {

    const checkboxes = document.getElementsByName(checkbox.name)

    checkboxes.forEach( (item) => {
      if (item !== checkbox) item.checked = false
    } )

    if (checkbox.checked === false) {
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name)
        const path = window.location.pathname + "?" + searchParams.toString()
        navigate(path)
      }
    } else {
      if (searchParams.has(checkbox.name)) {
        setSearchParams(searchParams.set(checkbox.name, checkbox.value)); // Corrected line
      } else {
        setSearchParams(searchParams.append(checkbox.name, checkbox.value)); // Corrected line
      }
      const path = window.location.pathname + "?" + searchParams.toString()
      navigate(path)
    }

  }
  
  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType)
    if (checkboxValue === value) return true
    return false
  }

  return (
    <div className="containr">
        <h2> { rating ? `Top Rated Recipes Found :` : "Best Recipes Of All Time" } </h2>

        <div  className="check">
          <h5>Category</h5>
        { recipeCategories?.map( (cat) => (
          <div key={cat} >
            <input 
              type="checkbox"
              name="cat"
              id={cat}
              value={cat}
              defaultChecked={defaultCheckHandler("cat", cat)}
              onClick={ (e) => handleClick(e.target) }
            />
            <label htmlFor={cat} >
              {cat}
            </label>
          </div>
        ) ) }
        </div>
      <div className="recipes">
        {isPending
          ? <Loader />
          : data?.recipes?.map((recipe, i) => (
              <RecipeCard key={recipe._id} index={i} recipe={recipe} rating={rating} />
            ))}
      </div>
    </div>
  );
};

export default Recipe;
