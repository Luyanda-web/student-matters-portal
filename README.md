const form = document.getElementById('caseForm');
const caseList = document.getElementById('caseList');
const notificationList = document.getElementById('notificationList');
const documentList = document.getElementById('documentList');
const reportArea = document.getElementById('reportArea');
const totalCases = document.getElementById('totalCases');
const openSessions = document.getElementById('openSessions');
const upcomingMeetings = document.getElementById('upcomingMeetings');

const documentInput = document.getElementById('documentFiles');

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function formatDate(dateValue) {
  if (!dateValue) return 'Not scheduled';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function getStatusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('open')) return 'status-pill';
  if (value.includes('await') || value.includes('review')) return 'status-pill warning';
  return 'status-pill success';
}

function renderStats(cases) {
  const open = cases.filter((item) => String(item.status || '').toLowerCase() !== 'closed').length;
  const upcoming = cases.filter((item) => item.meetingDate).length;

  totalCases.textContent = String(cases.length);
  openSessions.textContent = String(open);
  upcomingMeetings.textContent = String(upcoming);
}

function renderCaseList(cases) {
  if (!cases.length) {
    caseList.innerHTML = '<div class="case-item"><p class="muted">No student matters have been registered yet.</p></div>';
    return;
  }

  caseList.innerHTML = cases
    .slice()
    .reverse()
    .map((item) => `
      <article class="case-item">
        <div class="case-top">
          <div>
            <h4 class="case-title">${item.sessionTitle || item.caseType}</h4>
            <div class="muted">${item.studentName} • ${item.studentNumber}</div>
          </div>
          <span class="${getStatusClass(item.status)}">${item.status || 'Open'}</span>
        </div>

        <div class="case-info">
          <div>
            Case type
            <strong>${item.caseType}</strong>
          </div>
          <div>
            Meeting
            <strong>${formatDate(item.meetingDate)}</strong>
          </div>
          <div>
            Coordinator
            <strong>${item.coordinator}</strong>
          </div>
          <div>
            Access
            <strong>${item.accessGranted ? 'Granted' : 'Restricted'}</strong>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function renderNotifications(notifications) {
  if (!notifications.length) {
    notificationList.innerHTML = '<div class="notice-item"><p>No notifications available.</p></div>';
    return;
  }

  notificationList.innerHTML = notifications.slice(0, 5).map((item) => `
    <div class="notice-item">
      <div class="notice-top">
        <strong>${item.title}</strong>
        <span class="muted">${item.channel}</span>
      </div>
      <p>${item.message}</p>
      <div class="muted">To: ${Array.isArray(item.recipients) ? item.recipients.join(', ') : 'N/A'}</div>
    </div>
  `).join('');
}

function renderDocuments(cases) {
  const docs = cases.flatMap((caseItem) => (Array.isArray(caseItem.documents) ? caseItem.documents.map((doc) => ({
    caseTitle: caseItem.sessionTitle || caseItem.caseType,
    doc,
    caseId: caseItem.id,
    visible: doc.visible
  })) : []));

  if (!docs.length) {
    documentList.innerHTML = '<div class="doc-item"><p>No uploaded documents found.</p></div>';
    return;
  }

  documentList.innerHTML = docs.map(({ caseTitle, doc, caseId }) => `
    <div class="doc-item">
      <div class="doc-top">
        <strong>${doc.name}</strong>
        <button class="icon-btn" data-case-id="${caseId}" data-doc-name="${encodeURIComponent(doc.name)}">
          ${doc.visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <p>${caseTitle}</p>
      <div class="muted">Visible: ${doc.visible ? 'Yes' : 'No'}</div>
    </div>
  `).join('');

  documentList.querySelectorAll('.icon-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const caseId = Number(button.dataset.caseId);
      const docName = decodeURIComponent(button.dataset.docName);

      const casesData = await fetchJSON('/api/cases');
      const caseToUpdate = casesData.find((item) => item.id === caseId);

      if (!caseToUpdate) return;

      const updatedDocuments = caseToUpdate.documents.map((doc) => {
        if (doc.name === docName) {
          return { ...doc, visible: !doc.visible };
        }
        return doc;
      });

      await fetchJSON(`/api/cases/${caseId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...caseToUpdate, documents: updatedDocuments })
      });

      loadData();
    });
  });
}

