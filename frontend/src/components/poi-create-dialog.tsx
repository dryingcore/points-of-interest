import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  x: z.coerce.number().int("Deve ser um número inteiro").min(0, "Apenas números positivos."),
  y: z.coerce.number().int("Deve ser um número inteiro").min(0, "Apenas números positivos."),
})

type CreatePoiFormValues = z.infer<typeof formSchema>

interface PoiCreateDialogProps {
  onSuccess: () => void
}

export function PoiCreateDialog({ onSuccess }: PoiCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePoiFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      x: 0,
      y: 0,
    },
  })

  const onSubmit = async (data: CreatePoiFormValues) => {
    setIsSubmitting(true)
    try {
      await api.postPois(data)
      toast.success("Sucesso!", {
        description: `Ponto "${data.name}" criado com sucesso.`,
      })
      reset()
      setOpen(false)
      onSuccess()
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Ocorreu um erro inesperado"
      toast.error("Erro ao criar POI", {
        description: errMsg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Adicionar POI</span>
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Ponto de Interesse</DialogTitle>
          <DialogDescription>
            Crie um novo local fornecendo um nome único e suas coordenadas (X, Y).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Nome do Local</Label>
            <Input id="name" placeholder="Ex: Lanchonete" {...register("name")} />
            {errors.name && <p className="text-[0.8rem] text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="x" className={errors.x ? "text-destructive" : ""}>Coordenada X</Label>
              <Input id="x" type="number" {...register("x")} />
              {errors.x && <p className="text-[0.8rem] text-destructive">{errors.x.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="y" className={errors.y ? "text-destructive" : ""}>Coordenada Y</Label>
              <Input id="y" type="number" {...register("y")} />
              {errors.y && <p className="text-[0.8rem] text-destructive">{errors.y.message}</p>}
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Local"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
