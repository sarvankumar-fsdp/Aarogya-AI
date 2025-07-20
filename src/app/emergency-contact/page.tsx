'use client';

import { useState } from 'react';
import EmergencyForm from './EmergencyForm';
import EmergencyList from './EmergencyList';

export default function EmergencyContactsPage() {
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => setRefresh(!refresh);

    return (
        <div className="flwx flex-col max-w-3xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-6 text-red-500">Emergency Contacts</h1>
            <div className='flex flex-col gap-4'>
                <EmergencyForm onSuccess={handleRefresh} />
                <EmergencyList refresh={refresh} />
            </div>
            
        </div>
    );
}
