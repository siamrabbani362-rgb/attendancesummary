// ==========================================
// 50 Students Roster (CSE-2025 Section B)
// ==========================================
const INITIAL_STUDENTS = [
  // Page 1
  { id: '1', roll: '202522001', name: 'Md. Tayebur Rahman' },
  { id: '2', roll: '202522002', name: 'Md. Farhadul Karim' },
  { id: '3', roll: '202522003', name: 'Muhammad Zian Eqram' },
  { id: '4', roll: '202522004', name: 'Md. Neyamul Islam Nishir' },
  { id: '5', roll: '202522005', name: 'Mohammad Miftahul Islam' },
  { id: '6', roll: '202522006', name: 'Md. Yeaqubul Haque Jetto' },
  { id: '7', roll: '202522007', name: 'Abrar Ahmad Jihan' },
  { id: '8', roll: '202522008', name: 'Muhtasim Al Fuad' },
  { id: '9', roll: '202522009', name: 'Md. Sabbir Hasan Munna' },
  { id: '10', roll: '202522010', name: 'Md. Shaharia Hasan Nahid' },
  { id: '11', roll: '202522011', name: 'Md. Sayeem Bokhari' },
  { id: '12', roll: '202522012', name: 'Md. Sakhawat Hossain Jeashan' },
  { id: '13', roll: '202522013', name: 'Syeda Jannatul Mawa' },
  { id: '14', roll: '202522014', name: 'Mahim Bin Nazim' },
  { id: '15', roll: '202522015', name: 'Md. Mehedi Hasan' },

  // Page 2
  { id: '16', roll: '202522016', name: 'Ratul Barua Munna' },
  { id: '17', roll: '202522017', name: 'Arafat Rahman' },
  { id: '18', roll: '202522018', name: 'Md. Emon' },
  { id: '19', roll: '202522019', name: 'Sudip Sarker' },
  { id: '20', roll: '202522020', name: 'Istiyak Mahmud Niyaj' },
  { id: '21', roll: '202522021', name: 'Sidratul Moontaha Shama' },
  { id: '22', roll: '202522022', name: 'Tasnim Tamanna' },
  { id: '23', roll: '202522023', name: 'Adnan Zaman Saami' },
  { id: '24', roll: '202522024', name: 'Nusrat Jahan Sweety' },
  { id: '25', roll: '202522025', name: 'Sujana Chowdhury Barna' },
  { id: '26', roll: '202522026', name: 'Md Abir Anwar Khan' },
  { id: '27', roll: '202522027', name: 'Nabil Sadman' },
  { id: '28', roll: '202522028', name: 'Md. Ramimu Islam Ornob' },
  { id: '29', roll: '202522029', name: 'Toufique Imrul Khaledin' },
  { id: '30', roll: '202522030', name: 'Ferdous Ibne Saif' },

  // Page 3
  { id: '31', roll: '202522031', name: 'Zarah Zahin' },
  { id: '32', roll: '202522032', name: 'Tanvir Ahmed Nishad' },
  { id: '33', roll: '202522033', name: 'Zerin Tahmin Dina' },
  { id: '34', roll: '202522034', name: 'Khandkar Omer Bin Alif' },
  { id: '35', roll: '202522035', name: 'Tashrif Hossain Rihan' },
  { id: '36', roll: '202522036', name: 'Md. Bokhtier Mahmud Sakib' },
  { id: '37', roll: '202522037', name: 'Shehab Shahriar Fardin' },
  { id: '38', roll: '202522038', name: 'Samaira Nur Raisa' },
  { id: '39', roll: '202522039', name: 'Arnab Saha' },
  { id: '40', roll: '202522040', name: 'Afroz Jahan Sneha' },
  { id: '41', roll: '202522041', name: 'Ahamed Subah Anan' },
  { id: '42', roll: '202522401', name: 'KAZI YOUSUF HASSAN' },
  { id: '43', roll: '202522402', name: 'RIFAH TAMANNA' },
  { id: '44', roll: '202522403', name: 'INHAM SAMIN PULOK' },
  { id: '45', roll: '202522404', name: 'JANNATUL FERDOUSUR RAHMAN MEEHER' },

  // Page 4
  { id: '46', roll: '202522405', name: 'S M ISHHAM IRTIZA' },
  { id: '47', roll: '202522406', name: 'ATIFAH IBNAT' },
  { id: '48', roll: '202522407', name: 'FABIHA LAMISHA RAYNA' },
  { id: '49', roll: '202522408', name: 'MIZANUR RAHMAN MILON' },
  { id: '50', roll: '202522409', name: 'MOST. MUMTARIN MOON EMU' },
];

