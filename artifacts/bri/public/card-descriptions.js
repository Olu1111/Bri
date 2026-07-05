/**
 * Card Description Handler
 * Fetches AI-generated one-sentence interpretations for each card
 * based on its position and spread type.
 *
 * Calls /api/card-description on the Express API server,
 * which uses Claude Haiku via NaraRouter.
 * API_BASE is defined in spread.html as '/api'.
 */

const cardDescriptions = {};

/**
 * Fetch AI description for a single card
 */
async function getCardDescription(card, position, spreadType, positionMeaning) {
    // Create a cache key
    const cacheKey = `${card.suit}-${card.value}-${position}`;
    
    // Return cached description if available
    if (cardDescriptions[cacheKey]) {
        return cardDescriptions[cacheKey];
    }

    try {
        const cardName = `${card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} - ${card.value.charAt(0).toUpperCase() + card.value.slice(1)}`;
        
        const response = await fetch(`${API_BASE}/card-description`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                card: cardName,
                position: position,
                spread_type: spreadType,
                position_meaning: positionMeaning
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.description) {
            cardDescriptions[cacheKey] = data.description;
            return data.description;
        } else {
            throw new Error(data.error || 'Failed to generate description');
        }
    } catch (error) {
        console.error('Error fetching card description:', error);
        return null;
    }
}

/**
 * Generate descriptions for all cards in the current spread
 */
async function generateAllCardDescriptions(spread) {
    const descriptions = [];
    
    for (const position of spread.positions) {
        const description = await getCardDescription(
            position.card,
            position.meaning,
            spread.spread,
            position.description || position.house || ''
        );
        
        descriptions.push({
            position: position.position,
            card: position.card,
            meaning: position.meaning,
            description: description
        });
    }
    
    return descriptions;
}

/**
 * Display card descriptions in the cards list
 */
function displayCardDescriptions(descriptions) {
    const cardsList = document.getElementById('cardsList');
    
    if (!cardsList) return;
    
    // Clear loading state and show all descriptions at once
    cardsList.innerHTML = '';
    
    descriptions.forEach(item => {
        if (!item.description) return;
        
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
            <div class="card-item-header">
                <span class="card-position">${item.meaning}</span>
                <span class="card-name">${item.card.suit} - ${item.card.value}</span>
            </div>
            <div class="card-description">${item.description}</div>
        `;
        cardsList.appendChild(cardItem);
    });
}
