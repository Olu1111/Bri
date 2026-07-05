/**
 * Tarot Card Spread Logic
 * Handles various tarot spreads for AI genAI to follow
 */

// Define the deck structure
const DECK = {
  clubs: [
    'ace', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    'page', 'jack', 'queen', 'king'
  ],
  diamonds: [
    'ace', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    'page', 'jack', 'queen', 'king'
  ],
  hearts: [
    'ace', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    'page', 'jack', 'queen', 'king'
  ],
  spades: [
    'ace', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    'page', 'jack', 'queen', 'king'
  ],
  majors: [
    'jester', 'magician', 'priestess', 'empress', 'emperor', 'soothsayer',
    'lovers', 'charioteer', 'duality', 'hermit', 'instincts', 'strength',
    'hangedone', 'death', 'temperance', 'devil', 'tower', 'star',
    'moon', 'sun', 'redemption', 'world'
  ]
};

/**
 * Create a complete deck with all cards
 * @returns {Array} Array of all cards with suit and value
 */
function createFullDeck() {
  const fullDeck = [];
  
  Object.entries(DECK).forEach(([suit, cards]) => {
    cards.forEach(card => {
      fullDeck.push({ suit, value: card });
    });
  });
  
  return fullDeck;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleDeck(array) {
  const deck = [...array];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Get the file path for a card
 * @param {Object} card - Card object with suit and value
 * @returns {string} File path to the card image
 */
function getCardPath(card) {
  if (card.suit === 'majors') {
    // Map majors names to their index numbers
    const majorsIndexMap = {
      'jester': '00',
      'magician': '01',
      'priestess': '02',
      'empress': '03',
      'emperor': '04',
      'soothsayer': '05',
      'lovers': '06',
      'charioteer': '07',
      'duality': '08',
      'hermit': '09',
      'instincts': '10',
      'strength': '11',
      'hangedone': '12',
      'death': '13',
      'temperance': '14',
      'devil': '15',
      'tower': '16',
      'star': '17',
      'moon': '18',
      'sun': '19',
      'redemption': '20',
      'world': '21'
    };
    
    const majorNumber = majorsIndexMap[card.value] || '00';
    return `majors/${majorNumber}${card.value}.webp`;
  }
  
  // Map card values to their numeric representations
  const valueMap = {
    'ace': '01',
    'page': '11',
    'jack': '12',
    'queen': '13',
    'king': '14'
  };
  
  // Get the numeric part of the filename
  let numericPart = valueMap[card.value] || String(card.value).padStart(2, '0');
  
  // For numeric values (02-10), don't append the value name again
  if (card.value.match(/^\d+$/)) {
    return `${card.suit}/${card.suit}${numericPart}.webp`;
  }
  
  // For face cards and ace, append the value name
  return `${card.suit}/${card.suit}${numericPart}${card.value}.webp`;
}

/**
 * ONE CARD SPREAD
 * Pull one card randomly from the deck
 * @returns {Object} Single card with position interpretation
 */
function oneCardSpread() {
  const deck = shuffleDeck(createFullDeck());
  const card = deck[0];
  
  return {
    spread: 'One Card',
    positions: [
      {
        position: 1,
        meaning: 'The Card',
        card: card,
        cardPath: getCardPath(card)
      }
    ],
    interpretation: `This card represents the current energy or answer to your question. Meditate on its meaning and how it applies to your situation.`
  };
}

/**
 * THREE CARD SPREAD
 * Mind - Body - Spirit
 * @returns {Object} Three cards with their meanings
 */
function threeCardSpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 3);
  
  return {
    spread: 'Three Card (Mind, Body, Spirit)',
    positions: [
      {
        position: 1,
        meaning: 'Mind',
        description: 'Your thoughts, beliefs, and mental state',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        meaning: 'Body',
        description: 'Your physical health, energy, and actions',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        meaning: 'Spirit',
        description: 'Your spiritual essence, purpose, and inner wisdom',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      }
    ],
    interpretation: `Together these three cards form a complete picture of your holistic being. Notice how they relate to each other and what story they tell about balance or imbalance in your life.`
  };
}