// ==========================================
// Application State & LocalStorage Keys
// ==========================================
const STORAGE_KEY_ATTENDANCE = 'omr_attendance_records_v1';
const STORAGE_KEY_TITLE = 'omr_attendance_class_title_v1';
const STORAGE_KEY_DATE = 'omr_attendance_date_v1';

let students = INITIAL_STUDENTS;
let attendance = {};
let classTitle = 'CSE-2025 Attendance';
let attendanceDate = new Date().toISOString().split('T')[0];
let searchQuery = '';
let currentFilter = 'all'; // 'all' | 'present' | 'absent'
let currentFormat = 'roll_name'; // 'roll_name' | 'roll_only' | 'comma_rolls' | 'detailed_summary'
let copyTimeoutId = null;

// ==========================================
// Web Audio API: Click sound feedback
// ==========================================
let audioCtx = null;
function playClickSound(status) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(status === 'present' ? 587.33 : 369.99, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  } catch {
    // Audio is non-blocking
  }
}

// ==========================================
// Helpers & State Persistence
// ==========================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadState() {
  try {
    const savedAtt = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    if (savedAtt) {
      attendance = JSON.parse(savedAtt);
    } else {
      // Default: all 50 present
      const init = {};
      students.forEach((s) => {
        init[s.id] = 'present';
      });
      attendance = init;
    }

    const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
    if (savedTitle) classTitle = savedTitle;

    const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
    if (savedDate) attendanceDate = savedDate;
  } catch (e) {
    console.error('Failed to load state', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendance));
    localStorage.setItem(STORAGE_KEY_TITLE, classTitle);
    localStorage.setItem(STORAGE_KEY_DATE, attendanceDate);
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function getAbsentStudents() {
  return students.filter((s) => attendance[s.id] === 'absent');
}

// ==========================================
// Text Formatter for Absent Students
// ==========================================
function generateFormattedText(format) {
  const absentStudents = getAbsentStudents();
  const presentCount = students.length - absentStudents.length;

  if (absentStudents.length === 0) {
    return `Class: ${classTitle}\nDate: ${attendanceDate}\n\nAll ${students.length} students are PRESENT today. No absentees.`;
  }

  switch (format) {
    case 'roll_only':
      return absentStudents.map((s) => s.roll).join('\n');

    case 'comma_rolls':
      return absentStudents.map((s) => s.roll).join(', ');

    case 'detailed_summary': {
      const attendanceRate = Math.round((presentCount / students.length) * 100);
      return [
        `========================================`,
        `ATTENDANCE REPORT`,
        `========================================`,
        `Course/Class: ${classTitle}`,
        `Date:         ${attendanceDate}`,
        `Total Count:  ${students.length}`,
        `Present:      ${presentCount} (${attendanceRate}%)`,
        `Absent:       ${absentStudents.length} (${100 - attendanceRate}%)`,
        `========================================`,
        `LIST OF ABSENT STUDENTS:`,
        ...absentStudents.map((s, i) => `${i + 1}. Roll: ${s.roll} | Name: ${s.name}`),
        `========================================`,
      ].join('\n');
    }

    case 'roll_name':
    default:
      return [
        `Absent Students List (${absentStudents.length}):`,
        `Class: ${classTitle} | Date: ${attendanceDate}`,
        `----------------------------------------`,
        ...absentStudents.map((s, i) => `${i + 1}. Roll ${s.roll} - ${s.name}`),
      ].join('\n');
  }
}

