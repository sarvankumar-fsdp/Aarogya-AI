'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Contact {
    id: string;
    name: string;
    phone: string;
    relation: string;
}

export default function EmergencyList({ refresh }: { refresh: boolean }) {
    const { user } = useUser();
    const userId = user?.id;

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchContacts = async () => {
            try {
                const res = await fetch(`/api/emergency-contacts?user_id=${userId}`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setContacts(json.data);
                } else {
                    setContacts([]);
                    console.warn("Invalid data:", json);
                }
            } catch (err: any) {
                console.error("Fetch error:", err.message);
                setContacts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [refresh, userId]);

    const handleDelete = async (id: string) => {
        setDeleting(id);
        try {
            const res = await fetch(`/api/emergency-contacts?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
            }

            // ✅ Only parse JSON if content exists
            const text = await res.text();
            const json = text ? JSON.parse(text) : {};

            if (json.success) {
                setContacts((prev) => prev.filter((contact) => contact.id !== id));
            } else {
                alert('Failed to delete contact');
            }
        } catch (err: any) {
            console.error('Delete error:', err.message);
        } finally {
            setDeleting(null);
        }
    };
    

    if (loading) return <p className="text-white">Loading emergency contacts...</p>;

    return (
        <div className="bg-zinc-900 w-full max-h-[400px] overflow-y-auto rounded-xl p-4 space-y-4 border border-zinc-700 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
            {contacts.length === 0 && (
                <p className="text-gray-400">No emergency contacts yet.</p>
            )}
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className="bg-zinc-800 w-full p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between border border-zinc-700 transition-all duration-300 hover:scale-[1.01]"
                >
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                        <p className="text-sm text-gray-400">{contact.relation}</p>
                        <p className="text-sm text-gray-300">{contact.phone}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row gap-2">
                        <a
                            href={`tel:${contact.phone}`}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-center"
                        >
                            Call
                        </a>
                        <a
                            href={`https://wa.me/91${contact.phone}?text=${encodeURIComponent(
                                `Hi ${contact.name}, this is an emergency. Please respond immediately.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-center"
                        >
                            WhatsApp
                        </a>
                        <button
                            onClick={() => handleDelete(contact.id)}
                            disabled={deleting === contact.id}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-1 rounded text-center"
                        >
                            {deleting === contact.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
