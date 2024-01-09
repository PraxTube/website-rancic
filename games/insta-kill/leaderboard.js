document.addEventListener('DOMContentLoaded', function () {
  fetch('/games/insta-kill/leaderboard.csv')
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').slice(0, -1);
      const leaderboardData = [];

      rows.forEach(row => {
        const [name, score] = row.split(',').map(entry => entry.trim());
        leaderboardData.push({ name, score: parseInt(score) });
      });

      leaderboardData.sort((a, b) => b.score - a.score);
      const leaderboardBody = document.getElementById('leaderboard-body');

      console.log(`${leaderboardData}`);

      leaderboardData.forEach((row, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${index + 1}</td><td>${row.name}</td><td>${row.score}</td>`;
        leaderboardBody.appendChild(newRow);
      });
    })
    .catch(error => {
      console.error('Error fetching leaderboard data:', error);
    });
});