function renderReport(cases) {
  if (!cases.length) {
    reportArea.innerHTML = '<p>No case report available yet.</p>';
    return;
  }

  const reportLines = cases.map((item) => `
    <div>
      <h4>${item.sessionTitle || item.caseType}</h4>
      <p><strong>Student:</strong> ${item.studentName} (${item.studentNumber})</p>
      <p><strong>Issue:</strong> ${item.caseType} / ${item.matterType}</p>
      <p><strong>Coordinator:</strong> ${item.coordinator}</p>
      <p><strong>Meeting:</strong> ${formatDate(item.meetingDate)}</p>
      <p><strong>Access:</strong> ${item.accessGranted ? 'Granted to selected users' : 'Access pending'}</p>
      <p><strong>Documents:</strong> ${Array.isArray(item.documents) && item.documents.length ? item.documents.map((d) => d.name).join(', ') : 'No files uploaded'}</p>
      <p><strong>Notes:</strong> ${item.notes || 'No notes added.'}</p>
    </div>
  `).join('');

  reportArea.innerHTML = reportLines;
}

async function loadData() {
  try {
    const [cases, notifications] = await Promise.all([
      fetchJSON('/api/cases'),
      fetchJSON('/api/notifications')
    ]);

    renderStats(cases);
    renderCaseList(cases);
    renderNotifications(notifications);
    renderDocuments(cases);
    renderReport(cases);
  } catch (error) {
    console.error(error);
    caseList.innerHTML = '<div class="case-item"><p class="muted">Unable to load data right now.</p></div>';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const uploadedFiles = Array.from(documentInput.files || []).map((file) => ({
    name: file.name,
    visible: true
  }));

  const recipients = (formData.get('recipients') || '')
    .toString()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const nominatedUsers = (formData.get('nominatedUsers') || '')
    .toString()
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const payload = {
    studentName: formData.get('studentName')?.toString() || '',
    studentNumber: formData.get('studentNumber')?.toString() || '',
    caseType: formData.get('caseType')?.toString() || 'General matter',
    matterType: formData.get('matterType')?.toString() || 'Student matter',
    severity: formData.get('severity')?.toString() || 'Medium',
    coordinator: formData.get('coordinator')?.toString() || 'Program Coordinator',
    meetingDate: formData.get('meetingDate')?.toString() || '',
    teamsLink: formData.get('teamsLink')?.toString() || '',
    recipients,
    nominatedUsers,
    sessionTitle: formData.get('sessionTitle')?.toString() || '',
    notes: formData.get('notes')?.toString() || '',
    accessGranted: formData.get('accessGranted') === 'on',
    documents: uploadedFiles,
    status: 'Open'
  };

  await fetchJSON('/api/cases', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  const notificationText = `New ${payload.caseType} case created for ${payload.studentName}. Meeting scheduled for ${formatDate(payload.meetingDate)}.`;

  await fetchJSON('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Case created',
      message: notificationText,
      channel: 'Email',
      recipients: payload.recipients.length ? payload.recipients : ['program.coordinator@university.ac.za']
    })
  });

  form.reset();
  documentInput.value = '';
  loadData();
});

document.getElementById('focusCaseForm').addEventListener('click', () => {
  window.location.hash = '#cases';
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('refreshCases').addEventListener('click', () => {
  loadData();
});

document.getElementById('sendAccessNotice').addEventListener('click', async () => {
  const payload = {
    title: 'Access restoration notice',
    message: 'One or more shared links could not be accessed by the designated recipient. Please resend the correct Teams or Zoom invitation and verify edit rights.',
    recipients: ['student.support@university.ac.za', 'program.coordinator@university.ac.za']
  };

  await fetchJSON('/api/email-notice', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  loadData();
});

loadData();

