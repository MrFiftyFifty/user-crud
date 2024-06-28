import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { Table, Container, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const handleDelete = (id: number) => {
        Inertia.delete(route('users.destroy', { id }));
    };

    const handleRestore = (id: number) => {
        Inertia.post(route('users.restore', { id }));
    };

    const handleForceDelete = (id: number) => {
        Inertia.delete(route('users.forceDelete', { id }));
    };

    const handleBan = (id: number) => {
        Inertia.post(route('users.ban', { id }));
    };

    const handleUnban = (id: number) => {
        Inertia.post(route('users.unban', { id }));
    };

    return (
        <Container>
            <h1 className="my-4">{t('user_list')}</h1>
            <Button variant="primary" href={route('users.create')} className="mb-3">
                {t('create_user')}
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('name')}</th>
                        <th>{t('email')}</th>
                        <th>{t('gender')}</th>
                        <th>{t('birthdate')}</th>
                        <th>{t('state')}</th>
                        <th>{t('actions')}</th>
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
                            <td>{user.state === 'App\\States\\Banned' ? t('banned') : t('active')}</td>
                            <td>
                                {user.deleted_at ? (
                                    <>
                                        <Button
                                            variant="success"
                                            onClick={() => handleRestore(user.id)}
                                            className="me-2"
                                        >
                                            {t('restore_user')}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleForceDelete(user.id)}
                                        >
                                            {t('delete_user_forever')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="warning"
                                            href={route('users.edit', { id: user.id })}
                                            className="me-2"
                                        >
                                            {t('edit_user')}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(user.id)}
                                            className="me-2"
                                        >
                                            {t('delete_user')}
                                        </Button>
                                        {user.state === 'App\\States\\Banned' ? (
                                            <Button
                                                variant="success"
                                                onClick={() => handleUnban(user.id)}
                                            >
                                                {t('unban_user')}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="danger"
                                                onClick={() => handleBan(user.id)}
                                            >
                                                {t('ban_user')}
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
