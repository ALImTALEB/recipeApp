import { useEffect, useState } from "react"
import "./Review.scss"
import newRequest from "../../utils/newRequest"
import { useParams } from "react-router-dom"
import StarRatings from "react-star-ratings";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const Review = () => {
  const recipeId = useParams().id

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [res, setRes] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post('/recipes/reviews', review)
    },
    onSuccess: () => {
       queryClient.invalidateQueries(["reviews"])
       setRes("review added/updated asuccessfully!")
    },
    onError: (err) => {
      setError(err.response.data)
    }
  })  

  const handleSubmit = async (e) => {
    e.preventDefault()

    await mutation.mutate({recipeId ,rating, comment})
    setComment("")
    setRating(0)

  }


  useEffect( () => {
    if (res) {
      toast.success(res)
    }
    if (error) {
      toast.error(error)
    }
  }, [error, res] )

  return (
    <form className="review" onSubmit={handleSubmit} >
        <h3>Submit or update a review</h3>

        <StarRatings
          rating={rating}
          starRatedColor="black"
          changeRating={ (e) => setRating(e) }
          numberOfStars={3}
          name='rating'
        />

        <input onChange={e => setComment(e.target.value)} placeholder="What is your opinion about this recipe?" />
        <button type="submit" >Submit</button>
    </form>
  )
}

export default Review