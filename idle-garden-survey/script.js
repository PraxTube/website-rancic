async function loadAndSetupSurvey() {
  try {
    const response = await fetch("survey.json");
    if (!response.ok) throw new Error("Failed to load survey.json");
    const surveyJson = await response.json();

    const params = new URLSearchParams(window.location.search);
    const user_uuid = params.get('id') || '666';

    let storedIds = JSON.parse(localStorage.getItem('user_ids')) || [];
    if (!storedIds.includes(user_uuid)) {
      storedIds.push(user_uuid);
    }
    localStorage.setItem('user_ids', JSON.stringify(storedIds));

    const survey = new Survey.Model(surveyJson);
    survey.setValue("user-uuid", storedIds);
    survey.setValue("start-time", Math.floor(Date.now() / 1000));
    survey.onComplete.add(surveyComplete);
    survey.render(document.getElementById("surveyContainer"));
  } catch (error) {
    console.error("Error loading survey.json:", error);
  }

}

function surveyComplete(survey) {
  survey.setValue("end-time", Math.floor(Date.now() / 1000));
  saveSurveyResults(survey.getData());
}

async function saveSurveyResults(data) {
  try {
    const body = JSON.stringify(data);

    const response = await fetch("/survey-data-dump/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body
    });

    if (!response.ok) {
      console.error("Failed to save survey:", await response.text());
    } else {
      console.log("Survey saved OK");
    }
  } catch (err) {
    console.error("Error sending survey:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadAndSetupSurvey);
