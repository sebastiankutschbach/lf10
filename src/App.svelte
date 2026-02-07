<script lang="ts">
  import VehicleViz from "./lib/components/VehicleViz.svelte";
  import CompartmentView from "./lib/components/CompartmentView.svelte";
  import loadoutData from "./data/loadout.json";
  import type { Compartment } from "./lib/types";
  import "./app.css";

  // State
  let activeCompartment: Compartment | null = null;
  let currentView: "left" | "right" | "rear" | "roof" | "crew-cabin" | "driver-cabin" = "left";

  // Load data
  const compartments = loadoutData.compartments as Compartment[];

  function handleSelect(event: CustomEvent<string>) {
    const id = event.detail;
    const found = compartments.find((c) => c.id === id);
    if (found) {
      activeCompartment = found;
    } else {
      console.warn(`Compartment ${id} not found in loadout data.`);
    }
  }

  function handleClose() {
    activeCompartment = null;
  }
</script>

<main>
  <header>
    <h1>LF 10 Emmerstedt 11-45-32</h1>
    <p class="subtitle">MAN TGM 16.320 4x4 | Rosenbauer</p>
  </header>

  <section class="viz-section">
    <VehicleViz bind:view={currentView} on:select={handleSelect} />
  </section>

  {#if activeCompartment}
    <CompartmentView compartment={activeCompartment} onClose={handleClose} />
  {/if}

  <footer>
    <p>&copy; {new Date().getFullYear()} Freiwillige Feuerwehr</p>
  </footer>
</main>

<style>
  main {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }

  header {
    text-align: center;
    animation: fadeInDown 0.8s ease;
  }

  h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, #ff0000 0%, #ff6600 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    font-weight: 300;
  }

  .viz-section {
    width: 100%;
    display: flex;
    justify-content: center;
    animation: zoomIn 0.8s ease;
  }

  footer {
    margin-top: auto;
    color: #555;
    font-size: 0.8rem;
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
