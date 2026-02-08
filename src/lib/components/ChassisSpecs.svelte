<script lang="ts">
    import Separator from "./Separator.svelte";
    type Spec = {
        label: string;
        value: string;
    };
    const specs : Spec[] = [
        { label: "Modell", value: "MAN TGM 16.320 4x4 BB" },
        { label: "Motor", value: "MAN D0836 LFL (Euro 6)" },
        { label: "Zylinder / Bauart", value: "6 Zylinder / Reihe" },
        { label: "Hubraum", value: "6.871 cm³" },
        { label: "Max. Leistung", value: "235 kW (320 PS)" },
        { label: "Max. Drehmoment", value: "1.250 Nm" },
        { label: "Getriebe", value: "MAN TipMatic® 12-Gang (automatisiert)" },
        { label: "Antrieb", value: "Allradantrieb (4x4), zuschaltbar" },
        { label: "Gesamtgewicht", value: "16.000 kg (zulässig)" },
        {
            label: "Länge / Breite / Höhe",
            value: "ca. 7.200 / 2.500 / 3.300 mm",
        },
    ];
</script>

<section class="chassis-specs">
    <Separator text="Technische Daten Fahrgestell" margin="0 0 2rem 0" />

    <div class="specs-grid">
        {#each specs as spec}
            <div class="spec-item">
                <span class="label">{spec.label}</span>
                <span class="value">{spec.value}</span>
            </div>
        {/each}
    </div>
</section>

<style>
    .chassis-specs {
        width: 100%;
        max-width: 900px;
        margin: 4rem auto;
        padding: 0 1rem;
        animation: fadeInUp 0.8s ease;
    }

    .specs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        background: rgba(255, 255, 255, 0.03);
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid #222;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
    }

    .spec-item {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding-bottom: 0.8rem;
        border-bottom: 1px solid #222;
    }

    .spec-item:last-child {
        border-bottom: none;
    }

    .label {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1px;
    }

    .value {
        font-size: 1.1rem;
        color: #eee;
        font-weight: 500;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 600px) {
        .specs-grid {
            padding: 1.5rem;
        }
    }
</style>
