console.log("lets write Javascript");

function removeSpecialCharacters(inputString) {
  var specialCharacterPattern = /[!@#$%^&*()_+{}\[\]:;<>,?~\\\/\=]/;

  for (var i = 0; i < inputString.length; i++) {
    if (specialCharacterPattern.test(inputString[i])) {
      // Return the substring up to the special character
      return inputString.substring(0, i);
    }
  }

  // If no special characters are found, return the entire string
  return inputString;
}
function formatSeconds(seconds) {
  // Ensure seconds is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  // Round or truncate the decimal part
  var roundedSeconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  var minutes = Math.floor(roundedSeconds / 60);
  var remainingSeconds = roundedSeconds % 60;

  // Add leading zero if remainingSeconds is less than 10
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }

  // Construct the formatted string
  var formattedTime = minutes + ":" + remainingSeconds;

  return formattedTime;
}

let currentsong = new Audio();
async function getsongs() {
  let a = await fetch("https://github.com/Kali-13/Spotify_Clone/blob/main/Songs/");
  let response = await a.text();
  //    console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < anchor.length; index++) {
    const element = anchor[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/Songs/")[1]);
    }
  }
  return songs;
}
function PlaySong(track, pause = false) {
  currentsong.src = "/songs/" + track.replaceAll(" ", "%20");
  if (!pause) {
    currentsong.play();
    play.src = "svg/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML =
    removeSpecialCharacters(track);
}
async function main() {
  let songs = await getsongs();
  PlaySong(songs[0], true);

  let SongUl = document
    .querySelector(".songslist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    SongUl.innerHTML =
      SongUl.innerHTML +
      `<li>
       <div class="info flex">
       <img class="invert" src="svg/music.svg" alt="">
       <h4>${song.replaceAll("%20", " ")}</h4>
     </div>
        <div class="sorry flex ">
        <span>Play Now</span>
         <img class="invert" src="svg/playnow.svg" alt="">
        </div> 
       </li>`;
  }

  // adding Eventlistner to the songs
  Array.from(
    document.querySelector(".songslist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      PlaySong(e.querySelector(".info").lastElementChild.innerHTML.trim());
    });
  });
  // adding eventlistner to play , previous ,next
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "svg/pause.svg";
    } else {
      currentsong.pause();
      play.src = "svg/play.svg";
    }
  });

  // timeupdation of songs
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songduration").innerHTML = `${formatSeconds(
      currentsong.currentTime
    )}/${formatSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  // adding eventlistner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
}
main();
