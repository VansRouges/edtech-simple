"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StudentsTable } from "@/types"


export function StudentsTables({ students }: { students : StudentsTable[]}) {
  console.log("Students", students)

  return (
    <Table>
      <TableCaption>A list of students in your classes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>GPA</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.$id}>
            <TableCell>{student.firstName}</TableCell>
            <TableCell>{student.lastName}</TableCell>
            <TableCell>{student.className}</TableCell>
            <TableCell>{student.gender}</TableCell>
            <TableCell>{student.gpa}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

