// kiosk_logic.js

// --- CONFIGURATION ZONE (The only place you edit the number of tabs) ---

// 1. List of ALL GIDs
// If you want 10 tabs, you just add two more GIDs here.
const TAB_GIDS = [
    '123456789', // index 0 (Idag)
    '234567890', // index 1
    // ... add the rest of your GIDs
];

// 2. Base URL info
const SHEET_KEY = 'YOUR_SHEET_KEY_HERE';
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_KEY}/edit?single=true&widget=false&chrome=false&readonly=true&gid=`;

// 3. Current Tab Identification
// **CRITICAL:** This variable is defined in the HTML file, telling this script which GID to load.
let CURRENT_TAB_INDEX; 

// --- END CONFIGURATION ZONE ---

// ... (Rest of your formatTabName, DAY_NAMES, scheduleDailyUpdate functions go here) ...

function buildTabs() {
    const NAV_CONTAINER = document.getElementById('nav-container');
    NAV_CONTAINER.innerHTML = ''; 

    TAB_GIDS.forEach((gid, index) => {
        const tabName = formatTabName(index);
        const buttonLink = document.createElement('a');
        
        // Link to the generic file name based on its index
        buttonLink.href = `kiosk_tab_${index}.html`; 
        buttonLink.className = 'nav-button';
        buttonLink.textContent = tabName;

        // Set the active class based on the index defined in the HTML file
        if (index === CURRENT_TAB_INDEX) { 
            buttonLink.classList.add('active');
        }

        NAV_CONTAINER.appendChild(buttonLink);
    });

    // Load the IFRAME only on the first load
    const IFRAME = document.getElementById('sheetFrame');
    if (IFRAME && CURRENT_TAB_INDEX !== undefined) {
        IFRAME.src = SHEET_BASE_URL + TAB_GIDS[CURRENT_TAB_INDEX];
    }
}

// ... (Initialization logic runs here) ...
window.addEventListener('load', buildTabs);
scheduleDailyUpdate(); 
// ... (Your existing clock and splash screen JS goes here) ...
