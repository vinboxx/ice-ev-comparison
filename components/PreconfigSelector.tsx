'use client';
import { useEffect, useState } from 'react';
import type { Vehicle } from '../lib/types';

interface PreconfigSelectorProps {
    onSelect: (v: Vehicle) => void;
    type: 'ICE' | 'EV';
}

export function PreconfigSelector({ onSelect, type }: PreconfigSelectorProps) {
    const [options, setOptions] = useState<Vehicle[]>([]);
    useEffect(() => {
        fetch('/preconfig/vehicles.json')
            .then(r => r.json())
            .then(data => {
                setOptions(type === 'ICE' ? data.ice : data.ev);
            });
    }, [type]);
    return (
        <select
            className="select select-bordered select-sm"
            onChange={e => {
                const v = options.find(o => o.id === e.target.value);
                if (v) onSelect(v);
            }}
        >
            <option value="">Preset {type}</option>
            {options.map(o => (
                <option key={o.id} value={o.id}>
                    {o.name}
                </option>
            ))}
        </select>
    );
}