/**
 * FIVE CARD SPREAD
 * Current Situation → Response → What is Holding You Back → 
 * What You Can Do to Change → Outcome
 * @returns {Object} Five cards with their meanings
 */
function fiveCardSpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 5);
  
  return {
    spread: 'Five Card (Challenge & Solution)',
    positions: [
      {
        position: 1,
        meaning: 'The Current Situation',
        description: 'Where you are right now',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        meaning: 'The Response',
        description: 'How the universe or your higher self responds to this situation',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        meaning: 'What is Holding You Back',
        description: 'Obstacles, blocks, or limiting beliefs preventing progress',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      },
      {
        position: 4,
        meaning: 'What You Can Do to Change the Situation',
        description: 'Actions or mindset shifts available to you',
        card: cards[3],
        cardPath: getCardPath(cards[3])
      },
      {
        position: 5,
        meaning: 'The Outcome if You Make That Change',
        description: 'The potential result of taking the suggested action',
        card: cards[4],
        cardPath: getCardPath(cards[4])
      }
    ],
    interpretation: `This spread reveals the challenge you face and the path forward. Pay special attention to positions 3 and 4 as they hold the key to transformation.`
  };
}

/**
 * COMPATIBILITY SPREAD
 * Dynamics between two people with 7 cards total
 * Two pillars of 3 cards each with 1 center card
 * @returns {Object} Seven cards representing relationship dynamics
 */
function compatibilitySpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 7);
  
  return {
    spread: 'Compatibility (7-Card)',
    positions: [
      {
        position: 1,
        meaning: 'Person 1 - Base/Foundation',
        description: 'The foundation of the first person\'s role in the relationship',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        meaning: 'Person 1 - Current State',
        description: 'Where the first person stands emotionally and mentally',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        meaning: 'Person 1 - Potential',
        description: 'What the first person brings to the relationship',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      },
      {
        position: 4,
        meaning: 'What Keeps Them Together',
        description: 'The binding force or core connection between the two',
        card: cards[3],
        cardPath: getCardPath(cards[3]),
        placement: 'center'
      },
      {
        position: 5,
        meaning: 'Person 2 - Base/Foundation',
        description: 'The foundation of the second person\'s role in the relationship',
        card: cards[4],
        cardPath: getCardPath(cards[4])
      },
      {
        position: 6,
        meaning: 'Person 2 - Current State',
        description: 'Where the second person stands emotionally and mentally',
        card: cards[5],
        cardPath: getCardPath(cards[5])
      },
      {
        position: 7,
        meaning: 'Person 2 - Potential',
        description: 'What the second person brings to the relationship',
        card: cards[6],
        cardPath: getCardPath(cards[6])
      }
    ],
    layout: 'two pillars with center',
    interpretation: `The first pillar (positions 1-3) represents the first person, the center card (position 4) represents the bond between them, and the second pillar (positions 5-7) represents the second person. Notice how the pillars complement or challenge each other, and what role the center card plays in holding them together.`
  };
}

/**
 * HORSESHOE SPREAD
 * 7-card spread following a horseshoe path
 * @returns {Object} Seven cards with their meanings
 */
function horseshoeSpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 7);
  
  return {
    spread: 'Horseshoe (7-Card)',
    positions: [
      {
        position: 1,
        meaning: 'The Past',
        description: 'Events or influences that have shaped the current situation',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        meaning: 'The Present',
        description: 'Where you are right now and the current energies at play',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        meaning: 'The Near Future',
        description: 'What is coming soon; developments on the horizon',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      },
      {
        position: 4,
        meaning: 'The Answer',
        description: 'The core answer to your question or the heart of the matter',
        card: cards[3],
        cardPath: getCardPath(cards[3])
      },
      {
        position: 5,
        meaning: 'The Surrounding Energy',
        description: 'The general energy and atmosphere around the situation',
        card: cards[4],
        cardPath: getCardPath(cards[4])
      },
      {
        position: 6,
        meaning: 'Hopes and Fears',
        description: 'Your deepest desires and greatest concerns about the outcome',
        card: cards[5],
        cardPath: getCardPath(cards[5])
      },
      {
        position: 7,
        meaning: 'The Outcome',
        description: 'The likely resolution and where this path leads',
        card: cards[6],
        cardPath: getCardPath(cards[6])
      }
    ],
    layout: 'horseshoe',
    interpretation: `This spread reveals your journey from past to future in a natural arc. The horseshoe shape suggests protection and luck. Pay special attention to position 4 (the answer) and how it relates to positions 6 and 7.`
  };
}

