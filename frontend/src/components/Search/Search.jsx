import  { useState } from "react";

import "./Search.scss"
import { useNavigate } from "react-router-dom";

const Search = () => {

  const [input, setInput] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    input?.trim() && navigate(`?search=${input}`)
  }

  return (
    <div className="container">
      <div className="left">
        <h1>Nourishing Every Craving</h1>
        <p>
          Your Go-To Destination For Every Nourishing And Delicious Culinary
          Inspiration.
        </p>
        <form className="search" onSubmit={handleSubmit}>
            <input type="text" placeholder="search recipe..." onChange={e => setInput(e.target.value)} />
            <button>
            <img  className="mag" src="./images/search.png" alt="" />
            </button>
        </form>
      </div>
      <div className="right">
        <img src="./images/food.jpeg" alt="" />
      </div>
    </div>
  );
};

export default Search;