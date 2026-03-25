// ============================================================
// MIDWEST FTTH COMPETITIVE INTELLIGENCE — DATA LAYER
// Surf Internet vs Ezee Fiber + Regional Competitors
// Focus: IL/IN/MI overlap zones for I Squared Capital meeting
// Last updated: March 2026
// ============================================================

// ---- PROVIDER DEFINITIONS ----
const PROVIDERS = {
    surf:      { name: "Surf Internet",              sponsor: "Bain Capital / Macquarie",     color: "#00759E", short: "SRF" },
    ezee:      { name: "Ezee Fiber",                 sponsor: "I Squared Capital",            color: "#BD000C", short: "EZE" },
    metronet:  { name: "MetroNet",                   sponsor: "KKR / Oak Hill",               color: "#B98E2C", short: "MET" },
    att:       { name: "AT&T Fiber",                 sponsor: "Public (NYSE: T)",             color: "#009FDB", short: "ATT" },
    frontier:  { name: "Frontier Fiber",             sponsor: "Public (NASDAQ: FYBR)",        color: "#E60000", short: "FTR" },
    comcast:   { name: "Comcast / Xfinity",          sponsor: "Public (NASDAQ: CMCSA)",       color: "#E31937", short: "CMC" },
    i3:        { name: "i3 Broadband",               sponsor: "Wren House Infrastructure",    color: "#469A6C", short: "I3B" },
    lumen:     { name: "Lumen / Quantum Fiber",      sponsor: "Public (NYSE: LUMN)",          color: "#4972AC", short: "LUM" },
    brightspeed:{ name: "Brightspeed",               sponsor: "Apollo Global",                color: "#8E8D83", short: "BRS" },
    spectrum:  { name: "Spectrum (Charter)",          sponsor: "Public (NASDAQ: CHTR)",        color: "#0072CE", short: "SPE" },
};

