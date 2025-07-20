"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term); // Notify parent
    };

    return (
        <div className="w-full md:w-[200px]" suppressHydrationWarning>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-1 rounded-md border border-gray-700 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                />
                <Search className="absolute left-2 top-2 text-gray-400" size={16} />
            </div>
        </div>
    );
}
