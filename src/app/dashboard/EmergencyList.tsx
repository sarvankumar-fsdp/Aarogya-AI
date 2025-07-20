'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Phone } from 'lucide-react';

interface Contact {
    id: string;
    name: string;
    phone: string;
    relation: string;
}

const message = `Hi, this is an emergency. Please respond immediately.`;
const encodedMessage = message.replace(/ /g, '%20').replace(/,/g, '%2C');

export default function EmergencyList({ refresh }: { refresh: boolean }) {
    const { user } = useUser();
    const userId = user?.id;

    

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p className="text-white flex items-center justify-center p-4">Loading emergency contacts...</p>;

    return (
        <div className= "w-full max-h-[400px] overflow-y-auto rounded-xl p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800">
            {contacts.length === 0 && (
                <p className="text-gray-400">No emergency contacts yet.</p>
            )}
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className="bg-zinc-800 w-full p-4 rounded-lg flex flex-row items-center justify-between sm:flex-row sm:items-center sm:justify-between border border-zinc-700 transition-all duration-300 hover:scale-[1.01]"
                >
                    <div className=" flex flex-col space-y-1">
                        <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                        <p className="text-sm text-gray-400">{contact.relation}</p>
                        <p className="text-sm text-gray-300">{contact.phone}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex flex-row gap-2">
                        <a
                            href={`tel:${contact.phone}`}
                            className=" bg-green-600 hover:bg-green-700 text-white px-1 py-1 rounded text-center"
                        >
                            <Phone/>
                        </a>

                    </div>
                </div>
            ))}
        </div>
    );
}
