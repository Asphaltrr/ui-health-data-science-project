"use client"

import { useMemo, useState } from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Eye, SortAsc, SortDesc } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type HistoryItem } from "@/lib/types"

type HistoryTableProps = {
  data: HistoryItem[]
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))

export function HistoryTable({ data }: HistoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ])
  const [page, setPage] = useState(0)
  const pageSize = 8

  const columns = useMemo<ColumnDef<HistoryItem>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: ({ column }) => {
          const sorted = column.getIsSorted()
          return (
            <button
              className="flex items-center gap-1"
              onClick={column.getToggleSortingHandler()}
            >
              Date
              {sorted === "desc" ? (
                <SortDesc className="size-4" />
              ) : sorted === "asc" ? (
                <SortAsc className="size-4" />
              ) : null}
            </button>
          )
        },
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.timestamp)}
          </span>
        ),
      },
      {
        accessorKey: "prediction",
        header: "Prédiction",
        cell: ({ row }) => (
          <Badge
            variant={row.original.prediction === 1 ? "default" : "outline"}
            className={
              row.original.prediction === 1
                ? "bg-emerald-500 text-emerald-950"
                : ""
            }
          >
            {row.original.prediction === 1 ? "Survie" : "Décès"}
          </Badge>
        ),
      },
      {
        accessorKey: "proba_survie",
        header: "% Survie",
        cell: ({ row }) =>
          `${Math.round(row.original.proba_survie * 100)} %`,
      },
      {
        accessorKey: "proba_deces",
        header: "% Décès",
        cell: ({ row }) => `${Math.round(row.original.proba_deces * 100)} %`,
      },
      {
        id: "actions",
        header: "Détails",
        cell: ({ row }) => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <Eye className="size-4" />
                Voir
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Prédiction #{row.original.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {formatDate(row.original.timestamp)}
                  </Badge>
                  <Badge variant="outline">
                    Survie {Math.round(row.original.proba_survie * 100)}%
                  </Badge>
                  <Badge variant="outline">
                    Décès {Math.round(row.original.proba_deces * 100)}%
                  </Badge>
                </div>
                <pre className="bg-muted/40 max-h-72 overflow-auto rounded-lg p-3 text-xs">
                  {JSON.stringify(row.original.input, null, 2)}
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
    []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const sortedRows = table.getRowModel().rows
  const pageCount = Math.max(Math.ceil(sortedRows.length / pageSize), 1)
  const rows = sortedRows.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>{data.length} prédictions loguées</TableCaption>
      </Table>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page + 1} / {pageCount || 1}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(p + 1, Math.max(pageCount - 1, 0)))
            }
            disabled={page + 1 >= pageCount || rows.length === 0}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
