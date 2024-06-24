import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { Table, Container, Button } from "react-bootstrap";

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    birthdate: string;
    deleted_at: string | null;
}

interface DeletedProps {
    users: User[];
}

const Deleted: React.FC<DeletedProps> = ({ users }) => {
    const handleRestore = (id: number) => {
        Inertia.post(`/users/${id}/restore`);
    };

    const handleForceDelete = (id: number) => {
        Inertia.delete(`/users/${id}/force-delete`);
    };

    return (
        <Container>
            <h1 className="my-4">Удаленные пользователи</h1>
            <Button variant="primary" href="/users" className="mb-3">
                Вернуться к списку пользователей
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Пол</th>
                        <th>Дата рождения</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{new Date(user.birthdate).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="success"
                                    onClick={() => handleRestore(user.id)}
                                    className="me-2"
                                >
                                    Восстановить
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleForceDelete(user.id)}
                                >
                                    Удалить навсегда
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Deleted;
