const USER_KEY = "assignmentUser";
const COURSE_KEY = "selectedCourse";
const THEME_KEY = "themePreference";
const SUBMISSIONS_KEY = "assignmentSubmissions";
const SUBMIT_TARGET_KEY = "submitTarget";
const SESSION_KEY = "assignmentSession";
const PROTECTED_PAGES = ["dashboard.html", "assignments.html", "submit.html"];

const ASSIGNMENTS_BY_COURSE = {
    MDT111: [
        {
            id: "mdt111-a1",
            title: "Media Reflection Essay",
            desc: "Write a reflection on how digital media influences everyday life.",
            due: "18 Nov 2025 · 21:00",
            weight: "15%",
            statusType: "warn",
            closed: false
        },
        {
            id: "mdt111-a2",
            title: "Media Timeline Poster",
            desc: "Design a one-page timeline of media evolution from analog to digital.",
            due: "25 Nov 2025 · 23:59",
            weight: "25%",
            statusType: "good",
            closed: false
        },
        {
            id: "mdt111-a3",
            title: "Group Presentation",
            desc: "Prepare a 10-minute presentation on a media trend of your choice.",
            due: "1 Dec 2025 · 10:00",
            weight: "30%",
            statusType: "warn",
            closed: false
        }
    ],
    MDT112: [
        {
            id: "mdt112-a1",
            title: "HTML & CSS Landing Page",
            desc: "Build a responsive landing page using semantic HTML and modern CSS.",
            due: "20 Nov 2025 · 23:59",
            weight: "20%",
            statusType: "warn",
            closed: false
        },
        {
            id: "mdt112-a2",
            title: "Accessibility Audit",
            desc: "Evaluate an existing website and suggest improvements based on WCAG.",
            due: "22 Nov 2025 · 18:00",
            weight: "15%",
            statusType: "warn",
            closed: false
        },
        {
            id: "mdt112-a3",
            title: "Flexbox & Grid Layout",
            desc: "Create a dashboard layout using CSS Grid and Flexbox utilities.",
            due: "10 Nov 2025 · 16:00",
            weight: "25%",
            statusType: "bad",
            closed: true
        }
    ],
    MUX201: [
        {
            id: "mux201-a1",
            title: "User Interview Report",
            desc: "Summarise findings from at least three user interviews.",
            due: "19 Nov 2025 · 20:00",
            weight: "20%",
            statusType: "warn",
            closed: false
        },
        {
            id: "mux201-a2",
            title: "Persona & Journey Map",
            desc: "Create two personas and a simple user journey map.",
            due: "24 Nov 2025 · 23:00",
            weight: "25%",
            statusType: "good",
            closed: false
        },
        {
            id: "mux201-a3",
            title: "Lo-fi Prototype",
            desc: "Sketch low-fidelity wireframes for a mobile app concept.",
            due: "2 Dec 2025 · 23:59",
            weight: "25%",
            statusType: "warn",
            closed: false
        }
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    setupDarkMode();
    guardProtectedPages();
    initAuthPage();
    initDashboardPage();
    initAssignmentsPage();
    initSubmitPage();
    initLogout();
});

function safeGetParsed(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function getSubmissionMap() {
    const map = safeGetParsed(SUBMISSIONS_KEY);
    return map && typeof map === "object" ? map : {};
}

function saveSubmissionMap(map) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(map));
}

function isSubmitted(courseCode, assignmentId) {
    const map = getSubmissionMap();
    return !!(map[courseCode] && map[courseCode][assignmentId]);
}

function markSubmitted(courseCode, assignmentId) {
    const map = getSubmissionMap();
    if (!map[courseCode]) map[courseCode] = {};
    map[courseCode][assignmentId] = true;
    saveSubmissionMap(map);
}

function setupDarkMode() {
    const toggle = document.querySelector(".mode-toggle");
    if (!toggle) return;

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    toggle.textContent = document.body.classList.contains("dark") ? "◐" : "◑";

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        toggle.textContent = isDark ? "◐" : "◑";
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    });
}

function isLoggedIn() {
    return !!localStorage.getItem(SESSION_KEY);
}

function guardProtectedPages() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    if (PROTECTED_PAGES.includes(current) && !isLoggedIn()) {
        window.location.href = "index.html";
    }
}

function initLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(COURSE_KEY);
        localStorage.removeItem(SUBMISSIONS_KEY);
        localStorage.removeItem(SUBMIT_TARGET_KEY);
        window.location.href = "index.html";
    });
}

