/**
 * Spread Display Handler
 * Renders different spread layouts and displays card details
 */

// Get spread type from URL parameter
function getSpreadType() {
    const params = new URLSearchParams(window.location.search);
    return params.get('type') || 'one';
}

// Generate a new spread based on type
function generateSpread(spreadType) {
    try {
        console.log('Generating spread of type:', spreadType);
        return getTarotSpread(spreadType);
    } catch (error) {
        console.error('Error generating spread:', error);
        console.error('Spread type was:', spreadType);
        return null;
    }
}

// Render the spread layout
function renderSpreadLayout(spread) {
    const layoutContainer = document.getElementById('spreadLayout');
    layoutContainer.innerHTML = '';
    
    // Set layout class based on spread type
    const layoutClass = getLayoutClass(spread.spread);
    layoutContainer.className = `spread-layout ${layoutClass}`;
    
    // Render cards based on spread type
    switch (spread.spread) {
        case 'One Card':
            renderOneCardLayout(spread, layoutContainer);
            break;
        case 'Three Card (Mind, Body, Spirit)':
            renderThreeCardLayout(spread, layoutContainer);
            break;
        case 'Five Card (Challenge & Solution)':
            renderFiveCardLayout(spread, layoutContainer);
            break;
        case 'Celtic Cross (10-Card)':
            renderCelticCrossLayout(spread, layoutContainer);
            break;
        case 'Compatibility (7-Card)':
            renderCompatibilityLayout(spread, layoutContainer);
            break;
        case 'Horseshoe (7-Card)':
            renderHorseshoeLayout(spread, layoutContainer);
            break;
        case 'Astrological (12-Card)':
            renderAstrologicalLayout(spread, layoutContainer);
            break;
    }
}

// Get layout class name
function getLayoutClass(spreadName) {
    const classMap = {
        'One Card': 'one-card',
        'Three Card (Mind, Body, Spirit)': 'three-card',
        'Five Card (Challenge & Solution)': 'five-card',
        'Celtic Cross (10-Card)': 'celtic-cross',
        'Compatibility (7-Card)': 'compatibility',
        'Horseshoe (7-Card)': 'horseshoe',
        'Astrological (12-Card)': 'astrological'
    };
    return classMap[spreadName] || 'default';
}

// Render One Card Layout
function renderOneCardLayout(spread, container) {
    const position = spread.positions[0];
    createCardElement(container, position);
}

// Render Three Card Layout
function renderThreeCardLayout(spread, container) {
    spread.positions.forEach(position => {
        createCardElement(container, position);
    });
}

// Render Five Card Layout
function renderFiveCardLayout(spread, container) {
    spread.positions.forEach(position => {
        createCardElement(container, position);
    });
}

// Render Celtic Cross Layout
function renderCelticCrossLayout(spread, container) {
    spread.positions.forEach(position => {
        const card = createCardElement(container, position);
        card.setAttribute('data-position', position.position);
    });
}

// Render Compatibility Layout
function renderCompatibilityLayout(spread, container) {
    const leftPillar = document.createElement('div');
    leftPillar.className = 'pillar';
    
    const rightPillar = document.createElement('div');
    rightPillar.className = 'pillar';
    
    const centerCard = document.createElement('div');
    centerCard.className = 'center-card';
    
    // Add positions 1-3 to left pillar
    for (let i = 0; i < 3; i++) {
        createCardElement(leftPillar, spread.positions[i]);
    }
    
    // Add position 4 (center) to center container
    createCardElement(centerCard, spread.positions[3]);
    
    // Add positions 5-7 to right pillar
    for (let i = 4; i < 7; i++) {
        createCardElement(rightPillar, spread.positions[i]);
    }
    
    container.appendChild(leftPillar);
    container.appendChild(centerCard);
    container.appendChild(rightPillar);
}

