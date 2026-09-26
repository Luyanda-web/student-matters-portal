const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const casesFile = path.join(dataDir, 'cases.json');
const notificationsFile = path.join(dataDir, 'notifications.json');

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(casesFile)) {
    fs.writeFileSync(casesFile, JSON.stringify([
      {
        id: 1,
        studentName: 'Aphiwe Nkosi',
        studentNumber: '20243182',
        caseType: 'Plagiarism',
        matterType: 'Academic misconduct',
        severity: 'High',
        coordinator: 'Ms. Dlamini',
        meetingDate: '2026-10-04T10:00',
        teamsLink: 'https://teams.microsoft.com/l/meetup-join/abc123',
        recipients: ['coordinator@university.ac.za', 'lecturer@university.ac.za'],
        nominatedUsers: ['Academic Officer', 'Student Support'],
        sessionTitle: 'Plagiarism Case - Aphiwe Nkosi',
        accessGranted: true,
        documents: [
          { name: 'Turnitin report.pdf', visible: true },
          { name: 'Student declaration.pdf', visible: false }
        ],
        status: 'Open',
        notes: 'Student required to attend an academic integrity hearing.',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        studentName: 'Lethabo Mokoena',
        studentNumber: '20251241',
        caseType: 'Health issue',
        matterType: 'Medical interruption',
        severity: 'Medium',
        coordinator: 'Dr. Erasmus',
        meetingDate: '2026-10-05T14:30',
        teamsLink: 'https://teams.microsoft.com/l/meetup-join/def456',
        recipients: ['health.office@university.ac.za', 'program.coordinator@university.ac.za'],
        nominatedUsers: ['Student Affairs', 'Doctor'],
        sessionTitle: 'Health Issue - Lethabo Mokoena',
        accessGranted: true,
        documents: [
          { name: 'Medical certificate.pdf', visible: true },
          { name: 'Assessment timeline.pdf', visible: true }
        ],
        status: 'Awaiting review',
        notes: 'Medical evidence submitted; awaiting framework review.',
        createdAt: new Date().toISOString()
      }
    ], null, 2));
  }

  if (!fs.existsSync(notificationsFile)) {
    fs.writeFileSync(notificationsFile, JSON.stringify([
      {
        id: 1,
        title: 'Meeting reminder',
        message: 'Meeting scheduled with Aphiwe Nkosi for 2026-10-04 at 10:00.',
        channel: 'Email',
        recipients: ['coordinator@university.ac.za'],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Access issue',
        message: 'One of the shared files could not be accessed. Please check the link and resend an invitation.',
        channel: 'Teams',
        recipients: ['student.support@university.ac.za'],
        createdAt: new Date().toISOString()
      }
    ], null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content ? JSON.parse(content) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function createSessionTitle(caseType, studentName) {
  const cleanName = (studentName || 'Student').trim();
  const cleanCase = (caseType || 'Student matter').trim();
  return `${cleanCase} Case - ${cleanName}`;
}

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Student matters portal is running.' });
});

app.get('/api/cases', (req, res) => {
  const cases = readJson(casesFile, []);
  res.json(cases);
});

app.post('/api/cases', (req, res) => {
  const payload = req.body || {};
  const cases = readJson(casesFile, []);

  const newCase = {
    id: Date.now(),
    studentName: payload.studentName || 'Unknown Student',
    studentNumber: payload.studentNumber || '',
    caseType: payload.caseType || 'General matter',
    matterType: payload.matterType || 'Student matter',
    severity: payload.severity || 'Medium',
    coordinator: payload.coordinator || 'Program Coordinator',
    meetingDate: payload.meetingDate || '',
    teamsLink: payload.teamsLink || '',
    recipients: Array.isArray(payload.recipients) ? payload.recipients : [],
    nominatedUsers: Array.isArray(payload.nominatedUsers) ? payload.nominatedUsers : [],
    sessionTitle: payload.sessionTitle || createSessionTitle(payload.caseType, payload.studentName),
    accessGranted: payload.accessGranted === true,
    documents: Array.isArray(payload.documents) ? payload.documents : [],
    status: payload.status || 'Open',
    notes: payload.notes || '',
    createdAt: new Date().toISOString()
  };

  cases.push(newCase);
  writeJson(casesFile, cases);
  res.status(201).json(newCase);
});

app.put('/api/cases/:id', (req, res) => {
  const cases = readJson(casesFile, []);
  const caseId = Number(req.params.id);
  const index = cases.findIndex((item) => item.id === caseId);

  if (index === -1) {
    return res.status(404).json({ message: 'Case not found.' });
  }

  const updatedCase = {
    ...cases[index],
    ...req.body,
    sessionTitle: req.body.sessionTitle || createSessionTitle(req.body.caseType || cases[index].caseType, req.body.studentName || cases[index].studentName),
    documents: Array.isArray(req.body.documents) ? req.body.documents : cases[index].documents,
    recipients: Array.isArray(req.body.recipients) ? req.body.recipients : cases[index].recipients,
    nominatedUsers: Array.isArray(req.body.nominatedUsers) ? req.body.nominatedUsers : cases[index].nominatedUsers
  };

  cases[index] = updatedCase;
  writeJson(casesFile, cases);
  res.json(updatedCase);
});

app.get('/api/notifications', (req, res) => {
  const notifications = readJson(notificationsFile, []);
  res.json(notifications);
});

app.post('/api/notifications', (req, res) => {
  const notifications = readJson(notificationsFile, []);
  const payload = req.body || {};

  const newNotification = {
    id: Date.now(),
    title: payload.title || 'New message',
    message: payload.message || 'Notification created',
    channel: payload.channel || 'Email',
    recipients: Array.isArray(payload.recipients) ? payload.recipients : [],
    createdAt: new Date().toISOString()
  };

  notifications.unshift(newNotification);
  writeJson(notificationsFile, notifications);
  res.status(201).json(newNotification);
});

app.post('/api/email-notice', (req, res) => {
  const payload = req.body || {};
  const title = payload.title || 'Access issue notice';
  const recipients = Array.isArray(payload.recipients) ? payload.recipients : [];
  const message = payload.message || 'Access could not be granted to one of the requested links. Please review the invitation and resend the correct access link.';

  const notification = {
    id: Date.now(),
    title,
    message,
    channel: 'Email',
    recipients,
    createdAt: new Date().toISOString()
  };

  const notifications = readJson(notificationsFile, []);
  notifications.unshift(notification);
  writeJson(notificationsFile, notifications);

  res.json({
    success: true,
    message: 'Email notice created and sent to the designated recipients.',
    notification
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`Student matters portal listening on http://localhost:${PORT}`);
});

