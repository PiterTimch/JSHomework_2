document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("fileInput");
    const modal = document.getElementById("fileModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    const previewImage = document.getElementById("previewImage");
    const loadedImage = document.getElementById("loadedImage");

    let uploadedImageURL;
    let cropper;

    //cropper = new Cropper(previewImage, {
    //    aspectRatio: 1,
    //    viewMode: 1
    //});

    if (!fileInput || !modal || !closeModal || !cancelBtn || !previewImage) {
        console.error("Помилка: Один або кілька елементів не знайдено!");
        return;
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

                previewImage.src = uploadedImageURL = URL.createObjectURL(file);

                if (cropper) {
                    cropper.destroy();
                }

                cropper = new Cropper(previewImage, {
                    aspectRatio: 1,
                    viewMode: 1
                });


            }
            else {
                window.alert('Please choose an image file.');
            }
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

    fileInput.addEventListener("change", openModalWindow);
    closeModal.addEventListener("click", closeModalWindow);
    cancelBtn.addEventListener("click", closeModalWindow);
    saveBtn.addEventListener("click", saveImage);
});
