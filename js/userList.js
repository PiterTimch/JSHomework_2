const userEditModal = document.getElementById("userEditModal");
const croppingImage = document.getElementById("croppingImage");
const loadedImage = document.getElementById("loadedImage");
const previewImage = document.getElementById("previewImage");
const userList = document.getElementById("user-list");
const fileInput = document.getElementById("fileInput");

const modal = document.getElementById("fileModal");
const closeFileModal = document.getElementById("closeModal");
const cancelFileBtn = document.getElementById("cancelBtn");
const saveFileBtn = document.getElementById("saveBtn");

const closeUserModal = document.getElementById("closeEditModal");
const cancelUserBtn = document.getElementById("cancelEditBtn");
const saveUserBtn = document.getElementById("saveEditBtn");

const leftTurn = document.getElementById("leftTurn");
const rightTurn = document.getElementById("rightTurn");
const horizontalTurn = document.getElementById("horizontalTurn");
const verticalTurn = document.getElementById("verticalTurn");

let uploadedImageURL;
let cropper;
let currUserId;

const users = JSON.parse(localStorage.users);

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
    userCard.setAttribute("data-user-id", user.id);

    userCard.onclick = openEditedModal;

    userList.appendChild(userCard);
});

function openEditedModal(e) {

    currUserId = e.target.dataset.userId;

    fillFields();

    userEditModal.classList.remove("hidden");
    userEditModal.classList.add("flex");

}

function fillFields() {
    let user = users.find(u => u.id === currUserId);
    if (!user) return;

    document.getElementById("first_name").value = user.first_name || "";
    document.getElementById("last_name").value = user.last_name || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("username").value = user.username || "";

    if (user.avatar) {
        loadedImage.src = user.avatar;
    } else {
        loadedImage.classList.add("hidden");
    }
}

function updatePreview() {
    if (cropper) {
        const base64 = cropper.getCroppedCanvas().toDataURL();
        previewImage.src = base64;
    }
}

fileInput.onchange = (e) => {
    closeEditedModal();
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    const { target } = e;
    const { files } = target;
    const file = files[0];

    if (file) {
        if (/^image\/\w+/.test(file.type)) {

            if (uploadedImageURL) {
                URL.revokeObjectURL(uploadedImageURL);
            }

            croppingImage.src = uploadedImageURL = URL.createObjectURL(file);

            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(croppingImage, {
                aspectRatio: 1,
                viewMode: 1,
                autoCrop: true,
                crop() {
                    updatePreview();
                }
            });


        }
        else {
            alert('Please choose an image file.');
        }
    }
}

function closeEditedModal() {
    userEditModal.classList.remove("flex");
    userEditModal.classList.add("hidden");
}

function closeFileModalFunc() {
    modal.classList.remove("flex");
    modal.classList.add("hidden");

    fileInput.value = "";
    croppingImage.src = "";
    previewImage.src = "";

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function saveEditedModal() {
    const newData = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        username: document.getElementById("username").value,
        avatar: document.getElementById("loadedImage").src
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let userIndex = users.findIndex(u => u.id == currUserId);

    if (userIndex === -1) {
        console.error("Користувача не знайдено!");
        return;
    }

    users[userIndex] = { ...users[userIndex], ...newData };

    localStorage.setItem("users", JSON.stringify(users));

    closeEditedModal();

    location.href = "/pages/userList.html";
}


function saveFileModalFunc() {
    if (cropper) {
        var base64 = cropper.getCroppedCanvas().toDataURL();
        console.log("Get data url", base64);

        loadNewImage(base64);
    }

    closeFileModalFunc();
    userEditModal.classList.remove("hidden");
    userEditModal.classList.add("flex");
}

function loadNewImage(path) {
    if (loadedImage.classList.contains("hidden")) {
        loadedImage.classList.remove("hidden");
        loadedImage.classList.add("h-[200px]");
    }

    loadedImage.src = path;
}

closeUserModal.onclick = closeEditedModal;
cancelUserBtn.onclick = closeEditedModal;
saveUserBtn.onclick = saveEditedModal;

closeFileModal.onclick = closeFileModalFunc;
cancelFileBtn.onclick = closeFileModalFunc;
saveFileBtn.onclick = saveFileModalFunc;

window.onclick = (event) => {
    if (event.target === userEditModal) {
        closeEditedModal();
    }
    if (event.target === modal) {
        closeFileModalFunc();
    }
};
