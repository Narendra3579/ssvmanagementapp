// Data storage (using localStorage for persistence between separate apps)
function getLocalStorageData(key, defaultValue) {
    const data = localStorage.getItem(key);
    try {
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return defaultValue;
    }
}

function setLocalStorageData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Data arrays - initialized from localStorage
let students = getLocalStorageData('students', []);
let classes = new Set(students.map(s => s.class)); // Derived from students
let attendanceRecords = getLocalStorageData('attendanceRecords', []);
let csrSubmissions = getLocalStorageData('csrSubmissions', []);
let events = getLocalStorageData('events', []); // Events data

// Notification count for this app
let schoolManagementUnreadCsrCount = getLocalStorageData('schoolManagementUnreadCsrCount', 0);

// Login state
let isLoggedIn = getLocalStorageData('sm_isLoggedIn', false);
let currentPage = 'register-student-section'; // Default page to show


// DOM elements (Login Page)
const loginPage = document.getElementById('login-page');
const loginUsernameInput = document.getElementById('username');
const loginPasswordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const loginMessage = document.getElementById('login-message');
const newRegistrationButton = document.getElementById('new-registration-button');
const forgotPasswordButton = document.getElementById('forgot-password-button');

// DOM elements (App Content & Navigation)
const appContent = document.getElementById('app-content');
const logoutButton = document.getElementById('logout-button');
const smBadge = document.getElementById('sm-badge');
const sidebar = document.getElementById('sidebar');

// Navigation Links
const navRegisterStudent = document.getElementById('nav-register-student');
const navAttendanceDetails = document.getElementById('nav-attendance-details');
const navNotifications = document.getElementById('nav-notifications');
const navEventDetails = document.getElementById('nav-event-details');

// Content Sections
const registerStudentSection = document.getElementById('register-student-section');
const attendanceDetailsSection = document.getElementById('attendance-details-section');
const notificationsSection = document.getElementById('notifications-section');
const eventDetailsSection = document.getElementById('event-details-section');


// Student Management Section Elements
const studentNameInput = document.getElementById('student-name');
const studentClassInput = document.getElementById('student-class');
const studentPenInput = document.getElementById('student-pen');
const addStudentButton = document.getElementById('add-student-button');
const studentsList = document.getElementById('students-list');
const noStudentsMessage = document.getElementById('no-students-message');

// Attendance Details Section Elements (View and Mark combined)
const markAttendanceClassSelect = document.getElementById('mark-attendance-class-select');
const markAttendanceDateInput = document.getElementById('mark-attendance-date');
const studentsForAttendanceDiv = document.getElementById('students-for-attendance');
const noStudentsForAttendanceMessage = document.getElementById('no-students-for-attendance');
const saveAttendanceButton = document.getElementById('save-attendance-button');
const classForAttendanceViewSelect = document.getElementById('class-for-attendance-view');
const attendanceDateSelect = document.getElementById('attendance-date-select');
const attendanceSummaryDiv = document.getElementById('attendance-summary');
const absentStudentsList = document.getElementById('absent-students-list');

// Notifications (CSRs) Section Elements
const schoolManagementCsrList = document.getElementById('school-management-csr-list');

// Event Details Section Elements
const eventFormTitle = document.getElementById('event-form-title');
const eventIdToUpdate = document.getElementById('event-id-to-update');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const eventTimeInput = document.getElementById('event-time'); // New: Event time input
const eventDescriptionTextarea = document.getElementById('event-description');
const addEventButton = document.getElementById('add-event-button');
const saveEventChangesButton = document.getElementById('save-event-changes-button'); // New: Save changes button
const cancelEventEditButton = document.getElementById('cancel-event-edit-button'); // New: Cancel edit button
const eventsList = document.getElementById('events-list');
const noEventsMessage = document.getElementById('no-events-message');


/**
 * Initializes the application.
 */
function initializeApp() {
    // Set today's date as default for attendance and event date selectors
    const today = new Date().toISOString().slice(0, 10);
    attendanceDateSelect.value = today;
    markAttendanceDateInput.value = today;
    eventDateInput.value = today; // Set default for new event date
    eventTimeInput.value = "09:00"; // Default time for new events

    // Check login status on app load
    checkLoginStatus();

    // Add event listeners for login/logout
    loginButton.addEventListener('click', handleLogin);
    logoutButton.addEventListener('click', handleLogout);

    // Add event listeners for new registration and forgot password
    newRegistrationButton.addEventListener('click', handleNewRegistration);
    forgotPasswordButton.addEventListener('click', handleForgotPassword);

    // Add event listeners for navigation
    navRegisterStudent.addEventListener('click', (e) => { e.preventDefault(); showPage('register-student-section'); });
    navAttendanceDetails.addEventListener('click', (e) => { e.preventDefault(); showPage('attendance-details-section'); });
    navNotifications.addEventListener('click', (e) => { e.preventDefault(); showPage('notifications-section'); });
    navEventDetails.addEventListener('click', (e) => { e.preventDefault(); showPage('event-details-section'); });
}