// Render Horseshoe Layout
function renderHorseshoeLayout(spread, container) {
    spread.positions.forEach((position, index) => {
        const card = createCardElement(container, position);
        card.setAttribute('data-horseshoe', position.position);
    });
}

// Render Astrological Layout
function renderAstrologicalLayout(spread, container) {
    spread.positions.forEach(position => {
        const card = createCardElement(container, position);
        card.setAttribute('data-astro', position.position);
    });
}

// Create a card element
function createCardElement(container, position) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    card.title = `${position.meaning}: ${position.card.suit} ${position.card.value}`;
    
    // Create card name for modal display
    const cardSuit = position.card.suit.charAt(0).toUpperCase() + position.card.suit.slice(1);
    const cardValue = position.card.value.charAt(0).toUpperCase() + position.card.value.slice(1);
    const cardName = `${cardSuit} - ${cardValue}`;
    
    // Try to load the card image
    if (position.cardPath) {
        const img = document.createElement('img');
        img.src = position.cardPath;
        img.alt = `${position.card.suit} ${position.card.value}`;
        img.onerror = function() {
            // Fallback if image doesn't load
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'center';
            card.style.alignItems = 'center';
            card.textContent = `${position.card.suit.toUpperCase()}\n${position.card.value.toUpperCase()}`;
            card.style.fontSize = '14px';
            card.style.textAlign = 'center';
            card.style.color = '#9b9ba1';
            card.style.fontWeight = 'bold';
        };
        card.appendChild(img);
        
        // Add click handler to open modal
        card.addEventListener('click', function() {
            openCardModal(position.cardPath, cardName);
        });
    } else {
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'center';
        card.style.alignItems = 'center';
        card.textContent = `${position.card.suit.toUpperCase()}\n${position.card.value.toUpperCase()}`;
        card.style.fontSize = '14px';
        card.style.textAlign = 'center';
        card.style.color = '#9b9ba1';
        card.style.fontWeight = 'bold';
    }
    
    container.appendChild(card);
    return card;
}

// Render cards list (details below the spread)
function renderCardsList(spread) {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';
    
    // Show loading state while AI descriptions are being generated
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'cards-list-loading-full';
    loadingDiv.id = 'cardsListLoading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>🔮 Interpreting spread, please wait...</p>
    `;
    cardsList.appendChild(loadingDiv);
}

// Update page title and subtitle
function updatePageTitle(spread) {
    document.getElementById('spreadTitle').textContent = spread.spread;
    document.getElementById('spreadSubtitle').textContent = spread.interpretation || '';
}

// Initialize the spread display
function initializeSpread() {
    const spreadType = getSpreadType();
    console.log('Initializing spread with type:', spreadType);
    const spread = generateSpread(spreadType);
    
    if (!spread) {
        const errorMsg = `Error generating spread of type: ${spreadType}. Check browser console for details.`;
        console.error(errorMsg);
        document.getElementById('spreadLayout').innerHTML = `<p>${errorMsg}</p>`;
        return;
    }

    // Expose spread globally so ai-reading.js can access it
    window.currentSpread = spread;
    console.log('Spread initialized successfully:', spread);

    updatePageTitle(spread);
    renderSpreadLayout(spread);
    renderCardsList(spread);
    
    // Generate AI descriptions for each card
    generateAllCardDescriptions(spread).then(descriptions => {
        displayCardDescriptions(descriptions);
    }).catch(error => {
        console.warn('Could not generate card descriptions:', error);
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSpread);

/**
 * Open the card modal with large image
 */
function openCardModal(cardPath, cardName) {
    const modal = document.getElementById('cardModal');
    const img = document.getElementById('cardModalImage');
    const name = document.getElementById('cardModalName');
    
    img.src = cardPath;
    img.alt = cardName;
    name.textContent = cardName;
    
    modal.classList.add('active');
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCardModal();
        }
    });
}

/**
 * Close the card modal
 */
function closeCardModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
}