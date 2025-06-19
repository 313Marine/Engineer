// Global variables for views and navigation links
const views = {
    '#/dashboard': document.getElementById('dashboard-view'),
    '#/templates': document.getElementById('templates-view'),
    '#/editor': document.getElementById('editor-view')
};

const navLinks = document.querySelectorAll('.main-nav a');

// Function to render the dashboard with documents
function renderDashboard() {
    // Ensure storage is available (from js/storage.js)
    if (typeof storage === 'undefined' || !storage.getDocuments) {
        console.error('Storage module not available for renderDashboard.');
        const grid = document.getElementById('document-grid');
        if(grid) grid.innerHTML = '<p>Fejl: Kunne ikke loade dokumenter. Storage modul mangler.</p>';
        return;
    }
    const docs = storage.getDocuments();
    const grid = document.getElementById('document-grid');
    if (!grid) {
        console.error('#document-grid element not found.');
        return;
    }
    grid.innerHTML = ''; // Clear previous content

    if (docs.length === 0) {
        grid.innerHTML = `<p>Du har ingen CV'er endnu. <a href="#/templates" class="btn btn-primary" style="text-decoration:none; margin-left: 0.5rem;">Opret et nyt</a></p>`;
        return;
    }

    docs.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .forEach(doc => {
            const iconClass = 'fa-solid fa-file-lines';
            grid.innerHTML += `
                <div class="document-card" data-doc-id="${doc.docId}" role="article" aria-labelledby="doc-title-${doc.docId}">
                    <div class="doc-card-type-icon"><i class="${iconClass}"></i> CV</div>
                    <h3 id="doc-title-${doc.docId}">${doc.title}</h3>
                    <div class="meta">Sidst ændret: ${new Date(doc.lastModified).toLocaleString('da-DK', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="actions">
                        <button class="btn card-btn" data-action="edit" aria-label="Rediger ${doc.title}"><i class="fas fa-pen"></i></button>
                        <button class="btn card-btn" data-action="delete" aria-label="Slet ${doc.title}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
        });
}

// Function to attach event listeners for the document grid on the dashboard
function attachDocumentGridListeners() {
    const docGrid = document.getElementById('document-grid');
    if (!docGrid) return;

    docGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.document-card');
        if (!card) return;

        const docId = card.dataset.docId;
        const actionBtn = e.target.closest('button[data-action]');

        if (actionBtn) {
            e.stopPropagation(); // Prevent card click if button is clicked
            const action = actionBtn.dataset.action;
            if (action === 'edit') {
                window.location.hash = `#/editor/${docId}`;
            } else if (action === 'delete') {
                if (typeof storage === 'undefined' || typeof ui === 'undefined') {
                    console.error('Storage or UI module not available for delete action.');
                    return;
                }
                const docToDelete = storage.getDocument(docId);
                if (!docToDelete) {
                    console.error('Document to delete not found:', docId);
                    ui.showAlert('Fejl: Dokumentet kunne ikke findes.', 'danger');
                    return;
                }

                ui.showModal(
                    `<h3>Slet Dokument</h3>
                     <p>Er du sikker på, du vil slette "<strong>${docToDelete.title}</strong>"?</p>
                     <p>Handlingen kan ikke fortrydes.</p>
                     <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
                         <button class="btn btn-secondary" id="cancel-delete-btn">Annuller</button>
                         <button class="btn btn-danger" id="confirm-delete-btn">Slet</button>
                     </div>`
                );
                const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
                const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

                if (confirmDeleteBtn) {
                    confirmDeleteBtn.onclick = () => {
                        storage.deleteDocument(docId);
                        renderDashboard(); // Re-render dashboard after deletion
                        ui.hideModal();
                        ui.showAlert(`"${docToDelete.title}" blev slettet.`, 'success');
                    };
                }
                if (cancelDeleteBtn) {
                    cancelDeleteBtn.onclick = () => ui.hideModal();
                }
            }
        } else {
            // Clicked on the card itself, not a button
            window.location.hash = `#/editor/${docId}`;
        }
    });
}

// Function to render templates
function renderTemplates() {
    const grid = document.getElementById('template-grid');
    if (!grid) {
        console.error('#template-grid element not found.');
        return;
    }
    const previewToggle = document.getElementById('preview-mode-toggle');
    const previewToggleContainer = document.querySelector('.template-preview-toggle');

    const editorIsAvailable = typeof editor !== 'undefined' && editor.doc;
    const templatesAreAvailable = typeof templates !== 'undefined';

    if (!templatesAreAvailable) {
        console.error('Templates data not available for renderTemplates.');
        grid.innerHTML = '<p>Skabeloner kunne ikke indlæses.</p>';
        if (previewToggleContainer) previewToggleContainer.style.display = 'none';
        return;
    }

    const isPreviewMode = previewToggle && previewToggle.checked && editorIsAvailable;

    if (previewToggleContainer) {
        previewToggleContainer.style.display = editorIsAvailable ? 'flex' : 'none';
    }

    grid.innerHTML = ''; // Clear previous content
    grid.className = isPreviewMode ? 'template-grid preview-mode' : 'template-grid';

    templates.forEach(t => {
        let cardHTML = '';
        if (isPreviewMode && editorIsAvailable && typeof editor.generateCvPreviewHTML === 'function') {
            const previewContentHTML = editor.generateCvPreviewHTML(editor.doc.content, t.id);
            cardHTML = `
                <div class="template-card preview-card" data-template-id="${t.id}" data-template-name="${t.name}" tabindex="0" role="button" aria-label="Vælg skabelon ${t.name} med dit nuværende indhold">
                    <div class="template-card-title">${t.name}</div>
                    <div class="template-preview-content">
                        ${previewContentHTML}
                        <div class="template-preview-overlay"></div>
                    </div>
                </div>`;
        } else {
            cardHTML = `
                <div class="template-card" data-template-id="${t.id}" data-template-name="${t.name}" tabindex="0" role="button" aria-label="Vælg skabelon ${t.name}">
                    <img src="${t.previewImage}" alt="${t.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x400/ccc/999?text=Billede+utilgængeligt';">
                    <div class="template-card-title">${t.name}</div>
                </div>`;
        }
        grid.innerHTML += cardHTML;
    });
}

