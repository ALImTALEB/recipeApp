import {Helmet} from "react-helmet"

// eslint-disable-next-line react/prop-types
const Title = ({ title }) => {
  return <Helmet>
        <title> {`${title} - RecipeApp`} </title>
    </Helmet>
  
}

export default Title