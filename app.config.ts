import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    vite({ router }) {
        if (router === "client") {
            return {
                server: {
                    hmr: {
                        // It's a good practice to specify a port for HMR
                        // to avoid conflicts, e.g., 3001
                        port: 3001,
                    },
                    watch: {
                        // This is the crucial part for Docker Desktop
                        usePolling: true,
                    },
                },
            };
        }
        return {};
    },
});