// ==========================================
// UI Updates: Absent sections & Metrics
// ==========================================
function updateAbsentSections() {
  const formatted = generateFormattedText(currentFormat);
  const absentStudents = getAbsentStudents();

  // End Section textarea
  const endTextarea = document.getElementById('absent-end-textarea');
  if (endTextarea) {
    endTextarea.value = formatted;
  }

  // Modal textarea
  const modalTextarea = document.getElementById('absent-modal-textarea');
  if (modalTextarea) {
    modalTextarea.value = formatted;
  }

  // Badge updates across UI
  document.querySelectorAll('.absent-count-badge').forEach((badge) => {
    badge.textContent = String(absentStudents.length);
  });

  // Modal header text
  const modalDateInfo = document.getElementById('modal-date-info');
  if (modalDateInfo) {
    modalDateInfo.textContent = `${classTitle} • ${attendanceDate}`;
  }

  // Modal footer stats
  const modalStats = document.getElementById('modal-stats-text');
  if (modalStats) {
    modalStats.innerHTML = `<strong>${absentStudents.length}</strong> absent of ${students.length}`;
  }

  // Alerts
  const emptyAlert = document.getElementById('absent-end-empty-alert');
  if (emptyAlert) {
    if (absentStudents.length === 0) {
      emptyAlert.classList.remove('hidden');
    } else {
      emptyAlert.classList.add('hidden');
    }
  }

  const modalEmptyAlert = document.getElementById('absent-modal-empty-alert');
  if (modalEmptyAlert) {
    if (absentStudents.length === 0) {
      modalEmptyAlert.classList.remove('hidden');
    } else {
      modalEmptyAlert.classList.add('hidden');
    }
  }
}

function updateMetrics() {
  const totalCount = students.length;
  const absentStudents = getAbsentStudents();
  const absentCount = absentStudents.length;
  const presentCount = totalCount - absentCount;

  // Header badges
  const headerAbsentBadge = document.getElementById('header-absent-badge');
  if (headerAbsentBadge) headerAbsentBadge.textContent = String(absentCount);

  // Bottom telemetry bar
  const bottomPresent = document.getElementById('bottom-present-count');
  if (bottomPresent) bottomPresent.textContent = String(presentCount);

  const bottomAbsent = document.getElementById('bottom-absent-count');
  if (bottomAbsent) bottomAbsent.textContent = String(absentCount);

  const bottomPopBtn = document.getElementById('floating-pop-absent-list');
  if (bottomPopBtn) {
    bottomPopBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      <span>Export Absent (${absentCount})</span>
    `;
  }

  const toolbarPopBtn = document.getElementById('open-absent-modal-btn');
  if (toolbarPopBtn) {
    toolbarPopBtn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      <span>Pop Up Absent List</span>
      <span class="bg-blue-700 px-1.5 py-0.2 rounded-sm text-[11px] font-mono">${absentCount}</span>
    `;
  }

  // Filter button counts
  const filterAllBtn = document.getElementById('filter-all');
  if (filterAllBtn) filterAllBtn.textContent = `All (${totalCount})`;

  const filterPresentBtn = document.getElementById('filter-present');
  if (filterPresentBtn) filterPresentBtn.textContent = `Present (${presentCount})`;

  const filterAbsentBtn = document.getElementById('filter-absent');
  if (filterAbsentBtn) filterAbsentBtn.textContent = `Absent (${absentCount})`;

  updateAbsentSections();
}

function getFilteredStudents() {
  return students.filter((student) => {
    const status = attendance[student.id] || 'present';
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'present' && status === 'present') ||
      (currentFilter === 'absent' && status === 'absent');

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      student.name.toLowerCase().includes(q) ||
      student.roll.toLowerCase().includes(q)
    );
  });
}