/**
 * Checks the current login status and displays the appropriate UI.
 */
function checkLoginStatus() {
    if (isLoggedIn) {
        loginPage.style.display = 'none';
        appContent.style.display = 'flex'; // Use flex for app-content to maintain layout
        initializeAppContent(); // Initialize app content specific elements
        showPage(currentPage); // Show the last active page or default
    } else {
        loginPage.style.display = 'flex';
        appContent.style.display = 'none';
    }
}

/**
 * Handles the login attempt.
 */
function handleLogin() {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    // Hardcoded credentials for demo
    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        setLocalStorageData('sm_isLoggedIn', true);
        loginMessage.classList.add('hidden'); // Hide any previous error message
        checkLoginStatus(); // Switch to app content
        alertUser('Logged in successfully!');
    } else {
        loginMessage.textContent = 'Invalid username or password.';
        loginMessage.classList.remove('hidden');
        isLoggedIn = false;
        setLocalStorageData('sm_isLoggedIn', false);
    }
}

/**
 * Handles the logout action.
 */
function handleLogout() {
    isLoggedIn = false;
    setLocalStorageData('sm_isLoggedIn', false);
    alertUser('Logged out successfully!');
    checkLoginStatus(); // Switch back to login page
    // Clear inputs on logout
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
}

/**
 * Handles the New Registration button click. (Demo placeholder)
 */
function handleNewRegistration() {
    alertUser('New Registration: In a real application, this would redirect to a registration form where new admin accounts could be created. For this demo, please use username "admin" and password "admin123".');
}

/**
 * Handles the Forgot/Reset Password button click. (Demo placeholder)
 */
function handleForgotPassword() {
    alertUser('Forgot/Reset Password: In a real application, this would initiate a password reset process (e.g., sending an email with a reset link). For this demo, please use username "admin" and password "admin123".');
}

/**
 * Shows the specified content section and updates the active navigation link.
 * @param {string} pageId - The ID of the content section to show.
 */
