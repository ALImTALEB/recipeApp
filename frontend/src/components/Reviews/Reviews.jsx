/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/prop-types */
import StarRatings from "react-star-ratings";
import "./Reviews.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const Reviews = ({ review }) => {
  const userId = review.user;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [res, setRes] = useState("")
  const [err, setErr] = useState("")
  const recipeId = useParams().id
  const queryClient = useQueryClient()


  const { isPending, error, data } = useQuery({
    queryKey: [userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data.user;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/recipes/reviews/${recipeId}?revId=${id}`)
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["reviews"])
        setRes("review deleted asuccessfully!")
    },
    onError: (err) => {
        setErr(err.response.data)
    }
  }) 

  const deleteReview = async (id) => {
    await mutation.mutate(id)
  }

  useEffect( () => {
    if (res) {
      toast.success(res)
    }
    if (error) {
      toast.error(error)
    }    if (err) {
        toast.err(error)
      }
  }, [err, error, res] )

  return (
    <div className="reviewsss">
      <div className="revieww">
        {isPending ? (
          "Loading..."
        ) : error ? (
          "something went wrong with user details"
        ) : (
          <div className="user">
            <img
              className="pp"
              src={
                data?.img ||
                "https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
              }
              alt=""
            />
            <div className="info">
              <span> {data?.username} </span>
            </div>
          </div>
        )}

        <div className="stars">
          <StarRatings
            rating={review?.rating}
            starRatedColor="black"
            numberOfStars={3}
            starDimension="20px"
            starSpacing="1px"
            starEmptyColor="white"
            name="rating"
          />

        </div>
        <p className="rev"> {review?.comment} </p>

        {currentUser?.user?._id === review?.user && <p onClick={() => deleteReview(review._id)} className="delete">X</p>}
        <hr />
      </div>
    </div>
  );
};

export default Reviews;
