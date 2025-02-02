import MillionLint from '@million/lint';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        MillionLint.vite({
            enabled: true,
            auto: {
                threshold: 0.05,
                skip: ['useBadHook', /badVariable/g],
            },
        }),
        react(),
        tailwindcss(),
    ],
});
