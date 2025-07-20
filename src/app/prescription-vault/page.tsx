"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { Loader2, Trash, Undo2 } from "lucide-react";

interface Prescription {
    id: string;
    title: string;
    date: string;
    signed_url: string; // ✅ now using signed URL from backend
}

export default function PrescriptionVault() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (user) fetchPrescriptions();
    }, [user]);

    const fetchPrescriptions = async () => {
        setPrescriptionLoading(true);
        try {
            const res = await fetch("/api/prescriptions");
            const data = await res.json();

            if (Array.isArray(data)) {
                setPrescriptions(data);
            } else {
                console.error("Unexpected data:", data);
                setPrescriptions([]);
            }
        } catch (err) {
            console.error("Failed to fetch prescriptions:", err);
            setPrescriptions([]);
        }
        setPrescriptionLoading(false);
    };

    const handleUpload = async () => {
        if (!title || !date || !file) return alert("All fields required");
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);
        formData.append("file", file);

        const res = await fetch("/api/prescriptions", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            setTitle("");
            setDate("");
            setFile(null);
            fetchPrescriptions();
        } else {
            alert("Upload failed");
        }
        setLoading(false);
    };

    const deletePrescription = async (id: string) => {
        const res = await fetch(`/api/prescriptions?id=${id}`, {
            method: "DELETE",
        });
        if (res.ok) fetchPrescriptions();
        else alert("Delete failed");
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6 dark text-white">
            <div className="flex flex-row items-center justify-center gap-2">
                <a
                    href="/dashboard"
                    className="hover:underline font-extrabold text-xl hover:text-cyan-400"
                >
                    <Undo2 className="size-5" />
                </a>
                <h1 className="text-xl font-bold">Prescription Vault</h1>
            </div>

            {/* Upload Form */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div>
                        <Label className="mb-2">Prescription Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label className="mb-2">Date</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Upload File</Label>
                        <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                    <Button onClick={handleUpload} disabled={loading} className="cursor-pointer">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Upload Prescription"}
                    </Button>
                </CardContent>
            </Card>

            {/* Uploaded Prescriptions */}
            <h2 className="text-lg font-semibold">#&nbsp;Your Prescriptions</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {prescriptionLoading ? (
                    Array.from({ length: 2 }).map((_, idx) => (
                        <Card key={idx} className="bg-black animate-pulse h-40">
                            <CardContent className="p-4 space-y-3">
                                <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                                <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                                <div className="h-3 bg-slate-700/50 rounded w-2/3" />
                                <div className="h-8 bg-slate-700/50 rounded w-24 mt-4" />
                            </CardContent>
                        </Card>
                    ))
                ) : prescriptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-full">
                        No prescriptions uploaded yet.
                    </p>
                ) : (
                    prescriptions.map((p) => (
                        <Card key={p.id} className="p-4 py-2 bg-slate-900">
                            <CardContent className="p-4 space-y-2">
                                <h3 className="text-md font-bold">{p.title}</h3>
                                <p className="text-sm text-muted-foreground">{p.date}</p>
                                <a
                                    href={p.signed_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 text-sm hover:underline"
                                >
                                    View/Download
                                </a>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deletePrescription(p.id)}
                                    className="flex items-center cursor-pointer gap-2 mt-4"
                                >
                                    <Trash className="size-4" /> Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
