import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  base: "/fischkapp/",
  root: "./",
  build: {
    outDir: "dist",
  },
}
