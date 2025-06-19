// Editor functionality
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
            this.setZoom(75);
        } else if (window.innerWidth <= 480) {
            this.setZoom(50);
        } else {
            this.updateZoomControls(); // Ensure controls are updated if no specific zoom is set
        }
        this.setZoom(this.currentZoom); // Apply initial or default zoom to preview
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
        }, 10000);
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
            const originalText = 'Alle ændringer er gemt';
            indicator.textContent = 'Auto-gemmer...';
            indicator.classList.add('visible', 'saving');
            setTimeout(() => {
                indicator.textContent = 'Auto-gemt ✓';
                indicator.classList.remove('saving');
                indicator.classList.add('just-saved');
                setTimeout(() => {
                    indicator.textContent = originalText;
                    indicator.classList.remove('visible', 'just-saved');
                }, 2000);
            }, 500);
        }
    },

    showSaveIndicator() {
        this.saveIndicator.classList.add('visible');
        this.saveIndicator.textContent = 'Alle ændringer er gemt';
        setTimeout(() => this.saveIndicator.classList.remove('visible'), 2000);
    },

    renderCvControls() {
        let controlsHTML = this.renderPersonalDetailsControl(this.doc.content.personalDetails);
        (this.doc.content.sectionOrder || []).forEach(key => {
            controlsHTML += this.renderGenericSection(key, this.doc.content[key]);
        });
        this.controlsContainer.innerHTML = controlsHTML;
    },

    renderPersonalDetailsControl(data) {
        const photoPos = data.photoPosition || { x: 50, y: 50 };
        const photoInstructionsHTML = data.photo ? `<p class="photo-instructions">Klik og træk på billedet for at justere.</p>` : '';

        return `<div class="form-section">
            <div class="form-section-header">
                <span>Personlige Oplysninger</span>
            </div>
            <div class="form-section-content">
                <div class="photo-upload-container">
                    <div id="photo-preview-box" class="photo-preview ${data.photo ? 'has-photo' : ''}" style="background-image: url(${data.photo || 'none'}); background-position: ${photoPos.x}% ${photoPos.y}%;"></div>
                    ${photoInstructionsHTML}
                    <label class="btn btn-secondary file-input-label">
                        <i class="fas fa-upload"></i> Vælg Billede
                        <input type="file" data-action="upload-photo" accept="image/jpeg,image/png,image/gif,image/webp">
                    </label>
                    ${data.photo ? `<button class="btn-danger-text" data-action="remove-photo" aria-label="Fjern billede"><i class="fas fa-trash"></i> Fjern Billede</button>` : ''}
                </div>
                <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid var(--border-color);">
                <div class="form-group">
                    <label>Fulde Navn</label>
                    <input type="text" data-path="personalDetails.name" value="${data.name || ''}">
                </div>
                <div class="form-group">
                    <label>Stilling</label>
                    <input type="text" data-path="personalDetails.jobTitle" value="${data.jobTitle || ''}">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" data-path="personalDetails.email" value="${data.email || ''}">
                </div>
                <div class="form-group">
                    <label>Telefon</label>
                    <input type="tel" data-path="personalDetails.phone" value="${data.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Adresse</label>
                    <input type="text" data-path="personalDetails.address" value="${data.address || ''}">
                </div>
                <div class="form-group">
                    <label>LinkedIn (fuld URL)</label>
                    <input type="url" data-path="personalDetails.linkedin" value="${data.linkedin || ''}" placeholder="https://www.linkedin.com/in/ditnavn">
                </div>
            </div>
        </div>`;
    },

    renderGenericSection(key, data) {
        let contentHtml = '';
        if (!data) return '';

        if (key === 'profile') {
            contentHtml = `<div class="form-group">
                <textarea data-path="${key}.content" rows="5" placeholder="En kort, fængende profiltekst...">${data.content || ''}</textarea>
            </div>`;
        } else if (['experience', 'education', 'skills', 'languages', 'courses', 'volunteerWork'].includes(key)) {
            contentHtml = (data.items || []).map(item => this.renderListItemForm(key, item)).join('') +
                `<button class="btn btn-add" data-action="add-item" data-list-name="${key}" aria-label="Tilføj element til ${data.title}">
                    <i class="fas fa-plus"></i> Tilføj
                </button>`;
        }

        return `<div class="form-section" data-section-key="${key}" draggable="true">
            <div class="form-section-header">
                <i class="fas fa-grip-vertical drag-handle" aria-hidden="true"></i>
                <span>${data.title}</span>
            </div>
            <div class="form-section-content">${contentHtml}</div>
        </div>`;
    },

    renderListItemForm(listName, item) {
        const id = item.id;
        const removeLabelPrefix = `Fjern ${listName.replace(/([A-Z])/g, ' $1').toLowerCase()} element: `;


        if (listName === 'experience') {
            return `<div class="list-item" data-id="${id}">
                <div class="form-group">
                    <label>Stilling</label>
                    <input type="text" data-list="experience" data-field="jobTitle" value="${item.jobTitle || ''}">
                </div>
                <div class="form-group">
                    <label>Virksomhed</label>
                    <input type="text" data-list="experience" data-field="company" value="${item.company || ''}">
                </div>
                <div class="grid-2-col">
                    <div class="form-group">
                        <label>Startdato</label>
                        <input type="text" data-list="experience" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020">
                    </div>
                    <div class="form-group">
                        <label>Slutdato</label>
                        <input type="text" data-list="experience" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022">
                    </div>
                </div>
                <div class="form-group">
                    <label>Beskrivelse</label>
                    <textarea data-list="experience" data-field="description" rows="4">${item.description || ''}</textarea>
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="experience" data-id="${id}" aria-label="${removeLabelPrefix}${item.jobTitle || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Erfaring
                </button>
            </div>`;
        }

        if (listName === 'education') {
            return `<div class="list-item" data-id="${id}">
                <div class="form-group">
                    <label>Uddannelse</label>
                    <input type="text" data-list="education" data-field="degree" value="${item.degree || ''}">
                </div>
                <div class="form-group">
                    <label>Institution</label>
                    <input type="text" data-list="education" data-field="institution" value="${item.institution || ''}">
                </div>
                <div class="grid-2-col">
                    <div class="form-group">
                        <label>Startdato</label>
                        <input type="text" data-list="education" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020">
                    </div>
                    <div class="form-group">
                        <label>Slutdato</label>
                        <input type="text" data-list="education" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022">
                    </div>
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="education" data-id="${id}" aria-label="${removeLabelPrefix}${item.degree || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Uddannelse
                </button>
            </div>`;
        }

        if (listName === 'languages') {
            const levels = ['Modersmål', 'Flydende', 'Forhandlingsniveau', 'Professionel', 'Begynder'];
            return `<div class="list-item" data-id="${id}">
                <div class="grid-2-col">
                    <div class="form-group">
                        <label>Sprog</label>
                        <input type="text" data-list="languages" data-field="language" value="${item.language || ''}">
                    </div>
                    <div class="form-group">
                        <label>Niveau</label>
                        <select data-list="languages" data-field="level">
                            ${levels.map(l => `<option value="${l}" ${item.level === l ? 'selected' : ''}>${l}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="languages" data-id="${id}" aria-label="${removeLabelPrefix}${item.language || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Sprog
                </button>
            </div>`;
        }

        if (listName === 'skills') {
            return `<div class="list-item" data-id="${id}">
                <div class="form-group">
                    <label>Kompetence</label>
                    <input type="text" data-list="skills" data-field="skill" value="${item.skill || ''}">
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="skills" data-id="${id}" aria-label="${removeLabelPrefix}${item.skill || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Kompetence
                </button>
            </div>`;
        }

        if (listName === 'courses') {
            return `<div class="list-item" data-id="${id}">
                <div class="form-group">
                    <label>Kursus/Certifikat</label>
                    <input type="text" data-list="courses" data-field="courseName" value="${item.courseName || ''}">
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="courses" data-id="${id}" aria-label="${removeLabelPrefix}${item.courseName || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Kursus
                </button>
            </div>`;
        }

        if (listName === 'volunteerWork') {
            return `<div class="list-item" data-id="${id}">
                <div class="form-group">
                    <label>Rolle/Titel</label>
                    <input type="text" data-list="volunteerWork" data-field="role" value="${item.role || ''}">
                </div>
                <div class="form-group">
                    <label>Organisation</label>
                    <input type="text" data-list="volunteerWork" data-field="organization" value="${item.organization || ''}">
                </div>
                <div class="grid-2-col">
                    <div class="form-group">
                        <label>Startdato</label>
                        <input type="text" data-list="volunteerWork" data-field="startDate" value="${item.startDate || ''}" placeholder="Eks. Jan 2020">
                    </div>
                    <div class="form-group">
                        <label>Slutdato</label>
                        <input type="text" data-list="volunteerWork" data-field="endDate" value="${item.endDate || ''}" placeholder="Eks. Dec 2022">
                    </div>
                </div>
                <div class="form-group">
                    <label>Beskrivelse</label>
                    <textarea data-list="volunteerWork" data-field="description" rows="4">${item.description || ''}</textarea>
                </div>
                <button class="btn-danger-text" data-action="remove-item" data-list-name="volunteerWork" data-id="${id}" aria-label="${removeLabelPrefix}${item.role || 'uden titel'}">
                    <i class="fas fa-trash"></i> Fjern Frivilligt Arbejde
                </button>
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
        const { templateId } = this.doc.content;
        this.previewContainer.className = `editor-preview cv-preview ${templateId}`;
        const previewHTML = this.generateCvPreviewHTML(this.doc.content, templateId);
        this.previewContainer.innerHTML = previewHTML;
    },

    generateCvPreviewHTML(cvContent, templateId) {
        const { personalDetails } = cvContent;
        const photoPos = personalDetails.photoPosition || { x: 50, y: 50 };
        const photoStyle = `background-image: url('${personalDetails.photo}'); background-position: ${photoPos.x}% ${photoPos.y}%;`;
        const photoHTML = personalDetails.photo ? `<div class="cv-photo-container"><div class="cv-photo" style="${photoStyle}"></div></div>` : '';

        const contactHTML = this.getContactHTML(personalDetails);
        const allSectionsHTML = (cvContent.sectionOrder || []).map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');

        let previewHTML = '';

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
                const sidebarKeys = (cvContent.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                const mainKeys = (cvContent.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));
                const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');
                const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');

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
                const sidebarKeys = (cvContent.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                const mainKeys = (cvContent.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));
                const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');
                const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');

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
                const sidebarKeys = (cvContent.sectionOrder || []).filter(k => ['skills', 'languages'].includes(k));
                const mainKeys = (cvContent.sectionOrder || []).filter(k => !['skills', 'languages'].includes(k));
                const sidebarSectionsHTML = sidebarKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');
                const mainSectionsHTML = mainKeys.map(key => this.renderCvPreviewSection(key, cvContent[key])).join('');

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
        return previewHTML;
    },

    renderCvPreviewSection(key, data) {
        if (!data || !data.title || (Array.isArray(data.items) && data.items.length === 0 && key !== 'profile')) return '';
        let content = '';

        if (key === 'profile') {
            if (!data.content) return '';
            content = `<p>${(data.content || '').replace(/\n/g, '<br>')}</p>`;
        } else if (key === 'experience') {
            content = (data.items || []).map(item => `<div class="cv-experience-item">
                <h4>${item.jobTitle || ''}</h4>
                <div class="cv-item-subtitle">${item.company || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div>
                <div class="cv-item-description">${(item.description || '').replace(/\n/g, '<br>')}</div>
            </div>`).join('');
        } else if (key === 'education') {
            content = (data.items || []).map(item => `<div class="cv-education-item">
                <h4>${item.degree || ''}</h4>
                <div class="cv-item-subtitle">${item.institution || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div>
            </div>`).join('');
        } else if (key === 'courses') {
            content = `<ul>${(data.items || []).map(item => `<li class="cv-course-item">${item.courseName || ''}</li>`).join('')}</ul>`;
        } else if (key === 'volunteerWork') {
            content = (data.items || []).map(item => `<div class="cv-volunteer-item cv-experience-item">
                <h4>${item.role || ''}</h4>
                <div class="cv-item-subtitle">${item.organization || ''} | ${item.startDate || ''} - ${item.endDate || 'Nu'}</div>
                <div class="cv-item-description">${(item.description || '').replace(/\n/g, '<br>')}</div>
            </div>`).join('');
        } else if (key === 'languages') {
            content = `<ul>${(data.items || []).map(item => `<li class="cv-language-item">
                <span>${item.language || ''}</span> - <span>${item.level || ''}</span>
            </li>`).join('')}</ul>`;
        } else if (key === 'skills') {
            content = `<p>${(data.items || []).map(item => item.skill).join(', ')}</p>`;
        }

        if (!content || !content.trim()) return '';

        return `<section class="cv-section cv-section-${key}">
            <h2>${data.title}</h2>
            ${content}
        </section>`;
    },

    _displayFieldError(inputElement, message) {
        let errorSpan = inputElement.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-message')) {
            // Error span already exists
        } else {
            // Create new error span
            errorSpan = document.createElement('span');
            errorSpan.classList.add('error-message');
            inputElement.parentNode.insertBefore(errorSpan, inputElement.nextSibling);
        }
        errorSpan.textContent = message;
        errorSpan.style.display = message ? 'block' : 'none'; // Show/hide
        inputElement.classList.toggle('input-error', !!message); // Add/remove error class on input
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

    handlePrint() {
        // Add a class to the body for print-specific styles from cv-templates.css
        document.body.classList.add('print-active');
        this.previewContainer.classList.add('pdf-generating-preview'); // Use same class as PDF for consistency

        const originalZoom = this.currentZoom;
        this.setZoom(100);

        setTimeout(() => {
            window.print();
            this.setZoom(originalZoom);
            this.previewContainer.classList.remove('pdf-generating-preview');
            document.body.classList.remove('print-active');
        }, 100);
    },

    handleDownloadPdf() {
        const downloadBtn = document.getElementById('download-pdf-btn');
        const originalBtnHTML = downloadBtn.innerHTML;

        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Genererer PDF...`;

        const element = this.previewContainer;
        const filename = `${this.doc.title || 'cv'}.pdf`;

        const originalZoom = this.currentZoom;
        this.setZoom(100);
        element.classList.add('pdf-generating-preview');


        setTimeout(() => {
            const opt = {
                margin: [5, 5, 5, 5],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    dpi: 192,
                    letterRendering: true,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            html2pdf().from(element).set(opt).save()
                .then(() => {
                    // ui.showAlert('PDF downloaded successfully!', 'success'); // Optional
                })
                .catch((error) => {
                    console.error('PDF generation error:', error);
                    ui.showAlert('Der opstod en fejl under PDF-generering. Prøv venligst igen.', 'danger');
                })
                .finally(() => {
                    element.classList.remove('pdf-generating-preview');
                    this.setZoom(originalZoom);
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = originalBtnHTML;
                });
        }, 100);
    },

    attachEventListeners() {
        if (this.eventController) {
            this.eventController.abort();
        }
        this.eventController = new AbortController();
        const signal = this.eventController.signal;

        // Event listener for controls container (inputs, item add/remove etc.)
        let inputTimeout;
        this.controlsContainer.addEventListener('input', (e) => {
            clearTimeout(inputTimeout);
            const target = e.target;
            inputTimeout = setTimeout(() => {
                const { path, list, field } = target.dataset;
                let isValid = true;

                if (path) {
                    const keys = path.split('.');
                    let current = this.doc.content;
                    for (let i = 0; i < keys.length - 1; i++) {
                        if (!current[keys[i]]) current[keys[i]] = {};
                        current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = target.value;

                    if (path === 'personalDetails.email') {
                        const emailRegex = /^\S+@\S+\.\S+$/;
                        isValid = emailRegex.test(target.value);
                        this._displayFieldError(target, isValid ? '' : 'Ugyldig email-adresse');
                    } else if (path === 'personalDetails.linkedin') {
                        isValid = (!target.value || ((target.value.startsWith('https://') || target.value.startsWith('http://')) && target.value.includes('linkedin.com')));
                        this._displayFieldError(target, isValid ? '' : 'Ugyldig LinkedIn URL (skal starte med http(s):// og indeholde linkedin.com)');
                    } else {
                         this._displayFieldError(target, '');
                    }

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
            const button = e.target.closest('button[data-action]');
            if (!button) return;
            const { action, listName, id } = button.dataset;

            if (action === 'add-item') {
                const newItem = { id: `item_${Math.random().toString(36).substr(2, 9)}` };
                if (!this.doc.content[listName].items) this.doc.content[listName].items = [];
                this.doc.content[listName].items.push(newItem);
                this.markUnsaved();
                this.saveAndUpdate();
                this.render();
            } else if (action === 'remove-item') {
                this.doc.content[listName].items = this.doc.content[listName].items.filter(i => i.id !== id);
                this.markUnsaved();
                this.saveAndUpdate();
                this.render();
            } else if (action === 'remove-photo') {
                this.doc.content.personalDetails.photo = null;
                this.markUnsaved();
                this.saveAndUpdate();
                this.render();
            }
        }, { signal });

        this.controlsContainer.addEventListener('change', (e) => {
            const inputElement = e.target.closest('[data-action="upload-photo"]');
            if (inputElement && inputElement.files[0]) {
                const file = inputElement.files[0];
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    ui.showAlert('Ikke-understøttet filtype. Vælg venligst et JPG, PNG, GIF, eller WEBP billede.', 'danger'); // Translated
                    inputElement.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.doc.content.personalDetails.photo = event.target.result;
                    this.doc.content.personalDetails.photoPosition = { x: 50, y: 50 };
                    this.markUnsaved();
                    this.saveAndUpdate();
                    this.render();
                };
                reader.readAsDataURL(file);
            }
        }, { signal });

        // Title input
        let titleTimeout;
        this.titleInput.addEventListener('input', (e) => {
            clearTimeout(titleTimeout);
            titleTimeout = setTimeout(() => {
                this.doc.title = e.target.value;
                this.markUnsaved();
            }, 300);
        }, { signal });

        // Photo positioning drag
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
                this.renderCvPreview();
                const photoBox = this.controlsContainer.querySelector('#photo-preview-box');
                 if (photoBox) {
                    photoBox.style.backgroundPosition = `${newX}% ${newY}%`;
                }
            }
        }, { signal });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                const photoBox = this.controlsContainer.querySelector('#photo-preview-box');
                if (photoBox) photoBox.style.cursor = 'move';
                this.markUnsaved();
                this.saveAndUpdate();
            }
        }, { signal });

        // Section drag-and-drop
        let draggedItem = null;
        this.controlsContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('form-section')) {
                draggedItem = e.target;
                setTimeout(() => e.target.classList.add('dragging'), 0);
            }
        }, { signal });

        this.controlsContainer.addEventListener('dragend', (e) => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            }
        }, { signal });

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
                this.markUnsaved();
                this.saveAndUpdate();
                draggedItem = null;
            }
        }, { signal });

        // Editor Header Buttons
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', this.handleDownloadPdf.bind(this), { signal });
        }

        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', this.handlePrint.bind(this), { signal });
        }

        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', this.zoomIn.bind(this), { signal });
        }

        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', this.zoomOut.bind(this), { signal });
        }
    }
};
