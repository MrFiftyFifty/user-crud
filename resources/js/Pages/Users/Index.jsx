import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import { Button, Table, Container } from "react-bootstrap";

const Index = ({ users }) => {
    const handleDelete = (id) => {
        Inertia.delete(`/users/${id}`);
    };

    return (
        <Container>
            <h1 className="my-4">Users</h1>
            <InertiaLink href="/users/create">
                <Button variant="primary" className="mb-3">
                    Create User
                </Button>
            </InertiaLink>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Birthdate</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{user.birthdate}</td>
                            <td>
                                <InertiaLink href={`/users/${user.id}/edit`}>
                                    <Button variant="warning" className="me-2">
                                        Edit
                                    </Button>
                                </InertiaLink>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Index;
