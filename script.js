// auditoria-app.js
// Aplicación completa de gestión de calidad para auditores

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initApp();
});

// Función para inicializar la aplicación
function initApp() {
    // Inicializar secciones
    initSections();
    
    // Inicializar funcionalidad de notas
    initNotes();
    
    // Inicializar corrector de texto
    initTextCorrection();
    
    // Inicializar generador de PDF
    initPDFGenerator();
    
    // Inicializar gestión de normas
    initNorms();
    
    // Inicializar sistema de checklist
    initChecklists();
    
    // Inicializar planificación de auditorías
    initAuditPlanning();
    
    // Inicializar seguimiento de hallazgos
    initFindingsTracking();
    
    // Inicializar sistema de alertas
    initNotifications();
    
    // Inicializar análisis de datos
    initAnalytics();
    
    // Inicializar gestión documental
    initDocumentManagement();
    
    // Inicializar módulo de capacitación
    initTrainingModule();
    
    // Inicializar integración con APIs
    initNormativeAPI();
    
    // Inicializar modo offline
    initOfflineCapabilities();
    
    // Inicializar panel personalizable
    initCustomDashboard();
    
    // Cargar datos guardados
    loadSavedData();
}

// ==============================================
// GESTIÓN DE SECCIONES
// ==============================================
function initSections() {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const sections = document.querySelectorAll('.section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Actualizar menú activo
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                    
                    // Actualizar título
                    document.getElementById('section-title').textContent = 
                        this.textContent.trim();
                }
            });
            
            // Si es la sección de notas, cargarlas
            if (sectionId === 'notes') {
                displayNotes();
            }
            
            // Si es la sección de checklist, cargarlos
            if (sectionId === 'checklists') {
                displayChecklists();
            }
            
            // Si es la sección de auditorías, cargarlas
            if (sectionId === 'audit-planning') {
                displayAudits();
            }
            
            // Si es la sección de hallazgos, cargarlos
            if (sectionId === 'findings') {
                displayFindings();
            }
            
            // Si es la sección de documentos, cargarlos
            if (sectionId === 'documents') {
                displayDocuments();
            }
            
            // Si es la sección de capacitación, cargarla
            if (sectionId === 'training') {
                displayTraining();
            }
            
            // Si es la sección de dashboard, actualizar
            if (sectionId === 'dashboard') {
                updateDashboard();
            }
        });
    });
    
    // Botón para nueva nota
    document.getElementById('new-note-btn').addEventListener('click', function() {
        // Ir a la sección de notas
        document.querySelector('[data-section="notes"]').click();
        
        // Crear nueva nota
        createNewNote();
    });
}