function initAuthPage() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    if (!loginForm || !registerForm) return;

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");
    const goRegisterLink = document.getElementById("goRegisterLink");
    const goLoginLink = document.getElementById("goLoginLink");

    function showLogin() {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginTab.setAttribute("aria-selected", "true");
        registerTab.setAttribute("aria-selected", "false");
    }

    function showRegister() {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
        loginTab.classList.remove("active");
        registerTab.classList.add("active");
        loginTab.setAttribute("aria-selected", "false");
        registerTab.setAttribute("aria-selected", "true");
    }

    loginTab.addEventListener("click", showLogin);
    registerTab.addEventListener("click", showRegister);
    goRegisterLink.addEventListener("click", showRegister);
    goLoginLink.addEventListener("click", showLogin);

    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const input = document.getElementById(targetId);
            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                btn.textContent = "●";
            } else {
                input.type = "password";
                btn.textContent = "○";
            }
        });
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirm = document.getElementById("regConfirm").value;

        if (password !== confirm) {
            alert("Passwords do not match.");
            return;
        }

        const userData = { name, email, password };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        alert("Account created successfully! You can now login.");
        registerForm.reset();
        showLogin();
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const user = safeGetParsed(USER_KEY);
        if (!user) {
            alert("No account found. Please register first.");
            showRegister();
            return;
        }

        if (email === user.email && password === user.password) {
            localStorage.setItem(SESSION_KEY, "true");
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Email or password is incorrect.");
        }
    });
}

function initDashboardPage() {
    const wrapper = document.querySelector(".page-wrapper");
    const current = window.location.pathname.split("/").pop() || "index.html";
    if (!wrapper || current !== "dashboard.html") return;

    const user = safeGetParsed(USER_KEY);
    if (user) {
        const greeting = document.getElementById("userGreeting");
        const avatar = document.getElementById("userAvatar");

        if (greeting) greeting.textContent = `Hi, ${user.name || "Student"}`;
        if (avatar && user.name) avatar.textContent = user.name.charAt(0).toUpperCase();
    }

    const courseCards = document.querySelectorAll(".subject-card[data-course-code]");
    courseCards.forEach(card => {
        card.addEventListener("click", () => {
            const code = card.getAttribute("data-course-code");
            const name = card.querySelector(".subject-name")?.textContent || "";
            const data = { code, name };
            localStorage.setItem(COURSE_KEY, JSON.stringify(data));
        });
    });
}

function getAssignmentsForCourse(code) {
    if (ASSIGNMENTS_BY_COURSE[code]) {
        return ASSIGNMENTS_BY_COURSE[code];
    }
    return ASSIGNMENTS_BY_COURSE["MDT112"];
}

function getBaseStatus(item) {
    let statusClass = "status-warn";
    let statusText = "Not submitted";

    if (item.statusType === "good") {
        statusClass = "status-good";
        statusText = "On time";
    } else if (item.statusType === "bad") {
        statusClass = "status-bad";
        statusText = "Overdue";
    } else if (item.statusType === "warn") {
        statusClass = "status-warn";
        statusText = "Due soon";
    }

    return { statusClass, statusText };
}

function initAssignmentsPage() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    if (current !== "assignments.html") return;

    const courseData = safeGetParsed(COURSE_KEY);
    let courseCode = "MDT112";
    let courseName = "Web Development Fundamentals";

    if (courseData) {
        courseCode = courseData.code || courseCode;
        courseName = courseData.name || courseName;
    }

    const breadcrumb = document.getElementById("courseBreadcrumb");
    const title = document.getElementById("courseTitle");

    if (breadcrumb) breadcrumb.textContent = `Courses / ${courseCode}`;
    if (title) title.textContent = courseName;

    const assignmentList = document.getElementById("assignmentList");
    if (!assignmentList) return;

    assignmentList.innerHTML = "";

    const assignments = getAssignmentsForCourse(courseCode);
    const submissionMap = getSubmissionMap();
    const courseSubmissions = submissionMap[courseCode] || {};

    assignments.forEach((item) => {
        const article = document.createElement("article");
        article.className = "assignment-card";
        article.dataset.assignmentId = item.id;

        const mainDiv = document.createElement("div");
        mainDiv.className = "assignment-main";

        const h2 = document.createElement("h2");
        h2.className = "assignment-title";
        h2.textContent = item.title;

        const pDesc = document.createElement("p");
        pDesc.className = "assignment-desc";
        pDesc.textContent = item.desc;

        const metaDiv = document.createElement("div");
        metaDiv.className = "assignment-meta";

        const spanDue = document.createElement("span");
        spanDue.className = "meta-item";
        spanDue.textContent = `Due: ${item.due}`;

        const spanWeight = document.createElement("span");
        spanWeight.className = "meta-item";
        spanWeight.textContent = `Weight: ${item.weight}`;

        metaDiv.appendChild(spanDue);
        metaDiv.appendChild(spanWeight);

        mainDiv.appendChild(h2);
        mainDiv.appendChild(pDesc);
        mainDiv.appendChild(metaDiv);

        const sideDiv = document.createElement("div");
        sideDiv.className = "assignment-side";

        const statusSpan = document.createElement("span");
        statusSpan.classList.add("status-badge");
        statusSpan.dataset.assignmentStatus = "true";

        let { statusClass, statusText } = getBaseStatus(item);

        if (courseSubmissions[item.id]) {
            statusClass = "status-good";
            statusText = "Submitted";
        }

        statusSpan.classList.add(statusClass);
        statusSpan.textContent = statusText;

        const btn = document.createElement("button");

        if (item.closed) {
            btn.className = "btn ghost";
            btn.disabled = true;
            btn.textContent = "Closed";
        } else {
            btn.className = "btn secondary";
            btn.textContent = "Submit";
            btn.dataset.goSubmit = "true";
            btn.dataset.assignmentId = item.id;
        }

        sideDiv.appendChild(statusSpan);
        sideDiv.appendChild(btn);

        article.appendChild(mainDiv);
        article.appendChild(sideDiv);

        assignmentList.appendChild(article);
    });

    const backButtons = document.querySelectorAll(".back-btn[data-go]");
    backButtons.forEach(btn => {
        const target = btn.getAttribute("data-go");
        btn.addEventListener("click", () => {
            if (target) window.location.href = target;
        });
    });

    const submitButtons = document.querySelectorAll("[data-go-submit]");
    submitButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const assignmentId = btn.getAttribute("data-assignment-id");
            const target = { courseCode, assignmentId };
            localStorage.setItem(SUBMIT_TARGET_KEY, JSON.stringify(target));
            window.location.href = "submit.html";
        });
    });
}

