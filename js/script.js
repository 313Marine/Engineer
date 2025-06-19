document.addEventListener('DOMContentLoaded', () => {
    // Templates are now included directly in the script
    const templates = [
        {
            "id": "modern-cv",
            "name": "Moderne",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/667eea/ffffff?text=Moderne"
        },
        {
            "id": "creative-cv",
            "name": "Kreativ",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/764ba2/ffffff?text=Kreativ"
        },
        {
            "id": "professional-cv",
            "name": "Professionel",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/2c3e50/ecf0f1?text=Professionel"
        },
        {
            "id": "minimalist-cv",
            "name": "Minimalistisk",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/eeeeee/333333?text=Minimalistisk"
        },
        {
            "id": "executive-cv",
            "name": "Executive",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/1a365d/ffffff?text=Executive"
        },
        {
            "id": "academic-cv",
            "name": "Akademisk",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/2d3748/e2e8f0?text=Akademisk"
        },
        {
            "id": "tech-cv",
            "name": "Tech",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/0f172a/38bdf8?text=Tech"
        },
        {
            "id": "corporate-cv",
            "name": "Corporate",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/374151/f3f4f6?text=Corporate"
        },
        {
            "id": "designer-cv",
            "name": "Designer",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/7c3aed/fbbf24?text=Designer"
        },
        {
            "id": "consultant-cv",
            "name": "Konsulent",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/059669/ffffff?text=Konsulent"
        },
        {
            "id": "elegant-cv",
            "name": "Elegant",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/8b5a83/f8f6f0?text=Elegant"
        },
        {
            "id": "finance-cv",
            "name": "Finance",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/1e3a8a/ffffff?text=Finance"
        },
        {
            "id": "healthcare-cv",
            "name": "Healthcare",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/065f46/ffffff?text=Healthcare"
        },
        {
            "id": "legal-cv",
            "name": "Legal",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/1f2937/ffffff?text=Legal"
        },
        {
            "id": "marketing-cv",
            "name": "Marketing",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/dc2626/ffffff?text=Marketing"
        },
        {
            "id": "architect-cv",
            "name": "Architect",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/475569/ffffff?text=Architect"
        },
        {
            "id": "scientist-cv",
            "name": "Scientist",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/0369a1/ffffff?text=Scientist"
        },
        {
            "id": "startup-cv",
            "name": "Startup",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/7c3aed/ffffff?text=Startup"
        },
        {
            "id": "luxury-cv",
            "name": "Luxury",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/92400e/d4af37?text=Luxury"
        },
        {
            "id": "international-cv",
            "name": "International",
            "docType": "cv",
            "previewImage": "https://placehold.co/300x400/1e40af/ffffff?text=International"
        }
    ];
    main(templates);
});

