const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
console.log(highScores);

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup" , () => {
    console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
  console.log("Click the save button!");
  e.preventDefault();

  const score = {
    score: mostRecentScore;
    name: username.value
  };
  highScores.push(score);

  highScores.sort( (a,b) => {
    return b.score - a.score;
  })
  console.log(highScores)
};
