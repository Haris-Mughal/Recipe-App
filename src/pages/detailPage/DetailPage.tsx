import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/Store";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { fetchMeals } from "../../redux/MealSlice";
import { Categorys, Recipe } from "../../types/types";

const DetailPage: React.FC = () => {
  const { recpieId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const mealArray = useSelector((state: RootState) => state.meals.meals);
  const searchResults = useSelector(
    (state: RootState) => state.mealSearch.searchResults
  );
  const loading = useSelector((state: RootState) => state.meals.loading);
  const error = useSelector((state: RootState) => state.meals.error);
  const [recipieData, setRecipieData] = useState<Recipe | null>(null);

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  useEffect(() => {
    const matchRecipieId = mealArray.find(
      (recipies: Categorys) => recipies.idMeal.toString() === recpieId
    );

    if (matchRecipieId) {
      setRecipieData(matchRecipieId as Recipe);
    }
  }, [mealArray, recpieId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (recipieData === null) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div
        className="main relative bg-cover bg-center sm:w-full bg-no-repeat h-[709px] sm:h-[362px] "
        style={{
          backgroundImage: `url(${recipieData.strMealThumb})`,
        }}
      >
        <h4 className="absolute text-white inset-0 flex items-center justify-center text-center text-yellow font-bold text-4xl line-height-2  bg-black bg-opacity-70">
          {recipieData.strMeal}
        </h4>
      </div>

      <div className="container mx-auto mt-8 ps-5">
        <div key={recipieData.idMeal}>
          <div className="ingredients">
            <p className="flex flex-start text-2xl font-bold">Ingredients</p>
            <ul className="my-3">
              <ul className="list-disc list-inside">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((index) => {
                  const ingredient = recipieData[
                    `strIngredient${index}` as keyof Recipe
                  ] as string;
                  const measure = recipieData[
                    `strMeasure${index}` as keyof Recipe
                  ] as string;

                  if (ingredient) {
                    return (
                      <div key={index} className="py-1">
                        <li className="ms-7 text-[24px]">
                          {ingredient}
                          <span className="font-bold ms-3">{measure}</span>
                        </li>
                      </div>
                    );
                  }

                  return null;
                })}
              </ul>
            </ul>
          </div>
          <div className="procedure pb-8 mt-7">
            <h3 className="flex flex-start pb-2 text-2xl font-bold">
              Procedure
            </h3>
            <p className="py-1 ms-2 pe-1 text-[24px]">
              {recipieData.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
