import { useParams } from "react-router-dom";
import Review from "../../components/Review/Review";
import { Slider } from "infinite-react-carousel";
import "./Recipe.scss";
import "react-gallery-carousel/dist/index.css";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import StarRatings from "react-star-ratings";
import Loader from "../../components/Loader/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Reviews from "../../components/Reviews/Reviews";
import Title from "../../components/Title";

const Recipe = () => {
  const loggedInnn56 = JSON.parse(localStorage.getItem("currentUser"));
  const recipeId = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: [recipeId.id],
    queryFn: () =>
      newRequest.get(`/recipes/${recipeId.id}`).then((res) => {
        return res.data;
      }),
  });
  const recipe = data?.recipe;

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="recipe">
    <Title title="Recipe Details" />
      <div className="cntr">
        <div className="left">
          <Slider slidesToShow={1} className="slider">
            {recipe?.images?.map((img, i) => (
              <img key={i} src={img} />
            ))}
          </Slider>
        </div>

        <div className="right">
          <div className="recipeDetails">
            <h2> {recipe?.recipeName} </h2>
            <div className="details">
              <div className="userDetails">
                <img src={recipe?.user?.img || "../images/user.png"} alt="" />
                <span> {recipe?.user?.username} </span>
              </div>
              <div className="likes">
                <StarRatings
                  rating={recipe?.ratings}
                  starRatedColor="black"
                  numberOfStars={3}
                  starDimension="20px"
                  starSpacing="1px"
                  starEmptyColor="white"
                  name="rating"
                />

                <span> ({recipe?.numOfReviews}) </span>
              </div>
            </div>

            <h3>Ingredients</h3>
            <div className="ingredients">
              {recipe?.ingredients?.map((ing, i) => (
                <span key={i}> - {ing} </span>
              ))}
            </div>
            <h3>Cooking Instructions</h3>
            <div className="cookingInstructions">
              {recipe?.cookingInstructions?.map((ing, i) => (
                <span key={i}> - {ing} </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {
        recipe?.reviews?.map( (review, i) => (
      <Reviews key={i} review={review} numOfReviews={recipe?.numOfReviews} />
        ) )
      }
      {loggedInnn56?.user ? <Review /> : <p>Login to submit ur review</p>}
    </div>
  );
};

export default Recipe;
