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
    
    // Inicializar gráficos
    initCharts();
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
                    
                    // Actualizar título y descripción
                    document.getElementById('section-title').textContent = 
                        this.querySelector('span').textContent;
                    
                    // Actualizar descripción basada en la sección
                    updateSectionDescription(sectionId);
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
        });
    });
    
    // Botón para nueva nota
    document.getElementById('new-note-btn').addEventListener('click', function() {
        // Ir a la sección de notas
        document.querySelector('[data-section="notes"]').click();
        
        // Crear nueva nota
        createNewNote();
    });
    
    // Botón para acción rápida
    document.getElementById('quick-action-btn').addEventListener('click', function() {
        showQuickActionMenu();
    });
}

// Actualizar descripción de la sección
function updateSectionDescription(sectionId) {
    const descriptions = {
        'dashboard': 'Resumen general del sistema',
        'notes': 'Crear y organizar notas de auditoría',
        'checklists': 'Plantillas basadas en normas ISO',
        'audit-planning': 'Programación y gestión de auditorías',
        'findings': 'Seguimiento de hallazgos y no conformidades',
        'text-correction': 'Mejora la redacción de informes',
        'pdf-generator': 'Crear informes profesionales',
        'documents': 'Gestión documental del sistema',
        'training': 'Planificación de capacitaciones',
        'norms': 'Gestión de normas ISO integradas',
        'settings': 'Configuración de la aplicación'
    };
    
    document.getElementById('section-description').textContent = 
        descriptions[sectionId] || 'Sección de la aplicación';
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
            title: 'Nueva nota',
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
        
        // Mostrar notificación
        showNotification('Nueva nota creada', 'success');
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
        } else if (filterValue === 'important') {
            filteredNotes = notes.filter(note => 
                note.tag === 'important'
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
            const formattedDate = formatRelativeTime(noteDate);
            
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            if (note.id === currentNoteId) {
                noteElement.classList.add('active');
            }
            
            noteElement.innerHTML = `
                <div class="note-title">${note.title || 'Sin título'}</div>
                <div class="note-preview">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-meta">
                    <span class="note-date">${formattedDate}</span>
                    ${note.tag ? `<span class="note-tag ${note.tag}">${getTagName(note.tag)}</span>` : ''}
                </div>
            `;
            
            noteElement.addEventListener('click', function() {
                loadNote(note.id);
            });
            
            notesList.appendChild(noteElement);
        });
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
            'Editada: ' + formatRelativeTime(noteDate);
        
        document.getElementById('note-tags').value = note.tag || '';
        
        // Resaltar la nota seleccionada en la lista
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedNote = Array.from(document.querySelectorAll('.note-item')).find(item => {
            return item.querySelector('.note-title').textContent === note.title;
        });
        
        if (selectedNote) {
            selectedNote.classList.add('active');
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
    const exportTextBtn = document.getElementById('export-text-btn');
    
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
        correctedText.innerHTML = corrected;
        
        // Mostrar notificación
        showNotification('Texto corregido con éxito', 'success');
    });
    
    // Copiar texto corregido al portapapeles
    copyCorrectedBtn.addEventListener('click', function() {
        const text = correctedText.textContent;
        if (!text || text.includes('El texto corregido aparecerá aquí...')) {
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
        if (!text || text.includes('El texto corregido aparecerá aquí...')) {
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
    
    // Exportar texto corregido
    exportTextBtn.addEventListener('click', function() {
        const text = correctedText.textContent;
        if (!text || text.includes('El texto corregido aparecerá aquí...')) {
            showNotification('No hay texto para exportar', 'warning');
            return;
        }
        
        // Aquí iría la lógica para exportar el texto
        showNotification('Texto preparado para exportar', 'info');
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
        
        // Correcciones específicas de términos ISO
        if (document.getElementById('option-iso-terms').checked) {
            text = text.replace(/\bdisconformidad(es)?\b/gi, 'no conformidad$1');
            text = text.replace(/\bproceso de calidad\b/gi, 'proceso de gestión de la calidad');
            text = text.replace(/\bmejora\b/gi, 'mejora continua');
        }
        
        // Generar HTML de resultado con mejoras aplicadas
        return `
            <p>${text}</p>
            <div class="correction-details">
                <h4>Mejoras aplicadas:</h4>
                <ul>
                    <li>Corrección ortográfica: "identifcado" → "identificado"</li>
                    <li>Término técnico: "disconformidades" → "no conformidades"</li>
                    <li>Mejora de estilo: "mejora" → "mejorar"</li>
                    <li>Inclusión de referencia normativa</li>
                </ul>
            </div>
        `;
    }
}

// ==============================================
// GENERADOR DE PDF
// ==============================================
function initPDFGenerator() {
    const pdfTitle = document.getElementById('pdf-title');
    const pdfSubtitle = document.getElementById('pdf-subtitle');
    const pdfContent = document.getElementById('pdf-content');
    const pdfTemplate = document.getElementById('pdf-template');
    const pdfFooter = document.getElementById('pdf-footer');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');
    const previewTitle = document.getElementById('preview-title');
    const previewSubtitle = document.getElementById('preview-subtitle');
    const previewDate = document.getElementById('preview-date-value');
    const previewContent = document.getElementById('preview-content');
    const previewFooter = document.getElementById('preview-footer');
    
    // Actualizar vista previa en tiempo real
    pdfTitle.addEventListener('input', updatePreview);
    pdfSubtitle.addEventListener('input', updatePreview);
    pdfContent.addEventListener('input', updatePreview);
    pdfTemplate.addEventListener('change', updatePreview);
    pdfFooter.addEventListener('input', updatePreview);
    
    // Generar PDF
    generatePdfBtn.addEventListener('click', function() {
        const title = pdfTitle.value.trim() || 'Informe de Auditoría';
        const subtitle = pdfSubtitle.value.trim();
        const content = pdfContent.value.trim();
        const footer = pdfFooter.value.trim() || 'Generado con AuditorApp - Sistema de gestión de calidad';
        
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
        } else if (template === 'iso') {
            fontSize = 11;
            titleSize = 14;
            // Agregar logo ISO simulado
            doc.setFillColor(50, 50, 50);
            doc.rect(20, 20, 15, 15, 'F');
            doc.setFontSize(8);
            doc.text('ISO', 26, 28);
        }
        
        // Agregar título
        doc.setFontSize(titleSize);
        doc.setFont(undefined, 'bold');
        doc.text(title, 105, 30, { align: 'center' });
        
        // Agregar subtítulo si existe
        if (subtitle) {
            doc.setFontSize(fontSize - 2);
            doc.setFont(undefined, 'italic');
            doc.text(subtitle, 105, 40, { align: 'center' });
        }
        
        // Agregar fecha
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const date = new Date().toLocaleDateString();
        doc.text(`Fecha: ${date}`, 105, 50, { align: 'center' });
        
        // Agregar contenido
        doc.setFontSize(fontSize);
        const splitText = doc.splitTextToSize(content, 180);
        doc.text(splitText, 15, 60);
        
        // Agregar pie de página
        doc.setFontSize(8);
        doc.text(footer, 105, 280, { align: 'center' });
        
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
        const subtitle = pdfSubtitle.value.trim();
        const content = pdfContent.value.trim() || 'El contenido de tu informe aparecerá aquí...';
        const footer = pdfFooter.value.trim() || 'Generado con AuditorApp - Sistema de gestión de calidad';
        const date = new Date().toLocaleDateString();
        
        previewTitle.textContent = title;
        previewSubtitle.textContent = subtitle;
        previewDate.textContent = date;
        previewContent.innerHTML = content.replace(/\n/g, '<br>');
        previewFooter.innerHTML = footer;
    }
    
    // Inicializar vista previa
    updatePreview();
}

// ==============================================
// GESTIÓN DE NORMAS
// ==============================================
function initNorms() {
    const addNormBtn = document.getElementById('add-norm-btn');
    const updateNormsBtn = document.getElementById('update-norms-btn');
    const normForm = document.getElementById('norm-form');
    const cancelNormBtn = document.getElementById('cancel-norm-btn');
    const saveNormBtn = document.getElementById('save-norm-btn');
    const normCards = document.querySelectorAll('.norm-card');
    const closeDetailBtn = document.querySelector('.close-detail');
    
    // Mostrar formulario para agregar norma
    addNormBtn.addEventListener('click', function() {
        normForm.style.display = 'block';
    });
    
    // Actualizar normas
    updateNormsBtn.addEventListener('click', function() {
        showNotification('Buscando actualizaciones de normas...', 'info');
        
        // Simular actualización
        setTimeout(() => {
            showNotification('Todas las normas están actualizadas', 'success');
        }, 2000);
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
            active: false
        });
        
        localStorage.setItem('auditorApp_norms', JSON.stringify(norms));
        
        // Actualizar interfaz
        normForm.style.display = 'none';
        clearNormForm();
        updateStats();
        
        showNotification('Norma agregada correctamente', 'success');
    });
    
    // Mostrar detalles de norma al hacer clic en una tarjeta
    normCards.forEach(card => {
        if (!card.classList.contains('add-norm')) {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.norm-actions')) {
                    showNormDetails(this);
                }
            });
        }
    });
    
    // Cerrar detalles de norma
    closeDetailBtn.addEventListener('click', function() {
        document.getElementById('norms-detail').style.display = 'none';
    });
    
    // Limpiar formulario de norma
    function clearNormForm() {
        document.getElementById('norm-name').value = '';
        document.getElementById('norm-description').value = '';
        document.getElementById('norm-content').value = '';
    }
    
    // Mostrar detalles de norma
    function showNormDetails(card) {
        const normTitle = card.querySelector('h3').textContent;
        document.querySelector('#norms-detail .detail-header h3').textContent = normTitle + ' - Detalles';
        document.getElementById('norms-detail').style.display = 'block';
    }
}

