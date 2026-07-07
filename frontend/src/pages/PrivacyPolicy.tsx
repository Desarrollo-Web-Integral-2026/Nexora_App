// src/pages/PrivacyPolicy.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'responsable',
    title: '1. Responsable del Tratamiento de Datos',
    content: `Nexora — Plataforma Digital para la Comunidad Artística, desarrollada por Celeste Estefanía Ramírez Matehuala y Luis Manuel López Cano, alumnos de la Universidad Tecnológica del Norte de Guanajuato, con domicilio en Avenida Educación Tecnológica número 34, Fraccionamiento Universidad, C.P. 37800, Dolores Hidalgo Cuna de la Independencia Nacional, Guanajuato, es responsable del tratamiento de los datos personales que los usuarios proporcionan al utilizar la plataforma.`,
  },

  {
    id: 'datos',
    title: '2. Datos Recabados',
    content: `Para la operación del servicio se recaban los siguientes datos personales:

• Datos de identificación y contacto necesarios para crear y gestionar tu cuenta (nombre, correo electrónico y contraseña cifrada).

• Contenido generado por el usuario: publicaciones, comentarios, reacciones y mensajes privados.

• Archivos multimedia subidos a la plataforma (imágenes, ilustraciones y otros productos digitales).

• Datos de transacciones realizadas dentro del marketplace (información de tiendas virtuales, productos publicados, pedidos e historial de compras o ventas).`,
  },

  {
    id: 'finalidad',
    title: '3. Finalidad del Tratamiento',
    content: `Estos datos se utilizan exclusivamente para:

• Crear y administrar tu cuenta de usuario.

• Permitir la interacción social dentro de la plataforma (publicaciones, comentarios y mensajería en tiempo real).

• Gestionar tu tienda virtual y las transacciones del marketplace.

• Aplicar los mecanismos de protección de contenido multimedia (marcas de agua y restricciones de descarga) configurados sobre tus archivos.`,
  },

  {
  id: 'terceros',
  title: '4. Transferencia de Datos a Terceros',
  content: `Nexora utiliza los siguientes servicios externos para su operación:

- Cloudinary (cloudinary.com)
  - Datos transferidos: archivos multimedia (imágenes, ilustraciones y productos digitales)
  - Finalidad: almacenamiento, entrega y protección de contenido multimedia
  - Canal: HTTPS con autenticación segura mediante API keys
  - Retención: hasta que el usuario elimine el archivo o cancele su cuenta

Ningún dato personal como nombre, correo o contraseña es transferido a servicios externos.

Las transferencias de archivos multimedia solo ocurren cuando el usuario ha aceptado explícitamente este aviso de privacidad. Al subir cualquier archivo a la plataforma confirmas que has leído y aceptado que dicho contenido será almacenado en Cloudinary.`,
},

  {
    id: 'seguridad',
    title: '5. Seguridad de la Información',
    content: `El acceso a la plataforma está protegido mediante autenticación basada en JWT (JSON Web Tokens), y los archivos multimedia se almacenan y distribuyen a través de servicios especializados con control de acceso estricto.

No se comparte información personal con terceros sin tu consentimiento, salvo obligación legal expresa.`,
  },

  {
    id: 'arco',
    title: '6. Derechos ARCO',
    content: `Como titular de tus datos, tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tu información personal en cualquier momento.

Para ejercer estos derechos envía tu solicitud a:

privacidad@nexoraapp.mx

Indica tu nombre de usuario y la solicitud específica que deseas realizar.`,
  },
]

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="bg-bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/" className="text-2xl font-bold text-primary">
          Nexora
        </Link>
        <span className="text-muted text-sm">Aviso de Privacidad</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Versión simplificada */}
        <section className="bg-bg-card border border-accent/30 rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔒</span>
            <h2 className="text-xl font-bold text-accent">
              Aviso de Privacidad Simplificado
            </h2>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Nexora es responsable del tratamiento de los datos personales que
            proporcionas al utilizar la plataforma. Recopilamos únicamente la
            información necesaria para crear y administrar tu cuenta, permitir la
            interacción entre usuarios, gestionar publicaciones, mensajes privados,
            tiendas virtuales y transacciones dentro del marketplace.

            Tus datos están protegidos mediante autenticación segura con JWT y
            almacenamiento controlado de archivos multimedia. No compartimos tu
            información con terceros sin tu consentimiento, salvo obligación legal.

            Puedes ejercer tus derechos ARCO escribiendo a
            privacidad@nexoraapp.mx.
          </p>

          <a
            href="#aviso-integral"
            className="inline-block mt-4 text-primary text-sm underline hover:text-accent transition-colors"
          >
            Ver aviso integral completo
          </a>
        </section>

        {/* Versión integral */}
        <section id="aviso-integral">
          <h1 className="text-3xl font-bold text-text mb-2">
            Aviso de Privacidad Integral
          </h1>
          <p className="text-muted text-sm mb-8">
            Última actualización: {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className="flex flex-col gap-3">
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                className="bg-bg-card border border-primary/20 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/10 transition-colors"
                >
                  <span className="font-semibold text-text">
                    {section.title}
                  </span>
                  <span className="text-accent text-xl">
                    {activeSection === section.id ? '−' : '+'}
                  </span>
                </button>
                {activeSection === section.id && (
                  <div className="px-6 pb-6 text-muted text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer del aviso */}
        <div className="mt-10 text-center text-muted text-xs">
          <p>
            Para ejercer tus derechos ARCO o cualquier consulta escríbenos a{' '}
            <span className="text-accent">privacidad@nexora.mx</span>
          </p>
        </div>
      </main>

      {/* Footer global */}
      <footer className="border-t border-primary/20 px-6 py-6 text-center text-muted text-xs mt-10">
        <p>
          © {new Date().getFullYear()} Nexora — Todos los derechos reservados
        </p>
        <Link
          to="/privacy"
          className="text-accent underline mt-2 inline-block hover:text-primary transition-colors"
        >
          Aviso de Privacidad
        </Link>
      </footer>
    </div>
  )
}

export default PrivacyPolicy