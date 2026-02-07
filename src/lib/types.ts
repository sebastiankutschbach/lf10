export interface Compartment {
    id: string;
    name: string;
    side: 'left' | 'right' | 'rear' | 'front' | 'center';
    description: string;
    items: string[];
    image?: string;
    visualPosition?: {
        x: string;
        y: string;
    };
    visualPositionRight?: {
        x: string;
        y: string;
    };
}

export interface Loadout {
    compartments: Compartment[];
}
