<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import loadoutData from "../../data/loadout.json";
    import type { Compartment } from "../types";

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
    <div class="vehicle-graphic">
        <div class="viz-layer">
            {#if view === "left"}
                <img src="/assets/left-side.jpeg" alt="Fahrzeug Links" />
            {:else if view === "right"}
                <img src="/assets/right-side.png" alt="Fahrzeug Rechts" />
            {:else if view === "rear"}
                <img src="/assets/rear-side.png" alt="Fahrzeug Heck" />
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
    </div>
</div>

<style>
    .vehicle-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        width: 100%;
    }

    .vehicle-graphic {
        width: 100%;
        max-width: 900px;
        height: 500px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        overflow: hidden;
        background: #111;
        border: 1px solid #333;
    }

    .viz-layer {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .viz-layer img {
        max-width: 100%;
        max-height: 100%;
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
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.6);
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    }

    .marker-btn:hover .marker {
        background: var(--color-primary);
        border-color: var(--color-primary);
        transform: scale(1.2);
        box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
    }

    .marker-btn:focus {
        outline: none;
    }

    .marker-btn:focus .marker {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 4px rgba(204, 255, 0, 0.3);
    }

    .perspective-controls {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .perspective-controls button.active {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }
</style>
