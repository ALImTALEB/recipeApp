import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./MyReviews.scss";
import Loader from "../../components/Loader/Loader";
import Title from "../../components/Title";

const MyReviews = () => {

  const currentUser = JSON.parse(localStorage.getItem("currentUser")).user;

  const { isPending, error, data } = useQuery({
    queryKey: ["recipes"],
    queryFn: () =>
      newRequest.get(`/recipes`).then((res) => {
        return res?.data;
      }),
  });
  const recipesReviewed = data?.recipes?.filter((recipe) => {
    return recipe.reviews.some((rev) => rev.user === currentUser._id);
  });
  const myReviews = recipesReviewed?.flatMap((recipe) => {
    return recipe.reviews.filter((rev) => rev.user === currentUser._id);
  });

  return (
    <div className="revv">
    <Title title="My Reviews" />
      <div className="container">
        <div className="title">
          <h1>My Reviews</h1>
        </div>
        {
            isPending ? <Loader />
            : error ? "something went wrong"
            : (

        <div className="tables">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Recipe Name</th>
              </tr>
            </thead>
            <tbody>
              {recipesReviewed?.map((recipe, i) => (
                <tr key={i}>
                  <td>
                    <Link className="link" to={`/recipes/${recipe?._id}`}>
                      <img src={recipe?.coverImg} alt="" />
                    </Link>
                  </td>
                  <td>
                    <Link className="link" to={`/recipes/${recipe?._id}`}>
                      {recipe?.recipeName}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Comment</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {myReviews?.map((review, i) => (
                <tr key={i}>
                  <td>{review?.comment}</td>
                  <td>{review?.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            )
        }
      </div>
    </div>
  );
};

export default MyReviews;
