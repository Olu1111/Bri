/*
 * AI Reading Handler
 * Sends the current spread to the Express API server (/api/reading),
 * which calls Claude Haiku via NaraRouter and returns a psychoanalytical reading.
 *
 * API_BASE is defined in spread.html as '/api'.
 */

/**
 * Generate AI reading based on current spread and user query.
 * Reads spread data from window.currentSpread set by spread-display.js.
 */
function generateAIReading() {
    console.log('generateAIReading called');
    
    const queryInput    = document.getElementById('userQuery');
    const readingOutput = document.getElementById('readingOutput');
    const readingLoading = document.getElementById('readingLoading');
    const readingText   = document.getElementById('readingText');

    if (!queryInput || !readingOutput || !readingLoading || !readingText) {
        console.error('Missing required DOM elements');
        alert('Error: UI elements not found. Please refresh the page.');
        return;
    }

    const userQuery = queryInput.value.trim() || 'What guidance do the cards offer?';

    // window.currentSpread is set by spread-display.js after initializeSpread() runs
    const spread = window.currentSpread;
    if (!spread || !spread.positions || spread.positions.length === 0) {
        alert('Please wait for the spread to finish loading.');
        return;
    }

    // Map positions → the shape the /api/reading endpoint expects:
    // { name, position, meaning }
    const cardsData = spread.positions.map(pos => ({
        name:     `${pos.card.suit} - ${pos.card.value}`,
        position: pos.meaning  || `Position ${pos.position}`,
        meaning:  pos.description || pos.house || ''
    }));

    // Show loading, hide previous output
    readingLoading.style.display = 'block';
    readingOutput.style.display  = 'none';

    sendReadingRequest(userQuery, cardsData, readingLoading, readingOutput, readingText);
}

/**
 * Send the reading request to the API (separated for async handling)
 */
async function sendReadingRequest(userQuery, cardsData, readingLoading, readingOutput, readingText) {
    try {
        console.log('Sending request to API:', `${API_BASE}/reading`);
        const response = await fetch(`${API_BASE}/reading`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userQuery, cards: cardsData, spread_type: spread.spread })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data received:', data);

        if (data.success) {
            // Render as natural paragraphs — split on blank lines
            readingText.innerHTML = data.reading
                .split(/\n\n+/)
                .filter(p => p.trim())
                .map(p => `<p>${p.replace(/\n/g, ' ').trim()}</p>`)
                .join('');
            readingLoading.style.display = 'none';
            readingOutput.style.display  = 'block';
            readingOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            throw new Error(data.error || 'Unknown error generating reading');
        }

    } catch (error) {
        console.error('Error generating reading:', error);
        readingLoading.style.display = 'none';
        readingText.textContent =
            `Error: ${error.message}\n\nPlease try again in a moment.`;
        readingOutput.style.display = 'block';
    }
}

/**
 * Check if the API server is reachable and the model is configured.
 */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        return data.status === 'ok' && data.model_loaded;
    } catch {
        return false;
    }
}

// Show a warning banner if the API server is not available on page load
document.addEventListener('DOMContentLoaded', async () => {
    const healthy = await checkAPIHealth();
    if (!healthy) {
        const banner = document.createElement('div');
        banner.className = 'api-warning';
        banner.textContent =
            '⚠️ AI reading service is unavailable. Card spreads still work normally.';
        document.body.insertBefore(banner, document.body.firstChild);
    }
});
