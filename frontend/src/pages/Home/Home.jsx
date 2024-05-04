import Search from '../../components/Search/Search'
import Recipes from '../../components/Recipes/Recipes'
import Title from '../../components/Title'

const Home = () => {
  return (
    <>
        <Title title="Best Recipes Online" />
        <Search />
        <Recipes />
    </>
  )
}

export default Home