"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  defaultPatientValues,
  patientFields,
  patientSchema,
  type PatientFormValues,
} from "@/lib/patient"

type PatientFormProps = {
  onSubmit: (values: PatientFormValues) => Promise<void> | void
  submitLabel?: string
  loadingLabel?: string
  className?: string
}

export function PatientForm({
  onSubmit,
  submitLabel = "Lancer la prédiction",
  loadingLabel = "Calcul en cours...",
  className,
}: PatientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: defaultPatientValues,
  })

  const handleSubmit = async (values: PatientFormValues) => {
    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("space-y-6", className)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {patientFields.map((field) => {
          const error = form.formState.errors[field.name]
          if (field.type === "number") {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm text-muted-foreground">
                  {field.label}
                </label>
                <Input
                  type="number"
                  step={field.step ?? 1}
                  placeholder={field.placeholder}
                  {...form.register(field.name, { valueAsNumber: true })}
                  aria-invalid={!!error}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{field.helper}</span>
                  {error ? (
                    <span className="text-destructive">
                      {error.message?.toString()}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          }

          return (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm text-muted-foreground">
                {field.label}
              </label>
              <Controller
                name={field.name}
                control={form.control}
                render={({ field: controllerField }) => (
                  <Select
                    value={
                      controllerField.value !== undefined
                        ? String(controllerField.value)
                        : undefined
                    }
                    onValueChange={(val) =>
                      controllerField.onChange(Number(val))
                    }
                  >
                    <SelectTrigger
                      aria-invalid={!!error}
                      className="w-full justify-between"
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem
                          key={String(opt.value)}
                          value={String(opt.value)}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{field.helper}</span>
                {error ? (
                  <span className="text-destructive">
                    {error.message?.toString()}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? loadingLabel : submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset(defaultPatientValues)}
        >
          Réinitialiser
        </Button>
      </div>
    </form>
  )
}
