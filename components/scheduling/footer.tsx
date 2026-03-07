import { BUSINESS_NAME } from "@/lib/config"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-8 border-t border-border bg-card/50 py-6 text-center">
      <p className="text-xs text-muted-foreground">
        {currentYear} {BUSINESS_NAME}. Todos os direitos reservados.
      </p>
      {/* EDITE: Adicione links para redes sociais aqui */}
      <a
        href="/admin"
        className="mt-2 inline-block text-xs text-muted-foreground/50 transition-colors hover:text-primary"
      >
        Painel Administrativo
      </a>
    </footer>
  )
}