// ==============================================
// GESTIÓN DE NOTAS
// ==============================================
function initNotes() {
    // Almacenamiento de notas
    let notes = JSON.parse(localStorage.getItem('auditorApp_notes')) || [];
    let currentNoteId = null;
    
    // Guardar notas en localStorage
    function saveNotes() {
        localStorage.setItem('auditorApp_notes', JSON.stringify(notes));
        updateStats();
    }
    
    // Crear nueva nota
    window.createNewNote = function() {
        const newNote = {
            id: Date.now(),
            title: '',
            content: '',
            date: new Date().toISOString(),
            tag: ''
        };
        
        notes.unshift(newNote);
        currentNoteId = newNote.id;
        
        // Actualizar interfaz
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-date').textContent = 'Nueva nota';
        document.getElementById('note-tags').value = '';
        
        saveNotes();
        displayNotes();
    };
    
    // Mostrar notas en la lista
    window.displayNotes = function() {
        const notesList = document.getElementById('all-notes-list');
        const filterValue = document.getElementById('note-filter').value;
        
        // Filtrar notas según el criterio seleccionado
        let filteredNotes = notes;
        
        if (filterValue === 'today') {
            const today = new Date().toDateString();
            filteredNotes = notes.filter(note => 
                new Date(note.date).toDateString() === today
            );
        } else if (filterValue === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            filteredNotes = notes.filter(note => 
                new Date(note.date) >= oneWeekAgo
            );
        } else if (filterValue === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            filteredNotes = notes.filter(note => 
                new Date(note.date) >= oneMonthAgo
            );
        }
        
        // Aplicar búsqueda si hay texto
        const searchText = document.getElementById('note-search').value.toLowerCase();
        if (searchText) {
            filteredNotes = filteredNotes.filter(note => 
                note.title.toLowerCase().includes(searchText) || 
                note.content.toLowerCase().includes(searchText)
            );
        }
        
        // Generar HTML para la lista de notas
        if (filteredNotes.length === 0) {
            notesList.innerHTML = '<p class="empty-state">No se encontraron notas.</p>';
            return;
        }
        
        notesList.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteDate = new Date(note.date);
            const formattedDate = noteDate.toLocaleDateString() + ' ' + noteDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            if (note.id === currentNoteId) {
                noteElement.style.background = '#e3f2fd';
            }
            
            noteElement.innerHTML = `
                <div class="note-title">${note.title || 'Sin título'}</div>
                <div class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-date">${formattedDate}</div>
            `;
            
            noteElement.addEventListener('click', function() {
                loadNote(note.id);
            });
            
            notesList.appendChild(noteElement);
        });
        
        // Actualizar notas recientes en el dashboard
        updateRecentNotes();
    };
    
    // Cargar una nota en el editor
    function loadNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        
        currentNoteId = noteId;
        
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        
        const noteDate = new Date(note.date);
        document.getElementById('note-date').textContent = 
            'Editada: ' + noteDate.toLocaleDateString() + ' ' + 
            noteDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        document.getElementById('note-tags').value = note.tag || '';
        
        // Resaltar la nota seleccionada en la lista
        document.querySelectorAll('.note-item').forEach(item => {
            item.style.background = '#f8f9fa';
        });
        
        const selectedNote = Array.from(document.querySelectorAll('.note-item')).find(item => {
            return item.querySelector('.note-title').textContent === note.title;
        });
        
        if (selectedNote) {
            selectedNote.style.background = '#e3f2fd';
        }
        
        displayNotes();
    }
    
    // Guardar la nota actual
    document.getElementById('save-note').addEventListener('click', function() {
        if (!currentNoteId) return;
        
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].title = document.getElementById('note-title').value;
        notes[noteIndex].content = document.getElementById('note-content').value;
        notes[noteIndex].tag = document.getElementById('note-tags').value;
        notes[noteIndex].date = new Date().toISOString();
        
        saveNotes();
        displayNotes();
        
        // Mostrar confirmación
        showNotification('Nota guardada correctamente', 'success');
    });
    
    // Eliminar la nota actual
    document.getElementById('delete-note').addEventListener('click', function() {
        if (!currentNoteId) return;
        
        if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
            notes = notes.filter(n => n.id !== currentNoteId);
            currentNoteId = null;
            
            // Limpiar editor
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            document.getElementById('note-date').textContent = '';
            document.getElementById('note-tags').value = '';
            
            saveNotes();
            displayNotes();
            
            showNotification('Nota eliminada', 'info');
        }
    });
    
    // Búsqueda y filtrado de notas
    document.getElementById('note-search').addEventListener('input', displayNotes);
    document.getElementById('note-filter').addEventListener('change', displayNotes);
    
    // Auto-guardado cada 30 segundos
    setInterval(() => {
        if (currentNoteId) {
            const noteIndex = notes.findIndex(n => n.id === currentNoteId);
            if (noteIndex === -1) return;
            
            notes[noteIndex].title = document.getElementById('note-title').value;
            notes[noteIndex].content = document.getElementById('note-content').value;
            notes[noteIndex].tag = document.getElementById('note-tags').value;
            
            saveNotes();
        }
    }, 30000);
    
    // Actualizar notas recientes en el dashboard
    function updateRecentNotes() {
        const recentNotesList = document.getElementById('recent-notes-list');
        const recentNotes = notes.slice(0, 5); // Últimas 5 notas
        
        if (recentNotes.length === 0) {
            recentNotesList.innerHTML = '<p class="empty-state">No hay notas recientes. Crea tu primera nota.</p>';
            return;
        }
        
        recentNotesList.innerHTML = '';
        recentNotes.forEach(note => {
            const noteDate = new Date(note.date);
            const formattedDate = noteDate.toLocaleDateString() + ' ' + noteDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            
            noteElement.innerHTML = `
                <div class="note-title">${note.title || 'Sin título'}</div>
                <div class="note-preview">${note.content.substring(0, 80)}${note.content.length > 80 ? '...' : ''}</div>
                <div class="note-date">${formattedDate}</div>
            `;
            
            noteElement.addEventListener('click', function() {
                // Cambiar a la sección de notas y cargar esta nota
                document.querySelector('[data-section="notes"]').click();
                loadNote(note.id);
            });
            
            recentNotesList.appendChild(noteElement);
        });
    }
}

