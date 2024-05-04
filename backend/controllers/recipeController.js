import Recipe from "../models/recipeModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createRecipe = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const recipe = await Recipe.create({
    ...req.body,
    user,
  });

  res.status(201).json({
    recipe,
  });
});

export const getRecipes = catchAsyncErrors(async (req, res, next) => {
  //filter fn
  const filters = {
    ...(req.query.user && { user: req.query.user }),
    ...(req.query.search && {
      recipeName: {
        $regex: req.query.search,
        $options: "i",
      },
    }),
    ...(req.query.cat && { cat: req.query.cat }),
    ...(req.query.ratings && { ratings: req.query.ratings }),
  };
  //////

  let recipes = await Recipe.find(filters)
    .sort({ ratings: -1 })
    .populate("user");
  const recipesNumber = recipes.length;

  res.status(200).json({
    recipes,
  });
});

export const getRecipeDetails = catchAsyncErrors(async (req, res, next) => {
  const recipe = await Recipe.findById(req?.params?.id).populate("user");
  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  res.status(200).json({
    recipe,
  });
});

export const updateRecipe = catchAsyncErrors(async (req, res, next) => {
  let recipe = await Recipe.findById(req?.params?.id);

  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  recipe = await Recipe.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
  });

  res.status(200).json({
    recipe,
  });
});

export const deleteRecipe = catchAsyncErrors(async (req, res, next) => {
  const recipe = await Recipe.findById(req?.params?.id);

  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  // check if it's his recipe or not so he can only delete his recipe

  await recipe.deleteOne();

  res.status(200).json({
    message: "Recipe Deleted",
  });
});

// reviews

export const createRecipeReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, recipeId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  const isReviewed = recipe?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    recipe.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    recipe.reviews.push(review);
    recipe.numOfReviews = recipe.reviews.length;
  }

  recipe.ratings =
    recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
    recipe.reviews.length;

  await recipe.save({ validateBeforeSave: false });

  res.status(201).json({
    message: "Review Added!",
  });
});

export const getRecipeReviews = catchAsyncErrors(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  res.status(200).json({
    reviews: recipe.reviews,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorHandler("Recipe not found", 404));
  }

  const hisReview = recipe?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (!hisReview) {
    return next(new ErrorHandler("You can only delete ur review", 404));
  }

  recipe.reviews = recipe?.reviews?.filter(
    (rev) => rev._id.toString() !== req?.query?.revId.toString()
  );

  recipe.numOfReviews = recipe.reviews.length;

  if (recipe.numOfReviews === 0) {
    recipe.ratings = 0;
  } else {
    recipe.ratings =
      recipe.reviews.reduce((acc, item) => item.rating + acc, 0) /
      recipe.numOfReviews;
  }

  await recipe.save({ validateBeforeSave: false });

  res.status(201).json({
    message: "Review deleted!",
  });
});
