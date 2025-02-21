"use client";

import { useState, useEffect } from "react";
import { StudentsTable } from "@/components/StudentsTable";
import { AssignmentsTable } from "@/components/AssignmentsTable";
import { Button } from "@/components/ui/button";
import { NotAuthorizedDialog } from "@/components/NotAuthorizedDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { AddAssignmentDialog } from "@/components/AddAssignmentDialog";

interface Student {
  firstName: string;
  lastName: string;
  gender: string;
  className: string;
  gpa: number;
  creatorEmail: string;
}

interface Assignment {
  title: string;
  subject: string;
  className: string;
  teacher: string;
  dueDate: string;
  creatorEmail: string;
}


export default function TeacherDashboard() {
  const { token, user, logout } = useAuthStore();
  const { profile, clearProfile } = useProfileStore();
  const [isNotAuthorizedDialogOpen, setIsNotAuthorizedDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL_STUDENTS = "https://edtech-saas-backend.vercel.app/api/students";
  const API_URL_ASSIGNMENTS_GET = "https://edtech-saas-backend.vercel.app/api/assignments/get-all";
  const API_URL_ASSIGNMENTS = "https://edtech-saas-backend.vercel.app/api/assignments/create";

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [studentsRes, assignmentsRes] = await Promise.all([
          fetch(API_URL_STUDENTS, { headers }),
          fetch(API_URL_ASSIGNMENTS_GET, { headers }),
        ]);

        if (!studentsRes.ok) throw new Error(`Students API error: ${await studentsRes.text()}`);
        if (!assignmentsRes.ok) throw new Error(`Assignments API error: ${await assignmentsRes.text()}`);

        const studentsData = await studentsRes.json();
        console.log("Students Data:", studentsData);

        const assignmentsData = await assignmentsRes.json();
        console.log("Assignments Data:", assignmentsData);

        setStudents(studentsData);
        setAssignments(assignmentsData);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    if (!token) return;

    fetchData();
  }, [token]);

  const handleAddStudent = async (data: any) => {
    setLoading(true);
    setError("");
  
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      className: data.className,
      gpa: data.gpa,
      creatorEmail: profile?.email,
    };
    console.log("Students payload:", payload);
  
    try {
      const response = await fetch(API_URL_STUDENTS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json(); // Ensure the response is parsed before checking conditions
      console.log("Student Result", result);
  
      if (response.status === 403 && result.message === "Not authorized") {
        setIsAddStudentDialogOpen(false);
        setIsNotAuthorizedDialogOpen(true);
        return; // Stop further execution
      }
  
      if (!response.ok) throw new Error(result.message || "Failed to add student");
  
      setStudents((prevStudents: Student[]) => [...prevStudents, result]); // Ensure proper typing
      setIsAddStudentDialogOpen(false);
      await fetchData();
    } catch (err) {
      setError((err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddAssignment = async (data: any) => {
    setLoading(true);
    setError("");
  
    const payload = {
      title: data.title,
      subject: data.subject,
      className: data.className,
      teacher: data.teacher,
      dueDate: data.dueDate,
      creatorEmail: profile?.email,
    };
  
    try {
      const response = await fetch(API_URL_ASSIGNMENTS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json(); // Ensure response is parsed once
  
      if (response.status === 403 && result.message === "Not authorized") {
        setIsAddAssignmentDialogOpen(false);
        setIsNotAuthorizedDialogOpen(true);
        return; // Stop further execution
      }
  
      if (!response.ok) throw new Error(result.message || "Failed to add assignment");
  
      setAssignments((prevAssignments: Assignment[]) => [...prevAssignments, result]); // Ensure proper typing
      setIsAddAssignmentDialogOpen(false);
    } catch (err) {
      if(err.code === 403 && err.message === "Not authorized"){
        setIsAddAssignmentDialogOpen(false);
        setIsNotAuthorizedDialogOpen(true);
        return;
      }
      setError((err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    clearProfile();
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Welcome {profile?.firstName}</h1>
          <p className="text-gray-600 mb-6">
            You are logged in as {profile?.role === "Admin" ? "an" : "a"} {profile?.role}.
          </p>
        </div>
        <Button variant="default" onClick={handleLogout}>Log out</Button>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentsTable students={students} />
          <Button onClick={() => setIsAddStudentDialogOpen(true)}>Add a Student</Button>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTable assignments={assignments} />
          <Button onClick={() => setIsAddAssignmentDialogOpen(true)}>Add Assignment</Button>
        </TabsContent>
      </Tabs>

      <NotAuthorizedDialog open={isNotAuthorizedDialogOpen} onOpenChange={setIsNotAuthorizedDialogOpen} />
      <AddStudentDialog loading={loading} open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen} onAddStudent={handleAddStudent} />
      <AddAssignmentDialog open={isAddAssignmentDialogOpen} onOpenChange={setIsAddAssignmentDialogOpen} onAddAssignment={handleAddAssignment} />
    </div>
  );
}

