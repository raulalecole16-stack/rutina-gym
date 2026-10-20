// Configuración de la Rutina
const ROUTINE_DATA = [
    {
        id: "day1",
        title: "Día 1: Torso",
        exercises: [
            { id: "d1_e1", name: "Press inclinado", sets: 3 },
            { id: "d1_e2", name: "Press plano", sets: 3 },
            { id: "d1_e3", name: "Dominadas", sets: 3 },
            { id: "d1_e4", name: "Laterales", sets: 3 },
            { id: "d1_e5", name: "Remo sentado", sets: 2 },
            { id: "d1_e6", name: "Press de tríceps tras nuca", sets: 3 },
            { id: "d1_e7", name: "Curl bayesian", sets: 3 }
        ]
    },
    {
        id: "day2",
        title: "Día 2: Pierna",
        exercises: [
            { id: "d2_e1", name: "Abductores", sets: 3 },
            { id: "d2_e2", name: "Femoral", sets: 2 },
            { id: "d2_e3", name: "Sentadilla péndular", sets: 3 },
            { id: "d2_e4", name: "Haka", sets: 2 },
            { id: "d2_e5", name: "Extensiones", sets: 3 },
            { id: "d2_e6", name: "Abdomen", sets: 3 }
        ]
    },
    {
        id: "day3",
        title: "Día 3: Empujes",
        exercises: [
            { id: "d3_e1", name: "Aperturas inferiores", sets: 3 },
            { id: "d3_e2", name: "Press inclinado", sets: 3 },
            { id: "d3_e3", name: "Press plano", sets: 3 },
            { id: "d3_e4", name: "Press de tríceps tras nuca", sets: 3 },
            { id: "d3_e5", name: "Extensión de tríceps unilateral", sets: 3 },
            { id: "d3_e6", name: "Laterales", sets: 3 }
        ]
    },
    {
        id: "day4",
        title: "Día 4: Tirones",
        exercises: [
            { id: "d4_e1", name: "Dominadas", sets: 3 },
            { id: "d4_e2", name: "Jalón al pecho", sets: 2 },
            { id: "d4_e3", name: "Remo en T", sets: 3 },
            { id: "d4_e4", name: "Remo sentado", sets: 3 },
            { id: "d4_e5", name: "Curl bayesian", sets: 3 },
            { id: "d4_e6", name: "Curl predicador", sets: 2 },
            { id: "d4_e7", name: "Martillo (1s)", sets: 1 }
        ]
    },
    {
        id: "day5",
        title: "Día 5: Pierna (Posterior)",
        exercises: [
            { id: "d5_e1", name: "Abductor", sets: 3 },
            { id: "d5_e2", name: "Curl femoral", sets: 3 },
            { id: "d5_e3", name: "Haka", sets: 3 },
            { id: "d5_e4", name: "Femoral unilateral", sets: 3 },
            { id: "d5_e5", name: "Gemelo", sets: 3 },
            { id: "d5_e6", name: "Abdomen", sets: 3 }
        ]
    }
];

// Estado Global
let currentMonth = new Date().getMonth(); // 0-11
let currentDayIndex = 0;
let appState = loadState();

// Elementos DOM
const monthSelect = document.getElementById('month-select');
const daysNavContainer = document.getElementById('days-nav-tabs');
const dayContentContainer = document.getElementById('day-content-container');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    monthSelect.value = currentMonth;
    renderDaysTabs();
    renderDayContent();
    updateDashboard();

    // Eventos
    monthSelect.addEventListener('change', (e) => {
        currentMonth = parseInt(e.target.value);
        renderDayContent();
        updateDashboard();
    });

    document.getElementById('btn-reset-month').addEventListener('click', resetCurrentMonth);
    document.getElementById('btn-export').addEventListener('click', exportData);
    document.getElementById('btn-import-trigger').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', importData);
});

// Cargar estado desde LocalStorage
function loadState() {
    const saved = localStorage.getItem('gym_routine_data');
    return saved ? JSON.parse(saved) : {};
}

// Guardar estado en LocalStorage
function saveState() {
    localStorage.setItem('gym_routine_data', JSON.stringify(appState));
    updateDashboard();
}

