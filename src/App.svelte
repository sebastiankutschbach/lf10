<script lang="ts">
  import VehicleViz from "./lib/components/VehicleViz.svelte";
  import CompartmentView from "./lib/components/CompartmentView.svelte";
  import Quiz from "./lib/components/Quiz.svelte";
  import LegalNotice from "./lib/components/LegalNotice.svelte";
  import loadoutData from "./data/loadout.json";
  import type { Compartment } from "./lib/types";
  import "./app.css";

  // State
  let activeCompartment: Compartment | null = null;
  let showQuiz = false;
  let currentLegalView: "imprint" | "privacy" | null = null;
  let currentView:
    | "left"
    | "right"
    | "rear"
    | "roof"
    | "crew-cabin"
    | "driver-cabin" = "left";

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
    currentLegalView = null;
  }

  function showLegal(type: "imprint" | "privacy") {
    currentLegalView = type;
  }
</script>

<main>
  <header>
    <h1>LF 10 Emmerstedt 11-45-32</h1>
    <p class="subtitle">MAN TGM 16.320 4x4 | Rosenbauer</p>
    <div class="quiz-teaser">
      <button class="quiz-start-btn" on:click={() => (showQuiz = true)}>
        <span class="icon">🚒</span> Quiz: Kennst du die Beladung?
      </button>
    </div>
  </header>

  <section class="viz-section">
    <VehicleViz bind:view={currentView} on:select={handleSelect} />
  </section>

  {#if activeCompartment}
    <CompartmentView compartment={activeCompartment} onClose={handleClose} />
  {/if}

  {#if showQuiz}
    <Quiz {compartments} onClose={() => (showQuiz = false)} />
  {/if}

  {#if currentLegalView}
    <LegalNotice type={currentLegalView} onClose={handleClose} />
  {/if}

  <footer>
    <div class="footer-content">
      <p>&copy; {new Date().getFullYear()} Sebastian Kutschbach</p>
      <div class="footer-links">
        <button on:click={() => showLegal("imprint")}>Impressum</button>
        <button on:click={() => showLegal("privacy")}>Datenschutz</button>
      </div>
    </div>
  </footer>
</main>

<style>
  main {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(1rem, 5vw, 2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(1.5rem, 8vw, 3rem);
    box-sizing: border-box;
  }

  header {
    text-align: center;
    animation: fadeInDown 0.8s ease;
  }

  h1 {
    font-size: clamp(1.5rem, 8vw, 3.5rem);
    background: linear-gradient(135deg, #ff0000 0%, #ff6600 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    line-height: 1.1;
    word-wrap: break-word;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    font-weight: 300;
  }

  .quiz-teaser {
    margin-top: 1.5rem;
  }

  .quiz-start-btn {
    background: rgba(230, 57, 70, 0.1);
    border: 1px solid rgba(230, 57, 70, 0.3);
    color: #e63946;
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 auto;
  }

  .quiz-start-btn:hover {
    background: #e63946;
    color: white;
    box-shadow: 0 0 20px rgba(230, 57, 70, 0.4);
    transform: scale(1.05);
  }

  .quiz-start-btn .icon {
    font-size: 1.2rem;
  }

  .viz-section {
    width: 100%;
    display: flex;
    justify-content: center;
    animation: zoomIn 0.8s ease;
  }

  footer {
    margin-top: auto;
    width: 100%;
    padding: 2rem 0;
    border-top: 1px solid #222;
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #555;
    font-size: 0.85rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-links button {
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 0.85rem;
    transition: color 0.2s;
    padding: 0;
  }

  .footer-links button:hover {
    color: white;
  }

  @media (max-width: 600px) {
    .footer-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
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
