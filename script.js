document.addEventListener("DOMContentLoaded", () => {
  let display = new bootstrap.Modal(document.getElementById("welcomeModal"));
  display.show();
});

const URL = "https://6671157ee083e62ee439f788.mockapi.io/api/v9/todo";

const getFormInput = document.getElementById("form-id");
getFormInput.addEventListener("submit", (ele) => {
  ele.preventDefault();
  // console.log("Form Submitted");

  let userName = document.getElementById("inputUserName").value;
  let task = document.getElementById("inputTask").value;
  let deadLine = document.getElementById("inputDeadLine").value;
  let priority = document.getElementById("inputPriority").value;
  let data = JSON.stringify({
    userName,
    task,
    deadLine,
    priority,
    status: "Pending",
  });

  console.log(data);

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((req) => req.json())
    .then((resData) => {
      console.log("Success", resData);
    })
    .catch((err) => {
      console.log("Error", err);
    })
    .finally(() => {
      getFormInput.reset();
      displayTodos();
    });
});

function displayTodos() {
  fetch(URL)
    .then((req) => req.json())
    .then((fetchedData) => {
      const displayData = document.getElementById("todos");
      displayData.innerHTML = "";

      fetchedData.forEach((ele) => {
        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "col-md-4");
        mainDiv.setAttribute("id", "maindivId");

        let cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "card");
        cardDiv.setAttribute("id", "card-Id");
        mainDiv.appendChild(cardDiv);

        let cardHeader = document.createElement("h3");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.innerText = ele.userName;
        cardDiv.appendChild(cardHeader);

        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        let cardTitle = document.createElement("h5");
        cardTitle.setAttribute("class", "card-title");
        cardTitle.innerText = `Task: ${ele.task}`;
        cardBody.appendChild(cardTitle);

        let cardDeadline = document.createElement("p");
        cardDeadline.setAttribute("class", "card-text");
        cardDeadline.innerText = ` DeadLine: ${ele.deadLine}`;
        cardBody.appendChild(cardDeadline);

        let cardPriority = document.createElement("p");
        cardPriority.setAttribute("class", "card-text");
        cardPriority.innerText = ` Priority: ${ele.priority}`;
        cardBody.appendChild(cardPriority);

        let buttonDiv = document.createElement("button");
        buttonDiv.setAttribute(
          "class",
          ele.status === "Pending"
            ? "btn btn-danger"
            : ele.status === "Ongoing"
            ? "btn btn-warning"
            : "btn btn-success"
        );
        buttonDiv.setAttribute("id", "btnChange");
        buttonDiv.setAttribute("data-id", ele.id);
        buttonDiv.addEventListener("click", updateAPI);
        buttonDiv.innerText = ele.status;
        cardBody.appendChild(buttonDiv);

        let buttonclear = document.createElement("button");
        buttonclear.setAttribute("class", "btn btn-outline-danger");
        // buttonclear.innerText = "Delete";
        let buttonIcon = document.createElement("i");
        buttonIcon.setAttribute("class", "bi bi-trash-fill");
        buttonclear.appendChild(buttonIcon);

        buttonIcon.setAttribute("data-id", ele.id);
        buttonIcon.addEventListener("click", deleteTodo);
        cardBody.appendChild(buttonclear);

        cardDiv.appendChild(cardBody);

        displayData.append(mainDiv);
      });
    })
    .catch((err) => console.log("Error", err));
}

function deleteTodo(event) {
  const id = event.target.getAttribute("data-id");
  fetch(`${URL}/${id}`, {
    method: "DELETE",
  })
    .then((req) => req.json())
    .then((deletedData) => {
      console.log(deletedData);
      displayTodos();
    });
}

function updateAPI(event) {
  const statusUpdate = event.target.innerText;

  const newStatus =
    statusUpdate === "Pending"
      ? "Ongoing"
      : statusUpdate === "Ongoing"
      ? "Completed"
      : "Pending";

  const id = event.target.getAttribute("data-id");
  fetch(`${URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((req) => req.json())
    .then((dataUpdate) => {
      event.target.innerText = newStatus;
      event.target.setAttribute(
        "class",
        newStatus === "Pending"
          ? "btn btn-danger"
          : newStatus === "Ongoing"
          ? "btn btn-warning"
          : "btn btn-success"
      );
      displayTodos();
    });
}
window.onload = displayTodos;
