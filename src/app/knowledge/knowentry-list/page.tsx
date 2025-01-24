'use client';

import KnowEntryItem from "@/components/knowledge/KnowEntryItem";
import { useEffect, useState } from "react";

export default function Page() {
    const [knowEntries, setKnowEntries] = useState<KnowEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        fetch('/api/knowledge/know-entries')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => setKnowEntries(data))
            .catch((error) => console.error('Fetch error:', error));
    }, []);

    function onDelete(knowEntry: KnowEntry) {
        const deletedKnowEntry = knowEntries.find(entry => entry.title === knowEntry.title && entry.timestamp === knowEntry.timestamp);
        if (!deletedKnowEntry) {
            return;
        }

        fetch(`/api/knowledge/know-entries?title=${deletedKnowEntry.title}&timestamp=${deletedKnowEntry.timestamp}`, {
            method: 'DELETE',
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                setKnowEntries(knowEntries.filter(entry => entry !== deletedKnowEntry));
            })
            .catch((error) => console.error('Fetch error:', error));

    }

    const filterKnowEntries = () => {
        const match = searchQuery.toLowerCase();
        return knowEntries.filter(knowEntry =>
            knowEntry.title.toLowerCase().includes(match)
            || knowEntry.content.toLowerCase().includes(match)
            || knowEntry.tags.some(tag => tag.toLowerCase().includes(match))
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mx-auto p-4">
                <input
                    type="text"
                    className="border rounded p-2 w-full"
                    placeholder="Search know entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {filterKnowEntries().map((knowEntry, index) => (
                <KnowEntryItem key={index} knowEntry={knowEntry} onDelete={onDelete} />
            ))}
        </div>
    );
}
