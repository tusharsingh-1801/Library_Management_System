/* ================= SAFE LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {

/* ================= LOGIN SYSTEM ================= */
const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.onclick = () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("login", "true");
      loginPage.style.display = "none";
      app.style.display = "block";
    } else {
      alert("Invalid login");
    }
  };
}

if (localStorage.getItem("login") === "true") {
  if (loginPage) loginPage.style.display = "none";
  if (app) app.style.display = "block";
}

/* ================= DATA ================= */
let books = JSON.parse(localStorage.getItem("books")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let issues = JSON.parse(localStorage.getItem("issues")) || [];
let librarians = JSON.parse(localStorage.getItem("librarians")) || [];

let finePerDay = 5;

/* ================= ELEMENTS ================= */
const bookTable = document.getElementById("bookTable");
const memberTable = document.getElementById("memberTable");

const issueBook = document.getElementById("issueBook");
const issueMember = document.getElementById("issueMember");
const returnIssue = document.getElementById("returnIssue");

const totalBooks = document.getElementById("totalBooks");
const totalMembers = document.getElementById("totalMembers");
const totalIssued = document.getElementById("totalIssued");
const totalFine = document.getElementById("totalFine");

const fineDisplay = document.getElementById("fineDisplay");
const librarianList = document.getElementById("librarianList");

/* ================= SAVE ================= */
function saveData() {
  localStorage.setItem("books", JSON.stringify(books));
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("issues", JSON.stringify(issues));
  localStorage.setItem("librarians", JSON.stringify(librarians));
}

/* ================= ADD BOOK ================= */
const addBookBtn = document.getElementById("addBookBtn");
if (addBookBtn) {
  addBookBtn.onclick = () => {
    if (!bookTitle.value || !bookISBN.value) return alert("Fill all fields");

    books.push({
      id: Date.now(),
      title: bookTitle.value,
      isbn: bookISBN.value,
      price: bookPrice.value
    });

    bookTitle.value = "";
    bookISBN.value = "";
    bookPrice.value = "";

    saveData();
    renderBooks();
    updateDashboard();
    updateChart();
  };
}

/* ================= RENDER BOOK ================= */
function renderBooks() {
  if (!bookTable) return;

  bookTable.innerHTML = "";
  if (issueBook) issueBook.innerHTML = "";

  books.forEach(book => {
    bookTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
      </tr>
    `;

    if (issueBook)
      issueBook.innerHTML += `<option value="${book.id}">${book.title}</option>`;
  });
}

/* ================= ADD MEMBER ================= */
const addMemberBtn = document.getElementById("addMemberBtn");
if (addMemberBtn) {
  addMemberBtn.onclick = () => {
    if (!memberName.value) return alert("Enter name");

    members.push({
      id: Date.now(),
      name: memberName.value,
      phone: memberPhone.value,
      email: memberEmail.value
    });

    memberName.value = "";
    memberPhone.value = "";
    memberEmail.value = "";

    saveData();
    renderMembers();
    updateDashboard();
    updateChart();
  };
}

/* ================= RENDER MEMBER ================= */
function renderMembers() {
  if (!memberTable) return;

  memberTable.innerHTML = "";
  if (issueMember) issueMember.innerHTML = "";

  members.forEach(member => {
    memberTable.innerHTML += `
      <tr>
        <td>${member.name}</td>
        <td>${member.phone}</td>
      </tr>
    `;

    if (issueMember)
      issueMember.innerHTML += `<option value="${member.id}">${member.name}</option>`;
  });
}

/* ================= ISSUE ================= */
const issueBtn = document.getElementById("issueBtn");
if (issueBtn) {
  issueBtn.onclick = () => {
    if (!issueBook.value || !issueMember.value) return alert("Select both");

    issues.push({
      id: Date.now(),
      bookId: issueBook.value,
      memberId: issueMember.value,
      date: new Date()
    });

    saveData();
    renderIssues();
    updateDashboard();
    updateChart();
  };
}

/* ================= RENDER ISSUE ================= */
function renderIssues() {
  if (!returnIssue) return;

  returnIssue.innerHTML = "";

  issues.forEach(issue => {
    let book = books.find(b => b.id == issue.bookId);
    let member = members.find(m => m.id == issue.memberId);

    if (book && member) {
      returnIssue.innerHTML += `
        <option value="${issue.id}">
          ${book.title} - ${member.name}
        </option>
      `;
    }
  });
}

/* ================= RETURN ================= */
const returnBtn = document.getElementById("returnBtn");
if (returnBtn) {
  returnBtn.onclick = () => {
    let issue = issues.find(i => i.id == returnIssue.value);
    if (!issue) return;

    let days = Math.floor((new Date() - new Date(issue.date)) / (1000 * 60 * 60 * 24));
    let fine = days > 7 ? (days - 7) * finePerDay : 0;

    if (fineDisplay) fineDisplay.innerText = "₹" + fine;

    issues = issues.filter(i => i.id != issue.id);

    saveData();
    renderIssues();
    updateDashboard();
    updateChart();
  };
}

/* ================= LIBRARIAN ================= */
const addLibrarianBtn = document.getElementById("addLibrarianBtn");
if (addLibrarianBtn) {
  addLibrarianBtn.onclick = () => {
    if (!librarianName.value) return;

    librarians.push(librarianName.value);
    librarianName.value = "";

    saveData();
    renderLibrarians();
  };
}

function renderLibrarians() {
  if (!librarianList) return;

  librarianList.innerHTML = "";
  librarians.forEach(name => {
    librarianList.innerHTML += `<li>${name}</li>`;
  });
}

/* ================= DASHBOARD ================= */
function updateDashboard() {
  if (totalBooks) totalBooks.innerText = books.length;
  if (totalMembers) totalMembers.innerText = members.length;
  if (totalIssued) totalIssued.innerText = issues.length;

  let total = 0;
  issues.forEach(issue => {
    let days = Math.floor((new Date() - new Date(issue.date)) / (1000 * 60 * 60 * 24));
    if (days > 7) total += (days - 7) * finePerDay;
  });

  if (totalFine) totalFine.innerText = "₹" + total;
}

/* ================= CHART ================= */
let chart;

function updateChart() {
  const canvas = document.getElementById("myChart");
  if (!canvas) return;

  const data = [books.length, members.length, issues.length];

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
    return;
  }

  chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Books", "Members", "Issued"],
      datasets: [{
        label: "Library Stats",
        data: data
      }]
    }
  });
}

/* ================= NAVIGATION ================= */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  };
});

/* ================= DARK MODE ================= */
const toggle = document.getElementById("darkModeToggle");

if (toggle) {
  toggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggle.innerText = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      toggle.innerText = "🌙";
      localStorage.setItem("theme", "light");
    }
  };
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (toggle) toggle.innerText = "☀️";
}

/* ================= INIT ================= */
renderBooks();
renderMembers();
renderIssues();
renderLibrarians();
updateDashboard();
updateChart();

});
/* ================= SAFE LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {

/* ================= ELEMENTS ================= */
const bookTable = document.getElementById("bookTable");
const memberTable = document.getElementById("memberTable");

const issueBook = document.getElementById("issueBook");
const issueMember = document.getElementById("issueMember");
const returnIssue = document.getElementById("returnIssue");

const totalBooks = document.getElementById("totalBooks");
const totalMembers = document.getElementById("totalMembers");
const totalIssued = document.getElementById("totalIssued");

let chart;

/* ================= LOAD BOOKS ================= */
async function loadBooks() {
  bookTable.innerHTML = "";
  issueBook.innerHTML = "";

  const snapshot = await getDocs(collection(db, "books"));

  snapshot.forEach(docItem => {
    let book = docItem.data();

    bookTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>
          <button onclick="deleteBook('${docItem.id}')">❌</button>
        </td>
      </tr>
    `;

    issueBook.innerHTML += `<option>${book.title}</option>`;
  });
}

/* ================= ADD BOOK ================= */
addBookBtn.onclick = async () => {
  if (!bookTitle.value || !bookISBN.value) return alert("Fill all fields");

  await addDoc(collection(db, "books"), {
    title: bookTitle.value,
    isbn: bookISBN.value,
    price: bookPrice.value
  });

  bookTitle.value = "";
  bookISBN.value = "";
  bookPrice.value = "";

  loadBooks();
  updateChart();
};

/* ================= DELETE BOOK ================= */
window.deleteBook = async (id) => {
  await deleteDoc(doc(db, "books", id));
  loadBooks();
  updateChart();
};

/* ================= LOAD MEMBERS ================= */
async function loadMembers() {
  memberTable.innerHTML = "";
  issueMember.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  snapshot.forEach(docItem => {
    let m = docItem.data();

    memberTable.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.phone}</td>
      </tr>
    `;

    issueMember.innerHTML += `<option>${m.name}</option>`;
  });
}

/* ================= ADD MEMBER ================= */
addMemberBtn.onclick = async () => {
  if (!memberName.value) return alert("Enter name");

  await addDoc(collection(db, "members"), {
    name: memberName.value,
    phone: memberPhone.value,
    email: memberEmail.value
  });

  memberName.value = "";
  memberPhone.value = "";
  memberEmail.value = "";

  loadMembers();
  updateChart();
};

/* ================= ISSUE BOOK ================= */
issueBtn.onclick = async () => {
  if (!issueBook.value || !issueMember.value) return alert("Select both");

  await addDoc(collection(db, "issues"), {
    book: issueBook.value,
    member: issueMember.value,
    date: new Date()
  });

  alert("Book Issued ✅");

  updateChart();
};

/* ================= CHART (FIREBASE DATA) ================= */
async function updateChart() {
  const booksSnap = await getDocs(collection(db, "books"));
  const membersSnap = await getDocs(collection(db, "members"));
  const issuesSnap = await getDocs(collection(db, "issues"));

  const data = [booksSnap.size, membersSnap.size, issuesSnap.size];

  if (totalBooks) totalBooks.innerText = booksSnap.size;
  if (totalMembers) totalMembers.innerText = membersSnap.size;
  if (totalIssued) totalIssued.innerText = issuesSnap.size;

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
    return;
  }

  chart = new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: ["Books", "Members", "Issued"],
      datasets: [{
        label: "Library Stats",
        data: data
      }]
    }
  });
}

/* ================= NAVIGATION ================= */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  };
});

/* ================= DARK MODE ================= */
const toggle = document.getElementById("darkModeToggle");

if (toggle) {
  toggle.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggle.innerText = "☀️";
    } else {
      toggle.innerText = "🌙";
    }
  };
}

/* ================= INIT ================= */
loadBooks();
loadMembers();
updateChart();

});
/* ================= SAFE LOAD ================= */
document.addEventListener("DOMContentLoaded", () => {

/* ================= ELEMENTS ================= */
const bookTable = document.getElementById("bookTable");
const memberTable = document.getElementById("memberTable");

const issueBook = document.getElementById("issueBook");
const issueMember = document.getElementById("issueMember");

const totalBooks = document.getElementById("totalBooks");
const totalMembers = document.getElementById("totalMembers");
const totalIssued = document.getElementById("totalIssued");

let chart;

/* ================= SAMPLE DATA ================= */
async function addSampleMembers() {
  const members = [
    { name: "Aman Sharma", phone: "9876543210", email: "aman@gmail.com" },
    { name: "Priya Singh", phone: "9123456780", email: "priya@gmail.com" },
    { name: "Rahul Verma", phone: "9988776655", email: "rahul@gmail.com" }
  ];

  for (let m of members) {
    await addDoc(collection(db, "members"), m);
  }
}

async function addSampleIssues() {
  const issues = [
    { book: "Atomic Habits", member: "Aman Sharma", date: new Date() },
    { book: "Ikigai", member: "Priya Singh", date: new Date() }
  ];

  for (let i of issues) {
    await addDoc(collection(db, "issues"), i);
  }
}

/* ================= LOAD BOOKS ================= */
async function loadBooks() {
  bookTable.innerHTML = "";
  issueBook.innerHTML = "";

  const snapshot = await getDocs(collection(db, "books"));

  snapshot.forEach(docItem => {
    let book = docItem.data();

    bookTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>
          <button onclick="deleteBook('${docItem.id}')">❌</button>
          <button onclick="editBook('${docItem.id}')">✏️</button>
        </td>
      </tr>
    `;

    issueBook.innerHTML += `<option>${book.title}</option>`;
  });
}

