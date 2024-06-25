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
    state: string;
}

interface IndexProps {
    users: User[];
}

const Index: React.FC<IndexProps> = ({ users }) => {
    const handleDelete = (id: number) => {
        Inertia.delete(`/users/${id}`);
    };

    const handleRestore = (id: number) => {
        Inertia.post(`/users/${id}/restore`);
    };

    const handleForceDelete = (id: number) => {
        Inertia.delete(`/users/${id}/force-delete`);
    };

    const handleBan = (id: number) => {
        Inertia.post(`/users/${id}/ban`);
    };

    const handleUnban = (id: number) => {
        Inertia.post(`/users/${id}/unban`);
    };

    return (
        <Container>
            <h1 className="my-4">Список пользователей</h1>
            <Button variant="primary" href="/users/create" className="mb-3">
                Создать пользователя
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Пол</th>
                        <th>Дата рождения</th>
                        <th>Состояние</th>
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
                            <td>{user.state === 'App\\States\\Banned' ? 'Забанен' : 'Активен'}</td>
                            <td>
                                {user.deleted_at ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
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
                                            className="me-2"
                                        >
                                            Удалить
                                        </Button>
                                        {user.state === 'App\\States\\Banned' ? (
                                            <Button
                                                variant="success"
                                                onClick={() => handleUnban(user.id)}
                                            >
                                                Разбанить
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="danger"
                                                onClick={() => handleBan(user.id)}
                                            >
                                                Забанить
                                            </Button>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Index;