function initSubmitPage() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    if (current !== "submit.html") return;

    const target = safeGetParsed(SUBMIT_TARGET_KEY);
    const courseData = safeGetParsed(COURSE_KEY);

    let courseCode = "MDT112";
    let courseName = "Web Development Fundamentals";
    let targetAssignmentId = null;

    if (courseData) {
        courseCode = courseData.code || courseCode;
        courseName = courseData.name || courseName;
    }

    if (target && target.courseCode) {
        courseCode = target.courseCode;
        targetAssignmentId = target.assignmentId || null;
    }

    const assignments = getAssignmentsForCourse(courseCode);
    let primaryAssignment = assignments[0];

    if (targetAssignmentId) {
        const found = assignments.find(a => a.id === targetAssignmentId);
        if (found) primaryAssignment = found;
    }

    const breadcrumb = document.getElementById("submitBreadcrumb");
    const courseInput = document.getElementById("submitCourse");
    const assignmentInput = document.getElementById("submitAssignmentTitle");
    const submitTitle = document.getElementById("submitTitle");
    const submitDue = document.getElementById("submitDue");

    if (breadcrumb) breadcrumb.textContent = `${courseCode} / Assignments`;
    if (courseInput) courseInput.value = `${courseCode} – ${courseName}`;
    if (assignmentInput) assignmentInput.value = primaryAssignment.title;
    if (submitTitle) submitTitle.textContent = primaryAssignment.title;
    if (submitDue) submitDue.textContent = `Due: ${primaryAssignment.due}`;

    const backButtons = document.querySelectorAll(".back-btn[data-go]");
    backButtons.forEach(btn => {
        const targetPage = btn.getAttribute("data-go");
        btn.addEventListener("click", () => {
            if (targetPage) window.location.href = targetPage;
        });
    });

    const form = document.getElementById("submitForm");
    const fileInput = document.getElementById("fileInput");
    const statusBadge = document.getElementById("submitStatus");
    const fileNameLabel = document.getElementById("selectedFileName");

    if (!form) return;

    if (fileInput && fileNameLabel) {
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length) {
                fileNameLabel.textContent = fileInput.files[0].name;
            } else {
                fileNameLabel.textContent = "ยังไม่ได้เลือกไฟล์";
            }
        });
    }

    const alreadySubmitted = isSubmitted(courseCode, primaryAssignment.id);
    if (alreadySubmitted && statusBadge) {
        statusBadge.textContent = "Submitted";
        statusBadge.classList.remove("status-warn", "status-bad");
        statusBadge.classList.add("status-good");
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!fileInput || !fileInput.files.length) {
            alert("กรุณาแนบไฟล์ก่อนส่งงาน");
            return;
        }

        alert("อัพไฟล์เรียบร้อยแล้ว");

        if (statusBadge) {
            statusBadge.textContent = "Submitted";
            statusBadge.classList.remove("status-warn", "status-bad");
            statusBadge.classList.add("status-good");
        }

        markSubmitted(courseCode, primaryAssignment.id);
    });
}