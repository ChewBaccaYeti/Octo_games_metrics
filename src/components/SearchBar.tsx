import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (game: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [game, setGame] = useState('');

    const handleSearch = () => {
        onSearch(game);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Roll the dice"
                value={game}
                onChange={(e) => setGame(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