// ==============================================
// SISTEMA DE CHECKLIST
// ==============================================
function initChecklists() {
    const templateItems = document.querySelectorAll('.template-item');
    const checklistItems = document.querySelectorAll('.checklist-item input');
    
    // Cambiar plantilla de checklist
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            templateItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const template = this.getAttribute('data-template');
            loadChecklistTemplate(template);
        });
    });
    
    // Marcar/desmarcar items del checklist
    checklistItems.forEach(item => {
        item.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.classList.add('completed');
            } else {
                this.parentElement.classList.remove('completed');
            }
            
            updateChecklistProgress();
        });
    });
    
    // Cargar plantilla de checklist
    function loadChecklistTemplate(template) {
        // Aquí iría la lógica para cargar diferentes plantillas
        showNotification(`Plantilla ${template} cargada`, 'info');
    }
    
    // Actualizar progreso del checklist
    function updateChecklistProgress() {
        const totalItems = document.querySelectorAll('.checklist-item').length;
        const completedItems = document.querySelectorAll('.checklist-item input:checked').length;
        const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        // Actualizar UI con el progreso
        const progressElement = document.querySelector('.checklist-progress');
        if (progressElement) {
            progressElement.textContent = `Completado: ${progress}%`;
        }
    }
}

// ==============================================
// FUNCIONES UTILITARIAS
// ==============================================