function showPage(pageId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    document.querySelectorAll('#sidebar nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(pageId).classList.add('active');

    // Add active class to the corresponding nav link
    document.getElementById(`nav-${pageId.replace('-section', '')}`).classList.add('active');

    currentPage = pageId; // Update current page state

    // Special handling for sections that need re-rendering
    if (pageId === 'notifications-section') {
        // Mark all CSRs as read when notifications section is viewed
        csrSubmissions.forEach(submission => submission.isRead = true);
        setLocalStorageData('csrSubmissions', csrSubmissions);
        schoolManagementUnreadCsrCount = 0;
        setLocalStorageData('schoolManagementUnreadCsrCount', 0);
        renderSchoolManagementCsrList();
        updateSmBadge();
    } else if (pageId === 'attendance-details-section') {
        // Re-render attendance forms when this section is shown
        renderMarkAttendanceForm();
        updateSchoolManagementAttendanceView();
    } else if (pageId === 'event-details-section') {
        // When navigating to events, reset form to "Add New Event"
        resetEventForm();
        renderEventsList(); // Re-render events when this section is shown
    }
}


/**
 * Initializes elements and listeners specific to the app content after login.
 */
function initializeAppContent() {
    // These might be called again when showing page, but ensures initial setup
    renderStudentsList();
    updateSchoolManagementClassDropdown();
    updateMarkAttendanceClassDropdown();
    renderSchoolManagementCsrList();
    renderEventsList(); // Initial render for events
    updateSmBadge();

    // Attach listeners that persist regardless of page changes
    addStudentButton.addEventListener('click', handleAddStudent);
    markAttendanceClassSelect.addEventListener('change', renderMarkAttendanceForm);
    markAttendanceDateInput.addEventListener('change', renderMarkAttendanceForm);
    saveAttendanceButton.addEventListener('click', saveAttendance);
    classForAttendanceViewSelect.addEventListener('change', updateSchoolManagementAttendanceView);
    attendanceDateSelect.addEventListener('change', updateSchoolManagementAttendanceView);

    // Event listeners for Add/Update Event section
    addEventButton.addEventListener('click', handleAddEvent);
    saveEventChangesButton.addEventListener('click', handleSaveEventChanges); // New
    cancelEventEditButton.addEventListener('click', resetEventForm); // New
}

/**
 * Handles adding a new student.
 */
function handleAddStudent() {
    const studentName = studentNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const studentPen = studentPenInput.value.trim();

    if (studentName && studentClass && studentPen) {
        const existingStudent = students.find(s => s.penNumber === studentPen);
        if (existingStudent) {
            alertUser(`A student with PEN Number "${studentPen}" already exists. Please use a unique PEN Number.`);
            return;
        }

        const newStudent = {
            id: Date.now(),
            name: studentName,
            class: studentClass,
            penNumber: studentPen
        };
        students.push(newStudent);
        classes.add(studentClass);
        setLocalStorageData('students', students);

        renderStudentsList();
        updateSchoolManagementClassDropdown();
        updateMarkAttendanceClassDropdown();
        studentNameInput.value = '';
        studentClassInput.value = '';
        studentPenInput.value = '';
        alertUser(`New student added: ${newStudent.name} in ${newStudent.class} (PEN: ${newStudent.penNumber})`);
    } else {
        alertUser("Please enter student name, class, and PEN number.");
    }
}

/**
 * Renders the list of students.
 */
function renderStudentsList() {
    studentsList.innerHTML = '';
    if (students.length === 0) {
        noStudentsMessage.style.display = 'block';
    } else {
        noStudentsMessage.style.display = 'none';
        students.forEach(student => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item', 'flex-col', 'sm:flex-row', 'sm:justify-between', 'sm:items-center');
            listItem.innerHTML = `
                <div class="text-left w-full sm:w-auto">
                    <span><strong>Name:</strong> ${student.name}</span><br>
                    <span><strong>Class:</strong> ${student.class}</span><br>
                    <span><strong>PEN:</strong> ${student.penNumber || 'N/A'}</span>
                </div>
                <button class="text-red-500 hover:text-red-700 font-semibold mt-2 sm:mt-0" data-id="${student.id}">Delete</button>
            `;
            studentsList.appendChild(listItem);

            listItem.querySelector('button').addEventListener('click', (event) => {
                deleteStudent(parseInt(event.target.dataset.id));
            });
        });
    }
}

/**
 * Deletes a student.
 * @param {number} studentId - The ID of the student to delete.
 */
function deleteStudent(studentId) {
    students = students.filter(student => student.id !== studentId);
    const currentClasses = new Set(students.map(s => s.class));
    classes = currentClasses;
    setLocalStorageData('students', students);

    renderStudentsList();
    updateSchoolManagementClassDropdown();
    updateMarkAttendanceClassDropdown();
    updateSchoolManagementAttendanceView();
    alertUser(`Student deleted.`);
}

/**
 * Populates the class selection dropdown for attendance viewing.
 */
function updateSchoolManagementClassDropdown() {
    classForAttendanceViewSelect.innerHTML = '<option value="">-- Select Class --</option>';
    Array.from(classes).forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        classForAttendanceViewSelect.appendChild(option);
    });
}

/**
 * Updates the attendance summary and absent students list.
 */
function updateSchoolManagementAttendanceView() {
    const selectedClass = classForAttendanceViewSelect.value;
    const selectedDate = attendanceDateSelect.value;

    attendanceSummaryDiv.innerHTML = '<p>Select a class and date to view attendance.</p>';
    absentStudentsList.innerHTML = '<li class="text-gray-500">No absent students to display for this selection.</li>';

    if (!selectedClass || !selectedDate) {
        return;
    }

    const attendanceForClassAndDate = attendanceRecords.filter(rec =>
        rec.class === selectedClass && rec.date === selectedDate
    );

    const studentsInSelectedClass = students.filter(s => s.class === selectedClass);

    let presentCount = 0;
    let absentCount = 0;
    const absentStudentsDetails = [];

    studentsInSelectedClass.forEach(student => {
        const record = attendanceForClassAndDate.find(rec => rec.studentId === student.id);
        if (record) {
            if (record.status === 'Present') {
                presentCount++;
            } else if (record.status === 'Absent') {
                absentCount++;
                absentStudentsDetails.push(student.name);
            }
        } else {
            absentCount++;
            absentStudentsDetails.push(student.name + " (Unmarked)");
        }
    });

    attendanceSummaryDiv.innerHTML = `
        <p class="font-bold text-lg mb-2">Attendance Summary for ${selectedClass} on ${selectedDate}:</p>
        <p><strong>Total Students:</strong> ${studentsInSelectedClass.length}</p>
        <p class="text-green-700"><strong>Present:</strong> ${presentCount}</p>
        <p class="text-red-700"><strong>Absent:</strong> ${absentCount}</p>
    `;

    absentStudentsList.innerHTML = '';
    if (absentStudentsDetails.length > 0) {
        absentStudentsDetails.forEach(name => {
            const li = document.createElement('li');
            li.classList.add('list-item', 'bg-red-100', 'text-red-800');
            li.textContent = name;
            absentStudentsList.appendChild(li);
        });
    } else {
        absentStudentsList.innerHTML = `<li class="text-gray-500">No absent students for ${selectedClass} on ${selectedDate}.</li>`;
    }
}

