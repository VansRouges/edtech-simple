import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AssignmentsTable } from "@/types"

export function AssignmentsTables({ assignments }: { assignments: AssignmentsTable[] }) {
  console.log("Assignments", assignments)

  return (
    <Table>
      <TableCaption>A list of recent assignments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment.$id}>
            <TableCell>{assignment.title}</TableCell>
            <TableCell>{assignment.subject}</TableCell>
            <TableCell>{assignment.className}</TableCell>
            <TableCell>{assignment.teacher}</TableCell>
            <TableCell>{assignment.dueDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