function main(templates) {
    const storage = {
        getDocuments: () => JSON.parse(localStorage.getItem('cv-engineer-docs') || '[]').filter(doc => doc.docType === 'cv'),
        saveDocuments: (docs) => localStorage.setItem('cv-engineer-docs', JSON.stringify(docs)),
        getDocument: (docId) => storage.getDocuments().find(doc => doc.docId === docId),
        saveDocument: (docToSave) => {
            let docs = storage.getDocuments();
            const docIndex = docs.findIndex(doc => doc.docId === docToSave.docId);
            if (docIndex > -1) docs[docIndex] = docToSave;
            else docs.push(docToSave);
            storage.saveDocuments(docs);
        },
        createDocumentFromTemplate: (templateId, templateName) => {
            const docId = `doc_${Date.now()}`;
            const template = templates.find(t => t.id === templateId);

            const content = {
                templateId: template.id,
                sectionOrder: ['profile', 'experience', 'education', 'skills', 'courses', 'volunteerWork', 'languages'],
                personalDetails: { name: 'Dit Navn', jobTitle: 'Din Stilling', email: 'din@email.com', phone: '12345678', address: 'Din Gade 1, 1000 By', linkedin: '', photo: null, photoPosition: { x: 50, y: 50 } },
                profile: { title: 'Profil', content: 'En kort, professionel profil om dig selv.' },
                experience: { title: 'Arbejdserfaring', items: [] },
                education: { title: 'Uddannelse', items: [] },
                skills: { title: 'Kompetencer', items: [] },
                courses: { title: 'Relevante Kurser', items: [] },
                volunteerWork: { title: 'Frivilligt Arbejde', items: [] },
                languages: { title: 'Sprog', items: [] },
            };

            const newDoc = { docId, docType: 'cv', title: `Udkast - ${templateName}`, lastModified: new Date().toISOString(), content };
            storage.saveDocument(newDoc);
            return newDoc;
        },
        deleteDocument: (docId) => {
            let docs = storage.getDocuments().filter(doc => doc.docId !== docId);
            storage.saveDocuments(docs);
        },
    };

    const ui = {
        modalOverlay: document.getElementById('modal-overlay'),
        modalBody: document.getElementById('modal-body'),
        showModal(content) { this.modalBody.innerHTML = content; this.modalOverlay.classList.add('visible'); },
        hideModal() { this.modalOverlay.classList.remove('visible'); this.modalBody.innerHTML = ''; },
        showAlert(message, type = 'success') {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type}`;
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 4000);
        }
    };

    const editor = {
        doc: null,
        controlsContainer: document.getElementById('editor-controls'),
        previewContainer: document.getElementById('editor-preview'),
        titleInput: document.getElementById('doc-title-input'),
        saveIndicator: document.getElementById('save-indicator'),
        eventController: null,
        currentZoom: 100,
        zoomLevels: [25, 50, 75, 100, 125, 150, 200],
        autoSaveTimer: null,
        hasUnsavedChanges: false,

        init(docId) {
            this.doc = storage.getDocument(docId);
            if (!this.doc || this.doc.docType !== 'cv') {
                window.location.hash = '#/dashboard';
                return;
            }

            // Ensure new sections exist on older documents
            if (!this.doc.content.courses) {
                this.doc.content.courses = { title: 'Relevante Kurser', items: [] };
            }
            if (!this.doc.content.volunteerWork) {
                this.doc.content.volunteerWork = { title: 'Frivilligt Arbejde', items: [] };
            }
             if (!this.doc.content.sectionOrder.includes('courses')) {
                const skillsIndex = this.doc.content.sectionOrder.indexOf('skills');
                if (skillsIndex > -1) {
                    this.doc.content.sectionOrder.splice(skillsIndex + 1, 0, 'courses');
                } else {
                    this.doc.content.sectionOrder.push('courses');
                }
            }
            if (!this.doc.content.sectionOrder.includes('volunteerWork')) {
                 const coursesIndex = this.doc.content.sectionOrder.indexOf('courses');
                 if (coursesIndex > -1) {
                    this.doc.content.sectionOrder.splice(coursesIndex + 1, 0, 'volunteerWork');
                 } else {
                    this.doc.content.sectionOrder.push('volunteerWork');
                 }
            }

            if (this.doc.content.personalDetails && !this.doc.content.personalDetails.photoPosition) {
                this.doc.content.personalDetails.photoPosition = { x: 50, y: 50 };
            }

            ['experience', 'education', 'skills', 'languages', 'courses', 'volunteerWork'].forEach(key => {
                if (this.doc.content[key] && this.doc.content[key].items) {
                    this.doc.content[key].items.forEach(item => {
                        if (!item.id) {
                            item.id = `item_${Math.random().toString(36).substr(2, 9)}`;
                        }
                    });
                }
            });

            this.titleInput.value = this.doc.title;
            this.render();
            this.attachEventListeners();
            this.startAutoSave();

            // Set default zoom based on screen size
            if (window.innerWidth <= 768) {
                this.setZoom(75); // 75% zoom for tablets and mobile
            } else if (window.innerWidth <= 480) {
                this.setZoom(50); // 50% zoom for small mobile screens
            } else {
                this.updateZoomControls();
            }
        },

        render() {
            this.renderCvControls();
            this.renderCvPreview();
        },

        saveAndUpdate() {
            this.doc.lastModified = new Date().toISOString();
            storage.saveDocument(this.doc);
            this.hasUnsavedChanges = false;
            this.showSaveIndicator();
        },

        markUnsaved() {
            this.hasUnsavedChanges = true;
        },

        startAutoSave() {
            this.stopAutoSave();
            this.autoSaveTimer = setInterval(() => {
                if (this.hasUnsavedChanges && this.doc) {
                    this.autoSave();
                }
            }, 10000); // Auto-save every 10 seconds
        },

        stopAutoSave() {
            if (this.autoSaveTimer) {
                clearInterval(this.autoSaveTimer);
                this.autoSaveTimer = null;
            }
        },

        autoSave() {
            if (this.doc && this.hasUnsavedChanges) {
                this.doc.lastModified = new Date().toISOString();
                storage.saveDocument(this.doc);
                this.hasUnsavedChanges = false;
                this.showAutoSaveIndicator();
            }
        },

        showAutoSaveIndicator() {
            const indicator = this.saveIndicator;
            if (indicator) {
                const originalText = indicator.textContent;
                indicator.textContent = 'Auto-gemt';
                indicator.classList.add('visible');
                setTimeout(() => {
                    indicator.textContent = originalText;
                    indicator.classList.remove('visible');
                }, 2000);
            }
        },

        showSaveIndicator() { this.saveIndicator.classList.add('visible'); setTimeout(() => this.saveIndicator.classList.remove('visible'), 2000); },

        renderCvControls() {
            let controlsHTML = this.renderPersonalDetailsControl(this.doc.content.personalDetails);
            (this.doc.content.sectionOrder || []).forEach(key => {
                controlsHTML += this.renderGenericSection(key, this.doc.content[key]);
            });
            this.controlsContainer.innerHTML = controlsHTML;
        },

        renderPersonalDetailsControl(data) {
            const photoPos = data.photoPosition || { x: 50, y: 50 };
            return `<div class="form-section"><div class="form-section-header"><span>Personlige Oplysninger</span></div><div class="form-section-content">
                <div class="photo-upload-container">
                    <div id="photo-preview-box" class="photo-preview ${data.photo ? 'has-photo' : ''}" style="background-image: url(${data.photo || 'none'}); background-position: ${photoPos.x}% ${photoPos.y}%;"></div>
                     ${data.photo ? `<p class="photo-instructions">Klik og træk på billedet for at justere.</p>` : ''}
                    <label class="btn btn-secondary file-input-label"><i class="fas fa-upload"></i> Vælg Billede<input type="file" data-action="upload-photo" accept="image/*"></label>
                    ${data.photo ? `<button class="btn-danger-text" data-action="remove-photo"><i class="fas fa-trash"></i> Fjern Billede</button>` : ''}
                </div>
                <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">
                <div class="form-group"><label>Fulde Navn</label><input type="text" data-path="personalDetails.name" value="${data.name || ''}"></div>
                <div class="form-group"><label>Stilling</label><input type="text" data-path="personalDetails.jobTitle" value="${data.jobTitle || ''}"></div>
                <div class="form-group"><label>Email</label><input type="email" data-path="personalDetails.email" value="${data.email || ''}"></div>
                <div class="form-group"><label>Telefon</label><input type="tel" data-path="personalDetails.phone" value="${data.phone || ''}"></div>
                <div class="form-group"><label>Adresse</label><input type="text" data-path="personalDetails.address" value="${data.address || ''}"></div>
                <div class="form-group"><label>LinkedIn (fuld URL)</label><input type="url" data-path="personalDetails.linkedin" value="${data.linkedin || ''}" placeholder="https://www.linkedin.com/in/ditnavn"></div>
            </div></div>`;
        },

        renderGenericSection(key, data) {
            let contentHtml = '';
            if (!data) return '';
            if (key === 'profile') {
                contentHtml = `<div class="form-group"><textarea data-path="${key}.content" rows="5" placeholder="En kort, fængende profiltekst...">${data.content || ''}</textarea></div>`;
            } else if (['experience', 'education', 'skills', 'languages', 'courses', 'volunteerWork'].includes(key)) {
                contentHtml = (data.items || []).map(item => this.renderListItemForm(key, item)).join('') + `<button class="btn btn-add" data-action="add-item" data-list-name="${key}"><i class="fas fa-plus"></i> Tilføj</button>`;
            }
            return `<div class="form-section" data-section-key="${key}" draggable="true"><div class="form-section-header"><i class="fas fa-grip-vertical drag-handle" aria-hidden="true"></i><span>${data.title}</span></div><div class="form-section-content">${contentHtml}</div></div>`;
        },

        renderListItemForm(listName, item) {
            const id = item.id;
            if (listName === 'experience') {
                return `<div class="list-item" data-id="${id}">
                    <div class="form-group"><label>Stilling</label><input type="text" data-list="experience" data-field="jobTitle" value="${item.jobTitle || ''}"></div>
                    <div class="form-group"><label>Virksomhed</label><input type="text" data-list="experience" data-field="company" value="${item.company || ''}"></div>
                    <div class="grid-2-col">
                        <div class="form-group"><label>Startdato</label><input type="text" data-list="experience" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020"></div>
                        <div class="form-group"><label>Slutdato</label><input type="text" data-list="experience" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022"></div>
                    </div>
                    <div class="form-group"><label>Beskrivelse</label><textarea data-list="experience" data-field="description" rows="4">${item.description || ''}</textarea></div>
                    <button class="btn-danger-text" data-action="remove-item" data-list-name="experience" data-id="${id}"><i class="fas fa-trash"></i> Fjern Erfaring</button>
                </div>`;
            }
            if (listName === 'education') {
                return `<div class="list-item" data-id="${id}">
                    <div class="form-group"><label>Uddannelse</label><input type="text" data-list="education" data-field="degree" value="${item.degree || ''}"></div>
                    <div class="form-group"><label>Institution</label><input type="text" data-list="education" data-field="institution" value="${item.institution || ''}"></div>
                    <div class="grid-2-col">
                        <div class="form-group"><label>Startdato</label><input type="text" data-list="education" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020"></div>
                        <div class="form-group"><label>Slutdato</label><input type="text" data-list="education" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022"></div>
                    </div>
                    <button class="btn-danger-text" data-action="remove-item" data-list-name="education" data-id="${id}"><i class="fas fa-trash"></i> Fjern Uddannelse</button>
                </div>`;
            }
            if (listName === 'languages') {
                const levels = ['Modersmål', 'Flydende', 'Forhandlingsniveau', 'Professionel', 'Begynder'];
                return `<div class="list-item" data-id="${id}">
                    <div class="grid-2-col">
                        <div class="form-group"><label>Sprog</label><input type="text" data-list="languages" data-field="language" value="${item.language || ''}"></div>
                        <div class="form-group"><label>Niveau</label><select data-list="languages" data-field="level">${levels.map(l => `<option value="${l}" ${item.level === l ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
                    </div>
                    <button class="btn-danger-text" data-action="remove-item" data-list-name="languages" data-id="${id}"><i class="fas fa-trash"></i> Fjern Sprog</button>
                </div>`;
            }
            if (listName === 'skills') {
                return `<div class="list-item" data-id="${id}"><div class="form-group"><label>Kompetence</label><input type="text" data-list="skills" data-field="skill" value="${item.skill || ''}"></div><button class="btn-danger-text" data-action="remove-item" data-list-name="skills" data-id="${id}"><i class="fas fa-trash"></i> Fjern Kompetence</button></div>`;
            }
            if (listName === 'courses') {
                return `<div class="list-item" data-id="${id}">
                    <div class="form-group"><label>Kursus/Certifikat</label><input type="text" data-list="courses" data-field="courseName" value="${item.courseName || ''}"></div>
                    <button class="btn-danger-text" data-action="remove-item" data-list-name="courses" data-id="${id}"><i class="fas fa-trash"></i> Fjern Kursus</button>
                </div>`;
            }
            if (listName === 'volunteerWork') {
                return `<div class="list-item" data-id="${id}">
                    <div class="form-group"><label>Rolle/Titel</label><input type="text" data-list="volunteerWork" data-field="role" value="${item.role || ''}"></div>
                    <div class="form-group"><label>Organisation</label><input type="text" data-list="volunteerWork" data-field="organization" value="${item.organization || ''}"></div>
                    <div class="grid-2-col">
                        <div class="form-group"><label>Startdato</label><input type="text" data-list="volunteerWork" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020"></div>
                        <div class="form-group"><label>Slutdato</label><input type="text" data-list="volunteerWork" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022"></div>
                    </div>
                    <div class="form-group"><label>Beskrivelse</label><textarea data-list="volunteerWork" data-field="description" rows="4">${item.description || ''}</textarea></div>
                    <button class="btn-danger-text" data-action="remove-item" data-list-name="volunteerWork" data-id="${id}"><i class="fas fa-trash"></i> Fjern Frivilligt Arbejde</button>
                </div>`;
            }
            return '';
        },

        getContactHTML(details, listClass = 'contact-list') {
            const linkedinPath = details.linkedin ? details.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '') : '';
            const displayPath = linkedinPath.replace('linkedin.com/in/', '');
            return `<ul class="${listClass}">
                ${details.phone ? `<li><i class="fas fa-phone fa-fw"></i> ${details.phone}</li>` : ''}
                ${details.email ? `<li><i class="fas fa-envelope fa-fw"></i> ${details.email}</li>` : ''}
                ${details.address ? `<li><i class="fas fa-map-marker-alt fa-fw"></i> ${details.address}</li>` : ''}
                ${details.linkedin ? `<li><i class="fab fa-linkedin fa-fw"></i> <a href="https://${linkedinPath}" target="_blank" rel="noopener noreferrer">${displayPath}</a></li>` : ''}
            </ul>`;
        },

        renderCvPreview() {
            const { templateId, personalDetails } = this.doc.content;
            this.previewContainer.className = `editor-preview cv-preview ${templateId}`;

            const photoPos = personalDetails.photoPosition || { x: 50, y: 50 };
            const photoStyle = `background-image: url('${personalDetails.photo}'); background-position: ${photoPos.x}% ${photoPos.y}%;`;
            const photoHTML = personalDetails.photo ? `<div class="cv-photo-container"><div class="cv-photo" style="${photoStyle}"></div></div>` : '';

            const contactHTML = this.getContactHTML(personalDetails);
            const allSectionsHTML = (this.doc.content.sectionOrder || []).map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');

            let previewHTML = '';

            // This switch statement is rewritten to be robust and handle each template correctly.
            switch (templateId) {
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
                    const sidebarKeys = (this.doc.content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                    const mainKeys = (this.doc.content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

                    const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');
                    const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');

                    previewHTML = `
                        ${templateId === 'minimalist-cv' ? photoHTML : ''}
                        <header class="cv-header">
                            ${templateId === 'consultant-cv' ? photoHTML : ''}
                            ${(templateId !== 'minimalist-cv' && templateId !== 'consultant-cv') ? photoHTML : ''}
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
                    const sidebarKeys = (this.doc.content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                    const mainKeys = (this.doc.content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

                    const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');
                    const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');

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
                    const sidebarKeys = (this.doc.content.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                    const mainKeys = (this.doc.content.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));

                    const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');
                    const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, this.doc.content[key])).join('');

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
                    previewHTML = `<div>Template not found or configured: ${templateId}</div>`;
                    break;
            }

            this.previewContainer.innerHTML = previewHTML;
        },

        renderCvPreviewSection(key, data) {
            if (!data || !data.title || (Array.isArray(data.items) && data.items.length === 0 && key !== 'profile')) return '';
            let content = '';
            if (key === 'profile') {
                if (!data.content) return '';
                content = `<p>${(data.content || '').replace(/\n/g, '<br>')}</p>`;
            } else if (key === 'experience') {
                content = (data.items || []).map(item => `<div class="cv-experience-item"><h4>${item.jobTitle || ''}</h4><div class="cv-item-subtitle">${item.company || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div><div class="cv-item-description">${(item.description || '').replace(/\n/g, '<br>')}</div></div>`).join('');
            } else if (key === 'education') {
                content = (data.items || []).map(item => `<div class="cv-education-item"><h4>${item.degree || ''}</h4><div class="cv-item-subtitle">${item.institution || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div></div>`).join('');
            } else if (key === 'courses') {
                content = `<ul>${(data.items || []).map(item => `<li class="cv-course-item">${item.courseName || ''}</li>`).join('')}</ul>`;
            } else if (key === 'volunteerWork') {
                content = (data.items || []).map(item => `<div class="cv-volunteer-item cv-experience-item"><h4>${item.role || ''}</h4><div class="cv-item-subtitle">${item.organization || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div><div class="cv-item-description">${(item.description || '').replace(/\n/g, '<br>')}</div></div>`).join('');
            } else if (key === 'languages') {
                content = `<ul>${(data.items || []).map(item => `<li class="cv-language-item"><span>${item.language || ''}</span> - <span>${item.level || ''}</span></li>`).join('')}</ul>`;
            } else if (key === 'skills') {
                content = `<p>${(data.items || []).map(item => item.skill).join(', ')}</p>`;
            }

            if (!content || !content.trim()) return '';

            return `<section class="cv-section cv-section-${key}"><h2>${data.title}</h2>${content}</section>`;
        },

        updateZoomControls() {
            const zoomLevelElement = document.getElementById('zoom-level');
            const zoomInBtn = document.getElementById('zoom-in-btn');
            const zoomOutBtn = document.getElementById('zoom-out-btn');

            if (zoomLevelElement) {
                zoomLevelElement.textContent = `${this.currentZoom}%`;
            }

            if (zoomInBtn) {
                const maxZoom = Math.max(...this.zoomLevels);
                zoomInBtn.disabled = this.currentZoom >= maxZoom;
            }

            if (zoomOutBtn) {
                const minZoom = Math.min(...this.zoomLevels);
                zoomOutBtn.disabled = this.currentZoom <= minZoom;
            }
        },

        setZoom(zoomLevel) {
            if (this.zoomLevels.includes(zoomLevel)) {
                this.currentZoom = zoomLevel;
                if (this.previewContainer) {
                    this.previewContainer.style.transform = `scale(${zoomLevel / 100})`;
                    this.previewContainer.style.transformOrigin = 'top center';
                }
                this.updateZoomControls();
            }
        },

        zoomIn() {
            const currentIndex = this.zoomLevels.indexOf(this.currentZoom);
            if (currentIndex < this.zoomLevels.length - 1) {
                this.setZoom(this.zoomLevels[currentIndex + 1]);
            }
        },

        zoomOut() {
            const currentIndex = this.zoomLevels.indexOf(this.currentZoom);
            if (currentIndex > 0) {
                this.setZoom(this.zoomLevels[currentIndex - 1]);
            }
        },

        attachEventListeners() {
            if (this.eventController) {
                this.eventController.abort();
            }
            this.eventController = new AbortController();
            const signal = this.eventController.signal;

            let inputTimeout;
            this.controlsContainer.addEventListener('input', (e) => {
                clearTimeout(inputTimeout);
                const target = e.target;
                inputTimeout = setTimeout(() => {
                    const { path, list, field } = target.dataset;
                    if (path) {
                        const keys = path.split('.');
                        let current = this.doc.content;
                        for (let i = 0; i < keys.length - 1; i++) {
                            if (!current[keys[i]]) current[keys[i]] = {};
                            current = current[keys[i]];
                        }
                        current[keys[keys.length - 1]] = target.value;
                    } else if (list) {
                        const listItem = target.closest('.list-item');
                        if (listItem) {
                            const itemId = listItem.dataset.id;
                            const item = this.doc.content[list].items.find(i => i.id === itemId);
                            if (item) item[field] = target.value;
                        }
                    }
                    this.markUnsaved();
                    this.renderCvPreview();
                }, 300);
            }, { signal });

            this.controlsContainer.addEventListener('click', (e) => {
                const button = e.target.closest('[data-action]');
                if (!button) return;

                const { action, listName, id } = button.dataset;

                if (action === 'add-item') {
                    const newItem = { id: `item_${Math.random().toString(36).substr(2, 9)}` };
                    if (!this.doc.content[listName].items) {
                        this.doc.content[listName].items = [];
                    }
                    this.doc.content[listName].items.push(newItem);
                    this.saveAndUpdate();
                    this.render();
                } else if (action === 'remove-item') {
                    this.doc.content[listName].items = this.doc.content[listName].items.filter(i => i.id !== id);
                    this.saveAndUpdate();
                    this.render();
                } else if (action === 'remove-photo') {
                    this.doc.content.personalDetails.photo = null;
                    this.saveAndUpdate();
                    this.render();
                }
            }, { signal });

            this.controlsContainer.addEventListener('change', (e) => {
                if (e.target.closest('[data-action="upload-photo"]') && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.doc.content.personalDetails.photo = event.target.result;
                        this.doc.content.personalDetails.photoPosition = { x: 50, y: 50 };
                        this.saveAndUpdate();
                        this.render();
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            }, { signal });

            let titleTimeout;
            this.titleInput.addEventListener('input', (e) => {
                clearTimeout(titleTimeout);
                titleTimeout = setTimeout(() => {
                    this.doc.title = e.target.value;
                    this.markUnsaved();
                }, 300);
            }, { signal });

            let isDragging = false;
            let startX, startY, startPosX, startPosY;
            this.controlsContainer.addEventListener('mousedown', (e) => {
                const photoBox = e.target.closest('#photo-preview-box');
                if (photoBox && photoBox.classList.contains('has-photo')) {
                    e.preventDefault();
                    isDragging = true;
                    const details = this.doc.content.personalDetails;
                    startX = e.clientX;
                    startY = e.clientY;
                    startPosX = details.photoPosition.x;
                    startPosY = details.photoPosition.y;
                    photoBox.style.cursor = 'grabbing';
                }
            }, { signal });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    const sensitivity = 0.5;
                    let newX = startPosX + dx * sensitivity;
                    let newY = startPosY + dy * sensitivity;
                    newX = Math.max(0, Math.min(100, newX));
                    newY = Math.max(0, Math.min(100, newY));

                    this.doc.content.personalDetails.photoPosition = { x: newX, y: newY };

                    const photoBox = this.controlsContainer.querySelector('#photo-preview-box');
                    if (photoBox) {
                        photoBox.style.backgroundPosition = `${newX}% ${newY}%`;
                    }
                    this.renderCvPreview();
                }
            }, { signal });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    const photoBox = this.controlsContainer.querySelector('#photo-preview-box');
                    if (photoBox) photoBox.style.cursor = 'move';
                    this.saveAndUpdate();
                }
            }, { signal });

            let draggedItem = null;
            this.controlsContainer.addEventListener('dragstart', (e) => { if (e.target.classList.contains('form-section')) { draggedItem = e.target; setTimeout(() => e.target.classList.add('dragging'), 0); } }, { signal });
            this.controlsContainer.addEventListener('dragend', (e) => { if (draggedItem) { draggedItem.classList.remove('dragging'); draggedItem = null; } }, { signal });
            this.controlsContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                const targetSection = e.target.closest('.form-section');
                if (targetSection && draggedItem && targetSection !== draggedItem) {
                    const rect = targetSection.getBoundingClientRect();
                    const next = (e.clientY - rect.top) / rect.height > 0.5;
                    this.controlsContainer.insertBefore(draggedItem, next && targetSection.nextSibling || targetSection);
                }
            }, { signal });
            this.controlsContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem) {
                    draggedItem.classList.remove('dragging');
                    const newOrder = [...this.controlsContainer.querySelectorAll('.form-section[data-section-key]')].map(s => s.dataset.sectionKey);
                    this.doc.content.sectionOrder = newOrder;
                    this.saveAndUpdate();
                    draggedItem = null;
                }
            }, { signal });
        }
    };

    // --- Start Application Logic ---
    const views = { '#/dashboard': document.getElementById('dashboard-view'), '#/templates': document.getElementById('templates-view'), '#/editor': document.getElementById('editor-view') };
    const navLinks = document.querySelectorAll('.main-nav a');

    const renderDashboard = () => {
        const docs = storage.getDocuments();
        const grid = document.getElementById('document-grid');
        grid.innerHTML = '';
        if (docs.length === 0) { grid.innerHTML = `<p>Du har ingen CV'er. <a href="#/templates">Opret et nyt</a>.</p>`; return; }
        docs.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified)).forEach(doc => {
            const iconClass = 'fa-solid fa-file-lines';
            grid.innerHTML += `<div class="document-card" data-doc-id="${doc.docId}">
                <div class="doc-card-type-icon"><i class="${iconClass}"></i> CV</div>
                <h3>${doc.title}</h3>
                <div class="meta">Sidst ændret: ${new Date(doc.lastModified).toLocaleString('da-DK')}</div>
                <div class="actions">
                    <button class="btn card-btn" data-action="edit"><i class="fas fa-pen"></i></button>
                    <button class="btn card-btn" data-action="delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
        });
    };

    const renderTemplatePreview = (template, content) => {
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
    };

    const renderTemplates = () => {
        const grid = document.getElementById('template-grid');
        const previewToggle = document.getElementById('preview-mode-toggle');
        const previewToggleContainer = document.querySelector('.template-preview-toggle');
        const isPreviewMode = previewToggle && previewToggle.checked && editor.doc;

        // Show/hide preview toggle based on whether there's an active document
        if (previewToggleContainer) {
            previewToggleContainer.style.display = editor.doc ? 'flex' : 'none';
        }

        grid.innerHTML = '';
        grid.className = isPreviewMode ? 'template-grid preview-mode' : 'template-grid';

        templates.forEach(t => {
            if (isPreviewMode) {
                const previewHtml = renderTemplatePreview(t, editor.doc.content);
                grid.innerHTML += `<div class="template-card preview-card" data-template-id="${t.id}" data-template-name="${t.name}">
                    <div class="template-card-title">${t.name}</div>
                    <div class="template-preview-content">
                        ${previewHtml}
                        <div class="template-preview-overlay"></div>
                    </div>
                </div>`;
            } else {
                grid.innerHTML += `<div class="template-card" data-template-id="${t.id}" data-template-name="${t.name}">
                    <img src="${t.previewImage}" alt="${t.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x400/ccc/999?text=Image+Not+Found';">
                    <div class="template-card-title">${t.name}</div>
                </div>`;
            }
        });
    };

    const router = () => {
        const hash = window.location.hash || '#/dashboard';
        let docId = null;
        let currentViewId = hash;
        if (hash.startsWith('#/editor/')) {
            currentViewId = '#/editor';
            docId = hash.substring('#/editor/'.length);
        }
        Object.values(views).forEach(view => view && view.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active-link'));

        const activeView = views[currentViewId];
        if (activeView) {
            activeView.classList.add('active');
            const activeLink = document.querySelector(`.main-nav a[href*="${currentViewId.split('/')[1]}"]`);
            if (activeLink) activeLink.classList.add('active-link');

            if (currentViewId === '#/dashboard') { editor.stopAutoSave(); editor.doc = null; renderDashboard(); }
            else if (currentViewId === '#/templates') { renderTemplates(); }
            else if (currentViewId === '#/editor' && docId) { editor.init(docId); }
        } else {
            window.location.hash = '#/dashboard';
        }
    };

    window.addEventListener('hashchange', router);
    window.addEventListener('beforeunload', () => editor.stopAutoSave());
    document.getElementById('modal-close-btn').addEventListener('click', () => ui.hideModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => { if (e.target.id === 'modal-overlay') ui.hideModal(); });
    document.getElementById('focus-mode-btn').addEventListener('click', (e) => {
        const editorLayout = document.getElementById('editor-layout');
        const icon = e.currentTarget.querySelector('.fas');
        const buttonText = e.currentTarget.childNodes[1]; // Get the text node

        editorLayout.classList.toggle('focus-mode');

        if (editorLayout.classList.contains('focus-mode')) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
            // Update button text for mobile users
            if (window.innerWidth <= 768) {
                e.currentTarget.innerHTML = '<i class="fas fa-compress"></i> Vis Redigering';
            }
        } else {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
            // Update button text for mobile users
            if (window.innerWidth <= 768) {
                e.currentTarget.innerHTML = '<i class="fas fa-expand"></i> Fokus';
            }
        }
    });

    // Zoom button event listeners
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        if (editor.doc) {
            editor.zoomIn();
        }
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        if (editor.doc) {
            editor.zoomOut();
        }
    });

    // Template preview toggle event listener
    document.addEventListener('change', (e) => {
        if (e.target.id === 'preview-mode-toggle') {
            renderTemplates();
        }
    });

    // --- PRINT FUNCTIONALITY ---
    document.getElementById('print-btn').addEventListener('click', () => {
        if (!editor.doc) return;

        // Save current title for restoration
        const originalTitle = document.title;

        // Set document title for print
        document.title = `${editor.doc.title} - CV`;

        // Add print-optimized class to body
        document.body.classList.add('print-optimized');

        // Focus on the CV preview for printing
        const cvPreview = document.getElementById('editor-preview');
        if (cvPreview) {
            // Temporarily make the preview the only visible content
            cvPreview.style.position = 'static';
            cvPreview.style.width = '100%';
            cvPreview.style.maxWidth = 'none';
            cvPreview.style.transform = 'none';
            cvPreview.style.margin = '0';
            cvPreview.style.boxShadow = 'none';
        }

        // Trigger print dialog
        window.print();

        // Restore original state after print dialog
        setTimeout(() => {
            document.title = originalTitle;
            document.body.classList.remove('print-optimized');

            if (cvPreview) {
                cvPreview.style.position = '';
                cvPreview.style.width = '';
                cvPreview.style.maxWidth = '';
                cvPreview.style.transform = '';
                cvPreview.style.margin = '';
                cvPreview.style.boxShadow = '';
            }
        }, 100);
    });

    // --- REVISED PDF DOWNLOAD ---
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        if (!editor.doc) return;
        const btn = document.getElementById('download-pdf-btn');
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Genererer...`;

        const element = document.getElementById('editor-preview');
        const filename = `${editor.doc.title.replace(/ /g, '_')}.pdf`;

        // Temporarily add class to body for print-specific CSS overrides
        document.body.classList.add('pdf-export-active');

        const options = {
            margin: 0, // Margins are controlled via CSS padding for better background handling
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2, // Higher scale for better quality text and images
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true, // Needed for some background images
                onclone: (doc) => {
                    // This runs on the cloned document before rendering
                    // We can use this to ensure fonts are loaded, etc.
                }
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            // Use 'css' mode to respect page-break-before/after/inside properties from CSS
            pagebreak: { mode: 'css', before: '.page-break' }
        };

        // Temporarily adjust the preview for perfect A4 sizing before rendering
        const originalStyle = element.style.cssText;
        const originalClass = element.className;

        // Add a class for PDF-specific styling
        element.className += ' pdf-render-target';
        element.style.width = '210mm';
        element.style.height = 'auto'; // Let content flow naturally
        element.style.minHeight = '297mm'; // Ensure it's at least one page tall
        element.style.transform = 'scale(1)';
        element.style.transformOrigin = 'top left';

        // Get the element to be converted
        const worker = html2pdf().from(element).set(options);

        worker.save().then(() => {
            // Restore original styling after PDF is generated
            element.style.cssText = originalStyle;
            element.className = originalClass;
            document.body.classList.remove('pdf-export-active');

            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-file-pdf"></i> Download PDF`;
            ui.showAlert('PDF er downloadet!', 'success');
        }).catch(err => {
            // Restore original styling on error
            element.style.cssText = originalStyle;
            element.className = originalClass;
            document.body.classList.remove('pdf-export-active');

            ui.showAlert('Fejl ved PDF-generering.', 'danger');
            console.error(err);
            btn.disabled = false;
            btn.innerHTML = `<i class="fas fa-file-pdf"></i> Download PDF`;
        });
    });


    document.getElementById('template-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.template-card');
        if (!card) return;
        const { templateId, templateName } = card.dataset;

        if (editor.doc) {
            editor.doc.content.templateId = templateId;
            editor.saveAndUpdate();
            editor.render();
            window.location.hash = `#/editor/${editor.doc.docId}`;
            ui.showAlert(`Skabelonen "${templateName}" er anvendt.`, 'success');
        } else {
            const newDoc = storage.createDocumentFromTemplate(templateId, templateName);
            window.location.hash = `#/editor/${newDoc.docId}`;
        }
    });

    document.getElementById('document-grid').addEventListener('click', (e) => {
        const card = e.target.closest('.document-card');
        if (!card) return;
        const docId = card.dataset.docId;
        const actionBtn = e.target.closest('button[data-action]');
        if (actionBtn) {
            e.stopPropagation();
            const action = actionBtn.dataset.action;
            if (action === 'edit') { window.location.hash = `#/editor/${docId}`; }
            else if (action === 'delete') {
                const docToDelete = storage.getDocument(docId);
                ui.showModal(`<h3>Slet Dokument</h3><p>Er du sikker på, du vil slette "<strong>${docToDelete.title}</strong>"?</p><p>Handlingen kan ikke fortrydes.</p><div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;"><button class="btn btn-secondary" id="cancel-delete-btn">Annuller</button><button class="btn btn-danger" id="confirm-delete-btn">Slet</button></div>`);
                document.getElementById('confirm-delete-btn').onclick = () => { storage.deleteDocument(docId); renderDashboard(); ui.hideModal(); };
                document.getElementById('cancel-delete-btn').onclick = () => ui.hideModal();
            }
        } else { window.location.hash = `#/editor/${docId}`; }
    });

    router();
}
