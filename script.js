const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  singl_mealEl = document.getElementById("single-meal");

const urlMealsID = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const urlMealsRandom = "https://www.themealdb.com/api/json/v1/1/random.php";

const getMealById = (mealID) => {
  fetch(`${urlMealsID} + ${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMeal(meal);
    });
};

// FD - async-await
async function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  const res = await fetch(`${urlMealsRandom}`);
  const data = await res.json();
  const meal = await data.meals[0] 
  addMeal(meal);
}

// FE - fetch
const searchMeal = (event) => {
  event.preventDefault();

  singl_mealEl.innerHTML = "";

  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals === null) {
          resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `

          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="meal-info" data-mealID="${meal.idMeal}">
              <h3>${meal.strMeal}</h3>            
            </div>
          </div>
        `
            )
            .join("");
        }
      });
    search.value = "";
  }

  // else {
  //   alert('Please enter a search term')
  // }
};

const addMeal = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 50; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    }
  }

  singl_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

        <div class="single-meal-info">
          <p>${meal.strCategory}</p>
          <p>${meal.strArea}</p>
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>
      </div>  
  
  `;
};

submit.addEventListener("click", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
