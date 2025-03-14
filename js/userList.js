const users = JSON.parse(localStorage.users);

const userList = document.getElementById("user-list");

users.forEach(user => {
    const userCard = document.createElement("div");
    userCard.className = "flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-300 hover:shadow-lg transition cursor-pointer";
    userCard.innerHTML = `
                <img class="w-16 h-16 rounded-full" src="${user.avatar}" alt="${user.first_name} ${user.last_name}">
                <div>
                    <p class="text-lg font-medium text-gray-900">${user.first_name} ${user.last_name}</p>
                    <p class="text-gray-600">${user.email}</p>
                    <p class="text-gray-600">${user.phone}</p>
                    <p class="text-gray-500">@${user.username}</p>
                </div>
            `;
    userCard.setAttribute("data-userId", user.id);

    userList.appendChild(userCard);
});