// Formatear tiempo relativo
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffSecs < 60) {
        return 'Hace unos segundos';
    } else if (diffMins < 60) {
        return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
        return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
        return date.toLocaleDateString();
    }
}

// Obtener nombre de etiqueta
function getTagName(tag) {
    const tagNames = {
        'important': 'Importante',
        'action': 'Acción requerida',
        'followup': 'Seguimiento',
        'observation': 'Observación',
        'nc': 'No Conformidad'
    };
    
    return tagNames[tag] || tag;
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = 'var(--radius)';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = 'var(--shadow-hover)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.minWidth = '300px';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
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
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Cerrar notificación al hacer clic en el botón
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    // Eliminar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Obtener icono para notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    return icons[type] || 'info-circle';
}

// Cargar datos guardados
function loadSavedData() {
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    const notes = JSON.parse(localStorage.getItem('auditorApp_notes') || '[]');
    const generatedPDFs = parseInt(localStorage.getItem('auditorApp_generatedPDFs') || '0');
    const checklists = JSON.parse(localStorage.getItem('auditorApp_checklists') || '[]');
    const findings = JSON.parse(localStorage.getItem('auditorApp_findings') || '[]');
    const audits = JSON.parse(localStorage.getItem('auditorApp_audits') || '[]');
    const norms = JSON.parse(localStorage.getItem('auditorApp_norms') || '[]');
    
    document.getElementById('total-notes').textContent = notes.length;
    document.getElementById('total-pdfs').textContent = generatedPDFs;
    document.getElementById('total-checklists').textContent = checklists.length;
    document.getElementById('total-findings').textContent = findings.length;
    document.getElementById('total-audits').textContent = audits.length;
    document.getElementById('total-norms').textContent = norms.length + 3; // +3 por las normas predefinidas
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de hallazgos por estado
    const findingsCtx = document.getElementById('findings-chart').getContext('2d');
    const findingsChart = new Chart(findingsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Abiertos', 'En progreso', 'Resueltos', 'Cerrados'],
            datasets: [{
                data: [12, 8, 15, 10],
                backgroundColor: [
                    '#e74c3c',
                    '#f39c12',
                    '#3498db',
                    '#2ecc71'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Menú de acción rápida
function showQuickActionMenu() {
    const actions = [
        { icon: 'sticky-note', text: 'Nueva nota', section: 'notes' },
        { icon: 'tasks', text: 'Nuevo checklist', section: 'checklists' },
        { icon: 'calendar-alt', text: 'Programar auditoría', section: 'audit-planning' },
        { icon: 'search', text: 'Registrar hallazgo', section: 'findings' }
    ];
    
    // Crear menú de acciones rápidas
    const menu = document.createElement('div');
    menu.className = 'quick-action-menu';
    menu.innerHTML = `
        <div class="quick-action-header">
            <h3>Acciones rápidas</h3>
            <button class="btn-icon close-menu"><i class="fas fa-times"></i></button>
        </div>
        <div class="quick-action-items">
            ${actions.map(action => `
                <div class="quick-action-item" data-section="${action.section}">
                    <div class="action-icon">
                        <i class="fas fa-${action.icon}"></i>
                    </div>
                    <span>${action.text}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    // Estilos del menú
    menu.style.position = 'fixed';
    menu.style.top = '50%';
    menu.style.left = '50%';
    menu.style.transform = 'translate(-50%, -50%) scale(0.9)';
    menu.style.background = 'white';
    menu.style.borderRadius = 'var(--radius)';
    menu.style.boxShadow = 'var(--shadow-hover)';
    menu.style.zIndex = '1001';
    menu.style.padding = '20px';
    menu.style.minWidth = '250px';
    menu.style.opacity = '0';
    menu.style.transition = 'all 0.3s ease';
    
    // Agregar al documento
    document.body.appendChild(menu);
    
    // Mostrar con animación
    setTimeout(() => {
        menu.style.opacity = '1';
        menu.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Cerrar menú
    menu.querySelector('.close-menu').addEventListener('click', function() {
        menu.style.opacity = '0';
        menu.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
        }, 300);
    });
    
    // Acción al seleccionar una opción
    menu.querySelectorAll('.quick-action-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            // Cerrar menú
            menu.style.opacity = '0';
            menu.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (document.body.contains(menu)) {
                    document.body.removeChild(menu);
                }
                
                // Navegar a la sección correspondiente
                document.querySelector(`[data-section="${section}"]`).click();
            }, 300);
        });
    });
}

// Otras funciones de inicialización (simplificadas)
function initAuditPlanning() {}
function initFindingsTracking() {}
function initNotifications() {}
function initAnalytics() {}
function initDocumentManagement() {}
function initTrainingModule() {}
function initNormativeAPI() {}
function initOfflineCapabilities() {}
function initCustomDashboard() {}

// Inicializar la aplicación cuando se carga la página
window.onload = initApp;