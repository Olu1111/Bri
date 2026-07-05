/*
 * AI Reading Handler
 * Communicates with the local Tarot AI Flask server (tarot_api_server.py)
 * to generate readings from the fine-tuned Qwen2.5 LoRA model.
 *
 * Start the server with:  python tarot_api_server.py
 */

// API_BASE is defined in card-descriptions.js
// const API_BASE = 'http://localhost:5001';

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

    // Map positions → the shape the Flask /reading endpoint expects:
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
            body: JSON.stringify({ query: userQuery, cards: cardsData })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data received:', data);

        if (data.success) {
            readingText.textContent      = data.reading;
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
            `Error: ${error.message}\n\nMake sure the server is running:\n  python tarot_api_server.py`;
        readingOutput.style.display = 'block';
    }
}

/**
 * Check if the Flask server is reachable and the model is loaded.
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

// Show a warning banner if the server is not available on page load
document.addEventListener('DOMContentLoaded', async () => {
    const healthy = await checkAPIHealth();
    if (!healthy) {
        const banner = document.createElement('div');
        banner.className = 'api-warning';
        banner.textContent =
            '⚠️ Local AI server not detected. Start it with: python tarot_api_server.py';
        document.body.insertBefore(banner, document.body.firstChild);
    }
});