// ==========================================
// Render Student Roster with P and A columns
// ==========================================
function renderStudents() {
  const container = document.getElementById('students-container');
  const emptyState = document.getElementById('students-empty-state');
  const listCount = document.getElementById('list-count');

  const filtered = getFilteredStudents();

  if (listCount) {
    listCount.textContent = `(${filtered.length})`;
  }

  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filtered
    .map((student, idx) => {
      const status = attendance[student.id] || 'present';
      const isPresent = status === 'present';
      const isAbsent = status === 'absent';
      const originalIndex = students.findIndex((s) => s.id === student.id);
      const serialNumber = originalIndex !== -1 ? originalIndex + 1 : idx + 1;

      return `
      <div
        id="student-card-${student.id}"
        data-id="${student.id}"
        data-student-row="true"
        role="button"
        tabindex="0"
        title="Click to toggle (${isPresent ? 'Mark Absent' : 'Mark Present'})"
        class="student-card group flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-white border rounded-lg transition-all relative overflow-hidden select-none cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 ${
          isAbsent
            ? 'border-rose-300 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50/70 shadow-2xs'
            : isPresent
            ? 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/80'
            : 'border-slate-200 hover:border-slate-300'
        }"
      >
        <!-- Student Info: Serial Number + Roll Number + Student Name -->
        <div class="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-3 flex-1 pointer-events-none">
          <span class="text-xs font-mono font-bold text-slate-400 w-6 sm:w-7 shrink-0">
            #${String(serialNumber).padStart(2, '0')}
          </span>

          <div class="flex flex-col sm:flex-row sm:items-center sm:gap-3 min-w-0">
            <span class="text-xs sm:text-sm font-mono font-bold text-slate-800 shrink-0">
              ${student.roll}
            </span>
            <span class="hidden sm:inline text-slate-300">•</span>
            <span class="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              ${escapeHtml(student.name)}
            </span>
          </div>

          <!-- Quick status pill for instant recognition -->
          <span
            class="ml-auto mr-2 text-[10px] font-semibold px-2 py-0.5 rounded border hidden md:inline-flex items-center gap-1.5 transition-all ${
              isPresent
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }"
          >
            <span class="w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
            <span>${isPresent ? 'Present' : 'Absent'}</span>
          </span>
        </div>

        <!-- Dedicated Separate Columns for P and A with generous gap -->
        <div class="flex items-center gap-6 sm:gap-10 shrink-0 pl-2 border-l border-slate-100">
          <!-- Column 1: Present (P) Bubble -->
          <div class="w-16 sm:w-20 flex justify-center">
            <button
              type="button"
              id="mcq-p-${student.id}"
              data-id="${student.id}"
              data-status="present"
              title="${isPresent ? 'Currently Present (Click to mark Absent)' : 'Click to mark Present'}"
              class="mcq-btn w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                isPresent
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-3 ring-blue-100 scale-105'
                  : 'bg-white text-slate-400 border-slate-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50'
              }"
            >
              ${
                isPresent
                  ? '<svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>'
                  : 'P'
              }
            </button>
          </div>

          <!-- Column 2: Absent (A) Bubble -->
          <div class="w-16 sm:w-20 flex justify-center">
            <button
              type="button"
              id="mcq-a-${student.id}"
              data-id="${student.id}"
              data-status="absent"
              title="${isAbsent ? 'Currently Absent (Click to mark Present)' : 'Click to mark Absent'}"
              class="mcq-btn w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all cursor-pointer border-2 ${
                isAbsent
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs ring-3 ring-rose-100 scale-105'
                  : 'bg-white text-slate-400 border-slate-300 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50/50'
              }"
            >
              ${
                isAbsent
                  ? '<svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
                  : 'A'
              }
            </button>
          </div>
        </div>
      </div>
      `;
    })
    .join('');
}

// ==========================================
// Status Mutations: Toggle upon click
// ==========================================
function toggleStudentStatus(id) {
  const current = attendance[id] || 'present';
  const newStatus = current === 'present' ? 'absent' : 'present';
  setStudentStatus(id, newStatus);
}

function setStudentStatus(id, newStatus) {
  attendance[id] = newStatus;
  playClickSound(newStatus);
  saveState();
  renderStudents();
  updateMetrics();
}

function markAllPresent() {
  students.forEach((s) => {
    attendance[s.id] = 'present';
  });
  playClickSound('present');
  saveState();
  renderStudents();
  updateMetrics();
}

