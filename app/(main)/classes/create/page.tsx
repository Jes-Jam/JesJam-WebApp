"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "./header";

function CreateClassPage() {
  const [name, setName] = React.useState("");
  const [creatingClass, setCreatingClass] = React.useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatingClass(true);

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name}),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      router.push("/classes"); // Redirect after success
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setCreatingClass(false);
    }
  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header title="Create Class" />
      <div className=" text-center mt-5 text-slate-500">
      <p>
        The class will be created as a private class. Only you can see it.
      </p>
      <p>
        you can ask for approval to make the class appears in public later.
      </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="class-name">
            Class Name
          </label>
          <input
            type="text"
            id="class-name"
            className="block w-full px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter class name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary" className="mt-4"
            disabled={creatingClass}
          >
            {creatingClass ? "Creating Class..." : "Create Class"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateClassPage;
