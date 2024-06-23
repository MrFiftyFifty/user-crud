import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import { Button, Table, Container } from "react-bootstrap";

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    birthdate: string;
}

interface IndexProps {
    users: User[];
}

const Index: React.FC<IndexProps> = ({ users }) => {
    const handleDelete = (id: number) => {
        Inertia.delete(`/users/${id}`);
    };

    return (
        <Container>
            <h1 className="my-4">Пользователи</h1>
            <InertiaLink href="/users/create">
                <Button variant="primary" className="mb-3">
                    Создать пользователя
                </Button>
            </InertiaLink>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Пол</th>
                        <th>Дата рождения</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>
                                {new Date(user.birthdate).toLocaleDateString()}
                            </td>
                            <td>
                                <InertiaLink href={`/users/${user.id}/edit`}>
                                    <Button variant="warning" className="me-2">
                                        Редактировать
                                    </Button>
                                </InertiaLink>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Удалить
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
