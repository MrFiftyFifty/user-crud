import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Form, Button, Container } from "react-bootstrap";

interface User {
    id: number;
    name: string;
    email: string;
    gender: string;
    birthdate: string;
}

interface EditProps {
    user: User;
}

const Edit: React.FC<EditProps> = ({ user }) => {
    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);
    const [gender, setGender] = useState<string>(user.gender === "Мужской" ? "male" : "female");
    const [birthdate, setBirthdate] = useState<string>(user.birthdate);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.put(`/users/${user.id}`, { name, email, gender, birthdate });
    };

    return (
        <Container>
            <h1 className="my-4">Редактировать пользователя</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        placeholder="Имя"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пол</Form.Label>
                    <Form.Select
                        value={gender}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}
                        required
                    >
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата рождения</Form.Label>
                    <Form.Control
                        type="date"
                        value={birthdate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthdate(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Сохранить
                </Button>
            </Form>
        </Container>
    );
};

export default Edit;
