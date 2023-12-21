// Function which adds file preview after adding it to the dropzone
function previewFile(input) {
    const preview = document.getElementById('file-preview');
    const image = document.getElementById('preview-image');
    const dropZonePlaceholder = document.getElementById('dropzone-placeholder');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
            image.src = reader.result;
            preview.classList.remove('hidden');
            dropZonePlaceholder.classList.add('hidden');
        };

        reader.readAsDataURL(file);
    } else {
        preview.classList.add('hidden');
    }
}

// Removing image preview and restoring dropzone visibility
function removeImage() {
    const preview = document.getElementById('file-preview');
    const dropZonePlaceholder = document.getElementById('dropzone-placeholder');
    const input = document.getElementById('image');

    input.value = '';

    preview.classList.add('hidden');
    dropZonePlaceholder.classList.remove('hidden');
}