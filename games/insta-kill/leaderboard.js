document.addEventListener('DOMContentLoaded', function () {
  let leaderboardData = [];

  // Function to render the leaderboard based on the current data
  function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    leaderboardData.forEach(row => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `<td>${row.rank}</td><td>${row.name}</td><td>${row.score}</td><td>${row.kills}</td><td>${row.time}</td>`;
      leaderboardBody.appendChild(newRow);
    });
  }

  // Function to sort the leaderboard based on the selected key
  function sortLeaderboard(key, ascending) {
    leaderboardData.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string') {
        return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return ascending ? valueA - valueB : valueB - valueA;
      }
    });

    renderLeaderboard();
  }
  
  fetch('/games/insta-kill/leaderboard.csv')
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n');

      leaderboardData = rows.map((row, rank) => {
        const [name, score, kills, raw_time] = row.split(',').map(entry => entry.trim());
        const time = formatTime(parseFloat(raw_time));
        return { rank: parseInt(rank + 1), name, score: parseInt(score), kills: parseInt(kills), time };
      });

      sortLeaderboard('score', false); // Initial sorting by score in descending order

      const leaderboardHeaders = document.querySelectorAll('#leaderboard-table th');
      leaderboardHeaders.forEach(header => {
        if (header.classList.contains('rank-header')) {
          return;
        }

        header.addEventListener('click', () => {
          const key = header.textContent.toLowerCase();
          const isDescending = header.classList.contains('descending');

          // Toggle sorting order
          sortLeaderboard(key, isDescending);

          // Toggle CSS class for visual indication of sorting order
          leaderboardHeaders.forEach(h => h.classList.remove('ascending', 'descending'));
          header.classList.toggle(isDescending ? 'ascending' : 'descending');
        });
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
