import { tweetsDataImport } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = tweetsDataImport;

if (localStorage.getItem('tweetsData')) {
  tweetsData = JSON.parse(localStorage.getItem('tweetsData'));
}

document.addEventListener('click', function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === 'tweet-btn') {
    handleTweetBtnClick();
  } else if (e.target.id === 'reply-btn') {
    handleReplyNewComment();
  } else if (e.target.dataset.trash) {
    handleTrashBtnClick(e.target.dataset.trash);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById('tweet-input');

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = '';
  }
}

function handleReplyNewComment() {
  const replyTexts = document.querySelectorAll('.reply-text');

  replyTexts.forEach(function (text) {
    if (text.value) {
      const tweetId = text.parentNode.parentNode.parentNode.parentNode.id;
      tweetsData.forEach(function (tweet) {
        if (tweetId === `replies-${tweet.uuid}`) {
          tweet.replies.push({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: text.value,
          });
          render();
          text.value = '';
        }
      });
    }
  });
}

function handleTrashBtnClick(trashBtnId) {
  tweetsData.forEach(function (tweet) {
    if (tweet.uuid === trashBtnId) {
      const indexToRemove = tweetsData.findIndex(
        (item) => item.uuid === trashBtnId
      );
      if (indexToRemove !== -1) {
        tweetsData.splice(indexToRemove, 1);
      }
      render();
    }
  });
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = '';

    if (tweet.isLiked) {
      likeIconClass = 'liked';
    }

    let retweetIconClass = '';

    if (tweet.isRetweeted) {
      retweetIconClass = 'retweeted';
    }

    let repliesHtml = '';

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
        </div>
        `;
      });
    }

    repliesHtml += `
    <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="images/scrimbalogo.png" class="profile-pic">
            <div>
                <p class="handle">@Scrimba</p>
                <textarea class="reply-text"
                    name="textarea"
                    rows="5"
                    cols="30"
                    placeholder="Comment text..."></textarea>
                <button id="reply-btn">Reply</button>    
            </div>
        </div>
    </div>
    `;

    feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"
                        ></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${tweet.uuid}"
                        ></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
                        data-retweet="${tweet.uuid}"
                        ></i>
                        ${tweet.retweets}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-trash" data-trash="${tweet.uuid}"></i>
                    </sapn>
                </div>   
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>   
    </div>
    `;
  });
  return feedHtml;
}

function render() {
  document.getElementById('feed').innerHTML = getFeedHtml();
  localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}

render();
