"use client";

import { useState, useEffect } from "react";
import { StudentsTables } from "@/components/StudentsTable";
import { Button } from "@/components/ui/button";
import { NotAuthorizedDialog } from "@/components/NotAuthorizedDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { AddAssignmentDialog } from "@/components/AddAssignmentDialog";
import {Assignment,  AssignmentsTable, Student, StudentsTable } from "@/types";
import { AssignmentsTables } from "@/components/AssignmentsTable";
import axios from "axios";


export default function TeacherDashboard() {
  const { token, logout } = useAuthStore();
  const { profile, clearProfile } = useProfileStore();
  const [isNotAuthorizedDialogOpen, setIsNotAuthorizedDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] = useState(false);
  const [students, setStudents] = useState<StudentsTable[]>([]);
  const [assignments, setAssignments] = useState<AssignmentsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  const API_URL_STUDENTS = "https://edtech-saas-backend.vercel.app/api/students";
  // const API_URL_ASSIGNMENTS_GET = "https://edtech-saas-backend.vercel.app/api/assignments/get-all";
  const API_URL_ASSIGNMENTS = "https://edtech-saas-backend.vercel.app/api/assignments/create";

  

  async function fetchData() {
    setLoading(true);
    setError("");
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    const email = profile?.email;
    if (!email) {
      setError("Email is required");
      return;
    }
  
    // Construct the URLs with email as a path parameter
    const studentsUrl = `https://edtech-saas-backend.vercel.app/api/students/${email}`;
    const assignmentsUrl = `https://edtech-saas-backend.vercel.app/api/assignments/${email}`;
  
    // Fetch students data separately
    try {
      const studentsRes = await axios.get(studentsUrl, { headers });
      console.log("Students Data:", studentsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.warn("Failed to fetch students data:", err);
      setStudents([]); // Ensure state is updated to avoid undefined errors
    }
  
    // Fetch assignments data separately
    try {
      const assignmentsRes = await axios.get(assignmentsUrl, { headers });
      console.log("Assignments Data:", assignmentsRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      console.error("Error fetching assignments data:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
  
  
  
  useEffect(() => {
    if (!token) return;

    fetchData();
  }, [token]);

    const handleAddStudent = async (data: Omit<Student, 'creatorEmail'>) => {
    setLoading(true);
    setError("");
  
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      className: data.className,
      age: data.age,
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
      if ((err as Error & { code?: number }).code === 403 && (err as Error).message === "Not authorized") {
        setIsAddStudentDialogOpen(false);
        setIsNotAuthorizedDialogOpen(true);
        return;
      }
      setError((err as Error).message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  

    const handleAddAssignment = async (data: Assignment) => {
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
      if ((err as Error & { code?: number }).code === 403 && (err as Error).message === "Not authorized") {
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

      {profile?.role === 'Student' 
      ?  (
        <div>
          <AssignmentsTables assignments={assignments} />
          {/* <Button onClick={() => setIsAddAssignmentDialogOpen(true)}>Add Assignment</Button> */}
        </div> 
        )
        : (
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <StudentsTables students={students} />
              <Button onClick={() => setIsAddStudentDialogOpen(true)}>Add a Student</Button>
            </TabsContent>

            <TabsContent value="assignments">
              <AssignmentsTables assignments={assignments} />
              <Button onClick={() => setIsAddAssignmentDialogOpen(true)}>Add Assignment</Button>
            </TabsContent>
          </Tabs>
        )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <NotAuthorizedDialog open={isNotAuthorizedDialogOpen} onOpenChange={setIsNotAuthorizedDialogOpen} />
      <AddStudentDialog creatorEmail={profile?.email || ""} loading={loading} open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen} onAddStudent={handleAddStudent} />
      <AddAssignmentDialog creatorEmail={profile?.email || ""} open={isAddAssignmentDialogOpen} onOpenChange={setIsAddAssignmentDialogOpen} onAddAssignment={handleAddAssignment} />
    </div>
  );
}

