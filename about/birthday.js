function calculateAge() {
  const birthdate = new Date('2002-10-28');
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();

  if (today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate())) {
    age--;
  }

  return age;
}

function updateAge() {
  const age = calculateAge();
  document.getElementById('birthday').innerText = `${age}`;
}

updateAge();
