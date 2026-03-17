import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ placeholder, onSearch, ariaLabel = "Search" }) {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <input
            className="search-bar"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            aria-label={ariaLabel}
        />
    );
}

export default SearchBar;