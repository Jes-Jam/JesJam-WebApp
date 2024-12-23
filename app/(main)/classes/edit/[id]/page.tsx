"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "./header";
import { updateClass, getClassById } from "@/database/classCrud";



function EditClassPage({ params }: { params: { id: number } }) {
  const { id } = params;
  const [isError, setIsError] = React.useState<string | null>(null);
  const [name, setName] = React.useState<string>("");
  
  React.useEffect(() => {
    getClassById(id)
    .then((classData) => {
      if (classData) {
        setName(classData.title || "");
      }
    })
    .catch((err) => {
      setIsError(err.message);
    });
  }, [id]);
  const [isUpdatingClass, setUpdatingClass] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();


  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatingClass(true);

    if (isPending) return;

    startTransition (() => {
      updateClass(id, name)
        .then(() => router.push("/classes"))
        .finally(() => setUpdatingClass(false));
    })
  };

  return (
    <div className="h-full w-[900px] mx-auto pt-10 sm:px-4 md:px-4 lg:px-0">
      <Header title="Update Class" />
      {isError ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-red-500 text-lg font-bold">{isError}</p>
        </div>
      ) : (
        <>
          <div className="text-center mt-5 text-slate-500">
            <p>
              The class will be updated
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
                variant="primary"
                className="mt-4"
                disabled={isUpdatingClass}
              >
                {isUpdatingClass ? "Updating..." : "Update Class"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
export default EditClassPage;