// ==============================================
// CORRECTOR DE TEXTO
// ==============================================
function initTextCorrection() {
    const textToCorrect = document.getElementById('text-to-correct');
    const correctedText = document.getElementById('corrected-text');
    const correctTextBtn = document.getElementById('correct-text-btn');
    const copyCorrectedBtn = document.getElementById('copy-corrected-btn');
    const addToNotesBtn = document.getElementById('add-to-notes-btn');
    
    // Corregir texto
    correctTextBtn.addEventListener('click', function() {
        const text = textToCorrect.value.trim();
        if (!text) {
            showNotification('Por favor, ingresa texto para corregir', 'warning');
            return;
        }
        
        // Simular corrección (en una app real, esto se conectaría a un servicio de corrección)
        const corrected = correctText(text);
        
        // Mostrar texto corregido
        correctedText.innerHTML = `<p>${corrected}</p>`;
    });
    
    // Copiar texto corregido al portapapeles
    copyCorrectedBtn.addEventListener('click', function() {
        const text = correctedText.textContent;
        if (!text || text === 'El texto corregido aparecerá aquí...') {
            showNotification('No hay texto para copiar', 'warning');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Texto copiado al portapapeles', 'success');
            })
            .catch(err => {
                showNotification('Error al copiar el texto', 'error');
                console.error('Error al copiar texto: ', err);
            });
    });
    
    // Agregar texto corregido a notas
    addToNotesBtn.addEventListener('click', function() {
        const text = correctedText.textContent;
        if (!text || text === 'El texto corregido aparecerá aquí...') {
            showNotification('No hay texto para agregar a notas', 'warning');
            return;
        }
        
        // Cambiar a la sección de notas
        document.querySelector('[data-section="notes"]').click();
        
        // Crear nueva nota con el texto corregido
        createNewNote();
        
        // Llenar la nota con el texto corregido
        document.getElementById('note-title').value = 'Texto corregido';
        document.getElementById('note-content').value = text;
        
        // Guardar la nota
        document.getElementById('save-note').click();
        
        showNotification('Texto agregado a notas', 'success');
    });
    
    // Función para corregir texto (simulada)
    function correctText(text) {
        // Aquí iría la lógica real de corrección
        // Por ahora, solo simulamos algunas correcciones básicas
        
        // Corregir espacios antes de signos de puntuación
        text = text.replace(/\s+([.,;:!?])/g, '$1');
        
        // Añadir espacio después de signos de puntuación
        text = text.replace(/([.,;:!?])(\w)/g, '$1 $2');
        
        // Capitalizar después de punto
        text = text.replace(/([.!?]\s+)([a-z])/g, function(match, p1, p2) {
            return p1 + p2.toUpperCase();
        });
        
        // Corregir mayúsculas después de dos puntos en títulos
        text = text.replace(/(:\s+)([a-z])/g, function(match, p1, p2) {
            return p1 + p2.toUpperCase();
        });
        
        return text;
    }
}

// ==============================================
// GENERADOR DE PDF
// ==============================================
function initPDFGenerator() {
    const pdfTitle = document.getElementById('pdf-title');
    const pdfContent = document.getElementById('pdf-content');
    const pdfTemplate = document.getElementById('pdf-template');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');
    const previewTitle = document.getElementById('preview-title');
    const previewDate = document.getElementById('preview-date-value');
    const previewContent = document.getElementById('preview-content');
    
    // Actualizar vista previa en tiempo real
    pdfTitle.addEventListener('input', updatePreview);
    pdfContent.addEventListener('input', updatePreview);
    pdfTemplate.addEventListener('change', updatePreview);
    
    // Generar PDF
    generatePdfBtn.addEventListener('click', function() {
        const title = pdfTitle.value.trim() || 'Informe de Auditoría';
        const content = pdfContent.value.trim();
        
        if (!content) {
            showNotification('Por favor, ingresa contenido para el PDF', 'warning');
            return;
        }
        
        // Usar jsPDF para generar el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar el documento según la plantilla seleccionada
        const template = pdfTemplate.value;
        let fontSize = 12;
        let titleSize = 16;
        
        if (template === 'formal') {
            fontSize = 11;
            titleSize = 14;
        } else if (template === 'minimal') {
            fontSize = 10;
            titleSize = 12;
        }
        
        // Agregar título
        doc.setFontSize(titleSize);
        doc.setFont(undefined, 'bold');
        doc.text(title, 105, 20, { align: 'center' });
        
        // Agregar fecha
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const date = new Date().toLocaleDateString();
        doc.text(`Fecha: ${date}`, 105, 30, { align: 'center' });
        
        // Agregar contenido
        doc.setFontSize(fontSize);
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 15, 45);
        
        // Agregar pie de página
        doc.setFontSize(8);
        doc.text('Generado con AuditorApp - Sistema de gestión de calidad', 105, 280, { align: 'center' });
        
        // Guardar PDF
        doc.save(`Informe_${date.replace(/\//g, '-')}.pdf`);
        
        // Actualizar estadísticas
        const generatedPDFs = parseInt(localStorage.getItem('auditorApp_generatedPDFs') || '0');
        localStorage.setItem('auditorApp_generatedPDFs', (generatedPDFs + 1).toString());
        updateStats();
        
        showNotification('PDF generado correctamente', 'success');
    });
    
    // Actualizar vista previa
    function updatePreview() {
        const title = pdfTitle.value.trim() || 'Título del Informe';
        const content = pdfContent.value.trim() || 'El contenido de tu informe aparecerá aquí...';
        const date = new Date().toLocaleDateString();
        
        previewTitle.textContent = title;
        previewDate.textContent = date;
        previewContent.innerHTML = content.replace(/\n/g, '<br>');
    }
    
    // Inicializar vista previa
    updatePreview();
}

