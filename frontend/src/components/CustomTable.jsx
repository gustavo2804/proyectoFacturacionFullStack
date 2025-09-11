import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Card } from "./ui/card"

  export default function CustomTable({ data, columns }) {
            return (
              <Card className="flex flex-col items-center justify-center w-full ">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                   {columns.map((column)=>
                <TableHead key={column.key}>{column.label}</TableHead>
                )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>{row[column.key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}

                </TableBody>
              </Table>
              </Card>
            )
          }
          
  