/**
 * Populates the class selection dropdown for marking attendance.
 */
function updateMarkAttendanceClassDropdown() {
    markAttendanceClassSelect.innerHTML = '<option value="">-- Select Class --</option>';
    Array.from(classes).forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        markAttendanceClassSelect.appendChild(option);
    });
}

/**
 * Renders the form to mark attendance for students.
 */
function renderMarkAttendanceForm() {
    const selectedClass = markAttendanceClassSelect.value;
    const selectedDate = markAttendanceDateInput.value;

    studentsForAttendanceDiv.innerHTML = '';
    saveAttendanceButton.classList.add('hidden');

    if (!selectedClass || !selectedDate) {
        noStudentsForAttendanceMessage.style.display = 'block';
        return;
    } else {
        noStudentsForAttendanceMessage.style.display = 'none';
    }

    const studentsInClass = students.filter(s => s.class === selectedClass);

    if (studentsInClass.length === 0) {
        studentsForAttendanceDiv.innerHTML = `<p class="text-gray-500 text-center">No students found in ${selectedClass}.</p>`;
        return;
    }

    studentsInClass.forEach(student => {
        const existingRecord = attendanceRecords.find(
            rec => rec.studentId === student.id && rec.date === selectedDate
        );
        const status = existingRecord ? existingRecord.status : 'Absent';

        const studentAttendanceRow = document.createElement('div');
        studentAttendanceRow.classList.add('list-item', 'items-center', 'flex-col', 'sm:flex-row', 'sm:justify-between', 'sm:items-center');
        studentAttendanceRow.innerHTML = `
            <span class="font-medium text-gray-800 mb-2 sm:mb-0">${student.name} (PEN: ${student.penNumber || 'N/A'})</span>
            <div class="radio-group flex items-center">
                <label class="inline-flex items-center cursor-pointer">
                    <input type="radio" name="status-${student.id}" value="Present" class="form-radio h-4 w-4 text-green-600 border-gray-300 rounded-full focus:ring-green-500" ${status === 'Present' ? 'checked' : ''}>
                    <span class="ml-2 text-gray-700">Present</span>
                </label>
                <label class="inline-flex items-center ml-4 cursor-pointer">
                    <input type="radio" name="status-${student.id}" value="Absent" class="form-radio h-4 w-4 text-red-600 border-gray-300 rounded-full focus:ring-red-500" ${status === 'Absent' ? 'checked' : ''}>
                    <span class="ml-2 text-gray-700">Absent</span>
                </label>
            </div>
        `;
        studentsForAttendanceDiv.appendChild(studentAttendanceRow);
    });

    saveAttendanceButton.classList.remove('hidden');
}

/**
 * Saves the attendance records.
 */
function saveAttendance() {
    const selectedClass = markAttendanceClassSelect.value;
    const selectedDate = markAttendanceDateInput.value;

    if (!selectedClass || !selectedDate) {
        alertUser('Please select a class and date before saving attendance.');
        return;
    }

    const studentsInClass = students.filter(s => s.class === selectedClass);
    const newAttendanceRecords = [];

    studentsInClass.forEach(student => {
        const statusElement = document.querySelector(`input[name="status-${student.id}"]:checked`);
        if (statusElement) {
            newAttendanceRecords.push({
                studentId: student.id,
                class: selectedClass,
                date: selectedDate,
                status: statusElement.value,
                timestamp: new Date().toISOString()
            });
        }
    });

    attendanceRecords = attendanceRecords.filter(rec =>
        !(rec.class === selectedClass && rec.date === selectedDate)
    );

    attendanceRecords.push(...newAttendanceRecords);
    setLocalStorageData('attendanceRecords', attendanceRecords);
    alertUser('Attendance saved successfully!');

    updateSchoolManagementAttendanceView();
}

