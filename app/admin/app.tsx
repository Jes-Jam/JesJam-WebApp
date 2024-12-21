"use client"

import { Admin, ListGuesser, Resource } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest"

import { getIsAdmin } from "../../lib/admin";

import { redirect } from "next/navigation";

const dataProvider = simpleRestProvider("/api");

export default async function App() {
    const isAdmin = await getIsAdmin();

    if (!isAdmin) {
        redirect("/");
    }

    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="courses"
                recordRepresentation="title"
                list={ListGuesser}
            />
        </Admin>
    )
};