// Storage operations for localStorage
const storage = {
    getDocuments: () => {
        return JSON.parse(localStorage.getItem('cv-engineer-docs') || '[]').filter(doc => doc.docType === 'cv');
    },

    saveDocuments: (docs) => {
        localStorage.setItem('cv-engineer-docs', JSON.stringify(docs));
    },

    getDocument: (docId) => {
        return storage.getDocuments().find(doc => doc.docId === docId);
    },

    saveDocument: (docToSave) => {
        let docs = storage.getDocuments();
        const docIndex = docs.findIndex(doc => doc.docId === docToSave.docId);
        if (docIndex > -1) {
            docs[docIndex] = docToSave;
        } else {
            docs.push(docToSave);
        }
        storage.saveDocuments(docs);
    },

    createDocumentFromTemplate: (templateId, templateName) => {
        const docId = `doc_${Date.now()}`;
        const template = templates.find(t => t.id === templateId);

        const content = {
            templateId: template.id,
            sectionOrder: ['profile', 'experience', 'education', 'skills', 'courses', 'volunteerWork', 'languages'],
            personalDetails: {
                name: 'Dit Navn',
                jobTitle: 'Din Stilling',
                email: 'din@email.com',
                phone: '12345678',
                address: 'Din Gade 1, 1000 By',
                linkedin: '',
                photo: null,
                photoPosition: { x: 50, y: 50 }
            },
            profile: {
                title: 'Profil',
                content: 'En kort, professionel profil om dig selv.'
            },
            experience: {
                title: 'Arbejdserfaring',
                items: []
            },
            education: {
                title: 'Uddannelse',
                items: []
            },
            skills: {
                title: 'Kompetencer',
                items: []
            },
            courses: {
                title: 'Relevante Kurser',
                items: []
            },
            volunteerWork: {
                title: 'Frivilligt Arbejde',
                items: []
            },
            languages: {
                title: 'Sprog',
                items: []
            },
        };

        const newDoc = {
            docId,
            docType: 'cv',
            title: `Udkast - ${templateName}`,
            lastModified: new Date().toISOString(),
            content
        };

        storage.saveDocument(newDoc);
        return newDoc;
    },

    deleteDocument: (docId) => {
        let docs = storage.getDocuments().filter(doc => doc.docId !== docId);
        storage.saveDocuments(docs);
    }
};
