import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";

const Index = ({ users }) => {
    const handleDelete = (id) => {
        Inertia.delete(`/users/${id}`);
    };

    return (
        <div>
            <h1>Users</h1>
            <InertiaLink href="/users/create">Create User</InertiaLink>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <InertiaLink href={`/users/${user.id}/edit`}>
                            Edit
                        </InertiaLink>
                        <button onClick={() => handleDelete(user.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Index;