// ==============================================
// GESTIÓN DE NORMAS
// ==============================================
function initNorms() {
    const addNormBtn = document.getElementById('add-norm-btn');
    const showNormForm = document.getElementById('show-norm-form');
    const normForm = document.getElementById('norm-form');
    const cancelNormBtn = document.getElementById('cancel-norm-btn');
    const saveNormBtn = document.getElementById('save-norm-btn');
    
    // Mostrar formulario para agregar norma
    addNormBtn.addEventListener('click', function() {
        normForm.style.display = 'block';
    });
    
    showNormForm.addEventListener('click', function() {
        normForm.style.display = 'block';
    });
    
    // Cancelar agregar norma
    cancelNormBtn.addEventListener('click', function() {
        normForm.style.display = 'none';
        clearNormForm();
    });
    
    // Guardar nueva norma
    saveNormBtn.addEventListener('click', function() {
        const name = document.getElementById('norm-name').value.trim();
        const description = document.getElementById('norm-description').value.trim();
        
        if (!name) {
            showNotification('Por favor, ingresa un nombre para la norma', 'warning');
            return;
        }
        
        // Guardar norma (simulado)
        const norms = JSON.parse(localStorage.getItem('auditorApp_norms') || '[]');
        norms.push({
            id: Date.now(),
            name,
            description,
            content: document.getElementById('norm-content').value.trim(),
            active: true
        });
        
        localStorage.setItem('auditorApp_norms', JSON.stringify(norms));
        
        // Actualizar interfaz
        normForm.style.display = 'none';
        clearNormForm();
        updateStats();
        
        showNotification('Norma agregada correctamente', 'success');
    });
    
    // Limpiar formulario de norma
    function clearNormForm() {
        document.getElementById('norm-name').value = '';
        document.getElementById('norm-description').value = '';
        document.getElementById('norm-content').value = '';
    }
}

