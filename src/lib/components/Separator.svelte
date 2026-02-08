<script lang="ts">
    export let text: string = "";
    export let level: "h1" | "h2" | "h3" = "h2";
    export let margin: string = "0";
</script>

<div class="separator-container" style="margin: {margin};">
    <div class="line"></div>
    {#if level === "h1"}
        <h1>{text}</h1>
    {:else if level === "h2"}
        <h2>{text}</h2>
    {:else if level === "h3"}
        <h3>{text}</h3>
    {/if}
    <div class="line"></div>
</div>

<style>
    .separator-container {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
    }

    .line {
        height: 1px;
        flex: 1;
        background: linear-gradient(90deg, transparent, #e63946, transparent);
    }

    h1,
    h2,
    h3 {
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

    h1 {
        font-size: 2rem;
    }
    h2 {
        font-size: 1.5rem;
    }
    h3 {
        font-size: 1rem;
        letter-spacing: 1px;
    }

    @media (max-width: 600px) {
        h1 {
            font-size: 1.5rem;
        }
        h2 {
            font-size: 1.2rem;
        }
        .separator-container {
            gap: 1rem;
        }
    }
</style>
