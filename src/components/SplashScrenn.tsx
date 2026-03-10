import { motion } from "framer-motion"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f8faf9]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        {/* Ícone Minimalista Estilo Órbita */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#16a34a] shadow-lg">
          <div className="animate-spin-slow h-12 w-12 rounded-full border-4 border-white border-t-transparent" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Finanças Pessoais
        </h1>
      </motion.div>

      <div className="absolute bottom-12">
        <div className="flex space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-green-500" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-green-500 [animation-delay:0.2s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-green-500 [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}
