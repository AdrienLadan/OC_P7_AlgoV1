const recipesContainer = document.getElementById('recipes_cards');

const filtersSelected = {
    searchStr: '',
    ustensils: [],
    appareils: [],
    ingredients: []
};



recipesListFactory(recipesContainer, recipes);

function recipesListFactory(container, recipes) {
    for (let i = 0; i < recipes.length; i++) {
        recipeCardFactory(container, recipes[i]);
    }
}

function recipeCardFactory(container, recipe) {



    const recipeCard = document.createElement('div');
    recipeCard.classList.add('card');

    const recipeCardTitle = document.createElement('div');
    recipeCardTitle.classList.add('titleCard');


    const recipeCardBody = document.createElement('div');
    recipeCardBody.classList.add('recipeCardBody');


    const img = document.createElement('img');
    img.classList.add('image');
    img.src = "Assets/couleur-gris-cmjn-imprimerie.jpg";

    const h2 = document.createElement('h2');
    h2.classList.add('name');
    h2.textContent = recipe.name

    const time = document.createElement('h2');
    time.classList.add('time');
    time.textContent = recipe.time + "min";

    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-timer');

    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = recipe.description

    const ingredientsList = document.createElement('div');
    ingredientsList.classList.add('ingredients');


    for (let i = 0; i < recipe.ingredients.length; i++) {

        const ingredientDisplay = document.createElement('div');
        ingredientDisplay.classList.add('ingredientDisplay');

        const ingredient = document.createElement('p');
        ingredient.classList.add('ingredient');
        ingredient.textContent = recipe.ingredients[i].ingredient;
        ingredientsList.appendChild(ingredient);

        const quantity = document.createElement('p');
        quantity.classList.add('quantity');
        quantity.textContent = recipe.ingredients[i].quantity;
        ingredientsList.appendChild(quantity);

        const unit = document.createElement('p');
        unit.classList.add('unit');
        unit.textContent = recipe.ingredients[i].unit;
        ingredientsList.appendChild(unit);

        ingredientDisplay.appendChild(ingredient);
        ingredientDisplay.appendChild(quantity);
        ingredientDisplay.appendChild(unit);
        ingredientsList.appendChild(ingredientDisplay);


    }

    recipeCard.appendChild(img);

    recipeCardTitle.appendChild(h2);
    recipeCardTitle.appendChild(time);

    recipeCardBody.appendChild(ingredientsList);
    recipeCardBody.appendChild(description);



    recipeCard.appendChild(recipeCardTitle);
    recipeCard.appendChild(recipeCardBody);
    container.appendChild(recipeCard);
}

//fonction pour récuperer les éléments qui matched l'input 

function getElementsMatchingInput(inputValue, array) {
    return array.filter(item => {
        if (typeof item === "string") {
            return item?.toLowerCase()?.includes(inputValue.toLowerCase());
        }

        return Object.values(item).some(val => {
            return val?.toString()?.toLowerCase().includes(inputValue.toLowerCase());
        });
    });
}

let currentInput = '';
let currentIngredients = [];
let currentUstensils = [];
let currentAppareils = [];







function filterAndDisplayRecipes() {
    recipesContainer.innerHTML = '';
    NbResults.innerHTML = '';
    let results = recipes;

    if (filtersSelected.searchStr.length > 2) {
        results = getElementsMatchingInput(filtersSelected.searchStr, results)
    }

    if (filtersSelected.appareils.length > 0) {
        results = results.filter(res => filtersSelected.appareils.includes(res.appliance));
    }

    if (filtersSelected.ustensils.length > 0) {
        results = results.filter(res => filtersSelected.ustensils.every(
            selectedUstensil => res.ustensils.includes(selectedUstensil)));
    }

    if (filtersSelected.ingredients.length > 0) {
        results = results.filter(res => filtersSelected.ingredients.every(
            selectedIngredient => res.ingredients.find(ingredient => ingredient.ingredient === selectedIngredient) !== undefined));
    }

    console.log(`Elements found for filters`, results, filtersSelected);
    if (results.length > 0) {

        let numResults = document.createElement('p');
        numResults.classList.add('NbResults');
        numResults.textContent = `${results.length} results found`;
        NbResults.appendChild(numResults);

        results.forEach(result => {
            recipeCardFactory(recipesContainer, result);
        });
        if (results.length === 0) {
            const recipesContainer = document.getElementById('recipes_cards');
            recipesContainer.innerHTML = "No results found";
        }
    }
}






