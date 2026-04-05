import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚽</span>
              <span className="text-lg font-bold text-white">
                Apuestas<span className="text-green-400">Mundialistas</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              La plataforma #1 de reservas de canchas deportivas en Lima.
              Fútbol, Vóley y Básquet con disponibilidad en tiempo real.
            </p>
            <div className="flex gap-3 mt-4">
              {["📘", "📸", "🐦"].map((icon, i) => (
                <span key={i} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg text-lg cursor-pointer hover:bg-gray-700 transition-colors">
                  {icon}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#funcionalidades" className="hover:text-green-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#beneficios" className="hover:text-green-400 transition-colors">Beneficios</a></li>
              <li><a href="#canchas" className="hover:text-green-400 transition-colors">Canchas</a></li>
              <li><Link href="/reservas" className="hover:text-green-400 transition-colors">Reservar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>Av. El Derby s/n, Lima</li>
              <li>+51 999 888 777</li>
              <li>info@apuestasmundialistas.com</li>
              <li className="text-gray-400">Lun - Dom: 8:00 - 23:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ApuestasMundialistas.com — Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
