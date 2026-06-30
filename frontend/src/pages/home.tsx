import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkles, Heart, ShoppingBag, Shield,
  Image, MessageCircle, Send, Store, Droplets,
  Fingerprint, Download, Quote
} from 'lucide-react'

const features = [
  { icon: Image, title: 'Publicaciones', desc: 'Comparte tus trabajos con la comunidad' },
  { icon: MessageCircle, title: 'Comentarios', desc: 'Recibe feedback y conecta con otros artistas' },
  { icon: Send, title: 'Mensajería', desc: 'Comunicación directa entre usuarios' },
  { icon: ShoppingBag, title: 'Marketplace', desc: 'Compra y vende obras de arte' },
  { icon: Store, title: 'Tiendas virtuales', desc: 'Tu propio escaparate digital' },
  { icon: Droplets, title: 'Protección multimedia', desc: 'Seguridad para tu contenido' },
  { icon: Fingerprint, title: 'Marcas de agua', desc: 'Protege tu autoría automáticamente' },
  { icon: Download, title: 'Descargas controladas', desc: 'Tú decides quién descarga' },
]

function Home() {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">

      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0F0F1A]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent">
            Nexora
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#que-es" className="hover:text-white transition-colors">¿Qué es?</a>
            <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
            <Link to="/privacy" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#6C3FC5] opacity-20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#E040FB] opacity-20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5A623] opacity-10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 mb-8">
            <Sparkles className="w-4 h-4 text-[#E040FB]" />
            Plataforma Digital para la Comunidad Artística
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-[#6C3FC5] via-[#E040FB] to-[#F5A623] bg-clip-text text-transparent">
              Nexora
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
            Comparte • Descubre • Compra • Vende
          </p>

          <p className="text-gray-500 max-w-xl mx-auto mb-10">
            El espacio donde artistas y amantes del arte se encuentran para crear, inspirar y crecer juntos.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] text-white font-semibold hover:shadow-lg hover:shadow-[#6C3FC5]/25 transition-all duration-300 flex items-center gap-2 group">
              Crear cuenta
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2">
              Explorar comunidad
            </button>
          </div>
        </div>
      </section>

      {/* ¿Qué es Nexora? */}
      <section id="que-es" className="relative px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                ¿Qué es{' '}
                <span className="bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent">
                  Nexora
                </span>
                ?
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                Nexora es una plataforma diseñada para artistas y amantes del arte
                donde puedes publicar ilustraciones, pinturas, fotografías,
                esculturas, música y contenido digital.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Ilustraciones', 'Pinturas', 'Fotografías', 'Música'].map((item) => (
                <div key={item} className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#6C3FC5]/50 transition-all duration-300 hover:-translate-y-1">
                  <Heart className="w-8 h-8 text-[#E040FB] mb-3" />
                  <h3 className="font-semibold">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas principales */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#6C3FC5] opacity-10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Comunidad',
                desc: 'Comparte tus trabajos y conecta con una comunidad apasionada por el arte.',
                color: 'from-[#6C3FC5] to-[#8B5CF6]',
                borderHover: 'hover:border-[#6C3FC5]',
              },
              {
                icon: ShoppingBag,
                title: 'Marketplace',
                desc: 'Vende tus obras fácilmente mediante una tienda virtual integrada.',
                color: 'from-[#E040FB] to-[#F472B6]',
                borderHover: 'hover:border-[#E040FB]',
              },
              {
                icon: Shield,
                title: 'Seguridad',
                desc: 'Tus datos protegidos mediante autenticación JWT y controles de acceso.',
                color: 'from-[#F5A623] to-[#F97316]',
                borderHover: 'hover:border-[#F5A623]',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 ${item.borderHover} transition-all duration-500 hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegir Nexora? */}
      <section id="caracteristicas" className="relative px-6 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Por qué elegir{' '}
              <span className="bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent">
                Nexora
              </span>
              ?
            </h2>
            <p className="text-gray-500">Todo lo que necesitas en un solo lugar</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C3FC5] to-[#E040FB] p-2 flex-shrink-0">
                  <item.icon className="w-full h-full text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-[#E040FB] opacity-5 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Quote className="w-12 h-12 text-[#6C3FC5]/50 mx-auto mb-6" />
          <blockquote className="text-3xl md:text-4xl font-bold leading-tight">
            "Impulsando el{' '}
            <span className="bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent">
              talento artístico
            </span>
            "
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Link to="/" className="text-lg font-bold bg-gradient-to-r from-[#6C3FC5] to-[#E040FB] bg-clip-text text-transparent">
                Nexora
              </Link>
              <p className="text-gray-600 text-sm mt-1">&copy; 2026 Nexora. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Inicio</a>
              <Link to="/privacy" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home
