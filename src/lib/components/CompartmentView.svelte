<script lang="ts">
  import type { Compartment } from "../types";
  import { resolveAsset } from "../utils";

  export let compartment: Compartment;
  export let onClose: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-backdrop" on:click={onClose} role="button" tabindex="0">
  <div class="modal-content glass" on:click|stopPropagation role="region">
    <div class="header-container">
      <div class="specs-header">
        <div class="line"></div>
        <h2>{compartment.name}</h2>
        <div class="line"></div>
      </div>
      <button class="close-btn" on:click={onClose} aria-label="Schließen"
        >&times;</button
      >
    </div>

    <div class="body">
      <div class="image-area">
        {#if compartment.image}
          <img src={resolveAsset(compartment.image)} alt={compartment.name} />
        {:else}
          <div class="placeholder-image">
            <span class="icon">📷</span>
            <p>Bild von {compartment.name}</p>
          </div>
        {/if}
      </div>

      <div class="details">
        <p class="desc">{compartment.description}</p>
        <div class="specs-header subtitle">
          <div class="line"></div>
          <h3>Beladung:</h3>
          <div class="line"></div>
        </div>
        <ul class="item-list">
          {#each compartment.items as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    padding: 2rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
    border: 1px solid #333;
    background: #1e1e1e;
  }

  .header-container {
    position: relative;
    width: 100%;
    margin-bottom: 2rem;
  }

  .specs-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .specs-header.subtitle {
    gap: 1rem;
    margin: 1.5rem 0 1rem 0;
  }

  .specs-header h2,
  .specs-header h3 {
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap;
    background: linear-gradient(135deg, #fff 0%, #aaa 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .specs-header h2 {
    font-size: 1.5rem;
  }

  .specs-header h3 {
    font-size: 1rem;
    letter-spacing: 1px;
  }

  .line {
    height: 1px;
    flex: 1;
    background: linear-gradient(90deg, transparent, #e63946, transparent);
  }

  .close-btn {
    position: absolute;
    top: -0.5rem;
    right: 0;
    background: none;
    border: none;
    font-size: 2.5rem;
    cursor: pointer;
    color: #888;
    padding: 0;
    line-height: 1;
    z-index: 10;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #fff;
  }

  .body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .body {
      grid-template-columns: 1fr 1fr;
    }
  }

  .placeholder-image {
    width: 100%;
    aspect-ratio: 4/3;
    background: #2a2a2a;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    color: #666;
  }

  .placeholder-image .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .item-list {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }

  .item-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #333;
    color: #ddd;
  }

  .item-list li:last-child {
    border-bottom: none;
  }

  .desc {
    font-style: italic;
    color: #aaa;
    margin-bottom: 1rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
