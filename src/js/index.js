import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements,renderLoader,clearLoader} from './views/base';

/**  Global state of the app
* -- Search Object
* -- Current recepie Object
* -- Shopping list object
* -- Liked recipies
*/
const state = {};

/** SEARCH CONTROLLER*/
const controlSearch = async () => {
    // 1) Get the query from view
    const query = searchView.getInput(); //to do

    if (query){
        // 2) New Search Object and add it to query
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //4) Search for recipes
            await state.search.getResult();

            //5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            console.log(state.search.result);

        }
        catch(error){
            alert('something wrong with Search');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', el => {
    //prevent the page to reload
    el.preventDefault();
    controlSearch();
});

/*  here the pagination buttons are not already available before the page loads so we use event delegation
*/
elements.searchResPages.addEventListener('click', el => {
    const btn = el.target.closest('.btn-inline'); //find the closest element and click operates acc
    if(btn) {
        //dataset refers to where we prefix goto with data attr
        const goToPage = parseInt(btn.dataset.goto , 10); 
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }

});

/**RECIPE CONTROLLER */
const controlRecipe = async () => {
    //get ID from URL
    const id =  window.location.hash.replace('#','');

    if(id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe Object
        state.recipe = new Recipe(id);

        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // render recipes
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        }
        catch (error) {
            console.log(error);
            alert('recipe processing went wrong');
        }
        // Get Recipe Data
        

    }

}
//window.addEventListener('hashchange', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/** 
 * LIKES CONTROLLER
 */
state.likes = new Likes();
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});