/* ================= ADD BOOK ================= */
addBookBtn.onclick = async () => {
  if (!bookTitle.value || !bookISBN.value) return alert("Fill all fields");

  await addDoc(collection(db, "books"), {
    title: bookTitle.value,
    isbn: bookISBN.value,
    price: bookPrice.value
  });

  bookTitle.value = "";
  bookISBN.value = "";
  bookPrice.value = "";

  loadBooks();
  updateChart();
};

/* ================= DELETE BOOK ================= */
window.deleteBook = async (id) => {
  await deleteDoc(doc(db, "books", id));
  loadBooks();
  updateChart();
};

/* ================= EDIT BOOK ================= */
window.editBook = async (id) => {
  const newTitle = prompt("Enter new title");
  if (!newTitle) return;

  await updateDoc(doc(db, "books", id), {
    title: newTitle
  });

  loadBooks();
};

/* ================= LOAD MEMBERS ================= */
async function loadMembers() {
  memberTable.innerHTML = "";
  issueMember.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  snapshot.forEach(docItem => {
    let m = docItem.data();

    memberTable.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.phone}</td>
      </tr>
    `;

    issueMember.innerHTML += `<option>${m.name}</option>`;
  });
}

/* ================= ADD MEMBER ================= */
addMemberBtn.onclick = async () => {
  if (!memberName.value) return alert("Enter name");

  await addDoc(collection(db, "members"), {
    name: memberName.value,
    phone: memberPhone.value,
    email: memberEmail.value
  });

  memberName.value = "";
  memberPhone.value = "";
  memberEmail.value = "";

  loadMembers();
  updateChart();
};

/* ================= ISSUE BOOK ================= */
issueBtn.onclick = async () => {
  if (!issueBook.value || !issueMember.value) return alert("Select both");

  await addDoc(collection(db, "issues"), {
    book: issueBook.value,
    member: issueMember.value,
    date: new Date()
  });

  alert("Book Issued ✅");

  updateChart();
};

/* ================= CHART ================= */
async function updateChart() {
  const booksSnap = await getDocs(collection(db, "books"));
  const membersSnap = await getDocs(collection(db, "members"));
  const issuesSnap = await getDocs(collection(db, "issues"));

  const data = [booksSnap.size, membersSnap.size, issuesSnap.size];

  if (totalBooks) totalBooks.innerText = booksSnap.size;
  if (totalMembers) totalMembers.innerText = membersSnap.size;
  if (totalIssued) totalIssued.innerText = issuesSnap.size;

  if (chart) {
    chart.data.datasets[0].data = data;
    chart.update();
    return;
  }

  chart = new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: ["Books", "Members", "Issued"],
      datasets: [{
        label: "Library Stats",
        data: data
      }]
    }
  });
}

/* ================= NAVIGATION ================= */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  };
});

/* ================= DARK MODE ================= */
const toggle = document.getElementById("darkModeToggle");

if (toggle) {
  toggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggle.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
  };
}

/* ================= INIT ================= */
loadBooks();
loadMembers();
updateChart();

/* OPTIONAL: RUN ONCE ONLY */
// addSampleMembers();
// addSampleIssues();

});async function addSampleBooks() {
  const books = [
    { title: "Atomic Habits", isbn: "9780735211292", price: 499 },
    { title: "Rich Dad Poor Dad", isbn: "9781612680194", price: 399 },
    { title: "The Alchemist", isbn: "9780061122415", price: 299 },
    { title: "Think and Grow Rich", isbn: "9781585424337", price: 350 },
    { title: "Ikigai", isbn: "9780143130727", price: 450 },
    { title: "Deep Work", isbn: "9781455586691", price: 420 },
    { title: "The Power of Habit", isbn: "9780812981605", price: 380 },
    { title: "Start With Why", isbn: "9781591846444", price: 410 },
    { title: "Zero to One", isbn: "9780804139298", price: 390 },
    { title: "The 4-Hour Workweek", isbn: "9780307465351", price: 370 },
    { title: "Can't Hurt Me", isbn: "9781544512280", price: 480 },
    { title: "The Psychology of Money", isbn: "9780857197689", price: 360 },
    { title: "Sapiens", isbn: "9780062316097", price: 550 },
    { title: "Homo Deus", isbn: "9780062464316", price: 530 },
    { title: "Do Epic Shit", isbn: "9789391165481", price: 300 },
    { title: "Rework", isbn: "9780307463746", price: 340 },
    { title: "Make Your Bed", isbn: "9781455570249", price: 280 },
    { title: "The Subtle Art of Not Giving a F*ck", isbn: "9780062457714", price: 450 },
    { title: "Crushing It", isbn: "9780062674678", price: 410 },
    { title: "Eat That Frog", isbn: "9781576754227", price: 320 }
  ];

  for (let book of books) {
    await addDoc(collection(db, "books"), book);
  }

  alert("20 Sample Books Added ✅");
}
/* =========================================================
   🔥 FINAL STABILITY PATCH (ADDED - DO NOT REMOVE EXISTING CODE)
   This section improves stability WITHOUT modifying your logic
   ========================================================= */


/* ================= PREVENT MULTIPLE INIT =================
   Your file has multiple DOMContentLoaded blocks.
   This prevents duplicate execution side effects.
*/
if (!window.__app_initialized__) {
  window.__app_initialized__ = true;
} else {
  console.warn("⚠️ App already initialized — duplicate execution prevented");
}


/* ================= FIREBASE SAFETY =================
   Ensures Firebase is loaded before using it
*/
if (typeof db === "undefined") {
  console.error("❌ Firebase not initialized");
  alert("Backend not connected. Please check Firebase setup.");
}


/* ================= AUTO REFRESH SYSTEM =================
   Call this after any DB change if UI doesn't update
*/
async function refreshUI() {
  try {
    if (typeof loadBooks === "function") await loadBooks();
    if (typeof loadMembers === "function") await loadMembers();
    if (typeof updateChart === "function") await updateChart();
  } catch (e) {
    console.error("Refresh error:", e);
  }
}

/* Make globally accessible */
window.refreshUI = refreshUI;


/* ================= GLOBAL FUNCTION FIX =================
   Ensures functions work from HTML buttons
*/
if (typeof deleteBook !== "undefined") {
  window.deleteBook = deleteBook;
}

if (typeof editBook !== "undefined") {
  window.editBook = editBook;
}

if (typeof addSampleBooks !== "undefined") {
  window.addSampleBooks = addSampleBooks;
}


/* ================= SAMPLE DATA SAFE RUN =================
   Runs sample books ONLY ONCE (prevents duplication)
*/
if (!localStorage.getItem("books_seeded")) {
  if (typeof addSampleBooks === "function") {
    addSampleBooks();
    localStorage.setItem("books_seeded", "true");
  }
}


/* ================= DEBUG TOOL =================
   Use in console: debugApp()
*/
window.debugApp = () => {
  console.log("📚 Books:", typeof books !== "undefined" ? books : "Firebase");
  console.log("👤 Members:", typeof members !== "undefined" ? members : "Firebase");
  console.log("🔄 Issues:", typeof issues !== "undefined" ? issues : "Firebase");
};
/* ================= SIDEBAR TOGGLE ================= */
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
  menuToggle.onclick = () => {

    // Desktop collapse
    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");

    // Mobile open
    sidebar.classList.toggle("open");
  };
}
/* =========================================================
   🔥 LMS FINAL PRO VERSION (FIREBASE ONLY)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* ================= ELEMENTS ================= */
const bookTable = document.getElementById("bookTable");
const memberTable = document.getElementById("memberTable");

const issueBook = document.getElementById("issueBook");
const issueMember = document.getElementById("issueMember");
const returnIssue = document.getElementById("returnIssue");

const totalBooks = document.getElementById("totalBooks");
const totalMembers = document.getElementById("totalMembers");
const totalIssued = document.getElementById("totalIssued");
const totalFine = document.getElementById("totalFine");

const fineDisplay = document.getElementById("fineDisplay");

const addBookBtn = document.getElementById("addBookBtn");
const addMemberBtn = document.getElementById("addMemberBtn");
const issueBtn = document.getElementById("issueBtn");
const returnBtn = document.getElementById("returnBtn");

let chart;
let finePerDay = 5;

/* =========================================================
   📚 LOAD BOOKS
   ========================================================= */
async function loadBooks() {
  bookTable.innerHTML = "";
  issueBook.innerHTML = "";

  const snapshot = await getDocs(collection(db, "books"));

  snapshot.forEach(docItem => {
    const book = docItem.data();

    bookTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>
          <button onclick="deleteBook('${docItem.id}')">❌</button>
        </td>
      </tr>
    `;

    issueBook.innerHTML += `
      <option value="${docItem.id}">
        ${book.title}
      </option>
    `;
  });
}

