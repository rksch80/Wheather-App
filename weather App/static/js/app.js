const KELVIN = 273.15;
const country = "in";
const API_KEY = "fc27ee8b856655ef995c9dc03e29d192";
const weatherUri = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

function formatDate(date) {
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
}

function resolveStatus(response) {
  if (response.status !== 200) throw new Error(response);
  return response.json();
}

function updateJournalDOM(data) {
  console.log(data);
  const entries = document.getElementById("entries");
  if (!data.length) return;
  data.forEach((item, index) => {
    if (document.getElementById(`entry${index}`)) return;
    const row = document.createElement("div");
    row.id = `entry${index}`;
    row.className = "table-row";
    row.innerHTML = `
      <p class="table-cell">${formatDate(new Date(item.date))}</p>
      <p class="table-cell">${item.temp.toFixed(1)}</p>
      <p class="table-cell">${item.userInput}</p>
    `;
    entries.appendChild(row);
  });
}

function fetchJournalData() {
  fetch("/data")
    .then(resolveStatus)
    .then(updateJournalDOM);
}

function postJournalData(payload) {
  fetch("/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(resolveStatus)
    .then(updateJournalDOM);
}

function fetchWeatherData() {
  const zip = document.getElementById("zip").value;
  const userInput = document.getElementById("feelings").value;
  fetch(`${weatherUri}&zip=${zip},${country}`)
    .then(resolveStatus)
    .then(data => {
      const payload = {
        temp: data.main.temp - KELVIN,
        date: new Date(),
        userInput,
      };
      postJournalData(payload);
    });
}

function validateFields() {
  const zip = document.getElementById("zip");
  if (!zip.value || isNaN(Number(zip.value))) {
    zip.classList.add("input-error");
    return false;
  }
  zip.classList.remove("input-error");
  return true;
}

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  if (validateFields()) fetchWeatherData();
});

fetchJournalData();
