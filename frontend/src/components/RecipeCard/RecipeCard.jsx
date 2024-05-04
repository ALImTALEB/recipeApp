/* eslint-disable react/prop-types */

import "./RecipeCard.scss"
import { Link } from 'react-router-dom'
import StarRatings from "react-star-ratings"

const RecipeCard = ({ recipe, index, rating }) => {

  return (
    <Link className='link' to={`/recipes/${recipe._id}`}>

    <div className="contain">
      <div className="cover">
      <img src={recipe.coverImg} alt='' />
      {
        rating ?
        <div className='class'><span> {index+1} </span></div>
        : ""
      }
      </div>
      <div className="info">
        <div className="picName">
          <img src={recipe?.user?.img} alt='' />
          <span> {recipe?.user?.username} </span>
        </div>
        <div className="details">
        <StarRatings
          rating={recipe?.ratings}
          starRatedColor="black"
          numberOfStars={3}
          starDimension="20px"
          starSpacing="1px"
          starEmptyColor="white"
          name='rating'
        />
          <span> ({ recipe.numOfReviews }) </span>
        </div>
      </div>
      <h4> {recipe.recipeName} </h4>
    </div>
    </Link>
  )
}

export default RecipeCard