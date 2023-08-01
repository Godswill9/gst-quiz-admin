const cover = document.querySelector(".cover");
const optionInput = document.querySelector(".optionInput");
const optionKey = optionInput.querySelectorAll("input")[0];
const optionValue = optionInput.querySelectorAll("input")[1];
const submitOption = optionInput.querySelector("button");
const optionsDiv = document.querySelector(".options");
const questionBox = document.querySelectorAll("textarea")[0];
const answerBox = document.querySelectorAll("textarea")[1];
const descriptionBox = document.querySelectorAll("textarea")[2];
const submitQuestion = document.querySelector(".uploadBut");
const selectSubject = document.querySelector("select");

const fetchUser = () => {
  fetch("http://127.0.0.1:8080/api/checkAdmin", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.message !== "login again") {
        window.location.href = "http://127.0.0.1:5500/my-admin/posting.html";
      } else {
        window.location.href = "http://127.0.0.1:5500/my-admin/login.html";
      }
    });
};
fetchUser();

const checkForUpdates = () => {
  if (localStorage.getItem("editQuestion")) {
    const id = localStorage.getItem("editQuestion");
    fetch(`http://127.0.0.1:8080/api//question/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        questionBox.value = res[0].question;
        answerBox.value = res[0].answer;
        selectSubject.value = res[0].course;
        descriptionBox.value = res[0].description;
      });
  }
};

checkForUpdates();

answerBox.addEventListener("input", () => {
  console.log(answerBox.value.length);
  if (answerBox.value.length > 1) {
    answerBox.value = answerBox.value[0];
    alert("Just input an option");
    return;
  }
});

cover.addEventListener("click", () => {
  optionInput.style.display = "block";
});

submitOption.addEventListener("click", () => {
  var elem = document.createElement("div");
  var key = document.createElement("div");
  var value = document.createElement("div");
  key.textContent = optionKey.value;
  value.textContent = optionValue.value;
  elem.classList.add("option");
  key.classList.add("key");
  value.classList.add("value");

  elem.appendChild(key);
  elem.appendChild(value);
  optionsDiv.appendChild(elem);
  optionKey.value = "";
  optionValue.value = "";
  optionInput.style.display = "none";
});

submitQuestion.addEventListener("click", () => {
  var arr = [];
  optionsDiv.querySelectorAll(".option").forEach((item, i) => {
    arr.push(item.querySelector(".value").textContent);
  });
  var obj = {
    question: questionBox.value,
    answer: answerBox.value.toUpperCase(),
    options: arr,
    course: selectSubject.value,
    description: descriptionBox.value,
    id: localStorage.getItem("editQuestion"),
  };

  fetch("http://127.0.0.1:8080/api/postQuestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.message == "Question created successfully" || "data updated") {
        questionBox.value = "";
        answerBox.value = "";
        selectSubject.value = "";
        descriptionBox.value = "";
        optionsDiv.textContent = "";
        alert(res.message);
        localStorage.setItem("editQuestion", "");
        // window.location.href = "http://127.0.0.1:5500/my-admin/posting.html";
      }
    });
});
