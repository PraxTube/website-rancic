document.addEventListener('DOMContentLoaded', function () {
  let leaderboardData = [];

  // Function to render the leaderboard based on the current data
  function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    leaderboardData.forEach((row, index) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `<td>${index + 1}</td><td>${row.name}</td><td>${row.score}</td><td>${row.kills}</td><td>${row.time}</td>`;
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
      const rows = data.split('\n').slice(0, -1);

      leaderboardData = rows.map(row => {
        const [name, score, kills, raw_time] = row.split(',').map(entry => entry.trim());
        const time = formatTime(parseFloat(raw_time));
        return { name, score: parseInt(score), kills: parseInt(kills), time };
      });

      sortLeaderboard('score', false); // Initial sorting by score in descending order

      const leaderboardHeaders = document.querySelectorAll('#leaderboard-table th');
      leaderboardHeaders.forEach(header => {
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