// ==============================================
// SISTEMA DE CHECKLIST Y PLANTILLAS
// ==============================================
function initChecklists() {
    // Plantillas predefinidas según ISO 9001:2015
    const iso9001Checklists = {
        "contextOrganization": [
            "4.1 - Comprensión de la organización y su contexto",
            "4.2 - Comprensión de las necesidades y expectativas de las partes interesadas",
            "4.3 - Determinación del alcance del sistema de gestión de la calidad",
            "4.4 - Sistema de gestión de la calidad y sus procesos"
        ],
        "leadership": [
            "5.1 - Liderazgo y compromiso",
            "5.2 - Política de la calidad",
            "5.3 - Roles, responsabilidades y autoridades en la organización"
        ],
        "planning": [
            "6.1 - Acciones para abordar riesgos y oportunidades",
            "6.2 - Objetivos de la calidad y planificación para lograrlos",
            "6.3 - Planificación de los cambios"
        ],
        "support": [
            "7.1 - Recursos",
            "7.2 - Competencia",
            "7.3 - Toma de conciencia",
            "7.4 - Comunicación",
            "7.5 - Información documentada"
        ],
        "operation": [
            "8.1 - Planificación y control operacional",
            "8.2 - Requisitos para los productos y servicios",
            "8.3 - Diseño y desarrollo de los productos y servicios",
            "8.4 - Control de los procesos, productos y servicios proporcionados externamente",
            "8.5 - Producción y prestación del servicio",
            "8.6 - Liberación de los productos y servicios",
            "8.7 - Control de las salidas no conformes"
        ],
        "evaluation": [
            "9.1 - Seguimiento, medición, análisis y evaluación",
            "9.2 - Auditoría interna",
            "9.3 - Revisión por la dirección"
        ],
        "improvement": [
            "10.1 - Mejora continua",
            "10.2 - No conformidad y acción correctiva",
            "10.3 - Mejora"
        ]
    };

    // Gestión de checklist personalizados
    window.createChecklist = function(normId, chapter) {
        const checklist = {
            id: Date.now(),
            normId,
            chapter,
            items: iso9001Checklists[chapter] || [],
            created: new Date().toISOString(),
            completed: false
        };
        
        // Guardar checklist
        const checklists = JSON.parse(localStorage.getItem('auditorApp_checklists') || '[]');
        checklists.push(checklist);
        localStorage.setItem('auditorApp_checklists', JSON.stringify(checklists));
        
        return checklist;
    };
    
    // Mostrar checklist en la interfaz
    window.displayChecklists = function() {
        const checklists = JSON.parse(localStorage.getItem('auditorApp_checklists') || '[]');
        const checklistList = document.getElementById('checklists-list');
        
        if (checklists.length === 0) {
            checklistList.innerHTML = '<p class="empty-state">No hay checklist creados.</p>';
            return;
        }
        
        checklistList.innerHTML = '';
        checklists.forEach(checklist => {
            const checklistElement = document.createElement('div');
            checklistElement.className = 'checklist-item';
            checklistElement.innerHTML = `
                <h3>Checklist ${checklist.id}</h3>
                <p>Norma: ${checklist.normId}</p>
                <p>Capítulo: ${checklist.chapter}</p>
                <p>Creado: ${new Date(checklist.created).toLocaleDateString()}</p>
                <button class="btn btn-secondary open-checklist" data-id="${checklist.id}">Abrir Checklist</button>
            `;
            
            checklistList.appendChild(checklistElement);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.open-checklist').forEach(btn => {
            btn.addEventListener('click', function() {
                const checklistId = this.getAttribute('data-id');
                openChecklist(checklistId);
            });
        });
    };
    
    // Abrir checklist específico
    function openChecklist(checklistId) {
        // Implementar lógica para abrir y completar checklist
        showNotification(`Abriendo checklist ${checklistId}`, 'info');
    }
}

// ==============================================
// PLANIFICACIÓN DE AUDITORÍAS
// ==============================================
function initAuditPlanning() {
    // Calendario de auditorías
    window.scheduleAudit = function(auditData) {
        const audit = {
            id: Date.now(),
            ...auditData,
            created: new Date().toISOString(),
            status: 'planned'
        };
        
        // Guardar auditoría
        const audits = JSON.parse(localStorage.getItem('auditorApp_audits') || '[]');
        audits.push(audit);
        localStorage.setItem('auditorApp_audits', JSON.stringify(audits));
        
        // Programar recordatorio
        setReminder({
            type: 'audit',
            date: auditData.date,
            message: `Auditoría programada: ${auditData.title}`,
            relatedId: audit.id
        });
        
        return audit;
    };
    
    // Mostrar auditorías en la interfaz
    window.displayAudits = function() {
        const audits = JSON.parse(localStorage.getItem('auditorApp_audits') || '[]');
        const auditList = document.getElementById('audits-list');
        
        if (audits.length === 0) {
            auditList.innerHTML = '<p class="empty-state">No hay auditorías programadas.</p>';
            return;
        }
        
        auditList.innerHTML = '';
        audits.forEach(audit => {
            const auditElement = document.createElement('div');
            auditElement.className = 'audit-item';
            auditElement.innerHTML = `
                <h3>${audit.title}</h3>
                <p>Fecha: ${new Date(audit.date).toLocaleDateString()}</p>
                <p>Área: ${audit.area}</p>
                <p>Estado: ${audit.status}</p>
                <button class="btn btn-secondary view-audit" data-id="${audit.id}">Ver Detalles</button>
            `;
            
            auditList.appendChild(auditElement);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-audit').forEach(btn => {
            btn.addEventListener('click', function() {
                const auditId = this.getAttribute('data-id');
                viewAudit(auditId);
            });
        });
    };
    
    // Ver detalles de auditoría
    function viewAudit(auditId) {
        // Implementar lógica para ver detalles de auditoría
        showNotification(`Viendo auditoría ${auditId}`, 'info');
    }
}

