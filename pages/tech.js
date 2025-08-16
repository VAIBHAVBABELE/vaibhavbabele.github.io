const previewButtons = document.querySelectorAll('.preview-btn');
const pdfFrame = document.getElementById('pdfFrame');
const pdfModalEl = document.getElementById('pdfPreviewModal');
const pdfModal = pdfModalEl ? new bootstrap.Modal(pdfModalEl) : null;

// Dark mode toggle
const toggleBtn = document.getElementById("darkToggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// Function to convert Google Drive links to previewable links
function makePreviewSrc(url) {
  try {
    const u = new URL(url, window.location.origin);

    if (u.hostname.includes('drive.google.') && u.pathname.includes('/file/')) {
      return url.replace(/\/view.*$/, '/preview');
    }

    if (u.searchParams.get('id')) {
      const id = u.searchParams.get('id');
      return `https://drive.google.com/file/d/${id}/preview`;
    }
  } catch (e) { /* ignore */ }

  return url;
}

// PDF preview buttons
previewButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.getAttribute('data-preview');
    const finalSrc = makePreviewSrc(src);
    if (pdfFrame) pdfFrame.src = finalSrc;
    if (pdfModal) pdfModal.show();
  });
});

// Clear iframe when modal closes
pdfModalEl?.addEventListener('hidden.bs.modal', () => {
  if (pdfFrame) pdfFrame.src = '';
});

// --- Search (topics + notes) ---
const searchInput = document.getElementById('notesSearch');
const grid = document.getElementById('notesGrid');

function normalize(s) {
  return (s || '').toLowerCase().trim();
}

function doSearch() {
  const q = normalize(searchInput.value);
  const cards = grid.querySelectorAll('.category-card');

  cards.forEach(card => {
    let anyHitInCard = false;

    // Reset matches
    card.querySelectorAll('.topic').forEach(t => t.dataset.match = 'false');
    card.querySelectorAll('.note-item').forEach(n => n.dataset.match = 'false');

    if (!q) {
      card.style.display = '';
      card.querySelectorAll('details.topic').forEach(topic => topic.removeAttribute('open'));
      return;
    }

    const topics = card.querySelectorAll('.topic');
    topics.forEach(topic => {
      const topicName = normalize(topic.getAttribute('data-topic'));
      const summaryText = normalize(topic.querySelector('summary span')?.textContent);
      let topicHit = topicName.includes(q) || summaryText.includes(q);

      // Check notes inside topic
      const notes = topic.querySelectorAll('.note-item');
      let noteHit = false;
      notes.forEach(n => {
        const title = normalize(n.getAttribute('data-title'));
        const noteText = normalize(n.textContent);
        if (title.includes(q) || noteText.includes(q)) {
          n.dataset.match = 'true';
          noteHit = true;
        } else {
          n.dataset.match = 'false';
        }
      });

      // Show topic if topic name or any note matches
      if (topicHit || noteHit) {
        topic.dataset.match = 'true';
        topic.setAttribute('open', 'true');
        anyHitInCard = true;
      } else {
        topic.removeAttribute('open');
      }
    });

    card.style.display = anyHitInCard ? '' : 'none';
  });
}

searchInput?.addEventListener('input', doSearch);
