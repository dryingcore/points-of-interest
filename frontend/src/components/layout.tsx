import { MapPin } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">GeoTracker</span>
        </div>
        <div className="w-full flex-1 ml-4 border-l pl-4">
          <h1 className="text-sm font-medium text-muted-foreground">Pontos de Interesse - Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
