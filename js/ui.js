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
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 4000);
    }
};

// Template preview functionality
function renderTemplatePreview(template, content) {
    const { templateId, personalDetails } = { templateId: template.id, personalDetails: content.personalDetails };
    const photoPos = personalDetails.photoPosition || { x: 50, y: 50 };
    const photoStyle = `background-image: url('${personalDetails.photo}'); background-position: ${photoPos.x}% ${photoPos.y}%;`;
    const photoHTML = personalDetails.photo ? `<div class="cv-photo-container"><div class="cv-photo" style="${photoStyle}"></div></div>` : '';

    const contactHTML = editor.getContactHTML(personalDetails);
    const allSectionsHTML = (content.sectionOrder || []).map(key => editor.renderCvPreviewSection(key, content[key])).join('');

    let previewHTML = '';

    // Use the same switch logic as the main preview but with template.id
    switch (template.id) {
        case 'modern-cv':
        case 'executive-cv':
        case 'minimalist-cv':
        case 'academic-cv':
        case 'tech-cv':
        case 'consultant-cv':
        case 'designer-cv':
        case 'elegant-cv':
        case 'finance-cv':
        case 'healthcare-cv':
        case 'legal-cv':
        case 'marketing-cv':
        case 'architect-cv':
        case 'scientist-cv':
        case 'startup-cv':
        case 'luxury-cv':
        case 'international-cv': {
            const sidebarKeys = (content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
            const mainKeys = (content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

            const sidebarSectionsHTML = sidebarKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');
            const mainSectionsHTML = mainKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');

            previewHTML = `
                ${template.id === 'minimalist-cv' ? photoHTML : ''}
                <header class="cv-header">
                    ${template.id === 'consultant-cv' ? photoHTML : ''}
                    ${(template.id !== 'minimalist-cv' && template.id !== 'consultant-cv') ? photoHTML : ''}
                    <h1>${personalDetails.name || ''}</h1>
                    <p class="job-title">${personalDetails.jobTitle || ''}</p>
                </header>
                <div class="cv-layout-grid">
                    <main class="cv-main-content">
                        ${mainSectionsHTML}
                    </main>
                    <aside class="cv-sidebar">
                        <section class="cv-section cv-contact-section"><h2>Kontakt</h2>${contactHTML}</section>
                        ${sidebarSectionsHTML}
                    </aside>
                </div>`;
            break;
        }

        case 'creative-cv':
            previewHTML = `
               <div class="cv-header-background"></div>
               <div class="cv-content-wrapper">
                   <header class="cv-header">
                       ${photoHTML}
                       <h1>${personalDetails.name || ''}</h1>
                       <p class="job-title">${personalDetails.jobTitle || ''}</p>
                       <section class="cv-section cv-contact-section">${contactHTML}</section>
                   </header>
                   <main class="cv-main-content">${allSectionsHTML}</main>
               </div>`;
            break;

        case 'professional-cv': {
            const sidebarKeys = (content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
            const mainKeys = (content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

            const sidebarSectionsHTML = sidebarKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');
            const mainSectionsHTML = mainKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');

            previewHTML = `
                <div class="cv-layout-sidebar">
                    <aside class="cv-sidebar">
                        ${photoHTML}
                        <section class="cv-section cv-contact-section"><h2>Kontakt</h2>${contactHTML}</section>
                        ${sidebarSectionsHTML}
                    </aside>
                    <main class="cv-main-content">
                        <header class="cv-header">
                            <h1>${personalDetails.name || ''}</h1>
                            <p class="job-title">${personalDetails.jobTitle || ''}</p>
                        </header>
                        ${mainSectionsHTML}
                    </main>
                </div>`;
            break;
        }

        case 'corporate-cv': {
            const sidebarKeys = (content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
            const mainKeys = (content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

            const sidebarSectionsHTML = sidebarKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');
            const mainSectionsHTML = mainKeys.map(key => editor.renderCvPreviewSection(key, content[key])).join('');

            previewHTML = `
                <header class="cv-header">
                    <h1>${personalDetails.name || ''}</h1>
                    <p class="job-title">${personalDetails.jobTitle || ''}</p>
                </header>
                 <div class="cv-layout-grid">
                    <main class="cv-main-content">
                       ${photoHTML}
                       ${mainSectionsHTML}
                    </main>
                    <aside class="cv-sidebar">
                        <section class="cv-section cv-contact-section"><h2>Kontakt</h2>${contactHTML}</section>
                        ${sidebarSectionsHTML}
                    </aside>
                </div>`;
            break;
        }

        default:
            previewHTML = `<div>Template not found: ${template.id}</div>`;
            break;
    }

    return `<div class="cv-preview ${template.id}">${previewHTML}</div>`;
}
