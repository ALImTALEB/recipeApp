export const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("currentUser"))?._id,
  recipeName: "",
  cat: "",
  coverImg: "",
  images: [],
  ingredients: [],
  cookingInstructions: [],
};

export const recipeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_IMAGES":
      return {
        ...state,
        coverImg: action.payload.coverImg,
        images: action.payload.images,
      };
    case "ADD_INGREDIENT":
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case "REMOVE_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.filter((ing) => ing !== action.payload),
      };
    case "ADD_INSTRUCTION":
      return {
        ...state,
        cookingInstructions: [...state.cookingInstructions, action.payload],
      };
    case "REMOVE_INSTRUCTION":
      return {
        ...state,
        cookingInstructions: state.cookingInstructions.filter(
          (ins) => ins !== action.payload
        ),
      };
      case "SET_RECIPE":
        return {
          ...state,
          ...action.payload,
        };
  
    default:
      return state;
  }
};