// ==============================================
// SEGUIMIENTO DE HALLAZGOS Y NO CONFORMIDADES
// ==============================================
function initFindingsTracking() {
    // Sistema para registrar no conformidades
    window.recordFinding = function(findingData) {
        const finding = {
            id: Date.now(),
            ...findingData,
            recorded: new Date().toISOString(),
            status: 'open'
        };
        
        // Guardar hallazgo
        const findings = JSON.parse(localStorage.getItem('auditorApp_findings') || '[]');
        findings.push(finding);
        localStorage.setItem('auditorApp_findings', JSON.stringify(findings));
        
        // Programar recordatorio para seguimiento
        if (findingData.dueDate) {
            setReminder({
                type: 'finding',
                date: findingData.dueDate,
                message: `Vencimiento de acción correctiva: ${findingData.description}`,
                relatedId: finding.id
            });
        }
        
        return finding;
    };
    
    // Mostrar hallazgos en la interfaz
    window.displayFindings = function() {
        const findings = JSON.parse(localStorage.getItem('auditorApp_findings') || '[]');
        const findingsList = document.getElementById('findings-list');
        
        if (findings.length === 0) {
            findingsList.innerHTML = '<p class="empty-state">No hay hallazgos registrados.</p>';
            return;
        }
        
        findingsList.innerHTML = '';
        findings.forEach(finding => {
            const findingElement = document.createElement('div');
            findingElement.className = 'finding-item';
            findingElement.innerHTML = `
                <h3>${finding.type.toUpperCase()}: ${finding.description.substring(0, 50)}...</h3>
                <p>Área: ${finding.area}</p>
                <p>Gravedad: ${finding.severity}</p>
                <p>Estado: ${finding.status}</p>
                <p>Registrado: ${new Date(finding.recorded).toLocaleDateString()}</p>
                <button class="btn btn-secondary view-finding" data-id="${finding.id}">Ver Detalles</button>
            `;
            
            findingsList.appendChild(findingElement);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-finding').forEach(btn => {
            btn.addEventListener('click', function() {
                const findingId = this.getAttribute('data-id');
                viewFinding(findingId);
            });
        });
    };
    
    // Ver detalles de hallazgo
    function viewFinding(findingId) {
        // Implementar lógica para ver detalles de hallazgo
        showNotification(`Viendo hallazgo ${findingId}`, 'info');
    }
}

// ==============================================
// SISTEMA DE ALERTAS Y RECORDATORIOS
// ==============================================
function initNotifications() {
    // Recordatorios de auditorías programadas
    window.setReminder = function(reminderData) {
        const reminder = {
            id: Date.now(),
            ...reminderData,
            created: new Date().toISOString(),
            notified: false
        };
        
        // Guardar recordatorio
        const reminders = JSON.parse(localStorage.getItem('auditorApp_reminders') || '[]');
        reminders.push(reminder);
        localStorage.setItem('auditorApp_reminders', JSON.stringify(reminders));
        
        return reminder;
    };
    
    // Verificar recordatorios pendientes
    function checkReminders() {
        const reminders = JSON.parse(localStorage.getItem('auditorApp_reminders') || '[]');
        const now = new Date();
        
        reminders.forEach(reminder => {
            if (!reminder.notified && new Date(reminder.date) <= now) {
                // Mostrar notificación
                showNotification(reminder.message, 'warning');
                
                // Marcar como notificado
                reminder.notified = true;
            }
        });
        
        // Guardar cambios
        localStorage.setItem('auditorApp_reminders', JSON.stringify(reminders));
    }
    
    // Verificar recordatorios cada minuto
    setInterval(checkReminders, 60000);
}

// ==============================================
// ANÁLISIS DE DATOS Y REPORTES ESTADÍSTICOS
// ==============================================
function initAnalytics() {
    // Gráficos de tendencias de no conformidades
    window.generateReport = function(reportType, parameters) {
        let reportData = {};
        
        switch(reportType) {
            case 'nc-trend':
                reportData = generateNCTrendReport(parameters);
                break;
            case 'corrective-effectiveness':
                reportData = generateCorrectiveEffectivenessReport(parameters);
                break;
            case 'area-compliance':
                reportData = generateAreaComplianceReport(parameters);
                break;
            case 'period-comparison':
                reportData = generatePeriodComparisonReport(parameters);
                break;
            default:
                showNotification('Tipo de reporte no válido', 'error');
                return null;
        }
        
        return reportData;
    };
    
    // Generar reporte de tendencia de NCs
    function generateNCTrendReport(parameters) {
        const findings = JSON.parse(localStorage.getItem('auditorApp_findings') || '[]');
        const { period } = parameters;
        
        // Filtrar hallazgos por periodo
        const filteredFindings = findings.filter(finding => {
            const findingDate = new Date(finding.recorded);
            const now = new Date();
            
            if (period === 'month') {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return findingDate >= oneMonthAgo;
            } else if (period === 'quarter') {
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                return findingDate >= threeMonthsAgo;
            } else if (period === 'year') {
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                return findingDate >= oneYearAgo;
            }
            
            return true;
        });
        
        // Agrupar por mes y tipo
        const trendData = {};
        filteredFindings.forEach(finding => {
            const date = new Date(finding.recorded);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            
            if (!trendData[monthYear]) {
                trendData[monthYear] = {
                    total: 0,
                    nc: 0,
                    observation: 0,
                    opportunity: 0
                };
            }
            
            trendData[monthYear].total++;
            trendData[monthYear][finding.type]++;
        });
        
        return trendData;
    }
    
    // Generar reporte de efectividad de acciones correctivas
    function generateCorrectiveEffectivenessReport(parameters) {
        // Implementar lógica para reporte de efectividad
        return { message: "Reporte de efectividad de acciones correctivas" };
    }
    
    // Generar reporte de cumplimiento por área
    function generateAreaComplianceReport(parameters) {
        // Implementar lógica para reporte por área
        return { message: "Reporte de cumplimiento por área" };
    }
    
    // Generar reporte comparativo entre periodos
    function generatePeriodComparisonReport(parameters) {
        // Implementar lógica para reporte comparativo
        return { message: "Reporte comparativo entre periodos" };
    }
}