const input = document.querySelector('input');
// const filterInput = document.getElementsByName('filter');
input.addEventListener('keyup', function (e) {
    let inputValue = e.target.value;
    recipesContainer.innerHTML = '';

    filtersSelected.searchStr = inputValue;
    filterAndDisplayRecipes();

}
);

// Fonction pour Flatten un array 

function flattenAndGetDistinctElements(array2D) {
    const flattenArray = array2D.flat();
    return [...new Set(flattenArray)];
}

// Fonction pour creer les chips 

function BootstrapChipFactory(textBtn, iconClass, onRemoveChip) {
    const chip = document.createElement('div');
    chip.classList.add("btn-group");

    const mainBtn = document.createElement('button');
    mainBtn.classList.add('btn');
    mainBtn.innerText = textBtn;


    const sideBtn = document.createElement('button');
    sideBtn.classList.add('btn');

    const icon = document.createElement('span');
    icon.classList.add(iconClass);
    icon.classList.add('fas');

    sideBtn.appendChild(icon);

    sideBtn.addEventListener('click', function () {
        chip.remove();

        if (onRemoveChip) {
            onRemoveChip();
        }
    });

    chip.appendChild(mainBtn);
    chip.appendChild(sideBtn);

    return chip;
}

//Ustensils

//Display des ustensils dans le dropdown


const ustensils = recipes.map(ustensils => ustensils.ustensils);
const uniqueUstensils = flattenAndGetDistinctElements(ustensils);


function UstensilListFactory(ustensils, container) {
    for (let i = 0; i < ustensils.length; i++) {
        UstensilFactory(ustensils[i], container);
    }
}

function UstensilFactory(ustensil, container) {
    const ustensilP = document.createElement('p');
    ustensilP.classList.add('ustensil-button');
    ustensilP.textContent = ustensil;
    container.appendChild(ustensilP);

    ustensilP.addEventListener('click', function () {

        if (!filtersSelected.ustensils.includes(ustensil)) {
            filtersSelected.ustensils.push(ustensil);
            filterAndDisplayRecipes();
            const chipContainer = document.getElementById('chip-container');

            const chip = BootstrapChipFactory(ustensil, ["fa-circle-xmark"], () => {
                filtersSelected.ustensils.splice(filtersSelected.ustensils.indexOf(ustensil), 1);
                filterAndDisplayRecipes();
            });

            chip.classList.add("btnUstensils");

            chipContainer.appendChild(chip);
        }
    });

}



const ustensilsContainer = document.getElementById('ustensils-dropdown');
const ustensilsDisplay = document.createElement('div');
ustensilsDisplay.classList.add('ustensilsDisplay');

UstensilListFactory(uniqueUstensils, ustensilsDisplay);

ustensilsContainer.appendChild(ustensilsDisplay);



//Recherche dans les ustensils 

const inputUstensils = document.getElementById('searchInputUstensils');
inputUstensils.addEventListener('keyup', function (e) {
    let inputValueUstensils = e.target.value;
    ustensilsDisplay.innerHTML = '';
    console.log(inputValueUstensils);

    const resultsUstensils = getElementsMatchingInput(inputValueUstensils, uniqueUstensils);

    console.log(resultsUstensils);

    if (resultsUstensils.length > 0) {
        UstensilListFactory(resultsUstensils, ustensilsDisplay);
    }
}
);











//Appareils 

//Display des Appareils dans le dropdown