function markAllAbsent() {
  students.forEach((s) => {
    attendance[s.id] = 'absent';
  });
  playClickSound('absent');
  saveState();
  renderStudents();
  updateMetrics();
}

// ==========================================
// Modal & Clipboard Operations
// ==========================================
function openAbsentModal() {
  updateAbsentSections();
  const modal = document.getElementById('absent-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }
}

function closeAbsentModal() {
  const modal = document.getElementById('absent-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

async function copyText(text, buttonElement) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  if (buttonElement) {
    const originalHTML = buttonElement.innerHTML;
    buttonElement.innerHTML = `
      <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      <span>Copied!</span>
    `;
    buttonElement.classList.add('bg-emerald-600', 'text-white');

    if (copyTimeoutId) clearTimeout(copyTimeoutId);
    copyTimeoutId = window.setTimeout(() => {
      buttonElement.innerHTML = originalHTML;
      buttonElement.classList.remove('bg-emerald-600', 'text-white');
    }, 2200);
  }
}

function downloadTxt(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// Setup All Event Listeners
// ==========================================
function setupEventListeners() {
  // Class name input
  const classNameInput = document.getElementById('class-name-input');
  if (classNameInput) {
    classNameInput.value = classTitle;
    classNameInput.addEventListener('input', (e) => {
      classTitle = e.target.value || 'CSE-2025 Attendance';
      saveState();
      updateAbsentSections();
    });
  }

  // Date picker
  const datePicker = document.getElementById('date-picker');
  if (datePicker) {
    datePicker.value = attendanceDate;
    datePicker.addEventListener('change', (e) => {
      attendanceDate = e.target.value || new Date().toISOString().split('T')[0];
      saveState();
      updateAbsentSections();
    });
  }

  // Header quick buttons
  document.getElementById('header-select-all-btn')?.addEventListener('click', markAllPresent);
  document.getElementById('header-clear-all-btn')?.addEventListener('click', markAllAbsent);
  document.getElementById('header-export-absent-btn')?.addEventListener('click', openAbsentModal);

  // Action bar buttons
  document.getElementById('mark-all-present-btn')?.addEventListener('click', markAllPresent);
  document.getElementById('mark-all-absent-btn')?.addEventListener('click', markAllAbsent);
  document.getElementById('reset-attendance-btn')?.addEventListener('click', markAllPresent);
  document.getElementById('open-absent-modal-btn')?.addEventListener('click', openAbsentModal);

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderStudents();
    });
  }

  // Clear search from empty state
  document.getElementById('clear-filter-btn')?.addEventListener('click', () => {
    searchQuery = '';
    currentFilter = 'all';
    if (searchInput) searchInput.value = '';
    updateFilterUI();
    renderStudents();
  });

  // Filter tabs
  function updateFilterUI() {
    ['all', 'present', 'absent'].forEach((f) => {
      const btn = document.getElementById(`filter-${f}`);
      if (!btn) return;
      if (currentFilter === f) {
        btn.classList.add('bg-white', 'shadow-xs');
        if (f === 'present') btn.classList.add('text-emerald-700');
        else if (f === 'absent') btn.classList.add('text-rose-700');
        else btn.classList.add('text-slate-800');
        btn.classList.remove('text-slate-600');
      } else {
        btn.classList.remove('bg-white', 'shadow-xs', 'text-emerald-700', 'text-rose-700', 'text-slate-800');
        btn.classList.add('text-slate-600');
      }
    });
  }

  document.getElementById('filter-all')?.addEventListener('click', () => {
    currentFilter = 'all';
    updateFilterUI();
    renderStudents();
  });
  document.getElementById('filter-present')?.addEventListener('click', () => {
    currentFilter = 'present';
    updateFilterUI();
    renderStudents();
  });
  document.getElementById('filter-absent')?.addEventListener('click', () => {
    currentFilter = 'absent';
    updateFilterUI();
    renderStudents();
  });

  // Student click delegation:
  // "upon clicking it will do absent and upon again clicking it'll do present"
  const studentsContainer = document.getElementById('students-container');
  if (studentsContainer) {
    studentsContainer.addEventListener('click', (e) => {
      const target = e.target;
      const card = target.closest('[data-student-row="true"]');
      if (!card) return;

      const studentId = card.getAttribute('data-id');
      if (!studentId) return;

      const mcqBtn = target.closest('.mcq-btn');
      if (mcqBtn) {
        const btnStatus = mcqBtn.getAttribute('data-status');
        const currentStatus = attendance[studentId] || 'present';

        if (btnStatus === currentStatus) {
          toggleStudentStatus(studentId);
        } else {
          setStudentStatus(studentId, btnStatus);
        }
        return;
      }

      // Click anywhere on student row:
      toggleStudentStatus(studentId);
    });

    // Keyboard support: Space or Enter toggles
    studentsContainer.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const card = e.target.closest('[data-student-row="true"]');
        if (card) {
          e.preventDefault();
          const studentId = card.getAttribute('data-id');
          if (studentId) {
            toggleStudentStatus(studentId);
          }
        }
      }
    });
  }

  // End section format buttons
  document.querySelectorAll('.end-format-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const fmt = e.currentTarget.getAttribute('data-format');
      if (fmt) {
        currentFormat = fmt;
        document.querySelectorAll('.end-format-btn').forEach((b) => {
          if (b.getAttribute('data-format') === fmt) {
            b.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            b.classList.remove('bg-slate-100', 'text-slate-700');
          } else {
            b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
            b.classList.add('bg-slate-100', 'text-slate-700');
          }
        });
        updateAbsentSections();
      }
    });
  });

  // Modal format buttons
  document.querySelectorAll('.modal-format-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const fmt = e.currentTarget.getAttribute('data-format');
      if (fmt) {
        currentFormat = fmt;
        document.querySelectorAll('.modal-format-btn').forEach((b) => {
          if (b.getAttribute('data-format') === fmt) {
            b.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
            b.classList.remove('bg-slate-100', 'text-slate-700');
          } else {
            b.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
            b.classList.add('bg-slate-100', 'text-slate-700');
          }
        });
        updateAbsentSections();
      }
    });
  });

  // Copy buttons
  document.getElementById('copy-end-btn')?.addEventListener('click', (e) => {
    const text = generateFormattedText(currentFormat);
    copyText(text, e.currentTarget);
  });

  document.getElementById('modal-copy-btn')?.addEventListener('click', (e) => {
    const text = generateFormattedText(currentFormat);
    copyText(text, e.currentTarget);
  });

  // Download buttons
  document.getElementById('download-end-btn')?.addEventListener('click', () => {
    const text = generateFormattedText(currentFormat);
    const cleanDate = attendanceDate.replace(/[^0-9]/g, '-');
    downloadTxt(`Absent-Students-${cleanDate}.txt`, text);
  });

  document.getElementById('modal-download-btn')?.addEventListener('click', () => {
    const text = generateFormattedText(currentFormat);
    const cleanDate = attendanceDate.replace(/[^0-9]/g, '-');
    downloadTxt(`Absent-Students-${cleanDate}.txt`, text);
  });

  // Modal open & close
  document.getElementById('open-modal-from-end')?.addEventListener('click', openAbsentModal);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeAbsentModal);
  document.getElementById('absent-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeAbsentModal();
    }
  });

  // Modal select-all in textarea
  document.getElementById('modal-select-all-text-btn')?.addEventListener('click', () => {
    const textarea = document.getElementById('absent-modal-textarea');
    if (textarea) {
      textarea.focus();
      textarea.select();
    }
  });

  // Bottom floating controls
  document.getElementById('floating-mark-all-present')?.addEventListener('click', markAllPresent);
  document.getElementById('floating-pop-absent-list')?.addEventListener('click', openAbsentModal);
  document.getElementById('scroll-to-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ESC key closes modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAbsentModal();
    }
  });
}

// ==========================================
// Initialization
// ==========================================
function init() {
  loadState();
  renderStudents();
  updateMetrics();
  setupEventListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
