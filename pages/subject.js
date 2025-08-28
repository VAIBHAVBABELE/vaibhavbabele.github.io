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

// Dark mode toggle
const toggleBtn = document.getElementById("darkToggle");
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
}

// PDF preview buttons
const previewButtons = document.querySelectorAll('.preview-btn');
const pdfFrame = document.getElementById('pdfFrame');
const pdfModalEl = document.getElementById('pdfPreviewModal');
const pdfModal = pdfModalEl ? new bootstrap.Modal(pdfModalEl) : null;

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

        // Reset all open states and matches
        card.querySelectorAll('details').forEach(detail => {
            detail.removeAttribute('open');
            detail.removeAttribute('data-match');
        });
        card.querySelectorAll('.note-item').forEach(n => n.removeAttribute('data-match'));

        if (!q) {
            card.style.display = '';
            return;
        }

        const topics = card.querySelectorAll('.topic');
        topics.forEach(topic => {
            let topicHit = false;

            // Check if the semester itself matches
            const summaryText = normalize(topic.querySelector('summary span')?.textContent);
            if (summaryText.includes(q)) {
                topicHit = true;
            }

            // Check subjects and notes within this semester
            const subjects = topic.querySelectorAll('.subject');
            subjects.forEach(subject => {
                let subjectHit = false;
                const subjectName = normalize(subject.querySelector('summary span')?.textContent);
                if (subjectName.includes(q)) {
                    subjectHit = true;
                }

                // Check individual notes within this subject
                const notes = subject.querySelectorAll('.note-item');
                notes.forEach(n => {
                    const title = normalize(n.getAttribute('data-title'));
                    const noteText = normalize(n.textContent);
                    if (title.includes(q) || noteText.includes(q)) {
                        n.setAttribute('data-match', 'true');
                        subjectHit = true;
                        topicHit = true;
                    }
                });

                if (subjectHit) {
                    subject.setAttribute('data-match', 'true');
                    subject.setAttribute('open', 'true'); // Automatically open the subject
                    topicHit = true;
                }
            });

            if (topicHit) {
                topic.setAttribute('data-match', 'true');
                topic.setAttribute('open', 'true'); // Automatically open the semester
                anyHitInCard = true;
            }
        });

        card.style.display = anyHitInCard ? '' : 'none';
    });
}

searchInput?.addEventListener('input', doSearch);