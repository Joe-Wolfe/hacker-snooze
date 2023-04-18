"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show()
  $navUserProfile.text(`${currentUser.username}`).show();
}

$navStory.on("click", navStoryclick);

function navStoryclick(evt) {
  console.debug("navStoryClick");
  hidePageComponents();
  $newStoryForm.show();
}

/**
 * when a user clicks on the favorites tab we should put all the favorites stories on the page
 */

$favStory.on("click", function () {
  hidePageComponents()
  putFavoritesOnPage();
});

$myStories.on("click", function () {
  hidePageComponents()
  putMyStoriesOnPage();
});
