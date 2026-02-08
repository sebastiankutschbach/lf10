<script lang="ts">
    import { onMount } from "svelte";
    import type { Compartment } from "../types";

    export let compartments: Compartment[];
    export let onClose: () => void;

    interface Question {
        item: string;
        correctCompartment: string;
        options: string[];
    }

    let questions: Question[] = [];
    let currentIndex = 0;
    let score = 0;
    let showResults = false;
    let selectedOption: string | null = null;
    let feedback: "correct" | "wrong" | null = null;

    function initQuiz() {
        // Collect all items and their compartments
        const allItems: { item: string; compName: string }[] = [];
        compartments.forEach((comp) => {
            comp.items.forEach((item) => {
                allItems.push({ item, compName: comp.name });
            });
        });

        // Shuffle items and pick 10
        const shuffledItems = [...allItems].sort(() => Math.random() - 0.5);
        const selectedItems = shuffledItems.slice(0, 10);

        // All compartment names for distracting options
        const allCompNames = compartments.map((c) => c.name);

        questions = selectedItems.map((si) => {
            const options = [si.compName];
            while (options.length < 4) {
                const randomComp =
                    allCompNames[
                        Math.floor(Math.random() * allCompNames.length)
                    ];
                if (!options.includes(randomComp)) {
                    options.push(randomComp);
                }
            }
            return {
                item: si.item,
                correctCompartment: si.compName,
                options: options.sort(() => Math.random() - 0.5),
            };
        });

        currentIndex = 0;
        score = 0;
        showResults = false;
        selectedOption = null;
        feedback = null;
    }

    function handleAnswer(option: string) {
        if (selectedOption !== null) return;

        selectedOption = option;
        if (option === questions[currentIndex].correctCompartment) {
            score++;
            feedback = "correct";
        } else {
            feedback = "wrong";
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                selectedOption = null;
                feedback = null;
            } else {
                showResults = true;
            }
        }, 1500);
    }

    onMount(initQuiz);
</script>

<div class="quiz-overlay">
    <div class="quiz-container">
        <div class="quiz-top-bar">
            {#if !showResults && questions.length > 0}
                <span class="progress">Frage {currentIndex + 1} von 10</span>
            {:else}
                <span></span>
            {/if}
            <button class="close-btn" on:click={onClose} aria-label="Schließen"
                >&times;</button
            >
        </div>

        {#if !showResults && questions.length > 0}
            <div class="quiz-header">
                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: {(currentIndex / 10) * 100}%"
                    ></div>
                </div>
            </div>

            <div class="question-box">
                <h2>Wo befindet sich:</h2>
                <p class="equipment-name">{questions[currentIndex].item}</p>
            </div>

            <div class="options-grid">
                {#each questions[currentIndex].options as option}
                    <button
                        class="option-btn"
                        class:selected={selectedOption === option}
                        class:correct={selectedOption === option &&
                            feedback === "correct"}
                        class:wrong={selectedOption === option &&
                            feedback === "wrong"}
                        class:missed={selectedOption !== null &&
                            option ===
                                questions[currentIndex].correctCompartment &&
                            feedback === "wrong"}
                        disabled={selectedOption !== null}
                        on:click={() => handleAnswer(option)}
                    >
                        {option}
                    </button>
                {/each}
            </div>

            {#if feedback === "correct"}
                <p class="feedback correct-text">Richtig! 🎉</p>
            {:else if feedback === "wrong"}
                <p class="feedback wrong-text">
                    Leider falsch. Es ist in {questions[currentIndex]
                        .correctCompartment}.
                </p>
            {/if}
        {:else if showResults}
            <div class="results-box">
                <h2>Quiz Beendet!</h2>
                <p class="final-score">
                    Du hast {score} von 10 Fragen richtig beantwortet.
                </p>

                <div class="performance-msg">
                    {#if score === 10}
                        <p>
                            Perfekt! Du kennst das Fahrzeug in- und auswendig.
                            🚒
                        </p>
                    {:else if score >= 7}
                        <p>Sehr gut! Du bist fast ein Profi. 👍</p>
                    {:else if score >= 5}
                        <p>Nicht schlecht, aber da geht noch was! 💪</p>
                    {:else}
                        <p>
                            Du solltest dir die Ausrüstung nochmal genauer
                            anschauen. 😉
                        </p>
                    {/if}
                </div>

                <div class="actions">
                    <button class="primary-btn" on:click={initQuiz}
                        >Nochmal versuchen</button
                    >
                    <button class="secondary-btn" on:click={onClose}
                        >Schließen</button
                    >
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .quiz-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(8px);
    }

    .quiz-container {
        background: #1a1a1a;
        width: 100%;
        max-width: 600px;
        padding: 2rem;
        border-radius: 16px;
        border: 1px solid #333;
        position: relative;
        box-shadow: 0 0 50px rgba(230, 57, 70, 0.2);
    }

    .quiz-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        width: 100%;
    }

    .close-btn {
        background: none;
        border: none;
        color: #888;
        font-size: 2.2rem;
        cursor: pointer;
        transition: color 0.2s;
        line-height: 1;
        padding: 0;
        margin-right: -0.5rem;
    }

    .close-btn:hover {
        color: white;
    }

    .quiz-header {
        margin-bottom: 2rem;
    }

    .progress {
        color: #888;
        font-size: 0.9rem;
    }

    .progress-bar {
        height: 4px;
        background: #333;
        border-radius: 2px;
        margin-top: 0.5rem;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: var(--color-primary, #e63946);
        transition: width 0.3s ease;
    }

    .question-box {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    h2 {
        font-size: 1.2rem;
        color: #888;
        font-weight: 400;
        margin-bottom: 0.5rem;
    }

    .equipment-name {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        line-height: 1.2;
    }

    .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .option-btn {
        padding: 1rem;
        background: #252525;
        border: 1px solid #333;
        border-radius: 8px;
        color: #ccc;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
    }

    .option-btn:hover:not(:disabled) {
        background: #333;
        border-color: #555;
        transform: translateY(-2px);
    }

    .option-btn.correct {
        background: rgba(40, 167, 69, 0.2);
        border-color: #28a745;
        color: #28a745;
    }

    .option-btn.wrong {
        background: rgba(220, 53, 69, 0.2);
        border-color: #dc3545;
        color: #dc3545;
    }

    .option-btn.missed {
        background: rgba(40, 167, 69, 0.1);
        border-color: #28a745;
    }

    .feedback {
        margin-top: 1.5rem;
        text-align: center;
        font-weight: 600;
        min-height: 1.5rem;
    }

    .correct-text {
        color: #28a745;
    }
    .wrong-text {
        color: #dc3545;
    }

    .results-box {
        text-align: center;
        padding: 2rem 0;
    }

    .final-score {
        font-size: 1.5rem;
        margin: 1rem 0;
        color: white;
    }

    .performance-msg {
        color: #888;
        margin-bottom: 2rem;
        font-size: 1.1rem;
    }

    .actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .primary-btn {
        background: var(--color-primary, #e63946);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
    }

    .secondary-btn {
        background: #333;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.9;
    }

    @media (max-width: 500px) {
        .options-grid {
            grid-template-columns: 1fr;
        }
        .quiz-container {
            padding: 1.5rem;
            margin: 1rem;
        }
        .equipment-name {
            font-size: 1.5rem;
        }
    }
</style>
