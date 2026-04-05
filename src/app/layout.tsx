import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApuestasMundialistas.com | Reserva tu Cancha",
  description: "Reserva canchas de fútbol, vóley, básquet y más. Horarios en tiempo real, pagos con tarjeta, Yape o Plin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
