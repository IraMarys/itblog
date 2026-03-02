import { app } from "./app.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API is running!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Interface: 0.0.0.0 (all interfaces)`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🚀 Railway: ${process.env.RAILWAY_PUBLIC_DOMAIN || "not set"}`);
});
