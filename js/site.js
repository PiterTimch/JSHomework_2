document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const modal = document.getElementById("fileModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    const croppingImage = document.getElementById("croppingImage");
    const loadedImage = document.getElementById("loadedImage");
    const previewImage = document.getElementById("previewImage");
    const registerForm = document.getElementById("registerForm");

    const leftTurn = document.getElementById("leftTurn");
    const rightTurn = document.getElementById("rightTurn");
    const horizontalTurn = document.getElementById("horizontalTurn");
    const verticalTurn = document.getElementById("verticalTurn");

    let uploadedImageURL;
    let cropper;

    registerForm.onsubmit = (e) => {
        e.preventDefault();

        const formData = {
            id: crypto.randomUUID(),
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            avatar: document.getElementById("loadedImage").src
        }
        const oldItems = JSON.parse(localStorage.users ?? "[]");

        const isDuplicate = oldItems.some(user =>
            user.email === formData.email ||
            user.phone === formData.phone ||
            user.username === formData.username
        );

        if (isDuplicate) {
            showError("Користувач з таким email, телефоном або username вже існує!");
            return;
        }
        if (!(loadedImage.src.includes("data"))) {
            showError("Фото обов'язкове!");
            return;
        }

        let items = [...oldItems, formData];

        let json = JSON.stringify(items);
        localStorage.setItem("users", json);
        location.href = "/pages/userList.html";
    }

    function showError(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.classList.remove("hidden");
        errorMessage.innerText = message;
    }

    function openModalWindow(e) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        const { target } = e;
        const { files } = target;
        const file = files[0];
        if (file) {
            if (/^image\/\w+/.test(file.type)) {

                console.log("uploadedImageURL", uploadedImageURL);
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

    function updatePreview() {
        if (cropper) {
            const base64 = cropper.getCroppedCanvas().toDataURL();
            previewImage.src = base64;
        }
    }

    function closeModalWindow() {
        modal.classList.add("hidden");
        modal.classList.remove("flex");

        fileInput.value = "";

        if (cropper) {
            cropper.destroy();
            cropper = null;
        }

        if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = null;
        }
    }

    function saveImage() {
        if (cropper) {
            var base64 = cropper.getCroppedCanvas().toDataURL();
            console.log("Get data url", base64);

            loadNewImage(base64);
        }

        closeModalWindow();
    }

    function loadNewImage(path) {
        if (loadedImage.classList.contains("hidden")) {
            loadedImage.classList.remove("hidden");
            loadedImage.classList.add("h-[200px]");
        }

        loadedImage.src = path;
    }

    // кнопки редагування

    leftTurn.onclick = () => {
        if (cropper) {
            cropper.rotate(-90);
        }
    }

    rightTurn.onclick = () => {
        if (cropper) {
            cropper.rotate(90);
        }
    }

    verticalTurn.onclick = () => {
        if (cropper) {
            cropper.rotate(180);
        }
    }

    horizontalTurn.onclick = () => {
        if (cropper) {
            cropper.scaleX(-cropper.getData().scaleX || -1);
        }
    }

    fileInput.addEventListener("change", openModalWindow);
    closeModal.addEventListener("click", closeModalWindow);
    cancelBtn.addEventListener("click", closeModalWindow);
    saveBtn.addEventListener("click", saveImage);
});
