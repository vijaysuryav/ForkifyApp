import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeview.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import {async} from 'regenerator-runtime';
import 'core-js/features/object/from-entries';


// if(module.hot){
//   module.hot.accept(); //comming from parcel
// }

const controlRecipes = async function(){
  try{

    const id=window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();
        //0) results view to mark selected search result 
        resultsView.update(model.getSearchResultsPage());
            //4) updating Bookmarks 
    bookmarksView.update(model.state.bookmarks);
        
    // 1) Loading recipe
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);

    
  
  }catch(err){
    recipeView.renderError();
  }

  
};
const controlSearchResults = async function(){
  try{ 
    resultsView.renderSpinner();

    // 1) get Seacrh query 
    const query = searchView.getQuery();
    if(!query) return;


    // 2)  load search results
    await model.loadSeacrhResults(query);

    // 3) render results
    // resultsView.render(model.state.search.results);
    //console.log(model.getSearchResultsPage(1));
    resultsView.render(model.getSearchResultsPage());

    //4) render initial pagination buttons
    paginationView.render(model.state.search);


  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage){
  //console.log(typeof goToPage);
  //1) Render new results 
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) render NEW pagination buttons
  paginationView.render(model.state.search);
}


const controlServings = function(newServings){
  // Update teh recipe servings(in state)
  model.updateServings(newServings);

  // Update teh recipe view 
  recipeView.update(model.state.recipe);

}


const controlAddBookmark = function(){
  //1) add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //console.log(model.state.recipe);
  //2) update recipeView
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    // Show loading Spinner
    addRecipeView.renderSpinner();

    // function to upload the recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe 
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);

    //Close form window
    setTimeout(function(){
   addRecipeView.toggleWindow();
    },MODAL_CLOSE_SEC*1000);

  }catch(err){
    console.error('💥',err);
    addRecipeView.renderError(err.message);
  }

}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);

}
init();