/**
 * ASTROLOGICAL SPREAD
 * 12-card spread representing the astrological houses
 * @returns {Object} Twelve cards with their house meanings
 */
function astrologicalSpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 12);
  
  return {
    spread: 'Astrological (12-Card)',
    positions: [
      {
        position: 1,
        house: '1st House',
        meaning: 'Self, Identity, Style',
        description: 'Your appearance, personality, how you present yourself to the world',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        house: '2nd House',
        meaning: 'Resources, Values, Security, Possessions',
        description: 'Your material resources, self-worth, finances, and what you own',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        house: '3rd House',
        meaning: 'Communication, Education, Mental Activity, Siblings',
        description: 'How you think and communicate, learning, short journeys, relationships with siblings',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      },
      {
        position: 4,
        house: '4th House',
        meaning: 'Home, Family, Roots, Inner Self',
        description: 'Your home life, family relationships, ancestry, your private self',
        card: cards[3],
        cardPath: getCardPath(cards[3])
      },
      {
        position: 5,
        house: '5th House',
        meaning: 'Creative Expression, Pleasure, Children',
        description: 'Your creativity, romance, entertainment, children, hobbies, joy',
        card: cards[4],
        cardPath: getCardPath(cards[4])
      },
      {
        position: 6,
        house: '6th House',
        meaning: 'Rituals, Health, Routines, Work',
        description: 'Your daily habits, work life, health, service to others, pet care',
        card: cards[5],
        cardPath: getCardPath(cards[5])
      },
      {
        position: 7,
        house: '7th House',
        meaning: 'Partnership, Marriage, Shadow Self',
        description: 'Committed relationships, marriage, business partners, the parts of yourself you project onto others',
        card: cards[6],
        cardPath: getCardPath(cards[6])
      },
      {
        position: 8,
        house: '8th House',
        meaning: 'Sex, Death, Healing, Renewal, Inheritance',
        description: 'Transformation, intimacy, shared resources, inheritance, psychological depth, rebirth',
        card: cards[7],
        cardPath: getCardPath(cards[7])
      },
      {
        position: 9,
        house: '9th House',
        meaning: 'Philosophy, Adventure, Advanced Learning',
        description: 'Higher education, spirituality, long journeys, foreign cultures, beliefs and meaning',
        card: cards[8],
        cardPath: getCardPath(cards[8])
      },
      {
        position: 10,
        house: '10th House',
        meaning: 'Responsibility, Recognition, Career, Public Life',
        description: 'Your career, public reputation, authority, life purpose, achievements',
        card: cards[9],
        cardPath: getCardPath(cards[9])
      },
      {
        position: 11,
        house: '11th House',
        meaning: 'Community, Groups of Friends, Hopes, Goals',
        description: 'Your social circles, collective efforts, hopes and wishes, humanitarian ideals',
        card: cards[10],
        cardPath: getCardPath(cards[10])
      },
      {
        position: 12,
        house: '12th House',
        meaning: 'Retreat, Subconscious, Escapism, Self-Sabotage',
        description: 'The hidden self, spirituality, isolation, secrets, fears, karmic patterns, self-undoing',
        card: cards[11],
        cardPath: getCardPath(cards[11])
      }
    ],
    interpretation: `This spread maps your energies across all twelve houses of astrology, showing how different life areas influence and relate to each other. The 1st house (top) is your identity, moving clockwise through houses representing different life domains, with the 12th house (bottom) representing your hidden depths and spiritual evolution.`
  };
}

/**
 * CELTIC CROSS SPREAD
 * 10-card spread with detailed positions
 * @returns {Object} Ten cards with their meanings
 */