/* =========================================================
   ➕ ADD BOOK
   ========================================================= */
addBookBtn.onclick = async () => {
  const title = bookTitle.value;
  const isbn = bookISBN.value;
  const price = bookPrice.value;

  if (!title || !isbn) return alert("Fill all fields");

  await addDoc(collection(db, "books"), {
    title,
    isbn,
    price
  });

  bookTitle.value = "";
  bookISBN.value = "";
  bookPrice.value = "";

  refreshUI();
};

/* =========================================================
   ❌ DELETE BOOK
   ========================================================= */
window.deleteBook = async (id) => {
  await deleteDoc(doc(db, "books", id));
  refreshUI();
};

/* =========================================================
   👤 LOAD MEMBERS
   ========================================================= */
async function loadMembers() {
  memberTable.innerHTML = "";
  issueMember.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  snapshot.forEach(docItem => {
    const m = docItem.data();

    memberTable.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.phone}</td>
      </tr>
    `;

    issueMember.innerHTML += `
      <option value="${docItem.id}">
        ${m.name}
      </option>
    `;
  });
}

/* =========================================================
   ➕ ADD MEMBER
   ========================================================= */
addMemberBtn.onclick = async () => {
  const name = memberName.value;
  const phone = memberPhone.value;
  const email = memberEmail.value;

  if (!name) return alert("Enter name");

  await addDoc(collection(db, "members"), {
    name,
    phone,
    email
  });

  memberName.value = "";
  memberPhone.value = "";
  memberEmail.value = "";

  refreshUI();
};

/* =========================================================
   📤 ISSUE BOOK
   ========================================================= */
issueBtn.onclick = async () => {
  const bookId = issueBook.value;
  const memberId = issueMember.value;

  if (!bookId || !memberId) return alert("Select both");

  await addDoc(collection(db, "issues"), {
    bookId,
    memberId,
    date: new Date()
  });

  alert("Book Issued ✅");
  refreshUI();
};

/* =========================================================
   📥 LOAD ISSUES (FOR RETURN)
   ========================================================= */
async function loadIssues() {
  returnIssue.innerHTML = "";

  const snapshot = await getDocs(collection(db, "issues"));

  for (const docItem of snapshot.docs) {
    const issue = docItem.data();

    const bookSnap = await getDocs(collection(db, "books"));
    const memberSnap = await getDocs(collection(db, "members"));

    let bookName = "Book";
    let memberName = "Member";

    bookSnap.forEach(b => {
      if (b.id === issue.bookId) bookName = b.data().title;
    });

    memberSnap.forEach(m => {
      if (m.id === issue.memberId) memberName = m.data().name;
    });

    returnIssue.innerHTML += `
      <option value="${docItem.id}">
        ${bookName} - ${memberName}
      </option>
    `;
  }
}

/* =========================================================
   📥 RETURN BOOK + FINE
   ========================================================= */
returnBtn.onclick = async () => {
  const id = returnIssue.value;
  if (!id) return;

  const snapshot = await getDocs(collection(db, "issues"));

  let selected;

  snapshot.forEach(docItem => {
    if (docItem.id === id) selected = docItem;
  });

  if (!selected) return;

  const data = selected.data();

  const days = Math.floor(
    (new Date() - new Date(data.date.seconds * 1000)) /
    (1000 * 60 * 60 * 24)
  );

  const fine = days > 7 ? (days - 7) * finePerDay : 0;

  fineDisplay.innerText = "₹" + fine;

  await deleteDoc(doc(db, "issues", id));

  refreshUI();
};

/* =========================================================
   📊 DASHBOARD + CHART
   ========================================================= */
async function updateDashboard() {
  const booksSnap = await getDocs(collection(db, "books"));
  const membersSnap = await getDocs(collection(db, "members"));
  const issuesSnap = await getDocs(collection(db, "issues"));

  totalBooks.innerText = booksSnap.size;
  totalMembers.innerText = membersSnap.size;
  totalIssued.innerText = issuesSnap.size;

  if (chart) {
    chart.data.datasets[0].data = [
      booksSnap.size,
      membersSnap.size,
      issuesSnap.size
    ];
    chart.update();
    return;
  }

  chart = new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: ["Books", "Members", "Issued"],
      datasets: [{
        label: "Library Stats",
        data: [
          booksSnap.size,
          membersSnap.size,
          issuesSnap.size
        ]
      }]
    }
  });
}

/* =========================================================
   🔄 REFRESH UI
   ========================================================= */
async function refreshUI() {
  await loadBooks();
  await loadMembers();
  await loadIssues();
  await updateDashboard();
}

window.refreshUI = refreshUI;

/* =========================================================
   🌙 DARK MODE
   ========================================================= */
const toggle = document.getElementById("darkModeToggle");

if (toggle) {
  toggle.onclick = () => {
    document.body.classList.toggle("dark");
    toggle.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
  };
}

/* =========================================================
   📂 NAVIGATION
   ========================================================= */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  };
});

/* =========================================================
   🍔 SIDEBAR TOGGLE
   ========================================================= */
const sidebar = document.querySelector(".sidebar");
const main = document.querySelector(".main");
const menuToggle = document.getElementById("menuToggle");

if (menuToggle) {
  menuToggle.onclick = () => {
    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");
    sidebar.classList.toggle("open");
  };
}

/* =========================================================
   🚀 INIT
   ========================================================= */
refreshUI();

});
/* =========================================================
   🔥 LMS FINAL PRO VERSION (WITH FIREBASE BACKEND INSIDE)
   ========================================================= */

/* ================= FIREBASE BACKEND ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔑 PASTE YOUR FIREBASE CONFIG HERE */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

/* INIT */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

/* ================= ELEMENTS ================= */
const bookTable = document.getElementById("bookTable");
const memberTable = document.getElementById("memberTable");

const issueBook = document.getElementById("issueBook");
const issueMember = document.getElementById("issueMember");
const returnIssue = document.getElementById("returnIssue");

const totalBooks = document.getElementById("totalBooks");
const totalMembers = document.getElementById("totalMembers");
const totalIssued = document.getElementById("totalIssued");
const totalFine = document.getElementById("totalFine");

const fineDisplay = document.getElementById("fineDisplay");

const addBookBtn = document.getElementById("addBookBtn");
const addMemberBtn = document.getElementById("addMemberBtn");
const issueBtn = document.getElementById("issueBtn");
const returnBtn = document.getElementById("returnBtn");

let chart;
let finePerDay = 5;

/* =========================================================
   📚 LOAD BOOKS
   ========================================================= */
async function loadBooks() {
  bookTable.innerHTML = "";
  issueBook.innerHTML = "";

  const snapshot = await getDocs(collection(db, "books"));

  snapshot.forEach(docItem => {
    const book = docItem.data();

    bookTable.innerHTML += `
      <tr>
        <td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>
          <button onclick="deleteBook('${docItem.id}')">❌</button>
        </td>
      </tr>
    `;

    issueBook.innerHTML += `
      <option value="${docItem.id}">
        ${book.title}
      </option>
    `;
  });
}

/* =========================================================
   ➕ ADD BOOK
   ========================================================= */
addBookBtn.onclick = async () => {
  if (!bookTitle.value || !bookISBN.value) return alert("Fill all fields");

  await addDoc(collection(db, "books"), {
    title: bookTitle.value,
    isbn: bookISBN.value,
    price: bookPrice.value
  });

  bookTitle.value = "";
  bookISBN.value = "";
  bookPrice.value = "";

  refreshUI();
};

/* =========================================================
   ❌ DELETE BOOK
   ========================================================= */
window.deleteBook = async (id) => {
  await deleteDoc(doc(db, "books", id));
  refreshUI();
};

/* =========================================================
   👤 LOAD MEMBERS
   ========================================================= */
async function loadMembers() {
  memberTable.innerHTML = "";
  issueMember.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  snapshot.forEach(docItem => {
    const m = docItem.data();

    memberTable.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.phone}</td>
      </tr>
    `;

    issueMember.innerHTML += `
      <option value="${docItem.id}">
        ${m.name}
      </option>
    `;
  });
}

