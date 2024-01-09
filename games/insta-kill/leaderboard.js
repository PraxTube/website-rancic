document.addEventListener('DOMContentLoaded', function () {
  fetch('/games/insta-kill/leaderboard.csv')
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').slice(0, -1);
      const leaderboardData = [];

      rows.forEach(row => {
        const [name, score, kills, raw_time] = row.split(',').map(entry => entry.trim());
        const time = formatTime(parseFloat(raw_time));
        leaderboardData.push({ name, score: parseInt(score), kills, time});
      });

      leaderboardData.sort((a, b) => b.score - a.score);
      const leaderboardBody = document.getElementById('leaderboard-body');

      console.log(`${leaderboardData}`);

      leaderboardData.forEach((row, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${index + 1}</td><td>${row.name}</td><td>${row.score}</td><td>${row.kills}</td><td>${row.time}</td>`;
        leaderboardBody.appendChild(newRow);
      });
    })
    .catch(error => {
      console.error('Error fetching leaderboard data:', error);
    });
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