// Function to attach event listener for template selection
function attachTemplateGridListeners() {
    const templateGrid = document.getElementById('template-grid');
    if (!templateGrid) return;

    templateGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.template-card');
        if (!card) return;

        const { templateId, templateName } = card.dataset;
        if (!templateId || !templateName) return;

        if (typeof editor === 'undefined' || typeof storage === 'undefined' || typeof ui === 'undefined') {
            console.error('Editor, Storage or UI module not available for template selection.');
            return;
        }

        if (editor.doc) {
            editor.doc.content.templateId = templateId;
            editor.markUnsaved();
            editor.saveAndUpdate();
            window.location.hash = `#/editor/${editor.doc.docId}`;
            ui.showAlert(`Skabelonen "${templateName}" er anvendt på dit CV.`, 'success');
        } else {
            const newDoc = storage.createDocumentFromTemplate(templateId, templateName);
            window.location.hash = `#/editor/${newDoc.docId}`;
        }
    });
}

// Function to attach event listener for the preview mode toggle
function attachPreviewModeToggleListener() {
    const previewToggle = document.getElementById('preview-mode-toggle');
    if (!previewToggle) return;

    previewToggle.addEventListener('change', () => {
        renderTemplates();
    });
}

// Function to attach global application event listeners
function attachAppEventListeners() {
    window.addEventListener('hashchange', router);
    window.addEventListener('beforeunload', (event) => {
        if (typeof editor !== 'undefined' && editor.hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
        if (typeof editor !== 'undefined' && editor.stopAutoSave) {
            editor.stopAutoSave();
        }
    });

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn && typeof ui !== 'undefined' && ui.hideModal) {
        modalCloseBtn.addEventListener('click', () => ui.hideModal());
    }

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay && typeof ui !== 'undefined' && ui.hideModal) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                ui.hideModal();
            }
        });
    }

    const focusModeBtn = document.getElementById('focus-mode-btn');
    if (focusModeBtn) {
        focusModeBtn.addEventListener('click', (e) => {
            const editorLayout = document.getElementById('editor-layout');
            if (!editorLayout) return;

            editorLayout.classList.toggle('focus-mode');
            const isFocusMode = editorLayout.classList.contains('focus-mode');
            const icon = focusModeBtn.querySelector('.fas');

            let textNode = null;
            for (let i = focusModeBtn.childNodes.length - 1; i >= 0; i--) {
                if (focusModeBtn.childNodes[i].nodeType === Node.TEXT_NODE && focusModeBtn.childNodes[i].textContent.trim() !== '') {
                    textNode = focusModeBtn.childNodes[i];
                    break;
                }
            }

            if (isFocusMode) {
                if (icon) { icon.classList.remove('fa-expand'); icon.classList.add('fa-compress'); }
                focusModeBtn.setAttribute('aria-label', 'Slå fokus tilstand fra');
                if (textNode) textNode.textContent = " Normal";
            } else {
                if (icon) { icon.classList.remove('fa-compress'); icon.classList.add('fa-expand'); }
                focusModeBtn.setAttribute('aria-label', 'Skift fokus tilstand');
                if (textNode) textNode.textContent = " Fokus";
            }
        });
    }
}

// Router function to handle view switching
function router() {
    const hash = window.location.hash || '#/dashboard';
    let docId = null;
    let currentViewId = hash;

    if (hash.startsWith('#/editor/')) {
        currentViewId = '#/editor';
        docId = hash.substring('#/editor/'.length);
    }

    Object.values(views).forEach(view => {
        if (view) view.classList.remove('active');
    });
    navLinks.forEach(link => link.classList.remove('active-link'));

    const activeView = views[currentViewId];
    if (activeView) {
        activeView.classList.add('active');
        const activeLink = document.querySelector(`.main-nav a[href*="${currentViewId.split('/')[1]}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }

        if (currentViewId === '#/dashboard') {
            if (typeof editor !== 'undefined' && editor.stopAutoSave) {
                editor.stopAutoSave();
            }
            if (typeof editor !== 'undefined') {
                editor.doc = null;
            }
            renderDashboard();
        } else if (currentViewId === '#/templates') {
            renderTemplates();
        } else if (currentViewId === '#/editor' && docId) {
            if (typeof editor !== 'undefined' && editor.init) {
                editor.init(docId);
            } else {
                console.error('Editor module not found or init method missing.');
                window.location.hash = '#/dashboard';
            }
        } else if (currentViewId === '#/editor' && !docId) {
            console.warn('Editor view accessed without a document ID. Redirecting to dashboard.');
            window.location.hash = '#/dashboard';
        }
    } else {
        console.warn(`View for hash "${hash}" not found. Redirecting to dashboard.`);
        window.location.hash = '#/dashboard';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    attachAppEventListeners();
    attachDocumentGridListeners();
    attachTemplateGridListeners();
    attachPreviewModeToggleListener();
    router(); // Initial route handling
});