// ==============================================
// GESTIÓN DE DOCUMENTACIÓN
// ==============================================
function initDocumentManagement() {
    // Control de documentos y registros
    window.manageDocument = function(documentData) {
        const document = {
            id: Date.now(),
            ...documentData,
            created: new Date().toISOString(),
            version: '1.0',
            status: 'draft'
        };
        
        // Guardar documento
        const documents = JSON.parse(localStorage.getItem('auditorApp_documents') || '[]');
        documents.push(document);
        localStorage.setItem('auditorApp_documents', JSON.stringify(documents));
        
        return document;
    };
    
    // Mostrar documentos en la interfaz
    window.displayDocuments = function() {
        const documents = JSON.parse(localStorage.getItem('auditorApp_documents') || '[]');
        const documentsList = document.getElementById('documents-list');
        
        if (documents.length === 0) {
            documentsList.innerHTML = '<p class="empty-state">No hay documentos registrados.</p>';
            return;
        }
        
        documentsList.innerHTML = '';
        documents.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'document-item';
            docElement.innerHTML = `
                <h3>${doc.title}</h3>
                <p>Código: ${doc.code}</p>
                <p>Versión: ${doc.version}</p>
                <p>Estado: ${doc.status}</p>
                <p>Creación: ${new Date(doc.created).toLocaleDateString()}</p>
                <button class="btn btn-secondary view-document" data-id="${doc.id}">Ver Detalles</button>
            `;
            
            documentsList.appendChild(docElement);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-document').forEach(btn => {
            btn.addEventListener('click', function() {
                const docId = this.getAttribute('data-id');
                viewDocument(docId);
            });
        });
    };
    
    // Ver detalles de documento
    function viewDocument(docId) {
        // Implementar lógica para ver detalles de documento
        showNotification(`Viendo documento ${docId}`, 'info');
    }
}

// ==============================================
// MÓDULO DE CAPACITACIÓN
// ==============================================
function initTrainingModule() {
    // Registro de competencias del personal
    window.planTraining = function(trainingData) {
        const training = {
            id: Date.now(),
            ...trainingData,
            created: new Date().toISOString(),
            status: 'planned'
        };
        
        // Guardar capacitación
        const trainings = JSON.parse(localStorage.getItem('auditorApp_trainings') || '[]');
        trainings.push(training);
        localStorage.setItem('auditorApp_trainings', JSON.stringify(trainings));
        
        // Programar recordatorio
        if (trainingData.date) {
            setReminder({
                type: 'training',
                date: trainingData.date,
                message: `Capacitación programada: ${trainingData.title}`,
                relatedId: training.id
            });
        }
        
        return training;
    };
    
    // Mostrar capacitaciones en la interfaz
    window.displayTraining = function() {
        const trainings = JSON.parse(localStorage.getItem('auditorApp_trainings') || '[]');
        const trainingList = document.getElementById('training-list');
        
        if (trainings.length === 0) {
            trainingList.innerHTML = '<p class="empty-state">No hay capacitaciones programadas.</p>';
            return;
        }
        
        trainingList.innerHTML = '';
        trainings.forEach(training => {
            const trainingElement = document.createElement('div');
            trainingElement.className = 'training-item';
            trainingElement.innerHTML = `
                <h3>${training.title}</h3>
                <p>Fecha: ${new Date(training.date).toLocaleDateString()}</p>
                <p>Participantes: ${training.participants}</p>
                <p>Estado: ${training.status}</p>
                <button class="btn btn-secondary view-training" data-id="${training.id}">Ver Detalles</button>
            `;
            
            trainingList.appendChild(trainingElement);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.view-training').forEach(btn => {
            btn.addEventListener('click', function() {
                const trainingId = this.getAttribute('data-id');
                viewTraining(trainingId);
            });
        });
    };
    
    // Ver detalles de capacitación
    function viewTraining(trainingId) {
        // Implementar lógica para ver detalles de capacitación
        showNotification(`Viendo capacitación ${trainingId}`, 'info');
    }
}

