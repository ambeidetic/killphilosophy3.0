/**
 * Database Manager for KillPhilosophy
 * Handles all data storage, retrieval, and manipulation operations
 */

class DatabaseManager {
    constructor() {
        this.academics = {}; // Academic data
        this.noveltyTiles = []; // Recent updates and interesting content
        this.pendingSubmissions = []; // Submissions awaiting approval
        this.favorites = []; // User favorite academics
        
        // Initialize when the DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.loadData();
        });
    }
    
    /**
     * Load all data from localStorage
     */
    loadData() {
        try {
            // Load academics
            const savedAcademics = localStorage.getItem('killphilosophy_academics');
            if (savedAcademics) {
                this.academics = JSON.parse(savedAcademics);
            }
            
            // Load novelty tiles
            const savedNovelties = localStorage.getItem('killphilosophy_novelties');
            if (savedNovelties) {
                this.noveltyTiles = JSON.parse(savedNovelties);
            }
            
            // Load pending submissions
            const savedSubmissions = localStorage.getItem('killphilosophy_submissions');
            if (savedSubmissions) {
                this.pendingSubmissions = JSON.parse(savedSubmissions);
            }
            
            // Load favorites
            const savedFavorites = localStorage.getItem('killphilosophy_favorites');
            if (savedFavorites) {
                this.favorites = JSON.parse(savedFavorites);
            }
            
            console.log('Database loaded successfully');
            
            // If empty, load some sample data
            if (Object.keys(this.academics).length === 0) {
                this.loadSampleData();
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
    }
    
    /**
     * Save all data to localStorage
     */
    saveData() {
        try {
            localStorage.setItem('killphilosophy_academics', JSON.stringify(this.academics));
            localStorage.setItem('killphilosophy_novelties', JSON.stringify(this.noveltyTiles));
            localStorage.setItem('killphilosophy_submissions', JSON.stringify(this.pendingSubmissions));
            localStorage.setItem('killphilosophy_favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }
    
    /**
     * Load sample data for demonstration
     */
    loadSampleData() {
        console.log('Loading sample academic data');
        
        const sampleAcademics = {
            "michel-foucault": {
                "name": "Michel Foucault",
                "bio": "French philosopher, historian of ideas, and social theorist known for his critical studies of social institutions and his work on the history of human sexuality.",
                "taxonomies": {
                    "discipline": ["Philosophy", "History", "Sociology"],
                    "tradition": ["Post-structuralism", "Critical Theory"],
                    "era": ["20th Century"],
                    "methodology": ["Genealogy", "Discourse Analysis", "Archaeology"],
                    "theme": ["Power", "Knowledge", "Sexuality", "Discipline", "Governmentality"]
                },
                "papers": [
                    { "title": "The Order of Things", "year": 1966, "coauthors": [] },
                    { "title": "Discipline and Punish", "year": 1975, "coauthors": [] },
                    { "title": "The History of Sexuality", "year": 1976, "coauthors": [] }
                ],
                "events": [
                    { "title": "Lectures at the Collège de France", "year": 1970, "location": "Paris, France" },
                    { "title": "Visiting Professor", "year": 1975, "location": "University of California, Berkeley" }
                ],
                "connections": ["Jacques Derrida", "Gilles Deleuze", "Judith Butler"]
            },
            "jacques-derrida": {
                "name": "Jacques Derrida",
                "bio": "French philosopher known for developing a form of semiotic analysis known as deconstruction.",
                "taxonomies": {
                    "discipline": ["Philosophy", "Literary Theory"],
                    "tradition": ["Post-structuralism", "Deconstruction"],
                    "era": ["20th Century"],
                    "methodology": ["Deconstruction", "Textual Analysis"],
                    "theme": ["Language", "Writing", "Difference", "Ethics"]
                },
                "papers": [
                    { "title": "Of Grammatology", "year": 1967, "coauthors": [] },
                    { "title": "Writing and Difference", "year": 1967, "coauthors": [] },
                    { "title": "Margins of Philosophy", "year": 1972, "coauthors": [] }
                ],
                "events": [
                    { "title": "Teaching at the École Normale Supérieure", "year": 1964, "location": "Paris, France" },
                    { "title": "Visiting Professor", "year": 1975, "location": "Johns Hopkins University" }
                ],
                "connections": ["Michel Foucault", "Emmanuel Levinas", "Paul de Man"]
            },
            "judith-butler": {
                "name": "Judith Butler",
                "bio": "American philosopher and gender theorist whose work has influenced political philosophy, ethics, and the fields of feminist, queer, and literary theory.",
                "taxonomies": {
                    "discipline": ["Philosophy", "Gender Studies", "Literary Theory"],
                    "tradition": ["Post-structuralism", "Feminist Theory", "Queer Theory"],
                    "era": ["20th Century", "Contemporary"],
                    "methodology": ["Discourse Analysis", "Genealogy"],
                    "theme": ["Gender", "Sexuality", "Identity", "Performativity", "Ethics"]
                },
                "papers": [
                    { "title": "Gender Trouble", "year": 1990, "coauthors": [] },
                    { "title": "Bodies That Matter", "year": 1993, "coauthors": [] },
                    { "title": "Precarious Life", "year": 2004, "coauthors": [] }
                ],
                "events": [
                    { "title": "Maxine Elliot Professor", "year": 1998, "location": "University of California, Berkeley" },
                    { "title": "Hannah Arendt Chair", "year": 2012, "location": "European Graduate School" }
                ],
                "connections": ["Michel Foucault", "Donna Haraway", "Gayatri Spivak"]
            },
            "gilles-deleuze": {
                "name": "Gilles Deleuze",
                "bio": "French philosopher who, from the early 1960s until his death in 1995, wrote on philosophy, literature, film, and fine art.",
                "taxonomies": {
                    "discipline": ["Philosophy", "Literary Theory"],
                    "tradition": ["Post-structuralism", "Continental Philosophy"],
                    "era": ["20th Century"],
                    "methodology": ["Immanent Critique", "Conceptual Creation"],
                    "theme": ["Difference", "Repetition", "Rhizome", "Desire", "Immanence"]
                },
                "papers": [
                    { "title": "Difference and Repetition", "year": 1968, "coauthors": [] },
                    { "title": "Anti-Oedipus", "year": 1972, "coauthors": ["Félix Guattari"] },
                    { "title": "A Thousand Plateaus", "year": 1980, "coauthors": ["Félix Guattari"] }
                ],
                "events": [
                    { "title": "Teaching at the University of Paris VIII", "year": 1969, "location": "Paris, France" },
                    { "title": "Final Lecture", "year": 1987, "location": "University of Paris VIII" }
                ],
                "connections": ["Michel Foucault", "Félix Guattari", "Jacques Derrida"]
            },
            "donna-haraway": {
                "name": "Donna Haraway",
                "bio": "American scholar in the field of science and technology studies, a feminist, and a professor in the History of Consciousness Department at the University of California, Santa Cruz.",
                "taxonomies": {
                    "discipline": ["Philosophy", "Science and Technology Studies", "Feminist Theory"],
                    "tradition": ["Feminist Theory", "Post-humanism"],
                    "era": ["20th Century", "Contemporary"],
                    "methodology": ["Cultural Analysis", "Critical Theory"],
                    "theme": ["Technology", "Gender", "Nature/Culture", "Cyborg", "Species"]
                },
                "papers": [
                    { "title": "A Cyborg Manifesto", "year": 1985, "coauthors": [] },
                    { "title": "Simians, Cyborgs, and Women", "year": 1991, "coauthors": [] },
                    { "title": "Staying with the Trouble", "year": 2016, "coauthors": [] }
                ],
                "events": [
                    { "title": "Professor of History of Consciousness", "year": 1980, "location": "University of California, Santa Cruz" },
                    { "title": "Distinguished Lecture", "year": 2000, "location": "Harvard University" }
                ],
                "connections": ["Judith Butler", "Bruno Latour", "Karen Barad"]
            }
        };
        
        // Add sample academics to database
        this.academics = sampleAcademics;
        
        // Add sample novelty tiles
        this.noveltyTiles = [
            {
                title: "New Academic Added: Karen Barad",
                content: "Karen Barad's profile has been added to the database, featuring her work on feminist theory, posthumanism, and agential realism.",
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                type: "academic"
            },
            {
                title: "New Connection Discovered",
                content: "Research has revealed a significant intellectual exchange between Michel Foucault and Judith Butler during Butler's early work on gender performativity.",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                type: "connection"
            },
            {
                title: "Recently Added Paper",
                content: "Newly added to Donna Haraway's profile: 'The Companion Species Manifesto' (2003).",
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                type: "paper"
            }
        ];
        
        // Save the sample data
        this.saveData();
        
        console.log('Sample data loaded and saved');
    }
    
    /**
     * Get all academics as an array
     * @returns {Array} Array of academic objects
     */
    getAllAcademics() {
        return Object.values(this.academics);
    }
    
    /**
     * Get a specific academic by name
     * @param {string} name - Academic name
     * @returns {Object|null} Academic object or null if not found
     */
    getAcademic(name) {
        // Try exact match
        for (const key in this.academics) {
            if (this.academics[key].name === name) {
                return this.academics[key];
            }
        }
        
        // Try case-insensitive match
        const nameLower = name.toLowerCase();
        for (const key in this.academics) {
            if (this.academics[key].name.toLowerCase() === nameLower) {
                return this.academics[key];
            }
        }
        
        return null;
    }
    
    /**
     * Search academics by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} Array of matching academic objects
     */
    searchAcademics(criteria) {
        if (!criteria || Object.keys(criteria).length === 0) {
            return this.getAllAcademics();
        }
        
        return this.getAllAcademics().filter(academic => {
            // Check each criterion
            for (const key in criteria) {
                const value = criteria[key];
                
                // Name search
                if (key === 'name') {
                    if (!academic.name.toLowerCase().includes(value.toLowerCase())) {
                        return false;
                    }
                    continue;
                }
                
                // Bio search
                if (key === 'bio') {
                    if (!academic.bio || !academic.bio.toLowerCase().includes(value.toLowerCase())) {
                        return false;
                    }
                    continue;
                }
                
                // Taxonomy search
                if (academic.taxonomies && academic.taxonomies[key]) {
                    // If value is an array, check if any taxonomy value is in the criteria array
                    if (Array.isArray(value)) {
                        if (!value.some(v => academic.taxonomies[key].includes(v))) {
                            return false;
                        }
                    } 
                    // Otherwise check if the taxonomy includes the value
                    else if (!academic.taxonomies[key].includes(value)) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    /**
     * Add or update an academic
     * @param {Object} academic - Academic object
     * @returns {boolean} Success indicator
     */
    addOrUpdateAcademic(academic) {
        if (!academic || !academic.name) {
            return false;
        }
        
        try {
            // Generate a key from the name
            const key = academic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            
            // Add or update the academic
            this.academics[key] = academic;
            
            // Save data
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error adding/updating academic:', error);
            return false;
        }
    }
    
    /**
     * Delete an academic
     * @param {string} name - Academic name
     * @returns {boolean} Success indicator
     */
    deleteAcademic(name) {
        for (const key in this.academics) {
            if (this.academics[key].name === name) {
                delete this.academics[key];
                this.saveData();
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get all taxonomy categories with their values
     * @returns {Object} Taxonomy categories
     */
    getAllTaxonomyCategories() {
        const taxonomies = {
            discipline: new Set(),
            tradition: new Set(),
            era: new Set(),
            methodology: new Set(),
            theme: new Set()
        };
        
        // Collect all taxonomy values
        this.getAllAcademics().forEach(academic => {
            if (academic.taxonomies) {
                for (const category in taxonomies) {
                    if (academic.taxonomies[category]) {
                        academic.taxonomies[category].forEach(value => {
                            taxonomies[category].add(value);
                        });
                    }
                }
            }
        });
        
        // Convert Sets to Arrays
        const result = {};
        for (const category in taxonomies) {
            result[category] = Array.from(taxonomies[category]).sort();
        }
        
        return result;
    }
    
    /**
     * Get user favorites
     * @returns {Array} Array of favorite academic names
     */
    getFavorites() {
        return this.favorites;
    }
    
    /**
     * Add an academic to favorites
     * @param {string} name - Academic name
     * @returns {boolean} Success indicator
     */
    addToFavorites(name) {
        if (!name || this.favorites.includes(name)) {
            return false;
        }
        
        try {
            this.favorites.push(name);
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            return false;
        }
    }
    
    /**
     * Remove an academic from favorites
     * @param {string} name - Academic name
     * @returns {boolean} Success indicator
     */
    removeFromFavorites(name) {
        const index = this.favorites.indexOf(name);
        if (index === -1) {
            return false;
        }
        
        try {
            this.favorites.splice(index, 1);
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            return false;
        }
    }
    
    /**
     * Get recent novelty tiles
     * @param {number} count - Number of tiles to get
     * @returns {Array} Array of novelty tiles
     */
    getRecentNoveltyTiles(count = 10) {
        // Sort by date (newest first)
        return [...this.noveltyTiles]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, count);
    }
    
    /**
     * Add a novelty tile
     * @param {Object} tile - Novelty tile object
     * @returns {boolean} Success indicator
     */
    addNoveltyTile(tile) {
        if (!tile || !tile.title || !tile.content) {
            return false;
        }
        
        try {
            // Make sure the tile has a date
            if (!tile.date) {
                tile.date = new Date().toISOString();
            }
            
            // Add the tile
            this.noveltyTiles.push(tile);
            
            // Keep only the most recent 100 tiles
            if (this.noveltyTiles.length > 100) {
                this.noveltyTiles = this.noveltyTiles
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 100);
            }
            
            // Save data
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error adding novelty tile:', error);
            return false;
        }
    }
    
    /**
     * Add a pending submission
     * @param {Object} submission - Submission object
     * @returns {boolean} Success indicator
     */
    addPendingSubmission(submission) {
        if (!submission) {
            return false;
        }
        
        try {
            // Add the submission
            this.pendingSubmissions.push(submission);
            
            // Save data
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error adding pending submission:', error);
            return false;
        }
    }
    
    /**
     * Get all pending submissions
     * @returns {Array} Array of pending submissions
     */
    getPendingSubmissions() {
        return this.pendingSubmissions;
    }
    
    /**
     * Approve a pending submission
     * @param {number} index - Submission index
     * @returns {boolean} Success indicator
     */
    approvePendingSubmission(index) {
        if (index < 0 || index >= this.pendingSubmissions.length) {
            return false;
        }
        
        try {
            // Get the submission
            const submission = this.pendingSubmissions[index];
            
            // Process based on submission type
            if (submission.contributionType === 'paper' ||
                submission.contributionType === 'event' ||
                submission.contributionType === 'connection' ||
                submission.contributionType === 'taxonomy' ||
                submission.contributionType === 'bio') {
                
                // Get or create the academic
                let academic = this.getAcademic(submission.academicName);
                if (!academic) {
                    academic = {
                        name: submission.academicName,
                        papers: [],
                        events: [],
                        connections: [],
                        taxonomies: {}
                    };
                }
                
                // Update the academic with the submission data
                switch (submission.data.type) {
                    case 'paper':
                        if (!academic.papers) {
                            academic.papers = [];
                        }
                        academic.papers.push(submission.data.paper);
                        break;
                    
                    case 'event':
                        if (!academic.events) {
                            academic.events = [];
                        }
                        academic.events.push(submission.data.event);
                        break;
                    
                    case 'connection':
                        if (!academic.connections) {
                            academic.connections = [];
                        }
                        
                        const connectedAcademic = submission.data.connection.connectedAcademic;
                        
                        if (!academic.connections.includes(connectedAcademic)) {
                            academic.connections.push(connectedAcademic);
                        }
                        break;
                    
                    case 'taxonomy':
                        if (!academic.taxonomies) {
                            academic.taxonomies = {};
                        }
                        
                        for (const category in submission.data.taxonomies) {
                            if (!academic.taxonomies[category]) {
                                academic.taxonomies[category] = [];
                            }
                            
                            submission.data.taxonomies[category].forEach(value => {
                                if (!academic.taxonomies[category].includes(value)) {
                                    academic.taxonomies[category].push(value);
                                }
                            });
                        }
                        break;
                    
                    case 'bio':
                        academic.bio = submission.data.bio.text;
                        
                        if (submission.data.bio.birthYear) {
                            academic.birthYear = submission.data.bio.birthYear;
                        }
                        
                        if (submission.data.bio.deathYear) {
                            academic.deathYear = submission.data.bio.deathYear;
                        }
                        break;
                }
                
                // Save the academic
                this.addOrUpdateAcademic(academic);
                
                // Add a novelty tile
                this.addNoveltyTile({
                    title: `New Contribution: ${submission.academicName}`,
                    content: `New ${submission.data.type} information approved for ${submission.academicName}.`,
                    date: new Date().toISOString(),
                    type: submission.data.type
                });
            }
            
            // Remove the submission
            this.pendingSubmissions.splice(index, 1);
            
            // Save data
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error approving pending submission:', error);
            return false;
        }
    }
    
    /**
     * Reject a pending submission
     * @param {number} index - Submission index
     * @returns {boolean} Success indicator
     */
    rejectPendingSubmission(index) {
        if (index < 0 || index >= this.pendingSubmissions.length) {
            return false;
        }
        
        try {
            // Remove the submission
            this.pendingSubmissions.splice(index, 1);
            
            // Save data
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error rejecting pending submission:', error);
            return false;
        }
    }
    
    /**
     * Export database to JSON
     * @returns {string} JSON string of database
     */
    exportDatabase() {
        try {
            return JSON.stringify({
                academics: this.academics,
                noveltyTiles: this.noveltyTiles,
                pendingSubmissions: this.pendingSubmissions,
                favorites: this.favorites
            }, null, 2);
        } catch (error) {
            console.error('Error exporting database:', error);
            return null;
        }
    }
    
    /**
     * Import database from JSON
     * @param {string} json - JSON string to import
     * @returns {boolean} Success indicator
     */
    importDatabase(json) {
        try {
            const data = JSON.parse(json);
            
            if (data.academics) {
                this.academics = data.academics;
            }
            
            if (data.noveltyTiles) {
                this.noveltyTiles = data.noveltyTiles;
            }
            
            if (data.pendingSubmissions) {
                this.pendingSubmissions = data.pendingSubmissions;
            }
            
            if (data.favorites) {
                this.favorites = data.favorites;
            }
            
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error importing database:', error);
            return false;
        }
    }
    
    /**
     * Clear the database
     * @returns {boolean} Success indicator
     */
    clearDatabase() {
        try {
            this.academics = {};
            this.noveltyTiles = [];
            this.pendingSubmissions = [];
            this.favorites = [];
            
            this.saveData();
            
            return true;
        } catch (error) {
            console.error('Error clearing database:', error);
            return false;
        }
    }
}

// Initialize the database manager
const databaseManager = new DatabaseManager();

// Make it available globally
window.databaseManager = databaseManager;

// Setup database admin events once the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Export database button
    const exportButton = document.getElementById('export-database');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const json = databaseManager.exportDatabase();
            
            if (json) {
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'killphilosophy_database.json';
                a.click();
                
                URL.revokeObjectURL(url);
            } else {
                window.displayErrorMessage('Failed to export database', 'database');
            }
        });
    }
    
    // Import database button
    const importButton = document.getElementById('import-database');
    if (importButton) {
        importButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = (event) => {
                        const json = event.target.result;
                        const success = databaseManager.importDatabase(json);
                        
                        if (success) {
                            const successMessage = document.createElement('div');
                            successMessage.className = 'success-message';
                            successMessage.textContent = 'Database imported successfully.';
                            
                            const adminContent = document.querySelector('.admin-content');
                            if (adminContent) {
                                adminContent.insertBefore(successMessage, adminContent.firstChild);
                                
                                setTimeout(() => {
                                    successMessage.remove();
                                }, 5000);
                            }
                        } else {
                            window.displayErrorMessage('Failed to import database', 'database');
                        }
                    };
                    
                    reader.readAsText(file);
                }
            });
            
            input.click();
        });
    }
    
    // Clear database button
    const clearButton = document.getElementById('clear-database');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the database? This action cannot be undone.')) {
                const success = databaseManager.clearDatabase();
                
                if (success) {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Database cleared successfully.';
                    
                    const adminContent = document.querySelector('.admin-content');
                    if (adminContent) {
                        adminContent.insertBefore(successMessage, adminContent.firstChild);
                        
                        setTimeout(() => {
                            successMessage.remove();
                        }, 5000);
                    }
                } else {
                    window.displayErrorMessage('Failed to clear database', 'database');
                }
            }
        });
    }
    
    // Display pending submissions
    const pendingSubmissionsContainer = document.getElementById('pending-submissions');
    if (pendingSubmissionsContainer) {
        const submissions = databaseManager.getPendingSubmissions();
        
        if (submissions.length === 0) {
            pendingSubmissionsContainer.innerHTML = '<div class="info-message">No pending submissions</div>';
        } else {
            pendingSubmissionsContainer.innerHTML = '';
            
            submissions.forEach((submission, index) => {
                const submissionElement = document.createElement('div');
                submissionElement.className = 'submission-item';
                
                const submissionHeader = document.createElement('h4');
                submissionHeader.textContent = `${submission.academicName} - ${submission.contributionType}`;
                submissionElement.appendChild(submissionHeader);
                
                const submissionDetails = document.createElement('div');
                submissionDetails.className = 'submission-details';
                submissionDetails.innerHTML = `
                    <p>Type: ${submission.data.type}</p>
                    <p>Contributor: ${submission.contributorName || 'Anonymous'}</p>
                    <p>Date: ${new Date(submission.timestamp).toLocaleString()}</p>
                `;
                submissionElement.appendChild(submissionDetails);
                
                const submissionActions = document.createElement('div');
                submissionActions.className = 'submission-actions';
                
                const approveButton = document.createElement('button');
                approveButton.className = 'admin-btn approve-btn';
                approveButton.textContent = 'Approve';
                approveButton.addEventListener('click', () => {
                    const success = databaseManager.approvePendingSubmission(index);
                    
                    if (success) {
                        submissionElement.remove();
                        
                        if (pendingSubmissionsContainer.childElementCount === 0) {
                            pendingSubmissionsContainer.innerHTML = '<div class="info-message">No pending submissions</div>';
                        }
                    }
                });
                submissionActions.appendChild(approveButton);
                
                const rejectButton = document.createElement('button');
                rejectButton.className = 'admin-btn reject-btn';
                rejectButton.textContent = 'Reject';
                rejectButton.addEventListener('click', () => {
                    const success = databaseManager.rejectPendingSubmission(index);
                    
                    if (success) {
                        submissionElement.remove();
                        
                        if (pendingSubmissionsContainer.childElementCount === 0) {
                            pendingSubmissionsContainer.innerHTML = '<div class="info-message">No pending submissions</div>';
                        }
                    }
                });
                submissionActions.appendChild(rejectButton);
                
                submissionElement.appendChild(submissionActions);
                pendingSubmissionsContainer.appendChild(submissionElement);
            });
        }
    }
});
