"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EmergencyForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relation, setRelation] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser(); // ✅ Clerk

    const handleSubmit = async () => {
        if (!name || !phone || !relation) {
            toast.warning("Please fill all fields!");
            return;
        }

        if (!user?.id) {
            toast.error("User not authenticated.");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/emergency-contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                phone,
                relation,
                user_id: user.id, // ✅ Very important!
            }),
        });

        const result = await res.json();

        if (res.ok) {
            toast.success("Contact added!");
            setName('');
            setPhone('');
            setRelation('');
            onSuccess();
        } else {
            toast.error(result?.error || "Something went wrong.");
        }

        setLoading(false);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-white mb-2">Add Emergency Contact</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 text-white focus:ring-2 focus:ring-red-500"
                />
                <Input
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-zinc-800 text-white focus:ring-2 focus:ring-red-500"
                />
                <Input
                    placeholder="Relation (e.g., Father, Friend)"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="bg-zinc-800 text-white focus:ring-2 focus:ring-red-500"
                />
            </div>

            <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto mt-2 sm:mt-4 bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
                {loading ? "Adding..." : "Add Emergency Contact"}
            </Button>
        </div>

    );
}
