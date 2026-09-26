* {
  box-sizing: border-box;
}

:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --primary: #1d4ed8;
  --primary-dark: #163da5;
  --accent: #e0ecff;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --text: #14213d;
  --muted: #667085;
  --border: #dfe7f5;
  --shadow: 0 14px 30px rgba(19, 34, 70, 0.08);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #edf4ff 0%, var(--bg) 100%);
  color: var(--text);
}

button,
input,
select,
textarea {
  font: inherit;
}

.container {
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
}

.topbar {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 30;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), #6d8dff);
  box-shadow: var(--shadow);
}

.brand h1 {
  margin: 0;
  font-size: 1.1rem;
}

nav {
  display: flex;
  gap: 1.2rem;
}

nav a {
  text-decoration: none;
  color: var(--text);
  font-weight: 600;
  opacity: 0.8;
}

.page {
  padding: 2rem 0 4rem;
}

.hero {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.25rem 0 2rem;
}

.eyebrow {
  display: inline-block;
  color: var(--primary);
  background: var(--accent);
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero h2 {
  margin: 1rem 0 0.8rem;
  font-size: clamp(2.1rem, 3vw, 3.3rem);
  line-height: 1.1;
}

.hero p {
  color: var(--muted);
  line-height: 1.7;
  max-width: 60ch;
}

.cta-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.icon-btn {
  border: none;
  cursor: pointer;
  border-radius: 12px;
  transition: 0.2s ease;
}

.primary-btn {
  background: var(--primary);
  color: white;
  padding: 0.8rem 1.1rem;
  font-weight: 700;
  box-shadow: 0 10px 18px rgba(29, 78, 216, 0.18);
}

.primary-btn:hover {
  background: var(--primary-dark);
}

.secondary-btn,
.ghost-btn {
  background: #eff4ff;
  color: var(--primary);
  padding: 0.8rem 1rem;
  font-weight: 600;
}

.ghost-btn {
  background: transparent;
  border: 1px solid var(--border);
}

.hero-panel {
  background: linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 1.2rem;
  box-shadow: var(--shadow);
  display: grid;
  gap: 1rem;
}

.mini-stat {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem 1.1rem;
}

.mini-stat span {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  margin-bottom: 0.35rem;
}

.mini-stat strong {
  font-size: clamp(1.6rem, 2vw, 2.2rem);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-card,
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 20px;
}

.info-card {
  padding: 1.25rem;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 0.28rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.badge.accent {
  background: var(--accent);
  color: var(--primary);
}

.badge.success {
  background: rgba(22, 163, 74, 0.12);
  color: var(--success);
}

.badge.warning {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.info-card h3 {
  margin: 0.75rem 0 0.4rem;
  font-size: 1.3rem;
}

.info-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.workspace {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.two-column {
  margin-top: 1rem;
}

.panel {
  padding: 1.2rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.with-action {
  margin-bottom: 1.1rem;
}

.form-panel {
  min-height: 100%;
}

#caseForm {
  display: grid;
  gap: 1rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.45rem;
  color: var(--text);
  font-weight: 600;
}

label span {
  font-size: 0.9rem;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fdfdff;
  padding: 0.85rem 0.9rem;
  color: var(--text);
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid rgba(29, 78, 216, 0.12);
  border-color: rgba(29, 78, 216, 0.35);
}

textarea {
  resize: vertical;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.checkbox-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-wrap input {
  width: auto;
}

.submit-row {
  display: flex;
  justify-content: flex-end;
}

.stack-list,
.tiny-list {
  display: grid;
  gap: 0.8rem;
}

.case-item,
.notice-item,
.doc-item {
  background: #f8faff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem;
}

.case-top,
.notice-top,
.doc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
}

.case-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
}

.muted {
  color: var(--muted);
  font-size: 0.84rem;
}

.status-pill {
  border-radius: 999px;
  padding: 0.3rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(29, 78, 216, 0.09);
  color: var(--primary);
}

.status-pill.warning {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.status-pill.success {
  background: rgba(22, 163, 74, 0.1);
  color: var(--success);
}

.case-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 0.9rem;
  margin-top: 0.8rem;
  font-size: 0.9rem;
}

.case-info div {
  color: var(--muted);
}

.case-info strong {
  display: block;
  color: var(--text);
  margin-top: 0.25rem;
}

.notice-item,
.doc-item {
  display: grid;
  gap: 0.3rem;
}

.notice-item p,
.doc-item p {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
}

.doc-item .toggle-row {
  justify-content: flex-end;
  margin-top: 0.4rem;
}

.icon-btn {
  background: #eaf2ff;
  color: var(--primary);
  padding: 0.5rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.reports-panel {
  margin-top: 1rem;
}

.report-box {
  background: #f8faff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem;
  color: var(--text);
  line-height: 1.7;
}

.report-box h4 {
  margin: 0 0 0.5rem;
}

@media (max-width: 900px) {
  .hero,
  .workspace,
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .nav {
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
  }

  nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 620px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .cta-row {
    flex-direction: column;
  }
}

