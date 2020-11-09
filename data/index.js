function renderCards(recipes) {
  $recipes.innerHTML = "";
  for (let i in recipes) {
    let ingredients = "";
    for (let j in recipes[i].ingredients) {
      if (
        typeof recipes[i].ingredients[j].unit === "undefined" &&
        typeof recipes[i].ingredients[j].quantity === "undefined"
      ) {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}</span></li>`;
      } else if (typeof recipes[i].ingredients[j].unit === "undefined") {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}:</span> ${recipes[i].ingredients[j].quantity}</li>`;
      } else {
        ingredients += `<li><span class="bold">${recipes[i].ingredients[j].ingredient}:</span> ${recipes[i].ingredients[j].quantity} ${recipes[i].ingredients[j].unit}</li>`;
      }
    }

    let description = "";
    if (recipes[i].description.length > 160) {
      description = recipes[i].description.slice(0, 160) + "...";
    } else {
      description = recipes[i].description;
    }

    $recipes.innerHTML += `
      <div class="card" id="${recipes[i].id}">
      <img src="assets/card_img.jpg" alt="${recipes[i].name}" class="card__img" />
      <div class="card__text">
        <div class="card__text__top">
          <h2 class="card__text__title">${recipes[i].name}</h2>
          <p class="card__text__time">
            <span class="material-icons"> access_time </span>
            <span class="bold">${recipes[i].time} min</span>
          </p>
        </div>
        <div class="card__text__bottom">
          <ul class="card__text__ingredients">
            ${ingredients}
          </ul>
          <p class="card_text__description">
          ${description}
          </p>
        </div>
      </div>
    </div>`;
  }
}

function filterRecipes(recipes, search) {
  let filteredRecipes = [];
  for (let i in recipes) {
    // Search by name
    if (recipes[i].name.match(search)) {
      filteredRecipes.push(
        recipes.find((x) => x.name === recipes[i].name.match(search).input)
      );
      // Search by description
    } else if (recipes[i].description.match(search)) {
      filteredRecipes.push(
        recipes.find(
          (x) => x.description === recipes[i].description.match(search).input
        )
      );
      // Search by ingredients
    } else {
      for (let j in recipes[i].ingredients) {
        if (recipes[i].ingredients[j].ingredient.match(search)) {
          filteredRecipes.push(
            recipes.find((x) => {
              if (typeof x.ingredients[j] != "undefined") {
                return (
                  x.ingredients[j].ingredient ===
                  recipes[i].ingredients[j].ingredient.match(search).input
                );
              }
            })
          );
        }
      }
    }
  }
  return filteredRecipes;
}

function showCards(recipes, filteredRecipes) {
  // Hide all cards
  for (let i = 1; i <= recipes.length; i++) {
    document.getElementById(i).classList.add("hide");
  }
  // Show filtred cards
  if (filteredRecipes[0] !== undefined && filteredRecipes[0] !== 0) {
    for (let j in filteredRecipes) {
      document.getElementById(filteredRecipes[j].id).classList.remove("hide");
    }
  } else if (filteredRecipes[0] == 0) {
    for (let i = 1; i <= recipes.length; i++) {
      document.getElementById(i).classList.remove("hide");
    }
  } else {
    console.log("vide");
  }
}

function getAllIngredients(recipes) {
  let allIngredients = [];
  recipes.map((x) => {
    x.ingredients.map((y) => {
      if (!allIngredients.includes(y.ingredient)) {
        return allIngredients.push(y.ingredient);
      }
    });
  });
  return allIngredients;
}

function getAllAppliances(recipes) {
  let allAppliances = [];
  recipes.map((x) => {
    if (!allAppliances.includes(x.appliance)) {
      return allAppliances.push(x.appliance);
    }
  });
  return allAppliances;
}

function getAllUstensils(recipes) {
  let allUstensils = [];
  recipes.map((x) => {
    x.ustensils.map((y) => {
      if (!allUstensils.includes(y)) {
        return allUstensils.push(y);
      }
    });
  });
  return allUstensils;
}

/* DOM Variables */
const $recipes = document.getElementById("recipes");
const $searchInput = document.getElementById("search-bar-input");

$searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  if ($searchInput.value.length > 2) {
    let eachFilteredRecipes = [];
    filteredRecipes = [];
    const searchInput = $searchInput.value.split(" ");
    for (let i in searchInput) {
      const search = new RegExp(searchInput[i], "i");
      eachFilteredRecipes.push(filterRecipes(recipes, search));
    }
    filteredRecipes = [].concat.apply([], eachFilteredRecipes);
    filteredRecipes = filteredRecipes
      .filter(
        // find common occurences
        (i) =>
          filteredRecipes.filter((j) => i === j).length >= searchInput.length
      )
      .filter((item, pos) => {
        // delete duplicate
        return filteredRecipes.indexOf(item) == pos;
      });
    showCards(recipes, filteredRecipes);
  } else if ($searchInput.value.length == 0) {
    filteredRecipes = [0];
    showCards(recipes, filteredRecipes);
  }
});

let filteredRecipes = recipes;
renderCards(filteredRecipes);

console.log(getAllUstensils(recipes));
