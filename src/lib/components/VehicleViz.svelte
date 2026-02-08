<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import loadoutData from "../../data/loadout.json";
    import type { Compartment } from "../types";
    import { resolveAsset } from "../utils";

    const dispatch = createEventDispatcher<{
        select: string;
    }>();

    export let view:
        | "left"
        | "right"
        | "rear"
        | "roof"
        | "crew-cabin"
        | "driver-cabin" = "left";

    // Cast data to known type
    const compartments = loadoutData.compartments as Compartment[];

    function select(id: string) {
        dispatch("select", id);
    }

    function getVisual(comp: any, currentView: string) {
        return comp.views.find((v: any) => v.view === currentView);
    }
</script>

<div class="vehicle-container">
    <div class="viz-wrapper">
        <div class="viz-layer">
            {#if view === "left"}
                <img
                    src={resolveAsset("/assets/left-side.jpeg")}
                    alt="Fahrzeug Links"
                />
            {:else if view === "right"}
                <img
                    src={resolveAsset("/assets/right-side.png")}
                    alt="Fahrzeug Rechts"
                />
            {:else if view === "rear"}
                <img
                    src={resolveAsset("/assets/rear-side.png")}
                    alt="Fahrzeug Heck"
                />
            {:else if view === "roof"}
                <img
                    src={resolveAsset("/assets/roof.png")}
                    alt="Fahrzeug Dach"
                />
            {:else if view === "crew-cabin"}
                <img
                    src={resolveAsset("/assets/crew-cabin.png")}
                    alt="Mannschaftsraum"
                />
            {:else if view === "driver-cabin"}
                <img
                    src={resolveAsset("/assets/driver-cabin.png")}
                    alt="Fahrerkabine"
                />
            {/if}

            {#each compartments as comp}
                {@const visual = getVisual(comp, view)}
                {#if visual}
                    <button
                        class="marker-btn {comp.id.toLowerCase()}"
                        style="left: {visual.position.x}; top: {visual.position
                            .y};"
                        on:click={() => select(comp.id)}
                        aria-label={comp.name}
                    >
                        <span class="marker">+</span>
                    </button>
                {/if}
            {/each}
        </div>
    </div>

    <div class="perspective-controls">
        <button class:active={view === "left"} on:click={() => (view = "left")}
            >Fahrerseite</button
        >
        <button class:active={view === "rear"} on:click={() => (view = "rear")}
            >Heck</button
        >
        <button
            class:active={view === "right"}
            on:click={() => (view = "right")}>Beifahrerseite</button
        >
        <button class:active={view === "roof"} on:click={() => (view = "roof")}
            >Dach</button
        >
        <button
            class:active={view === "crew-cabin"}
            on:click={() => (view = "crew-cabin")}>Mannschaftsraum</button
        >
        <button
            class:active={view === "driver-cabin"}
            on:click={() => (view = "driver-cabin")}>Fahrerkabine</button
        >
    </div>
</div>

<style>
    .vehicle-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 1rem;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .viz-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        perspective: 1000px;
    }

    .viz-layer {
        position: relative;
        display: inline-block;
        max-width: 100%;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #333;
        background: #111;
    }

    .viz-layer img {
        display: block;
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
    }

    /* Marker Button - Absolute positioning based on data */
    .marker-btn {
        position: absolute;
        transform: translate(
            -50%,
            -50%
        ); /* Center the button on the coordinate */
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    /* The Plus Marker */
    .marker {
        width: clamp(24px, 4vw, 36px);
        height: clamp(24px, 4vw, 36px);
        background: rgba(227, 24, 55, 0.8); /* Fire Red */
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(14px, 2.5vw, 20px);
        font-weight: bold;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    }

    .marker::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid white;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    .marker-btn:hover .marker {
        background: white;
        color: var(--color-primary);
        transform: scale(1.15);
        box-shadow: 0 0 30px rgba(227, 24, 55, 0.6);
    }

    .marker-btn:focus {
        outline: none;
    }

    .marker-btn:focus .marker {
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4);
    }

    .perspective-controls {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        width: 100%;
    }

    .perspective-controls button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 8px;
        background: #222;
        color: #999;
        border: 1px solid #444;
        cursor: pointer;
        transition: all 0.2s;
        flex: 1;
        max-width: 200px;
        flex-basis: 100%;
    }

    .perspective-controls button:hover {
        background: #333;
        color: white;
    }

    .perspective-controls button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
        box-shadow: 0 4px 15px rgba(227, 24, 55, 0.4);
    }
</style>
