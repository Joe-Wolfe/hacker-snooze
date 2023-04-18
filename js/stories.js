"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${favoritesHTML(story.storyId)}
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $(".favorites").on("click", updateFavorites)

  $allStoriesList.show();
}

function putFavoritesOnPage() {
  {
    console.debug("putFavoritesOnPage");

    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
    $(".favorites").on("click", updateFavorites)

    $allStoriesList.show();
  }
}

function putMyStoriesOnPage() {
  {
    console.debug("putFavoritesOnPage");

    $allStoriesList.empty();

    // loop through all of our stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
    $(".favorites").on("click", updateFavorites)
    $(".favorites").after($("<span>").addClass("trash").html(" &#128465;"))
    $(".trash").on("click", removeStory)

    $allStoriesList.show();
  }
}

async function updateFavorites() {
  console.debug("updateFavorites")
  const isFav = $(this).html() === "❤"
  const selectedID = $(this).closest("li").attr("id")
  if (isFav) {
    $(this).html("♡");
    await unfavoriteStory(selectedID);
  }
  else {
    $(this).html("❤");
    await favoriteStory(selectedID);
  }
}

//New Story Submit
$newStoryForm.on("submit", function (evt) {
  submitStory(evt);
})

//sends story info to the server and then reloads the storylists
async function submitStory(evt) {
  console.debug("submitStory")
  evt.preventDefault();
  await storyList.addStory(currentUser, {
    title: $storyTitle.val(),
    author: $storyAuthor.val(),
    url: $storyURL.val()
  })
  $storyTitle.val("");
  $storyAuthor.val("");
  $storyURL.val("");
  hidePageComponents();
  storyList = await StoryList.getStories();
  putStoriesOnPage();
}

async function removeStory() {
  console.log($(this));
  const selectedId = $(this).closest("li").attr("id")
  await storyList.deleteStory(selectedId)
  $(this).closest("li").remove()

}

function favoritesHTML(story) {
  console.debug("favoritesHTML")
  const isFav = currentUser.favorites.some(function (fav) {
    return (fav.storyId === story)
  });
  const favSymbol = isFav ? "&#x2764" : "&#x2661"

  return `<span class = favorites>${favSymbol}</span>`
}


