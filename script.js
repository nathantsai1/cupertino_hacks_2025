// Background color change
const colors = [
    'linear-gradient(135deg, #e0f7fa, #b9fbc0)',
    'linear-gradient(135deg, #f4e4bc, #f9d5e5)',
    'linear-gradient(135deg, #d4fc79, #96e6a1)',
    'linear-gradient(135deg, #a1c4fd, #c2e9fb)'
];
let colorIndex = 0;

document.getElementById('color-btn').addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.background = colors[colorIndex];
});

// Fun facts
const facts = [
    "Biodiversity supports 70% of global agriculture through pollination.",
    "Over 1 million species are at risk of extinction due to habitat loss.",
    "Coral reefs house 25% of marine life despite covering less than 0.1% of the ocean floor.",
    "Forests absorb 30% of global CO2 emissions annually."
];
let factIndex = 0;

document.getElementById('fact-btn').addEventListener('click', () => {
    const factText = document.getElementById('fact-text');
    factText.textContent = facts[factIndex];
    factText.style.opacity = '0';
    setTimeout(() => {
        factText.style.opacity = '1';
    }, 100);
    factIndex = (factIndex + 1) % facts.length;
});