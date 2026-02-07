<script lang="ts">
  import type { Compartment } from '../types';

  export let compartment: Compartment;
  export let onClose: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-backdrop" on:click={onClose} role="button" tabindex="0">
  <div class="modal-content glass" on:click|stopPropagation role="region">
    <div class="header">
      <h2>{compartment.name}</h2>
      <button class="close-btn" on:click={onClose}>&times;</button>
    </div>
    
    <div class="body">
      <div class="image-area">
        {#if compartment.image}
          <img src={compartment.image} alt={compartment.name} />
        {:else}
          <div class="placeholder-image">
            <span class="icon">📷</span>
            <p>Bild von {compartment.name}</p>
          </div>
        {/if}
      </div>
      
      <div class="details">
        <p class="desc">{compartment.description}</p>
        <h3>Beladung:</h3>
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #fff;
    padding: 0;
    line-height: 1;
  }
  
  .close-btn:hover {
    color: var(--color-primary);
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
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
