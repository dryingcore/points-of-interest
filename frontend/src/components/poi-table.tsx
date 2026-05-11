import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetPois200Item } from "@/api/model"

interface PoiTableProps {
  pois: GetPois200Item[]
  isLoading: boolean
}

export function PoiTable({ pois, isLoading }: PoiTableProps) {
  return (
    <Card className="col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle>Pontos de Interesse Cadastrados</CardTitle>
        <CardDescription>Uma lista completa de todos os locais no banco de dados.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur z-10 shadow-sm">
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nome do Local</TableHead>
                <TableHead className="text-right">Coord X</TableHead>
                <TableHead className="text-right">Coord Y</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : pois.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhum ponto de interesse encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                pois.map((poi) => (
                  <TableRow key={poi.id}>
                    <TableCell className="font-medium text-muted-foreground">#{poi.id}</TableCell>
                    <TableCell className="font-semibold">{poi.name}</TableCell>
                    <TableCell className="text-right">{poi.x}</TableCell>
                    <TableCell className="text-right">{poi.y}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
