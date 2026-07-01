function SecurityBadge() {
    const isHttps = window.location.protocol === 'https:'

    if (!isHttps && import.meta.env.PROD) return null

    return (
        <div className="hidden md:flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                />
            </svg>
            Conexión segura
        </div>
    )
}

export default SecurityBadge