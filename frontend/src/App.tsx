import { useEffect, useState } from 'react'
import { Toaster } from "@/components/ui/sonner"
import Layout from '@/components/layout'
import { PoiTable } from '@/components/poi-table'
import { PoiCreateDialog } from '@/components/poi-create-dialog'
import { PoiProximitySearch } from '@/components/poi-proximity-search'

import { api } from '@/lib/api'
import type { GetPois200Item } from '@/api/model'

function App() {
  const [pois, setPois] = useState<GetPois200Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPois = async () => {
    setIsLoading(true)
    try {
      const response = await api.getPois()
      setPois(response.data)
    } catch (error) {
      console.error("Failed to load POIs", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPois()
  }, [])

  const latestPoi = pois.length > 0 ? [...pois].sort((a, b) => b.id - a.id)[0] : null;

  return (
    <>
      <Layout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
              <p className="text-muted-foreground">
                Gerencie e acompanhe todos os pontos de interesse na plataforma.
              </p>
            </div>
            <PoiCreateDialog onSuccess={loadPois} />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total de Locais</h3>
              </div>
              <div className="text-2xl font-bold">{isLoading ? "..." : pois.length}</div>
              <p className="text-xs text-muted-foreground">Locais registrados no banco</p>
            </div>
            
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Último Adicionado</h3>
              </div>
              <div className="text-2xl font-bold truncate">
                {isLoading ? "..." : latestPoi ? latestPoi.name : "Nenhum"}
              </div>
              <p className="text-xs text-muted-foreground">
                {latestPoi ? `Coord: ${latestPoi.x}, ${latestPoi.y}` : "Adicione um local"}
              </p>
            </div>
            
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Status do Sistema</h3>
              </div>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">Conectado à API Orval</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PoiTable pois={pois} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-1">
              <PoiProximitySearch />
            </div>
          </div>
        </div>
      </Layout>
      <Toaster />
    </>
  )
}

export default App