// Renderizar pestañas de días
function renderDaysTabs() {
    daysNavContainer.innerHTML = '';
    ROUTINE_DATA.forEach((day, index) => {
        const btn = document.createElement('button');
        btn.className = `day-tab-btn ${index === currentDayIndex ? 'active' : ''}`;
        btn.innerHTML = `<i data-lucide="dumbbell"></i> ${day.title}`;
        btn.addEventListener('click', () => {
            currentDayIndex = index;
            renderDaysTabs();
            renderDayContent();
        });
        daysNavContainer.appendChild(btn);
    });
    lucide.createIcons();
}

// Renderizar contenido del día activo
function renderDayContent() {
    const dayData = ROUTINE_DATA[currentDayIndex];
    
    let html = `
        <div class="day-header">
            <h2>${dayData.title}</h2>
        </div>
        <div class="exercises-list">
    `;

    dayData.exercises.forEach(exercise => {
        html += `
            <div class="exercise-card">
                <div class="exercise-header">
                    <span class="exercise-title">${exercise.name}</span>
                    <span class="exercise-info-tag">${exercise.sets} series</span>
                </div>
                <div class="sets-container">
        `;

        for (let s = 1; s <= exercise.sets; s++) {
            const setKey = `${currentMonth}_${dayData.id}_${exercise.id}_s${s}`;
            const setData = appState[setKey] || { weight: '', reps: '', done: false };

            html += `
                <div class="set-row ${setData.done ? 'completed' : ''}">
                    <span class="set-label">Serie ${s}</span>
                    <div class="input-group">
                        <input type="number" placeholder="0" value="${setData.weight}" 
                            onchange="updateSetData('${setKey}', 'weight', this.value)">
                        <span>kg</span>
                    </div>
                    <div class="input-group">
                        <input type="number" placeholder="0" value="${setData.reps}" 
                            onchange="updateSetData('${setKey}', 'reps', this.value)">
                        <span>reps</span>
                    </div>
                    <div class="set-check">
                        <input type="checkbox" class="set-checkbox" ${setData.done ? 'checked' : ''} 
                            onchange="updateSetData('${setKey}', 'done', this.checked)">
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;
    });

    html += `</div>`;
    dayContentContainer.innerHTML = html;
}

// Actualizar un campo de una serie
window.updateSetData = function(key, field, value) {
    if (!appState[key]) {
        appState[key] = { weight: '', reps: '', done: false };
    }
    appState[key][field] = value;
    saveState();

    // Si cambió el estado de "done", se vuelve a renderizar para actualizar clases CSS
    if (field === 'done') {
        renderDayContent();
    }
};

// Actualizar Métricas en el Dashboard
function updateDashboard() {
    let totalSets = 0;
    let completedSets = 0;
    let totalVolume = 0;

    ROUTINE_DATA.forEach(day => {
        day.exercises.forEach(ex => {
            for (let s = 1; s <= ex.sets; s++) {
                totalSets++;
                const key = `${currentMonth}_${day.id}_${ex.id}_s${s}`;
                const set = appState[key];
                if (set && set.done) {
                    completedSets++;
                    const w = parseFloat(set.weight) || 0;
                    const r = parseInt(set.reps) || 0;
                    totalVolume += (w * r);
                }
            }
        });
    });

    const percent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    document.getElementById('stat-progress-text').innerText = `${percent}%`;
    document.getElementById('stat-completed-sets').innerText = `${completedSets} / ${totalSets}`;
    document.getElementById('stat-total-volume').innerText = `${totalVolume.toLocaleString()} kg`;
}

// Reiniciar mes actual
function resetCurrentMonth() {
    if (confirm("¿Estás seguro de que deseas borrar los registros de este mes?")) {
        Object.keys(appState).forEach(key => {
            if (key.startsWith(`${currentMonth}_`)) {
                delete appState[key];
            }
        });
        saveState();
        renderDayContent();
    }
}

// Exportar datos a JSON
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gym_routine_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Importar datos desde JSON
function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const imported = JSON.parse(event.target.result);
            appState = imported;
            saveState();
            renderDayContent();
            alert("¡Datos importados con éxito!");
        } catch (err) {
            alert("Error al leer el archivo JSON.");
        }
    };
    reader.readAsText(file);
}