// ==============================================
// INTEGRACIÓN CON APIS DE NORMAS
// ==============================================
function initNormativeAPI() {
    // Conexión con bases de datos de normas
    window.updateNorms = function() {
        // Simular actualización de normas (en una app real, conectaría con APIs)
        showNotification('Buscando actualizaciones de normas...', 'info');
        
        setTimeout(() => {
            showNotification('Todas las normas están actualizadas', 'success');
        }, 2000);
    };
}

// ==============================================
// MODO OFFLINE Y SINCRONIZACIÓN
// ==============================================
function initOfflineCapabilities() {
    // Funcionamiento sin conexión
    window.enableOfflineMode = function() {
        // Verificar si el navegador soporta service workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration);
                    showNotification('Modo offline activado', 'success');
                })
                .catch(error => {
                    console.log('Error al registrar Service Worker:', error);
                    showNotification('Error al activar modo offline', 'error');
                });
        } else {
            showNotification('Tu navegador no soporta modo offline', 'warning');
        }
    };
    
    // Detectar cambios en la conexión
    window.addEventListener('online', function() {
        showNotification('Conexión restablecida. Sincronizando datos...', 'info');
        syncData();
    });
    
    window.addEventListener('offline', function() {
        showNotification('Modo offline activado. Los cambios se sincronizarán cuando recuperes la conexión.', 'warning');
    });
    
    // Sincronizar datos cuando hay conexión
    function syncData() {
        // Implementar lógica de sincronización
        setTimeout(() => {
            showNotification('Datos sincronizados correctamente', 'success');
        }, 1500);
    }
}

// ==============================================
// PANEL DE CONTROL PERSONALIZABLE
// ==============================================
function initCustomDashboard() {
    // Widgets arrastrables
    window.customizeDashboard = function(widgets) {
        const dashboard = document.getElementById('dashboard-section');
        
        // Limpiar dashboard
        dashboard.innerHTML = '';
        
        // Agregar widgets seleccionados
        widgets.forEach(widget => {
            const widgetElement = document.createElement('div');
            widgetElement.className = 'dashboard-widget';
            widgetElement.id = `widget-${widget}`;
            widgetElement.innerHTML = `<h3>${widget.title}</h3><div class="widget-content"></div>`;
            
            dashboard.appendChild(widgetElement);
        });
        
        // Guardar configuración
        localStorage.setItem('auditorApp_dashboardConfig', JSON.stringify(widgets));
        
        showNotification('Dashboard personalizado guardado', 'success');
    };
    
    // Cargar configuración del dashboard
    function loadDashboardConfig() {
        const config = JSON.parse(localStorage.getItem('auditorApp_dashboardConfig') || 'null');
        
        if (config) {
            customizeDashboard(config);
        }
    }
    
    // Inicializar dashboard
    loadDashboardConfig();
}

// ==============================================
// FUNCIONES UTilitarias
// ==============================================

// Cargar datos guardados
function loadSavedData() {
    updateStats();
    updateRecentNotes();
}

// Actualizar estadísticas
function updateStats() {
    const notes = JSON.parse(localStorage.getItem('auditorApp_notes') || '[]');
    const generatedPDFs = parseInt(localStorage.getItem('auditorApp_generatedPDFs') || '0');
    const norms = JSON.parse(localStorage.getItem('auditorApp_norms') || '[]');
    const findings = JSON.parse(localStorage.getItem('auditorApp_findings') || '[]');
    const audits = JSON.parse(localStorage.getItem('auditorApp_audits') || '[]');
    
    document.getElementById('total-notes').textContent = notes.length;
    document.getElementById('total-pdfs').textContent = generatedPDFs;
    document.getElementById('total-norms').textContent = norms.length + 1; // +1 por ISO 9001:2015
    document.getElementById('total-findings').textContent = findings.length;
    document.getElementById('total-audits').textContent = audits.length;
}

// Actualizar dashboard
function updateDashboard() {
    updateStats();
    updateRecentNotes();
    
    // Aquí se agregaría más lógica para actualizar widgets del dashboard
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 15px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    // Colores según el tipo
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Inicializar la aplicación cuando se carga la página
window.onload = initApp;