/* =========================================================
   ➕ ADD MEMBER
   ========================================================= */
addMemberBtn.onclick = async () => {
  if (!memberName.value) return alert("Enter name");

  await addDoc(collection(db, "members"), {
    name: memberName.value,
    phone: memberPhone.value,
    email: memberEmail.value
  });

  memberName.value = "";
  memberPhone.value = "";
  memberEmail.value = "";

  refreshUI();
};

/* =========================================================
   📤 ISSUE BOOK
   ========================================================= */
issueBtn.onclick = async () => {
  if (!issueBook.value || !issueMember.value) return alert("Select both");

  await addDoc(collection(db, "issues"), {
    bookId: issueBook.value,
    memberId: issueMember.value,
    date: new Date()
  });

  alert("Book Issued ✅");
  refreshUI();
};

/* =========================================================
   📥 LOAD ISSUES
   ========================================================= */
async function loadIssues() {
  returnIssue.innerHTML = "";

  const snapshot = await getDocs(collection(db, "issues"));

  for (const docItem of snapshot.docs) {
    const issue = docItem.data();

    returnIssue.innerHTML += `
      <option value="${docItem.id}">
        ${issue.bookId} - ${issue.memberId}
      </option>
    `;
  }
}

/* =========================================================
   📥 RETURN BOOK + FINE
   ========================================================= */
