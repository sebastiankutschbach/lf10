<script lang="ts">
    import { onMount } from "svelte";
    import type { Compartment, Loadout } from "../types";
    import Separator from "./Separator.svelte";

    export let compartments: Compartment[];
    export let onClose: () => void;

    let editingData: Compartment[] = JSON.parse(JSON.stringify(compartments));
    let selectedIndex = 0;
    let saveStatus: "idle" | "saving" | "success" | "error" = "idle";
    let errorMessage = "";

    $: selectedCompartment = editingData[selectedIndex];

    async function save() {
        saveStatus = "saving";
        try {
            const response = await fetch("api/save-loadout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ compartments: editingData }),
            });
            const result = await response.json();
            if (result.success) {
                saveStatus = "success";
                // Trigger reload of the main data if possible, or just notify the user
                setTimeout(() => {
                    saveStatus = "idle";
                }, 3000);
            } else {
                throw new Error(result.error);
            }
        } catch (e) {
            saveStatus = "error";
            errorMessage = (e as Error).message;
        }
    }

    function addItem() {
        editingData[selectedIndex].items = [
            ...editingData[selectedIndex].items,
            "Neuer Gegenstand",
        ];
    }

    function removeItem(itemIndex: number) {
        editingData[selectedIndex].items = editingData[
            selectedIndex
        ].items.filter((_, i) => i !== itemIndex);
    }

    function updateItem(itemIndex: number, value: string) {
        editingData[selectedIndex].items[itemIndex] = value;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") onClose();
    }
</script>

<div
    class="editor-overlay"
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
>
    <div class="editor-container" on:click|stopPropagation role="presentation">
        <header>
            <div class="header-main">
                <Separator text="Loadout Editor" level="h2" />
                <div class="actions">
                    <button
                        class="btn-save"
                        class:success={saveStatus === "success"}
                        class:loading={saveStatus === "saving"}
                        on:click={save}
                    >
                        {#if saveStatus === "saving"}
                            Speichern...
                        {:else if saveStatus === "success"}
                            Gespeichert! ✓
                        {:else}
                            Änderungen speichern
                        {/if}
                    </button>
                    <button class="btn-close" on:click={onClose}>&times;</button
                    >
                </div>
            </div>
            {#if saveStatus === "error"}
                <p class="error">{errorMessage}</p>
            {/if}
        </header>

        <div class="editor-content">
            <aside class="sidebar">
                <div class="sidebar-header">Kompartimente</div>
                <div class="compartment-list">
                    {#each editingData as comp, i}
                        <button
                            class="comp-item"
                            class:active={selectedIndex === i}
                            on:click={() => (selectedIndex = i)}
                        >
                            <span class="comp-id">{comp.id}</span>
                            <span class="comp-name">{comp.name}</span>
                        </button>
                    {/each}
                </div>
            </aside>

            <main class="main-editor">
                {#if selectedCompartment}
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="comp-name">Name</label>
                            <input
                                id="comp-name"
                                type="text"
                                bind:value={selectedCompartment.name}
                            />
                        </div>
                        <div class="form-group">
                            <label for="comp-side">Seite</label>
                            <select
                                id="comp-side"
                                bind:value={selectedCompartment.side}
                            >
                                <option value="left">Links</option>
                                <option value="right">Rechts</option>
                                <option value="rear">Hinten</option>
                                <option value="front">Vorne</option>
                                <option value="center">Mitte</option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <label for="comp-desc">Beschreibung</label>
                            <textarea
                                id="comp-desc"
                                bind:value={selectedCompartment.description}
                            ></textarea>
                        </div>
                    </div>

                    <div class="items-section">
                        <div class="items-header">
                            <h3>
                                Beladung ({selectedCompartment.items.length})
                            </h3>
                            <button class="btn-add" on:click={addItem}
                                >+ Gegenstand</button
                            >
                        </div>
                        <div class="items-list">
                            {#each selectedCompartment.items as item, itemIndex}
                                <div class="item-row">
                                    <input
                                        type="text"
                                        value={item}
                                        on:input={(e) =>
                                            updateItem(
                                                itemIndex,
                                                e.currentTarget.value,
                                            )}
                                    />
                                    <button
                                        class="btn-remove"
                                        on:click={() => removeItem(itemIndex)}
                                        >&times;</button
                                    >
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </main>
        </div>
    </div>
</div>

<style>
    .editor-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 2rem;
        animation: fadeIn 0.3s ease;
    }

    .editor-container {
        background: var(--color-surface);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-lg);
        width: 100%;
        max-width: 1100px;
        height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        animation: scaleUp 0.3s ease-out;
    }

    header {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
    }

    .header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .actions {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .editor-content {
        display: flex;
        flex: 1;
        overflow: hidden;
    }

    .sidebar {
        width: 280px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.2);
    }

    .sidebar-header {
        padding: 1.2rem 1.5rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--color-text-secondary);
        font-weight: 700;
    }

    .compartment-list {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
    }

    .comp-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem 1rem;
        border: 1px solid transparent;
        background: transparent;
        color: white;
        text-align: left;
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: all 0.2s;
        margin-bottom: 0.2rem;
    }

    .comp-item:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .comp-item.active {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
    }

    .comp-id {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        min-width: 35px;
        text-align: center;
        font-weight: 600;
    }

    .main-editor {
        flex: 1;
        padding: 2.5rem;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.01);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .full-width {
        grid-column: span 2;
    }

    label {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    input,
    textarea,
    select {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-md);
        padding: 0.8rem 1rem;
        color: white;
        font-size: 1rem;
        outline: none;
        transition: all 0.2s;
    }

    input:focus,
    textarea:focus,
    select:focus {
        background: rgba(0, 0, 0, 0.3);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.1);
    }

    textarea {
        height: 120px;
        resize: vertical;
    }

    .items-section {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 2.5rem;
    }

    .items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .items-header h3 {
        font-size: 1.25rem;
        color: var(--color-text);
    }

    .items-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .item-row {
        display: flex;
        gap: 0.5rem;
        animation: slideIn 0.2s ease-out;
    }

    .item-row input {
        flex: 1;
    }

    .btn-save {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .btn-save:hover {
        background: #ff3333;
        transform: translateY(-2px);
        box-shadow: 0 10px 20px -10px rgba(255, 0, 0, 0.5);
    }

    .btn-save.success {
        background: #2a9d8f;
    }

    .btn-close {
        background: transparent;
        border: none;
        color: white;
        font-size: 2.5rem;
        cursor: pointer;
        line-height: 1;
        opacity: 0.4;
        transition: all 0.2s;
        padding: 0 0.5rem;
    }

    .btn-close:hover {
        opacity: 1;
        transform: rotate(90deg);
    }

    .btn-add {
        background: rgba(255, 255, 255, 0.08);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.6rem 1.2rem;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.2s;
    }

    .btn-add:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-remove {
        background: rgba(255, 0, 0, 0.1);
        color: var(--color-primary);
        border: 1px solid rgba(255, 0, 0, 0.2);
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        cursor: pointer;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .btn-remove:hover {
        background: var(--color-primary);
        color: white;
    }

    .error {
        color: var(--color-primary);
        font-size: 0.9rem;
        margin-top: 0.5rem;
        font-weight: 600;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes scaleUp {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @media (max-width: 900px) {
        .editor-container {
            height: 95vh;
        }
        .sidebar {
            width: 80px;
        }
        .comp-name {
            display: none;
        }
        .form-grid {
            grid-template-columns: 1fr;
        }
        .full-width {
            grid-column: span 1;
        }
        .items-list {
            grid-template-columns: 1fr;
        }
    }
</style>
