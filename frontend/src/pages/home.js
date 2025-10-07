import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // 💡 Re-introducing: Used for navigation
import api from '../api/axios'; 
import './home.css'; // Assuming you renamed the CSS file to home.css

// --- Configuration Constants ---
const CATEGORIES = [
    { name: 'Car', icon: '🚗', description: 'New & Used Vehicles' },
    { name: 'House', icon: '🏠', description: 'Apartments & Property' },
    { name: 'Electronics', icon: '📱', description: 'Phones, Laptops, Gadgets' },
];
const CITIES = ['Addis Ababa', 'Adama', 'Mekele', 'Gondar', 'Hawassa'];


// === AD CARD COMPONENT (Now navigates on click) ===
// 💡 IMPORTANT: Must accept 'navigate' prop to enable click functionality
const AdCard = ({ ad, navigate }) => {
    // Function to handle clicking an ad card
    const handleAdClick = () => {
        // Navigates to the detail page for the property/ad
        navigate(`/property/${ad._id}`); 
    };

    return (
        <div className="ad-card" onClick={handleAdClick}> {/* 💡 CLICK HANDLER ADDED */}
            <div className="ad-image-container">
                <img 
                    src={ad.picture || 'https://via.placeholder.com/280x200?text=Ad+Image'} 
                    alt={ad.pname} 
                    className="ad-image" 
                />
                {ad.isPremium && <span className="premium-tag">DIAMOND 💎</span>}
                {ad.sellerRole === 'broker' && <span className="broker-tag">BROKER 💼</span>} 
            </div>
            <div className="ad-details">
                <h3 className="ad-title">{ad.pname}</h3>
                <p className="ad-price">ETB {ad.price ? ad.price.toLocaleString() : 'N/A'}</p>
                <p className="ad-location">{ad.location || 'Unknown Location'} | {ad.category || 'House'}</p>
            </div>
        </div>
    );
};


// === MAIN HOME PAGE COMPONENT (Updated API Call) ===
const HomePage = () => {
    const navigate = useNavigate(); // 💡 HOOK: For routing
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        query: '',
        category: '',
        location: '',
    });
    
    // 💡 Function to check if the user is logged in (SIMPLIFIED)
    const isAuthenticated = () => {
        // In a real app, this should check the AuthContext or validate the JWT token
        return !!localStorage.getItem('user'); 
    };

    // 💡 1. POST AD BUTTON FUNCTIONALITY
    const handlePostAdClick = () => {
        if (isAuthenticated()) {
            // User is logged in, send them to the ad creation form (Need to create this route)
            navigate('/post-ad'); 
        } else {
            // User is not logged in, prompt them to register/login
            navigate('/register'); 
            alert("Please register or log in to post an ad!");
        }
    };


    // 💡 2. SEARCH BUTTON FUNCTIONALITY (Fetches data based on filters)
    const fetchAds = useCallback(async () => {
        setLoading(true);
        
        // Build the query string for advanced search
        const queryString = new URLSearchParams(filters).toString();
        
        try {
            // The endpoint should be a unified search endpoint (e.g., /property/search)
            // Using /property and applying client-side filtering (for now)
            const response = await api.get(`/property?${queryString}`); 
            
            // --- SIMULATION LOGIC (REMAINS THE SAME) ---
            const simulatedAds = response.data.map((ad, index) => ({
                ...ad,
                category: CATEGORIES[index % 3].name, 
                isPremium: index % 5 === 0,
                sellerRole: index % 7 === 0 ? 'broker' : 'user',
                location: CITIES[index % CITIES.length],
            }));

            // Client-side filtering (should be done on the backend for performance)
            const filteredAds = simulatedAds.filter(ad => {
                const matchesQuery = ad.pname.toLowerCase().includes(filters.query.toLowerCase()) || 
                                     ad.description.toLowerCase().includes(filters.query.toLowerCase());
                const matchesCategory = !filters.category || ad.category === filters.category;
                const matchesLocation = !filters.location || ad.location === filters.location;
                return matchesQuery && matchesCategory && matchesLocation;
            });

            setAds(filteredAds);
        } catch (err) {
            console.error("Error fetching ads. Check if backend is running on port 9000.", err);
            setAds([]);
        } finally {
            setLoading(false);
        }
    }, [filters]); // Re-run only when filters change

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // 💡 3. CATEGORY CLICK FUNCTIONALITY
    const handleCategoryClick = (categoryName) => {
        // Toggle functionality: If the category is already selected, clear it.
        const newCategory = categoryName === filters.category ? '' : categoryName;
        
        setFilters(prevFilters => ({
            ...prevFilters,
            category: newCategory
        }));
        // Note: fetchAds will automatically run due to the 'filters' dependency
    };

    // 💡 4. SEARCH FORM SUBMIT FUNCTIONALITY
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Triggered by the "🔍 Search" button
        console.log(`Search triggered with filters: ${JSON.stringify(filters)}`);
        // fetchAds runs automatically on filter change, but calling it here ensures immediate update
        fetchAds(); 
    };

    return (
        <div className="homepage">
            {/* --- TOP HEADER & ADVANCED SEARCH BAR --- */}
            <header className="main-header">
                <a href="/" className="logo">M<sub>4</sub>S BROKERY SYSTEM</a>
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        name="query"
                        placeholder="What are you looking for?" 
                        value={filters.query}
                        onChange={handleFilterChange}
                        className="search-input"
                    />

                    <select 
                        name="location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="search-select"
                    >
                        <option value="">All Ethiopia</option>
                        {CITIES.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <select 
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="search-select"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    {/* 💡 SEARCH BUTTON */}
                    <button type="submit" className="search-btn">🔍 Search</button>
                    
                    {/* 💡 POST AD BUTTON */}
                    <button type="button" className="post-ad-btn" onClick={handlePostAdClick}>
                        Post Ad FREE! ➕
                    </button>
                </form>
            </header>

            <hr/>

            {/* --- CATEGORIES GRID --- */}
            <section className="category-grid-section">
                <h2>Browse by Category</h2>
                <div className="category-grid">
                    {CATEGORIES.map(cat => (
                       
                        <div 
                            key={cat.name} 
                            className={`category-card ${filters.category === cat.name ? 'active-category' : ''}`}
                            onClick={() => handleCategoryClick(cat.name)}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <p className="category-name">{cat.name}</p>
                            <small>{cat.description}</small>
                        </div>
                    ))}
                </div>
            </section>

            <hr/>

            {/* --- AD LISTINGS FEED --- */}
            <section className="ad-feed-section">
                <h2>🔥 Top Listings near {filters.location || 'You'}</h2>
                {loading ? (
                    <p className="loading-message">Fetching the best deals...</p>
                ) : (
                    <div className="ad-list">
                        {ads.length > 0 ? ads.map(ad => (
                            // 💡 Pass 'navigate' to AdCard
                            <AdCard key={ad._id} ad={ad} navigate={navigate} /> 
                        )) : (
                            <p className="no-ads-message">No listings found matching your criteria. Try different filters.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default HomePage;