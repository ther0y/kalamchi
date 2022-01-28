<style>
    .modal-wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        padding-top: 200px;
        justify-content: center;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.1);
        z-index: 999;
        animation: fade-in 0.35s ease-in-out;
    }

    .modal {
        top: 0;
        background: white;
        max-width: 480px;
        width: 80%;
        border-radius: 6px;
        /*opacity: 0;*/
        color: #3a3a3c;
        animation: scale-up 0.45s ease-in-out;
    }

    @media screen and (max-width: 480px) {
        .modal {
            width: 90%;
        }
    }

    @keyframes fade-in {
        0% {
            background: rgba(255, 255, 255, 0);
        }

        100% {
            background: rgba(255, 255, 255, 0.1);
        }
    }

    @keyframes scale-up {
        0% {
            opacity: 0;
            transform:  translateY(40px);
        }
        100% {
            opacity: 1;
            transform:  translateY(0);
        }
    }
</style>
<script lang="ts">
  import { fade, fly } from 'svelte/transition';
    import {resultTitle} from "../utils/result-helper";
    import {GameStore} from "../stores/gamestore";

    export let isFinished = false;
</script>

{#if (isFinished)}
    <div class="modal-wrapper">
        <div class="modal">
            <h2>{resultTitle[$GameStore.guessIndex]}!</h2>
        </div>
    </div>
{/if}