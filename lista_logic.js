// lista_logic.js

// --- CONFIGURATION ZONE (The only place to edit GIDs, Key, and number of tabs) ---

// 1. List of ALL GIDs (9 GIDs total, index 0 through 8)
// Get these from your Google Sheet URL (the number after &gid=).
const TAB_GIDS = [
    '1636624790', // index 0 (Idag)
    '1204403917',      // index 1 
    '674604999',      // index 2
    '1153946543',      // index 3
    '780547244',      // index 4
    '130124250',      // index 5
    '323917698',      // index 6
    '510183968',      // index 7
];

// 2. Base URL information
// Get the long ID from your sheet URL: /d/YOUR_SHEET_KEY_HERE/edit
const SHEET_KEY = '1g-lihq6fKE0kCmiLdlgjaOfyJ6PcFHr14pH5VC9sxZo'; 
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_KEY}/preview?gid=`;

// 3. Current Tab Identification
// This variable is defined in the HTML files (dag0.html, dag1.html, etc.)
let CURRENT_TAB_INDEX; 

// --- END CONFIGURATION ZONE ---

// Helper arrays and functions for dynamic Swedish date naming
const DAY_NAMES = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];

function formatTabName(dayOffset) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    // Tab 1 (index 0) is always named "Idag"
    if (dayOffset === 0) {
        return "Idag";
    }

    // Format for Day Name DD/MM
    const dayName = DAY_NAMES[date.getDay()];
    const day = date.getDate().toString().padStart(1, '0');
    const month = (date.getMonth() + 1).toString().padStart(1, '0');

    return `${dayName} ${day}/${month}`;
}

// Function to build and activate the navigation tabs
function buildTabs() {
    const NAV_CONTAINER = document.getElementById('nav-container');
    
    // Safety check to ensure the container exists
    if (!NAV_CONTAINER) {
        console.error("NAV_CONTAINER element not found. Check dag0.html structure.");
        return;
    }
    
    NAV_CONTAINER.innerHTML = ''; // Clear existing content

    TAB_GIDS.forEach((gid, index) => {
        const tabName = formatTabName(index);
        const buttonLink = document.createElement('a');
        
        // Link to the generic file name based on its index
        buttonLink.href = `dag${index}.html`; 
        buttonLink.className = 'nav-button';
        buttonLink.textContent = tabName;

        // Set the 'active' class based on the index defined in the HTML file
        if (index === CURRENT_TAB_INDEX) { 
            buttonLink.classList.add('active');
        }

        NAV_CONTAINER.appendChild(buttonLink);
    });

    // Load the IFRAME source based on the current page's index
    const IFRAME = document.getElementById('sheetFrame');
    if (IFRAME && CURRENT_TAB_INDEX !== undefined) {
        // This is the CRITICAL line that sets the correct sheet content for the current page
        IFRAME.src = SHEET_BASE_URL + TAB_GIDS[CURRENT_TAB_INDEX];
    }
}

// Function to schedule a refresh (rebuild tabs) every day at 5:00 AM
function scheduleDailyUpdate() {
    const now = new Date();
    const fiveAM = new Date(now);
    
    // Set target to 5:00:00 AM
    fiveAM.setHours(5, 0, 0, 0);

    // If it's already past 5 AM, set the target for 5 AM tomorrow
    if (now.getTime() >= fiveAM.getTime()) {
        fiveAM.setDate(fiveAM.getDate() + 1);
    }

    const delay = fiveAM.getTime() - now.getTime();

    setTimeout(() => {
        // When 5 AM hits, rebuild the tabs (updates the dates)
        // We force a full page reload to ensure the new date is fully applied 
        // and browser cache is cleared.
        window.location.reload(true); 
        
        // Then re-schedule the next 5 AM update
        scheduleDailyUpdate();
    }, delay);
}

// ----------------------------------------------------
// Initialization
// ----------------------------------------------------

// Run the daily update timer when this file loads
scheduleDailyUpdate();
// NOTE: buildTabs is called from the refreshSheet function in dag0.html 
// to ensure it runs *after* the clock/splash logic is ready.
