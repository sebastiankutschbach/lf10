export interface Compartment {
    id: string;
    name: string;
    side: 'left' | 'right' | 'rear' | 'front' | 'center';
    description: string;
    items: string[];
    image?: string;
    views: {
        view: string;
        position: {
            x: string;
            y: string;
        };
    }[];
}

export interface Loadout {
    compartments: Compartment[];
}
