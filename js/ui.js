// UI functionality for modals, alerts, and other interface elements
const ui = {
    modalOverlay: document.getElementById('modal-overlay'),
    modalBody: document.getElementById('modal-body'),

    showModal(content) {
        this.modalBody.innerHTML = content;
        this.modalOverlay.classList.add('visible');
    },

    hideModal() {
        this.modalOverlay.classList.remove('visible');
        this.modalBody.innerHTML = '';
    },

    showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.setAttribute('role', 'alert'); // Added for accessibility
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }
};

// Template preview functionality
function renderTemplatePreview(template, content) {
    // Ensure personalDetails exists, providing a default if not.
    const personalDetails = content.personalDetails || { name: '', jobTitle: '', photo: null, photoPosition: { x: 50, y: 50 }, phone: '', email: '', address: '', linkedin: '' };

    // Create a cvContent object similar to what generateCvPreviewHTML expects
    const cvContent = {
        ...content, // Spread existing content
        personalDetails: personalDetails, // Ensure personalDetails is well-defined
        templateId: template.id // Add templateId for generateCvPreviewHTML
    };

    // Call the centralized function from editor.js
    // Note: We are passing the 'content' object which contains all sections (experience, education, etc.)
    // and personalDetails. template.id is passed as the templateId.
    const previewHTML = editor.generateCvPreviewHTML(cvContent, template.id);

    return `<div class="cv-preview ${template.id}">${previewHTML}</div>`;
}