/**
 * Renders the list of Feedback, Suggestions, and Complaints.
 */
function renderSchoolManagementCsrList() {
    schoolManagementCsrList.innerHTML = '';
    if (csrSubmissions.length === 0) {
        schoolManagementCsrList.innerHTML = '<li class="text-gray-500">No new CSRs.</li>';
    } else {
        csrSubmissions.slice().reverse().forEach(submission => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-item', 'csr-item');
            if (!submission.isRead) {
                listItem.classList.add('border-l-4', 'border-red-500');
            }
            listItem.innerHTML = `
                <div class="header-row">
                    <span class="font-bold text-base text-gray-800">${submission.type} from ${submission.studentName} (ID: ${submission.studentId})</span>
                    <span class="text-xs text-gray-500">${submission.timestamp}</span>
                </div>
                <p class="text-sm text-gray-700">${submission.message}</p>
            `;
            schoolManagementCsrList.appendChild(listItem);
        });
    }
}

/**
 * Handles adding a new event.
 */
function handleAddEvent() {
    const eventName = eventNameInput.value.trim();
    const eventDate = eventDateInput.value;
    const eventTime = eventTimeInput.value; // Get time
    const eventDescription = eventDescriptionTextarea.value.trim();

    if (eventName && eventDate && eventTime && eventDescription) {
        const newEvent = {
            id: Date.now(),
            name: eventName,
            date: eventDate,
            time: eventTime, // Store time
            description: eventDescription
        };
        events.push(newEvent);
        setLocalStorageData('events', events);

        renderEventsList();
        resetEventForm(); // Reset form after adding
        alertUser(`Event "${newEvent.name}" added successfully!`);
    } else {
        alertUser("Please fill in all event details (Name, Date, Time, Description).");
    }
}

/**
 * Opens the form to edit an existing event.
 * @param {number} eventId - The ID of the event to edit.
 */
function openEditEventForm(eventId) {
    const eventToEdit = events.find(event => event.id === eventId);
    if (!eventToEdit) {
        alertUser('Event not found.');
        return;
    }

    // Populate form fields
    eventIdToUpdate.value = eventToEdit.id;
    eventNameInput.value = eventToEdit.name;
    eventDateInput.value = eventToEdit.date;
    eventTimeInput.value = eventToEdit.time;
    eventDescriptionTextarea.value = eventToEdit.description;

    // Adjust form visibility
    eventFormTitle.textContent = 'Update Event Details';
    addEventButton.classList.add('hidden');
    saveEventChangesButton.classList.remove('hidden');
    cancelEventEditButton.classList.remove('hidden');
}

/**
 * Handles saving changes to an existing event.
 */
function handleSaveEventChanges() {
    const id = parseInt(eventIdToUpdate.value);
    const name = eventNameInput.value.trim();
    const date = eventDateInput.value;
    const time = eventTimeInput.value;
    const description = eventDescriptionTextarea.value.trim();

    if (name && date && time && description) {
        const eventIndex = events.findIndex(event => event.id === id);
        if (eventIndex !== -1) {
            events[eventIndex] = { ...events[eventIndex], name, date, time, description };
            setLocalStorageData('events', events);
            renderEventsList();
            resetEventForm(); // Reset form after saving
            alertUser(`Event "${name}" updated successfully!`);
        } else {
            alertUser('Error: Event not found for update.');
        }
    } else {
        alertUser("Please fill in all event details (Name, Date, Time, Description).");
    }
}

/**
 * Resets the event form to its default "Add New Event" state.
 */
function resetEventForm() {
    eventFormTitle.textContent = 'Add New Event';
    eventIdToUpdate.value = '';
    eventNameInput.value = '';
    eventDateInput.value = new Date().toISOString().slice(0, 10); // Reset to today
    eventTimeInput.value = "09:00"; // Reset to default time
    eventDescriptionTextarea.value = '';

    addEventButton.classList.remove('hidden');
    saveEventChangesButton.classList.add('hidden');
    cancelEventEditButton.classList.add('hidden');
}

/**
 * Renders the list of events.
 */
