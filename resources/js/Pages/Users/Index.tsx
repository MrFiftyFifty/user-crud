import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { Table, Container, Button } from "react-bootstrap";

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    birthdate: string;
    avatar: string | null;
    deleted_at: string | null;
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
            <h1 className="my-4">Список пользователей</h1>
            <Button variant="primary" href="/users/create" className="mb-3">
                Создать пользователя
            </Button>
            <Button variant="secondary" href="/deleted-users" className="mb-3 ms-2">
                Показать удаленных пользователей
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
                            <td>
                                {user.avatar && (
                                    <img
                                        src={`/storage/${user.avatar}`}
                                        alt="Avatar"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            marginRight: '10px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                {user.name}
                            </td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{new Date(user.birthdate).toLocaleDateString()}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    href={`/users/${user.id}/edit`}
                                    className="me-2"
                                >
                                    Редактировать
                                </Button>
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