const Appareils = recipes.map(Appareils => Appareils.appliance);
const uniqueAppareils = flattenAndGetDistinctElements(Appareils);


function AppareilsListFactory(appareils, container) {
    for (let i = 0; i < appareils.length; i++) {
        AppareilsFactory(appareils[i], container);
    }
}

function AppareilsFactory(appareil, container) {
    const appareilsP = document.createElement('p');
    appareilsP.classList.add('appareils');
    appareilsP.textContent = appareil;
    container.appendChild(appareilsP);

    appareilsP.addEventListener('click', function () {

        if (!filtersSelected.appareils.includes(appareil)) {
            filtersSelected.appareils.push(appareil);
            filterAndDisplayRecipes();

            const chipContainer = document.getElementById('chip-container');

            const chip = BootstrapChipFactory(appareil, ["fa-circle-xmark"], () => {
                filtersSelected.appareils.splice(filtersSelected.appareils.indexOf(appareil), 1);
                filterAndDisplayRecipes();
            });
            chip.classList.add("btnAppareils");


            chipContainer.appendChild(chip);
        }
    });

}



const AppareilsContainer = document.getElementById('appareils-dropdown');
const AppareilsDisplay = document.createElement('div');
AppareilsDisplay.classList.add("AppareilsDisplay");

AppareilsListFactory(uniqueAppareils, AppareilsDisplay);


AppareilsContainer.appendChild(AppareilsDisplay);


//Recherche dans les appareils 

const inputAppareils = document.getElementById('searchInputAppareils');
inputAppareils.addEventListener('keyup', function (e) {
    let inputValueAppareils = e.target.value;
    AppareilsDisplay.innerHTML = '';

    const resultsAppareils = getElementsMatchingInput(inputValueAppareils, uniqueAppareils);

    if (resultsAppareils.length > 0) {
        AppareilsListFactory(resultsAppareils, AppareilsDisplay);
    }
}
);










//Gestion des ingredients 


//Display des ingredients dans le dropdown

const ingredients = recipes.map(ingredients => ingredients.ingredients);
const uniqueIngredients = flattenAndGetDistinctElements(ingredients);


function IngredientsListFactory(ingredients, container) {
    for (let i = 0; i < ingredients.length; i++) {
        IngredientsFactory(ingredients[i], container);
    }
}


function IngredientsFactory(ingredient, container) {
    const IngredientP = document.createElement('p');
    IngredientP.classList.add('ingredient-button');
    IngredientP.textContent = ingredient.ingredient;
    container.appendChild(IngredientP);

    IngredientP.addEventListener('click', function () {

        if (!filtersSelected.ingredients.includes(ingredient.ingredient)) {
            filtersSelected.ingredients.push(ingredient.ingredient);
            filterAndDisplayRecipes();

            const chipContainer = document.getElementById('chip-container');

            const chip = BootstrapChipFactory(ingredient.ingredient, ["fa-circle-xmark"], () => {
                filtersSelected.ingredients.splice(filtersSelected.ingredients.indexOf(ingredient.ingredient), 1);
                filterAndDisplayRecipes();
            });
            chip.classList.add("btnIngredients");

            chipContainer.appendChild(chip);
        }
    });

}

const IngredientsContainer = document.getElementById('ingredients-dropdown');
const ingredientsDisplay = document.createElement('div');
ingredientsDisplay.classList.add("ingredientsDisplay");

IngredientsListFactory(uniqueIngredients, ingredientsDisplay);

IngredientsContainer.appendChild(ingredientsDisplay);


const inputIngredient = document.getElementById('searchInputIngredients');
inputIngredient.addEventListener('keyup', function (e) {
    let inputValueIngredients = e.target.value;
    ingredientsDisplay.innerHTML = '';
    const resultsIngredients = getElementsMatchingInput(inputValueIngredients, uniqueIngredients);

    if (resultsIngredients.length > 0) {
        IngredientsListFactory(resultsIngredients, ingredientsDisplay);
    }
}
);
