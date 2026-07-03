const DATA_POLICY = {
  users: {
    fields: ['nombre', 'apellido', 'correo', 'password', 'rol', 'avatar_url', 'descripcion'],
    finalidad: 'Crear y gestionar la cuenta del usuario en Nexora',
    retention: '2 años desde el último inicio de sesión',
    retentionDays: 730,
  },
  sessions: {
    fields: ['user_id', 'refresh_token', 'expires_at', 'created_at'],
    finalidad: 'Mantener la sesión activa del usuario autenticado',
    retention: '7 días desde su creación',
    retentionDays: 7,
  },
  posts: {
    fields: ['user_id', 'tipo', 'contenido', 'multimedia_url', 'created_at'],
    finalidad: 'Publicar contenido en el feed social de Nexora',
    retention: 'Hasta que el usuario lo elimine o cancele su cuenta',
    retentionDays: null,
  },
  messages: {
    fields: ['conversation_id', 'sender_id', 'contenido', 'created_at'],
    finalidad: 'Comunicación privada entre usuarios',
    retention: '1 año desde el envío o hasta que el usuario los elimine',
    retentionDays: 365,
  },
  orders: {
    fields: ['buyer_id', 'seller_id', 'product_id', 'monto', 'status', 'created_at'],
    finalidad: 'Gestionar transacciones dentro del marketplace',
    retention: '5 años por obligación fiscal',
    retentionDays: 1825,
  },
  audit_logs: {
    fields: ['user_id', 'accion', 'entidad', 'timestamp', 'ip'],
    finalidad: 'Trazabilidad y cumplimiento normativo',
    retention: '3 años por obligación legal',
    retentionDays: 1095,
  },
}

const getPolicy = (entity) => {
  return DATA_POLICY[entity] || null
}

const getAllPolicies = () => DATA_POLICY

module.exports = { getPolicy, getAllPolicies }