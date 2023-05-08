import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  base: "/fancy-calendar-js/",
  root: "./",
  build: {
    outDir: "dist",
  },
}
