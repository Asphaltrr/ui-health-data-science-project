import { z } from "zod"

export const patientSchema = z.object({
  age: z.coerce.number().min(0).max(120),
  gender: z.coerce.number(),
  steroid: z.coerce.number(),
  antivirals: z.coerce.number(),
  fatigue: z.coerce.number(),
  malaise: z.coerce.number(),
  anorexia: z.coerce.number(),
  liverBig: z.coerce.number(),
  liverFirm: z.coerce.number(),
  spleen: z.coerce.number(),
  spiders: z.coerce.number(),
  ascites: z.coerce.number(),
  varices: z.coerce.number(),
  bili: z.coerce.number(),
  alk: z.coerce.number(),
  sgot: z.coerce.number(),
  albu: z.coerce.number(),
  protime: z.coerce.number(),
  histology: z.coerce.number(),
})

export type PatientFormValues = z.infer<typeof patientSchema>

export const defaultPatientValues: PatientFormValues = {
  age: 50,
  gender: 1,
  steroid: 2,
  antivirals: 1,
  fatigue: 2,
  malaise: 2,
  anorexia: 2,
  liverBig: 2,
  liverFirm: 2,
  spleen: 2,
  spiders: 2,
  ascites: 2,
  varices: 2,
  bili: 0.5,
  alk: 85,
  sgot: 20,
  albu: 4,
  protime: 65,
  histology: 1,
}

type Option = { label: string; value: number }

export type PatientField =
  | {
      name: keyof PatientFormValues
      label: string
      type: "number"
      helper?: string
      step?: number
    }
  | {
      name: keyof PatientFormValues
      label: string
      type: "select"
      options: Option[]
      helper?: string
    }

const yesNo: Option[] = [
  { label: "Oui", value: 1 },
  { label: "Non", value: 2 },
]

export const patientFields: PatientField[] = [
  { name: "age", label: "Âge", type: "number", helper: "années" },
  {
    name: "gender",
    label: "Genre",
    type: "select",
    options: [
      { label: "Homme", value: 1 },
      { label: "Femme", value: 2 },
    ],
  },
  { name: "steroid", label: "Steroid (1/2)", type: "select", options: yesNo },
  { name: "antivirals", label: "Antiviraux (1/2)", type: "select", options: yesNo },
  { name: "fatigue", label: "Fatigue (1/2)", type: "select", options: yesNo },
  { name: "malaise", label: "Malaise (1/2)", type: "select", options: yesNo },
  { name: "anorexia", label: "Anorexie (1/2)", type: "select", options: yesNo },
  { name: "liverBig", label: "Foie volumineux (1/2)", type: "select", options: yesNo },
  { name: "liverFirm", label: "Foie ferme (1/2)", type: "select", options: yesNo },
  { name: "spleen", label: "Rate (1/2)", type: "select", options: yesNo },
  { name: "spiders", label: "Spiders (1/2)", type: "select", options: yesNo },
  { name: "ascites", label: "Ascite (1/2)", type: "select", options: yesNo },
  { name: "varices", label: "Varices (1/2)", type: "select", options: yesNo },
  { name: "bili", label: "Bilirubine", type: "number", helper: "mg/dL", step: 0.1 },
  { name: "alk", label: "Phosphatase alcaline", type: "number" },
  { name: "sgot", label: "SGOT", type: "number" },
  { name: "albu", label: "Albumine", type: "number", helper: "g/dL", step: 0.1 },
  { name: "protime", label: "Prothrombine", type: "number" },
  { name: "histology", label: "Histologie (1/2)", type: "select", options: yesNo },
]
