document.addEventListener("DOMContentLoaded", function() {
    const userTableBody = document.getElementById("userList");
    const paginationDiv = document.getElementById("pagination");
    const searchInput = document.getElementById("searchInput");

    const usersPerPage = 10;
    let currentPage = 1;
    let users = [];
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
            displayUsers();
            setupPagination();
            document.addEventListener("keydown", handleArrowKeys);
        })

    function displayUsers(filter = "") {
        userTableBody.innerHTML = "";
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        currentUsers = users.slice(startIndex, endIndex);
        let filteredUsers = currentUsers;
        if (filter.trim() !== "") {
            console.log(filter);
            filteredUsers = currentUsers.filter(user => user.name.toLowerCase().includes(filter.toLowerCase()) ||
                                                    user.email.toLowerCase().includes(filter.toLowerCase()) ||
                                                    user.age.toString().includes(filter));
        }
        filteredUsers.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.age}</td>
            `;
            userTableBody.appendChild(row);
        });
    }

    function setupPagination() {
        paginationDiv.innerHTML = "";
        const totalPages = (users.length / usersPerPage);

        const leftArrow = document.createElement("a");
        leftArrow.style.cursor = "pointer";
        leftArrow.innerHTML = "&laquo;";
        leftArrow.classList.add("arrow");
        leftArrow.addEventListener("click", function() {
            currentPage = currentPage - 1;
            displayUsers();
            setupPagination();
        });
        paginationDiv.appendChild(leftArrow);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement("a");
            pageLink.href = "#";
            pageLink.textContent = i;
            pageLink.classList.add("page-link");
            if (i === currentPage) {
                pageLink.classList.add("active");
            }
            pageLink.addEventListener("click", function() {
                currentPage = i;
                displayUsers();
                setupPagination();
            });
            paginationDiv.appendChild(pageLink);
        }

        const rightArrow = document.createElement("a");
        rightArrow.style.cursor = "pointer";
        rightArrow.innerHTML = "&raquo;";
        rightArrow.classList.add("arrow");
        rightArrow.addEventListener("click", function() {
            currentPage = currentPage + 1;
            displayUsers();
            setupPagination();
        });
        paginationDiv.appendChild(rightArrow);
    }

    function handleArrowKeys(e) {
        if (e.key === "ArrowRight") {
            currentPage = currentPage + 1;
            displayUsers();
            setupPagination();
        } else if (e.key === "ArrowLeft") {
            currentPage = currentPage - 1;
            displayUsers();
            setupPagination();
        }
    }

    searchInput.addEventListener("input", function() {
        if (searchInput.value.trim() === "") {
            displayUsers();
        } else {
            displayUsers(searchInput.value);
        }
    });
});