returnBtn.onclick = async () => {
  const id = returnIssue.value;
  if (!id) return;

  const snapshot = await getDocs(collection(db, "issues"));

  let selected;

  snapshot.forEach(docItem => {
    if (docItem.id === id) selected = docItem;
  });

  if (!selected) return;

  const data = selected.data();

  const days = Math.floor(
    (new Date() - new Date(data.date.seconds * 1000)) /
    (1000 * 60 * 60 * 24)
  );

  const fine = days > 7 ? (days - 7) * finePerDay : 0;

  fineDisplay.innerText = "₹" + fine;

  await deleteDoc(doc(db, "issues", id));

  refreshUI();
};

/* =========================================================
   📊 DASHBOARD
   ========================================================= */
async function updateDashboard() {
  const booksSnap = await getDocs(collection(db, "books"));
  const membersSnap = await getDocs(collection(db, "members"));
  const issuesSnap = await getDocs(collection(db, "issues"));

  totalBooks.innerText = booksSnap.size;
  totalMembers.innerText = membersSnap.size;
  totalIssued.innerText = issuesSnap.size;
}

/* =========================================================
   🔄 REFRESH UI
   ========================================================= */
async function refreshUI() {
  await loadBooks();
  await loadMembers();
  await loadIssues();
  await updateDashboard();
}

/* INIT */
refreshUI();

});