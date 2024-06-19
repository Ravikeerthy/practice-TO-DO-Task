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
    let deadLine = document.getElementById("inputDealine").value;
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
          cardDeadline.innerText = ` DeadLine: ${ele.deadline}`;
          cardBody.appendChild(cardDeadline);
  
          let cardPriority = document.createElement("p");
          cardPriority.setAttribute("class", "card-text");
          cardPriority.innerText = ` Priority: ${ele.priority}`;
          cardBody.appendChild(cardPriority);
  
          let buttonDiv = document.createElement("button");
          buttonDiv.setAttribute("class", "btn btn-primary");
          buttonDiv.setAttribute("id", "btnChange");
          buttonDiv.innerText = ele.status;
          cardBody.appendChild(buttonDiv);
  
          buttonDiv.addEventListener("click", () => {
            // if(ele.status === "pending"){
            buttonDiv.style.backgroundColor = "rgb(238, 223, 182)";
            buttonDiv.innerText = "Ongoing";
            ele.status = "Ongoing";
            updateAPI(ele.id, "Ongoing");
            // cardBody.appendChild(buttonDiv);
          });
          buttonDiv.addEventListener("click", () => {
            if (ele.status === "Ongoing") {
              buttonDiv.style.backgroundColor = "green";
              buttonDiv.innerText = "Completed";
              ele.status = "Completed";
              updateAPI(ele.id, "Completed");
            }
            // cardBody.appendChild(buttonDiv);
          });
  
          cardDiv.appendChild(cardBody);
  
          displayData.append(mainDiv);
        });
      })
      .catch((err) => console.log("Error", err));
  }
  
  function updateAPI(todoId, newStatus) {
    const updatedAPI = `https://6671157ee083e62ee439f788.mockapi.io/api/v9/todo/${todoId}`;
    fetch(updatedAPI, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((req) => req.json())
      .then((updatedStatus) => {
        console.log("Updated", updatedStatus);
      })
      .catch((err) => {
        console.log("Not Updated", err);
      });
  }
  window.onload = displayTodos;
  