<script lang="ts">
    export let type: "imprint" | "privacy" = "imprint";
    export let onClose: () => void;

    // Default placeholders - User should fill these
    const contactInfo = {
        name: "Sebastian Kutschbach",
        address: "Wiesenstr, 54\n38350 Helmstedt",
        email: "skutschbach85@gmail.com",
    };
</script>

<div
    class="legal-overlay"
    on:click|self={onClose}
    on:keydown|self={(e) => e.key === "Escape" && onClose()}
>
    <div class="legal-modal">
        <button class="close-btn" on:click={onClose} aria-label="Schließen"
            >×</button
        >

        <div class="content">
            {#if type === "imprint"}
                <h1>Impressum</h1>

                <section>
                    <h2>Angaben gemäß § 5 TMG</h2>
                    <p>{contactInfo.name}</p>
                    <p style="white-space: pre-line;">{contactInfo.address}</p>
                </section>

                <section>
                    <h2>Kontakt</h2>
                    <p>E-Mail: {contactInfo.email}</p>
                </section>

                <section>
                    <h2>Redaktionell verantwortlich</h2>
                    <p>{contactInfo.name}</p>
                </section>

                <section>
                    <h2>
                        Verbraucherstreitbeilegung/Universalschlichtungsstelle
                    </h2>
                    <p>
                        Wir sind nicht bereit oder verpflichtet, an
                        Streitbeilegungsverfahren vor einer
                        Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </section>
            {:else}
                <h1>Datenschutzerklärung</h1>

                <section>
                    <h2>1. Datenschutz auf einen Blick</h2>
                    <h3>Allgemeine Hinweise</h3>
                    <p>
                        Die folgenden Hinweise geben einen einfachen Überblick
                        darüber, was mit Ihren personenbezogenen Daten passiert,
                        wenn Sie diese Website besuchen.
                    </p>
                </section>

                <section>
                    <h2>2. Hosting</h2>
                    <p>
                        Wir hosten die Inhalte unserer Website bei folgendem
                        Anbieter:
                    </p>
                    <p>
                        <strong>GitHub Pages</strong>
                    </p>
                </section>

                <section>
                    <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
                    <h3>Datenschutz</h3>
                    <p>
                        Die Betreiber dieser Seiten nehmen den Schutz Ihrer
                        persönlichen Daten sehr ernst. Wir behandeln Ihre
                        personenbezogenen Daten vertraulich und entsprechend den
                        gesetzlichen Datenschutzvorschriften sowie dieser
                        Datenschutzerklärung.
                    </p>
                </section>
            {/if}
        </div>
    </div>
</div>

<style>
    .legal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
    }

    .legal-modal {
        background: #1a1a1a;
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        border-radius: 16px;
        border: 1px solid #333;
        position: relative;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        animation: modalIn 0.3s ease-out;
    }

    @keyframes modalIn {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        background: none;
        border: none;
        color: #999;
        font-size: 2.5rem;
        cursor: pointer;
        z-index: 10;
        line-height: 1;
        transition: color 0.2s;
    }

    .close-btn:hover {
        color: white;
    }

    .content {
        padding: 3rem;
        overflow-y: auto;
        color: #ddd;
    }

    h1 {
        color: white;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--color-primary);
        padding-bottom: 0.5rem;
        inline-size: fit-content;
    }

    h2 {
        color: white;
        font-size: 1.25rem;
        margin: 2rem 0 1rem;
    }

    h3 {
        color: #bbb;
        font-size: 1rem;
        margin: 1.5rem 0 0.5rem;
    }

    section {
        margin-bottom: 2rem;
    }

    p {
        line-height: 1.6;
        margin-bottom: 1rem;
    }

    @media (max-width: 600px) {
        .content {
            padding: 2rem 1.5rem;
        }
    }
</style>