function celticCrossSpread() {
  const deck = shuffleDeck(createFullDeck());
  const cards = deck.slice(0, 10);
  
  return {
    spread: 'Celtic Cross (10-Card)',
    positions: [
      {
        position: 1,
        meaning: 'The Present Moment',
        description: 'Your current situation and what you are dealing with now',
        card: cards[0],
        cardPath: getCardPath(cards[0])
      },
      {
        position: 2,
        meaning: 'What Crosses You',
        description: 'The challenge or opposing force you are facing',
        card: cards[1],
        cardPath: getCardPath(cards[1])
      },
      {
        position: 3,
        meaning: 'Foundation of the Situation',
        description: 'The root cause, underlying principle, or basis of the matter',
        card: cards[2],
        cardPath: getCardPath(cards[2])
      },
      {
        position: 4,
        meaning: 'Recent Past',
        description: 'What has led you to this point; recent events or influences',
        card: cards[3],
        cardPath: getCardPath(cards[3])
      },
      {
        position: 5,
        meaning: 'Situations on the Horizon',
        description: 'What is approaching or coming into view',
        card: cards[4],
        cardPath: getCardPath(cards[4])
      },
      {
        position: 6,
        meaning: 'Near Future',
        description: 'What will happen in the near term',
        card: cards[5],
        cardPath: getCardPath(cards[5])
      },
      {
        position: 7,
        meaning: 'Querent at the Moment',
        description: 'Your current state of mind, emotions, or self-perception',
        card: cards[6],
        cardPath: getCardPath(cards[6])
      },
      {
        position: 8,
        meaning: 'Environment, Surroundings & Other Influences',
        description: 'External factors, people, or circumstances affecting you',
        card: cards[7],
        cardPath: getCardPath(cards[7])
      },
      {
        position: 9,
        meaning: 'Hopes and Fears of the Querent',
        description: 'What you deeply desire and what you fear most',
        card: cards[8],
        cardPath: getCardPath(cards[8])
      },
      {
        position: 10,
        meaning: 'Outcome or Where You\'re Headed',
        description: 'The likely outcome or final result of the current situation',
        card: cards[9],
        cardPath: getCardPath(cards[9])
      }
    ],
    interpretation: `The Celtic Cross is a comprehensive reading. Pay attention to how the cards flow from position 1-6 (timeline), positions 7-8 (internal and external factors), position 9 (inner truth), and position 10 (destination).`
  };
}

/**
 * Main function to get a spread by type
 * @param {string} spreadType - Type of spread: 'one', 'three', 'five', 'celtic', 'compatibility', 'horseshoe', or 'astrological'
 * @returns {Object} The requested spread with all card information
 */
function getTarotSpread(spreadType) {
  const typeMap = {
    'one': oneCardSpread,
    'three': threeCardSpread,
    'five': fiveCardSpread,
    'celtic': celticCrossSpread,
    'compatibility': compatibilitySpread,
    'horseshoe': horseshoeSpread,
    'astrological': astrologicalSpread
  };
  
  const spreadFunction = typeMap[spreadType.toLowerCase()];
  
  if (!spreadFunction) {
    throw new Error(`Invalid spread type: ${spreadType}. Choose from: 'one', 'three', 'five', 'celtic', 'compatibility', 'horseshoe', or 'astrological'`);
  }
  
  return spreadFunction();
}

/**
 * Get a random spread
 * @returns {Object} A randomly selected spread
 */
function getRandomSpread() {
  const spreadTypes = ['one', 'three', 'five', 'celtic', 'compatibility', 'horseshoe', 'astrological'];
  const randomType = spreadTypes[Math.floor(Math.random() * spreadTypes.length)];
  return getTarotSpread(randomType);
}

// Export functions for use in Node.js or browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTarotSpread,
    getRandomSpread,
    oneCardSpread,
    threeCardSpread,
    fiveCardSpread,
    celticCrossSpread,
    compatibilitySpread,
    horseshoeSpread,
    astrologicalSpread,
    createFullDeck,
    shuffleDeck,
    getCardPath,
    DECK
  };
}