function renderEventsList() {
    eventsList.innerHTML = '';
    if (events.length === 0) {
        noEventsMessage.style.display = 'block';
    } else {
        noEventsMessage.style.display = 'none';
        // Sort events by date and then time, upcoming first
        const sortedEvents = events.slice().sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeA - dateTimeB;
        });

        sortedEvents.forEach(event => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item', 'flex-col', 'items-start', 'bg-blue-50', 'border-blue-200');
            listItem.innerHTML = `
                <div class="header-row w-full mb-1 flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span class="font-bold text-base text-blue-800">${event.name}</span>
                    <span class="text-sm text-blue-600">${event.date} at ${event.time}</span>
                </div>
                <p class="text-sm text-gray-700 w-full mb-2">${event.description}</p>
                <div class="flex gap-2 w-full justify-end">
                    <button class="text-blue-500 hover:text-blue-700 font-semibold" data-id="${event.id}" data-action="edit">Edit</button>
                    <button class="text-red-500 hover:text-red-700 font-semibold" data-id="${event.id}" data-action="delete">Delete</button>
                </div>
            `;
            eventsList.appendChild(listItem);

            // Add event listeners for edit and delete buttons
            listItem.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const eventId = parseInt(e.target.dataset.id);
                    const action = e.target.dataset.action;
                    if (action === 'edit') {
                        openEditEventForm(eventId);
                    } else if (action === 'delete') {
                        deleteEvent(eventId);
                    }
                });
            });
        });
    }
}

/**
 * Deletes an event.
 * @param {number} eventId - The ID of the event to delete.
 */
function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);
    setLocalStorageData('events', events);
    renderEventsList();
    alertUser('Event deleted successfully.');
    resetEventForm(); // Reset form if the deleted event was being edited
}

/**
 * Updates the School Management notification badge.
 */
function updateSmBadge() {
    if (schoolManagementUnreadCsrCount > 0) {
        smBadge.textContent = schoolManagementUnreadCsrCount;
        smBadge.classList.remove('hidden');
    } else {
        smBadge.classList.add('hidden');
    }
}

/**
 * Displays a temporary message to the user instead of alert().
 * @param {string} message - The message to display.
 */
function alertUser(message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert-message');
    alertDiv.textContent = message;
    // Prepend to main-content-area to ensure it's visible within the scrollable area
    document.getElementById('main-content-area').prepend(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Listen for changes in localStorage for real-time updates (simulated)
window.addEventListener('storage', (event) => {
    if (event.key === 'students') {
        students = getLocalStorageData('students', []);
        classes = new Set(students.map(s => s.class));
        if (isLoggedIn) {
            renderStudentsList();
            updateSchoolManagementClassDropdown();
            updateMarkAttendanceClassDropdown();
        }
    }
    if (event.key === 'attendanceRecords') {
        attendanceRecords = getLocalStorageData('attendanceRecords', []);
        if (isLoggedIn) {
            updateSchoolManagementAttendanceView();
        }
    }
    if (event.key === 'csrSubmissions') {
        const oldCsrSubmissions = getLocalStorageData('csrSubmissions', []);
        const newCsrSubmissions = JSON.parse(event.newValue);

        let currentUnread = newCsrSubmissions.filter(sub => !sub.isRead).length;

        if (JSON.stringify(oldCsrSubmissions) !== JSON.stringify(newCsrSubmissions)) {
            csrSubmissions = newCsrSubmissions;
            if (isLoggedIn && currentPage === 'notifications-section') { // Only mark read if on notifications page
                   csrSubmissions.forEach(submission => submission.isRead = true);
                   setLocalStorageData('csrSubmissions', csrSubmissions);
                   schoolManagementUnreadCsrCount = 0;
                   setLocalStorageData('schoolManagementUnreadCsrCount', 0);
                   renderSchoolManagementCsrList();
            } else {
                // If not logged in or not on notifications page, update unread count
                schoolManagementUnreadCsrCount = currentUnread;
                setLocalStorageData('schoolManagementUnreadCsrCount', schoolManagementUnreadCsrCount);
                // Only re-render if it makes sense for current view (e.g., if notifications section is open)
                if (currentPage === 'notifications-section') {
                    renderSchoolManagementCsrList();
                }
            }
            updateSmBadge();
        }
    }
    if (event.key === 'schoolManagementUnreadCsrCount') {
           schoolManagementUnreadCsrCount = parseInt(event.newValue);
           updateSmBadge();
    }
    if (event.key === 'events') { // Listen for events data changes
        events = getLocalStorageData('events', []);
        // Only re-render events if the events section is active to prevent unnecessary re-renders
        if (isLoggedIn && currentPage === 'event-details-section') {
            renderEventsList();
        }
    }
});
