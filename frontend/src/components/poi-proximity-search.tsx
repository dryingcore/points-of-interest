import { useState } from "react"
import { Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import type { GetPoisSearch200Item } from "@/api/model"
import { Separator } from "@/components/ui/separator"

const searchSchema = z.object({
  x: z.coerce.number().int("Deve ser um inteiro").min(0, "Apenas números positivos"),
  y: z.coerce.number().int("Deve ser um inteiro").min(0, "Apenas números positivos"),
  dmax: z.coerce.number().min(0, "A distância deve ser maior que 0"),
})

type SearchFormValues = z.infer<typeof searchSchema>

export function PoiProximitySearch() {
  const [results, setResults] = useState<GetPoisSearch200Item[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema) as any,
    defaultValues: {
      x: 0,
      y: 0,
      dmax: 10,
    },
  })

  const onSearch = async (data: SearchFormValues) => {
    setIsSearching(true)
    try {
      const response = await api.getPoisSearch({
        x: data.x,
        y: data.y,
        dmax: data.dmax,
      })
      setResults(response.data)
      if (response.data.length === 0) {
        toast.info("Nenhum POI encontrado", {
          description: "Não existem locais nesta área com a distância informada."
        })
      }
    } catch (error) {
      toast.error("Erro na busca", {
        description: "Não foi possível buscar pontos de interesse por proximidade."
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Card className="col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle>Busca por Proximidade</CardTitle>
        <CardDescription>
          Encontre POIs próximos a uma coordenada específica dentro de um raio de distância (D-Max).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="search-x" className={errors.x ? "text-destructive" : ""}>Ref. X</Label>
              <Input id="search-x" type="number" {...register("x")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="search-y" className={errors.y ? "text-destructive" : ""}>Ref. Y</Label>
              <Input id="search-y" type="number" {...register("y")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dmax" className={errors.dmax ? "text-destructive" : ""}>Dist. Máx</Label>
              <Input id="dmax" type="number" step="any" {...register("dmax")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSearching}>
            <Search className="mr-2 h-4 w-4" />
            {isSearching ? "Buscando..." : "Pesquisar locais próximos"}
          </Button>
        </form>

        {results !== null && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h4 className="text-sm font-medium">Resultados da busca ({results.length})</h4>
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
              {results.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum resultado</p>
              ) : (
                results.map((poi) => (
                  <div key={poi.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{poi.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Coordenadas: ({poi.x}, {poi.y})
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
