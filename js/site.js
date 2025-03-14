document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const modal = document.getElementById("fileModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    const croppingImage = document.getElementById("croppingImage");
    const loadedImage = document.getElementById("loadedImage");
    const previewImage = document.getElementById("previewImage");

    const leftTurn = document.getElementById("leftTurn");
    const rightTurn = document.getElementById("rightTurn");
    const horizontalTurn = document.getElementById("horizontalTurn");
    const verticalTurn = document.getElementById("verticalTurn");

    let uploadedImageURL;
    let cropper;

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
            const base64 = cropper.getCroppedCanvas().toDataURL(); // Отримуємо Base64
            previewImage.src = base64; // Оновлюємо прев'ю в реальному часі
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

        closeModalWindow()
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