// ---- OPERATOR PROFILES ----
const OPERATOR_PROFILES = [
    {
        id: "surf",
        name: "Surf Internet",
        sponsor: "Bain Capital Credit / Macquarie Capital",
        hq: "Elkhart, Indiana",
        ceo: "Gene Crusie",
        states: ["IN", "IL", "MI"],
        stateCount: 3,
        metrics: [
            { label: "Fiber Passings", value: "250,000+", asOf: "Dec 2025", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "2025 Construction", value: "75,000+ new passings, 40 new markets", asOf: "Dec 2025", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "ABS Issuance", value: "$407M inaugural fiber ABS (Class A-2: A-, Class B: BBB)", asOf: "Mar 2026", source: "Telecompetitor", sourceUrl: "https://www.telecompetitor.com/surf-internet-completes-407m-abs/" },
            { label: "Equity Investment", value: "Macquarie Capital led (Jan 2026) + Bain Capital + Future Standard", asOf: "Jan 2026", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "Debt Facility", value: "$300M upsized (DigitalBridge Credit), Feb 2025", asOf: "Feb 2025", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "Total Capital Raised", value: "~$1.085B", asOf: "Mar 2026", source: "CBInsights", sourceUrl: "https://www.cbinsights.com/" },
            { label: "Strategy", value: "Rural/suburban Great Lakes FTTH, BEAD-funded expansion", asOf: "2026", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "COO", value: "Brent Williams (ex-Windstream SVP Engineering)", asOf: "May 2024", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/" },
            { label: "CFO", value: "Ryan Delack (Bain Capital affiliated)", asOf: "2025", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/" },
        ]
    },
    {
        id: "ezee",
        name: "Ezee Fiber",
        sponsor: "I Squared Capital (100% owned, ISQ Fund III)",
        hq: "Houston, TX",
        ceo: "Matt Marino (ex-Altice USA EVP)",
        states: ["TX", "NM", "WA", "IL", "MI", "OR"],
        stateCount: 6,
        metrics: [
            { label: "Fiber Passings", value: "600,000+ (post-Tachus)", asOf: "Dec 2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Total Announced Investment", value: "$1.25B+ across all markets", asOf: "Mar 2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Houston Build", value: "$200M expansion (core market)", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Chicagoland Build", value: "$400M — DuPage, Cook, Lake, Kane, Will counties", asOf: "Jul 2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Chicagoland Status", value: "First customers Jan 2026 (Oak Brook, Streamwood)", asOf: "Jan 2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Metro Detroit Build", value: "8 counties announced Feb 2026, construction started", asOf: "Feb 2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Washington State Build", value: "$400M — Greater Puget Sound", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "New Mexico Build", value: "$250M — Albuquerque, Santa Fe, Rio Rancho", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Oregon Expansion", value: "Salem area, construction starting H1 2026", asOf: "Feb 2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Tachus Acquisition", value: "~60K subs, 100% underground fiber in Houston", asOf: "Jul 2025", source: "PE Hub", sourceUrl: "https://www.pehub.com/" },
            { label: "Conterra NM Acquisition", value: "128 miles of fiber (Santa Fe, Rio Rancho)", asOf: "Dec 2024", source: "PE Hub", sourceUrl: "https://www.pehub.com/" },
            { label: "Pricing", value: "1G/$69, 2G/$89, 5G/$99, 8G/$119 — no contracts, Wi-Fi 7", asOf: "2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Midwest GM", value: "Greg Thomas, SVP & GM (ex-MCI President/COO)", asOf: "2025", source: "LinkedIn", sourceUrl: "https://www.linkedin.com/" },
            { label: "Estimated Revenue", value: "~$128M", asOf: "2025", source: "Bitscale", sourceUrl: "https://www.bitscale.com/" },
        ]
    },
    {
        id: "metronet",
        name: "MetroNet",
        sponsor: "KKR / Oak Hill Capital",
        hq: "Evansville, IN",
        ceo: "John Cinelli",
        states: ["IN", "IL", "MI", "OH", "KY", "IA", "WI", "MN", "FL", "VA", "NC", "TX"],
        stateCount: 16,
        metrics: [
            { label: "Homes Passed", value: "2M+", asOf: "2025", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/" },
            { label: "Build Rate", value: "500,000 passings/yr", asOf: "2025", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/" },
            { label: "Pen Rate", value: "35-43% mature markets", asOf: "2025", source: "Industry", sourceUrl: "https://www.metronetinc.com/" },
            { label: "T-Mobile Valuation", value: "$4,900/HHP (25.0x EBITDA)", asOf: "Jul 2024", source: "T-Mobile", sourceUrl: "https://www.t-mobile.com/" },
            { label: "T-Mobile JV Status", value: "Regulatory delay — insurance structure blocking", asOf: "Mar 2026", source: "UBS Internal", sourceUrl: "#" },
        ]
    },
    {
        id: "i3",
        name: "i3 Broadband",
        sponsor: "Wren House Infrastructure",
        hq: "Champaign, IL",
        ceo: "Paul Cronin",
        states: ["IL", "IN"],
        stateCount: 2,
        metrics: [
            { label: "Focus Markets", value: "Champaign-Urbana, Bloomington-Normal, Springfield, Peoria (IL)", asOf: "2025", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/" },
            { label: "Indiana Expansion", value: "Terre Haute, Muncie", asOf: "2025", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/" },
            { label: "Strategy", value: "Mid-size IL/IN metros, residential FTTH + MDU", asOf: "2025", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/" },
        ]
    },
    {
        id: "att",
        name: "AT&T Fiber",
        sponsor: "Public (NYSE: T)",
        hq: "Dallas, TX",
        ceo: "John Stankey",
        states: ["IL", "IN", "MI"],
        stateCount: 21,
        metrics: [
            { label: "National HHP Target", value: "60M by 2030", asOf: "2025", source: "AT&T Investor Day", sourceUrl: "https://investors.att.com/" },
            { label: "Lumen Acquisition", value: "Closed Feb 2, 2026 — adds mass-market fiber", asOf: "Feb 2026", source: "AT&T Newsroom", sourceUrl: "https://about.att.com/" },
            { label: "IL/IN/MI Presence", value: "ILEC in portions of IL, IN, MI (BellSouth/Ameritech legacy)", asOf: "2026", source: "AT&T", sourceUrl: "https://www.att.com/" },
        ]
    },
    {
        id: "frontier",
        name: "Frontier Fiber",
        sponsor: "Public (NASDAQ: FYBR) — Verizon acquiring",
        hq: "Dallas, TX",
        ceo: "Nick Jeffery",
        states: ["IL", "IN", "MI", "OH", "CT", "NY", "CA"],
        stateCount: 25,
        metrics: [
            { label: "Verizon Acquisition", value: "$20B (26.6x EBITDA), pending regulatory approval", asOf: "Sep 2024", source: "Verizon", sourceUrl: "https://www.verizon.com/" },
            { label: "IL/IN Legacy", value: "Former ILEC footprint in rural/suburban areas", asOf: "2025", source: "Frontier", sourceUrl: "https://frontier.com/" },
        ]
    },
    {
        id: "spectrum",
        name: "Spectrum (Charter Communications)",
        sponsor: "Public (NASDAQ: CHTR)",
        hq: "Stamford, CT",
        ceo: "Chris Winfrey",
        states: ["IL", "IN", "MI"],
        stateCount: 41,
        metrics: [
            { label: "Technology", value: "HFC + fiber overbuild (RDOF/BEAD areas)", asOf: "2026", source: "Charter", sourceUrl: "https://corporate.charter.com/" },
            { label: "Midwest Presence", value: "Significant cable footprint across IL, IN, MI metros", asOf: "2026", source: "Charter", sourceUrl: "https://corporate.charter.com/" },
        ]
    },
];

// ---- MAP MARKERS ----
const MARKETS = [
    // ======= SURF INTERNET — INDIANA (CORE) =======
    { lat: 41.683, lng: -85.977, name: "Elkhart, IN (HQ)", provider: "surf", passings: "Core market — headquarters", status: "Core Market", notes: "Surf's original market and HQ. Largest IN footprint.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 16 },
    { lat: 41.677, lng: -86.252, name: "South Bend, IN", provider: "surf", passings: "Active service", status: "Core Market", notes: "Major Surf market. Notre Dame metro.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 14 },
    { lat: 41.583, lng: -85.834, name: "Goshen, IN", provider: "surf", passings: "Active service", status: "Core Market", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 10 },
    { lat: 41.238, lng: -85.854, name: "Warsaw, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.473, lng: -87.061, name: "Valparaiso, IN", provider: "surf", passings: "Active service", status: "Active", notes: "NW Indiana, near Chicago metro.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 10 },
    { lat: 41.661, lng: -86.895, name: "Michigan City, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.607, lng: -86.727, name: "La Porte, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.473, lng: -87.346, name: "Merrillville, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 9 },
    { lat: 41.417, lng: -87.365, name: "Crown Point, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.532, lng: -87.252, name: "Hobart, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.494, lng: -87.268, name: "Highland, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 7 },
    { lat: 41.576, lng: -87.176, name: "Portage, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.346, lng: -86.310, name: "Plymouth, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 7 },
    { lat: 41.451, lng: -85.999, name: "Nappanee, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.534, lng: -85.825, name: "Middlebury, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.127, lng: -85.580, name: "Columbia City, IN", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },

    // ======= SURF INTERNET — ILLINOIS =======
    { lat: 41.525, lng: -88.082, name: "Joliet, IL", provider: "surf", passings: "Active service", status: "Active", notes: "Will County. Potential Ezee overlap zone.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 12, overlapWith: ["ezee"] },
    { lat: 41.120, lng: -87.861, name: "Kankakee, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 10 },
    { lat: 42.271, lng: -89.094, name: "Rockford, IL", provider: "surf", passings: "Active service", status: "Active", notes: "Major IL market for Surf.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 12 },
    { lat: 41.760, lng: -89.088, name: "Rock Falls, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.345, lng: -88.842, name: "Ottawa, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.327, lng: -89.128, name: "Peru / LaSalle, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8 },
    { lat: 41.379, lng: -89.127, name: "Princeton, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.364, lng: -89.055, name: "Mendota, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.357, lng: -88.421, name: "Morris, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 7 },
    { lat: 41.922, lng: -89.068, name: "Rochelle, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.470, lng: -87.640, name: "Steger, IL", provider: "surf", passings: "Active service", status: "Active", notes: "South suburban Chicago — Cook County edge.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 7, overlapWith: ["ezee"] },
    { lat: 41.432, lng: -87.990, name: "Manhattan, IL", provider: "surf", passings: "Active service", status: "Active", notes: "Will County.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.209, lng: -87.859, name: "Manteno, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.454, lng: -88.206, name: "Minooka, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.427, lng: -88.196, name: "Channahon, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.288, lng: -88.285, name: "Coal City, IL", provider: "surf", passings: "Active service", status: "Active", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6 },
    { lat: 41.506, lng: -87.636, name: "Chicago Heights, IL", provider: "surf", passings: "Active service", status: "Active", notes: "South Cook County.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8, overlapWith: ["ezee","comcast"] },

    // ======= SURF INTERNET — MICHIGAN =======
    { lat: 45.317, lng: -85.259, name: "Charlevoix, MI", provider: "surf", passings: "New build 2025", status: "New Build", notes: "Northern MI expansion (late 2025).", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8, isNew: true },
    { lat: 45.373, lng: -84.955, name: "Petoskey, MI", provider: "surf", passings: "New build 2025", status: "New Build", notes: "Northern MI expansion.", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 8, isNew: true },
    { lat: 45.249, lng: -84.917, name: "Boyne City, MI", provider: "surf", passings: "New build 2025", status: "New Build", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6, isNew: true },
    { lat: 45.359, lng: -84.918, name: "Harbor Springs, MI", provider: "surf", passings: "New build 2025", status: "New Build", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", size: 6, isNew: true },

    // ======= EZEE FIBER — ILLINOIS (CHICAGOLAND) =======
    { lat: 41.832, lng: -87.951, name: "Oak Brook, IL (Ezee)", provider: "ezee", passings: "First customers Jan 2026", status: "Active", notes: "$400M Chicagoland build. DuPage County. First live customers.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 14, isNew: true },
    { lat: 42.026, lng: -88.018, name: "Streamwood, IL (Ezee)", provider: "ezee", passings: "First customers Jan 2026", status: "Active", notes: "Cook/DuPage County line. Live customers.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 12, isNew: true },
    { lat: 41.994, lng: -87.971, name: "Elk Grove Village, IL (Ezee HQ)", provider: "ezee", passings: "Regional HQ", status: "Active", notes: "Midwest regional headquarters.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 10, isNew: true },
    { lat: 41.869, lng: -88.012, name: "DuPage County (Ezee)", provider: "ezee", passings: "$400M Chicagoland allocation", status: "Construction", notes: "Core Chicago suburban target. 5 counties: DuPage, Cook, Lake, Kane, Will.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 16, isNew: true },
    { lat: 42.100, lng: -88.040, name: "Lake County, IL (Ezee)", provider: "ezee", passings: "Planned", status: "Planned", notes: "Part of 5-county Chicagoland build.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 10, isNew: true },
    { lat: 41.900, lng: -88.300, name: "Kane County, IL (Ezee)", provider: "ezee", passings: "Planned", status: "Planned", notes: "Part of 5-county Chicagoland build.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 10, isNew: true },
    { lat: 41.550, lng: -88.050, name: "Will County, IL (Ezee)", provider: "ezee", passings: "Planned", status: "Planned", notes: "Southern Chicagoland. OVERLAP with Surf (Joliet, Manhattan, Channahon).", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 12, isNew: true, overlapWith: ["surf","comcast"] },
    { lat: 41.850, lng: -87.750, name: "Cook County suburbs (Ezee)", provider: "ezee", passings: "Planned", status: "Construction", notes: "Western/SW Cook County suburbs.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 12, isNew: true },

    // ======= EZEE FIBER — MICHIGAN (METRO DETROIT) =======
    { lat: 42.331, lng: -83.046, name: "Metro Detroit (Ezee)", provider: "ezee", passings: "8 counties announced", status: "Construction", notes: "Wayne, Macomb, Oakland, Washtenaw, Genesee, St. Clair, Monroe, Livingston. Construction started Feb 2026.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 16, isNew: true },
    { lat: 42.480, lng: -83.145, name: "Oakland County, MI (Ezee)", provider: "ezee", passings: "Planned", status: "Construction", notes: "Affluent Detroit suburbs (Troy, Royal Oak, Birmingham).", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 12, isNew: true },
    { lat: 42.530, lng: -82.917, name: "Macomb County, MI (Ezee)", provider: "ezee", passings: "Planned", status: "Construction", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 10, isNew: true },
    { lat: 42.283, lng: -83.749, name: "Washtenaw County, MI (Ezee)", provider: "ezee", passings: "Planned", status: "Planned", notes: "Ann Arbor metro.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 10, isNew: true },
    { lat: 43.012, lng: -83.688, name: "Genesee County, MI (Ezee)", provider: "ezee", passings: "Planned", status: "Planned", notes: "Flint metro.", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", size: 8, isNew: true },

    // ======= METRONET — INDIANA =======
    { lat: 39.769, lng: -86.158, name: "Indianapolis, IN (MetroNet)", provider: "metronet", passings: "Core market", status: "Core Market", notes: "MetroNet's largest market. 2M+ HHP nationally.", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 16 },
    { lat: 40.417, lng: -86.876, name: "Lafayette, IN (MetroNet)", provider: "metronet", passings: "Core market", status: "Core Market", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 37.975, lng: -87.556, name: "Evansville, IN (MetroNet HQ)", provider: "metronet", passings: "Headquarters + core", status: "Core Market", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 12 },
    { lat: 40.195, lng: -85.386, name: "Muncie, IN (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 8 },
    { lat: 40.484, lng: -86.133, name: "Kokomo, IN (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 8 },

    // ======= METRONET — ILLINOIS =======
    { lat: 40.484, lng: -88.994, name: "Bloomington-Normal, IL (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 40.694, lng: -89.589, name: "Peoria, IL (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 39.799, lng: -89.644, name: "Springfield, IL (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 38.627, lng: -90.199, name: "Metro East / St. Louis, IL (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },

    // ======= METRONET — MICHIGAN =======
    { lat: 42.732, lng: -84.556, name: "Lansing, MI (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 42.291, lng: -85.587, name: "Kalamazoo, MI (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 10 },
    { lat: 42.963, lng: -85.668, name: "Grand Rapids, MI (MetroNet)", provider: "metronet", passings: "Active", status: "Active", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", size: 12 },

    // ======= i3 BROADBAND =======
    { lat: 40.116, lng: -88.243, name: "Champaign-Urbana, IL (i3)", provider: "i3", passings: "Core market", status: "Core Market", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/", size: 12 },
    { lat: 40.484, lng: -88.994, name: "Bloomington, IL (i3)", provider: "i3", passings: "Active", status: "Active", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/", size: 8 },
    { lat: 39.799, lng: -89.644, name: "Springfield, IL (i3)", provider: "i3", passings: "Active", status: "Active", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/", size: 8 },
    { lat: 40.694, lng: -89.589, name: "Peoria, IL (i3)", provider: "i3", passings: "Active", status: "Active", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/", size: 8 },

    // ======= AT&T FIBER — MAJOR MIDWEST METROS =======
    { lat: 41.878, lng: -87.630, name: "Chicago Metro (AT&T)", provider: "att", passings: "Major ILEC — extensive fiber", status: "Core Market", notes: "Ameritech legacy. Deep fiber footprint across Chicagoland.", source: "AT&T", sourceUrl: "https://www.att.com/", size: 16 },
    { lat: 42.331, lng: -83.046, name: "Detroit Metro (AT&T)", provider: "att", passings: "ILEC coverage", status: "Core Market", notes: "Ameritech legacy territory.", source: "AT&T", sourceUrl: "https://www.att.com/", size: 14, overlapWith: ["ezee"] },
    { lat: 39.769, lng: -86.158, name: "Indianapolis (AT&T)", provider: "att", passings: "ILEC coverage", status: "Core Market", source: "AT&T", sourceUrl: "https://www.att.com/", size: 14, overlapWith: ["metronet"] },

    // ======= COMCAST — MAJOR PRESENCE =======
    { lat: 41.880, lng: -87.627, name: "Chicago (Comcast)", provider: "comcast", passings: "Major cable incumbent", status: "Core Market", notes: "Dominant cable provider in Chicagoland. Xfinity brand.", source: "Comcast", sourceUrl: "https://corporate.comcast.com/", size: 14, overlapWith: ["ezee","att"] },
    { lat: 42.333, lng: -83.048, name: "Detroit (Comcast)", provider: "comcast", passings: "Major cable incumbent", status: "Core Market", notes: "Significant SE Michigan footprint.", source: "Comcast", sourceUrl: "https://corporate.comcast.com/", size: 12, overlapWith: ["ezee","att"] },
    { lat: 39.771, lng: -86.156, name: "Indianapolis (Comcast)", provider: "comcast", passings: "Cable incumbent", status: "Core Market", source: "Comcast", sourceUrl: "https://corporate.comcast.com/", size: 12 },

    // ======= SPECTRUM =======
    { lat: 42.963, lng: -85.668, name: "Grand Rapids, MI (Spectrum)", provider: "spectrum", passings: "Cable incumbent", status: "Core Market", source: "Spectrum", sourceUrl: "https://www.spectrum.com/", size: 12, overlapWith: ["metronet"] },
    { lat: 42.115, lng: -87.861, name: "North Shore IL (Spectrum)", provider: "spectrum", passings: "Cable presence", status: "Active", source: "Spectrum", sourceUrl: "https://www.spectrum.com/", size: 10, overlapWith: ["ezee"] },
];

// ---- ANNOUNCED BUILDS (for Build Pipeline tab) ----
const BUILDS = [
    { provider: "surf", market: "Northern Michigan", state: "MI", status: "NEW BUILD", targetHHP: "TBD", timeline: "Late 2025 — 2026", overlap: "None (greenfield)", notes: "Charlevoix, Petoskey, Boyne City, Harbor Springs", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
    { provider: "surf", market: "NW Indiana expansion", state: "IN", status: "EXPANDING", targetHHP: "75K+ (2025)", timeline: "Ongoing", overlap: "MetroNet (limited)", notes: "Valparaiso, Crown Point, Merrillville, Portage region", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
    { provider: "surf", market: "IL downstate / exurban Chicago", state: "IL", status: "ACTIVE", targetHHP: "Ongoing build", timeline: "Ongoing", overlap: "Low — rural/exurban focus", notes: "Joliet, Kankakee, Rockford, Morris, Ottawa. Surf more rural vs Ezee suburban", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/", overlapRisk: "Medium" },
    { provider: "surf", market: "BEAD expansion", state: "IN/IL/MI", status: "PLANNED", targetHHP: "TBD — BEAD eligible", timeline: "2026-2028", overlap: "BEAD-protected areas", notes: "Surf positioning for BEAD grants across all 3 states", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
    { provider: "ezee", market: "Chicagoland (5 counties)", state: "IL", status: "ACTIVE", targetHHP: "$400M investment", timeline: "2025-2028", overlap: "Comcast incumbent; AT&T fiber; Surf exurban edge", notes: "DuPage, Cook, Lake, Kane, Will. First customers Jan 2026 (Oak Brook, Streamwood). Regional HQ in Elk Grove Village", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", overlapRisk: "High" },
    { provider: "ezee", market: "Metro Detroit (8 counties)", state: "MI", status: "CONSTRUCTION", targetHHP: "TBD — 8 counties", timeline: "Q2 2026 first installs", overlap: "AT&T + Comcast incumbents; Spectrum partial", notes: "Wayne, Macomb, Oakland, Washtenaw, Genesee, St. Clair, Monroe, Livingston. Construction started Feb 2026", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/", overlapRisk: "High" },
    { provider: "ezee", market: "Oregon (Salem)", state: "OR", status: "PLANNED", targetHHP: "TBD", timeline: "H1 2026", overlap: "N/A (outside scope)", notes: "New state entry", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
    { provider: "metronet", market: "Michigan statewide", state: "MI", status: "EXPANDING", targetHHP: "500K/yr nationally", timeline: "Ongoing", overlap: "Ezee in Detroit; Spectrum in GR", notes: "Grand Rapids, Lansing, Kalamazoo active. 2M+ passings nationally", source: "MetroNet", sourceUrl: "https://www.metronetinc.com/", overlapRisk: "Medium" },
    { provider: "i3", market: "Central IL metros", state: "IL", status: "ACTIVE", targetHHP: "Ongoing", timeline: "Ongoing", overlap: "MetroNet in Bloomington/Peoria/Springfield", notes: "Champaign-Urbana core. Wren House backing. Direct MetroNet competitor in mid-IL", source: "i3 Broadband", sourceUrl: "https://www.i3broadband.com/", overlapRisk: "Medium" },
];

// ---- OVERLAP ANALYSIS MATRIX ----
const OVERLAP_MATRIX = [
    { market: "Will County, IL (Joliet)", state: "IL", surf: "active", ezee: "planned", metronet: null, att: "active", comcast: "core", spectrum: null, i3: null, risk: "HIGH", notes: "Direct Surf/Ezee overlap. Ezee Will County build into Surf's Joliet territory" },
    { market: "South Cook County, IL", state: "IL", surf: "active", ezee: "building", metronet: null, att: "core", comcast: "core", spectrum: null, i3: null, risk: "HIGH", notes: "Steger, Chicago Heights — Surf active, Ezee expanding south from Oak Brook" },
    { market: "DuPage County, IL", state: "IL", surf: null, ezee: "active", metronet: null, att: "core", comcast: "core", spectrum: null, i3: null, risk: "Medium", notes: "Ezee's primary Chicagoland focus. No Surf presence" },
    { market: "Lake County, IL", state: "IL", surf: null, ezee: "planned", metronet: null, att: "active", comcast: "core", spectrum: "active", i3: null, risk: "Medium", notes: "Ezee planned; Spectrum + AT&T incumbents" },
    { market: "Kane County, IL", state: "IL", surf: null, ezee: "planned", metronet: null, att: "active", comcast: "core", spectrum: null, i3: null, risk: "Low", notes: "Ezee planned; no Surf presence" },
    { market: "Rockford, IL", state: "IL", surf: "active", ezee: null, metronet: null, att: "active", comcast: "core", spectrum: null, i3: null, risk: "Low", notes: "Surf active, no Ezee plans" },
    { market: "Metro Detroit, MI (8 counties)", state: "MI", surf: null, ezee: "building", metronet: null, att: "core", comcast: "core", spectrum: null, i3: null, risk: "Medium", notes: "Ezee 8-county build announced Feb 2026. No Surf presence" },
    { market: "Northern Michigan", state: "MI", surf: "building", ezee: null, metronet: null, att: "limited", comcast: null, spectrum: "active", i3: null, risk: "Low", notes: "Surf new build area. No Ezee plans" },
    { market: "Grand Rapids, MI", state: "MI", surf: null, ezee: null, metronet: "active", att: "active", comcast: "active", spectrum: "core", i3: null, risk: "Low", notes: "MetroNet vs Spectrum/AT&T. Neither Surf nor Ezee present" },
    { market: "Bloomington-Normal, IL", state: "IL", surf: null, ezee: null, metronet: "active", att: "active", comcast: "core", spectrum: null, i3: "active", risk: "Medium", notes: "MetroNet vs i3 vs AT&T overlap" },
    { market: "Elkhart / South Bend, IN", state: "IN", surf: "core", ezee: null, metronet: null, att: "active", comcast: "active", spectrum: null, i3: null, risk: "Low", notes: "Surf's home turf. No competitive fiber threat" },
    { market: "NW Indiana (Gary/Merrillville)", state: "IN", surf: "active", ezee: null, metronet: null, att: "active", comcast: "core", spectrum: null, i3: null, risk: "Low", notes: "Surf expanding in Chicago exurbs. No Ezee plans" },
    { market: "Indianapolis, IN", state: "IN", surf: null, ezee: null, metronet: "core", att: "core", comcast: "core", spectrum: null, i3: null, risk: "N/A", notes: "MetroNet vs AT&T. Neither Surf nor Ezee" },
];

// ---- CALCULATIONS ----
const CALCULATIONS = {
    surfABS: {
        label: "Surf Internet ABS Capacity",
        formula: "$332M secured + $75M VFN = $407M total",
        result: "$407M",
        inputs: [
            { label: "Secured Term Notes", value: "$332M", asOf: "Mar 2026", source: "Telecompetitor", sourceUrl: "https://www.telecompetitor.com/surf-internet-completes-407m-abs/" },
            { label: "Variable Funding Note", value: "$75M", asOf: "Mar 2026", source: "Telecompetitor", sourceUrl: "https://www.telecompetitor.com/surf-internet-completes-407m-abs/" },
            { label: "Class A-2 Rating", value: "A-", asOf: "Mar 2026", source: "Goldman Sachs (structurer)", sourceUrl: "#" },
            { label: "Class B Rating", value: "BBB", asOf: "Mar 2026", source: "Goldman Sachs", sourceUrl: "#" },
        ],
        caveat: "Inaugural fiber ABS. Goldman Sachs structured and led. Oversubscribed multiple times."
    },
    ezeeInvestment: {
        label: "Ezee Fiber Total Announced Investment",
        formula: "$200M (TX) + $250M (NM) + $400M (WA) + $400M (IL) = $1.25B+",
        result: "$1.25B+",
        inputs: [
            { label: "Houston, TX", value: "$200M", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "New Mexico", value: "$250M", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Washington State", value: "$400M", asOf: "2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
            { label: "Chicagoland, IL", value: "$400M", asOf: "Jul 2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
        ],
        caveat: "Does not include Metro Detroit (Feb 2026) or Oregon (Feb 2026) — investment amounts not disclosed for those markets."
    },
    combinedPlatform: {
        label: "Hypothetical Combined Surf + Ezee Platform",
        formula: "250K (Surf) + 600K (Ezee) = 850K+ passings",
        result: "850K+ passings",
        inputs: [
            { label: "Surf Passings", value: "250,000+", asOf: "Dec 2025", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "Ezee Passings", value: "600,000+", asOf: "Dec 2025", source: "Ezee Fiber", sourceUrl: "https://www.ezeefiber.com/" },
        ],
        caveat: "Hypothetical combination. Sponsors (Bain/Macquarie vs I Squared) would make a merger structurally complex. Geographic overlap limited to IL (partial) and MI (minimal current)."
    },
    surfValuation: {
        label: "Surf Implied Valuation (ABS-Based)",
        formula: "ABS: $407M. At market comps: $2,500-2,800/HHP x 250K = $625M-$700M EV",
        result: "$625M - $700M EV (est.)",
        inputs: [
            { label: "Passings", value: "250,000+", asOf: "Dec 2025", source: "Surf Internet", sourceUrl: "https://www.surfinternet.com/" },
            { label: "Market $/HHP range", value: "$2,500 - $2,800", asOf: "Mar 2026", source: "Lazard/UBS", sourceUrl: "#" },
            { label: "ABS capacity", value: "$407M (debt)", asOf: "Mar 2026", source: "Telecompetitor", sourceUrl: "https://www.telecompetitor.com/surf-internet-completes-407m-abs/" },
        ],
        caveat: "Revenue/EBITDA not publicly disclosed. Implied from ABS capacity and passing count. Surf is testing the market for IOIs."
    },
};
