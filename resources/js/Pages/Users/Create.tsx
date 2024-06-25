import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Form, Button, Container } from "react-bootstrap";

const Create: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        gender: "",
        birthdate: "",
        avatar: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key as keyof typeof data] as string | Blob);
        });
        post("/users", {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    };

    return (
        <Container>
            <h1 className="my-4">Создать пользователя</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("name", e.target.value)}
                        placeholder="Имя"
                        required
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("email", e.target.value)}
                        placeholder="Email"
                        required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пол</Form.Label>
                    <Form.Select
                        value={data.gender}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData("gender", e.target.value)}
                        required
                    >
                        <option value="">Выберите пол</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </Form.Select>
                    {errors.gender && <div className="text-danger">{errors.gender}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Дата рождения</Form.Label>
                    <Form.Control
                        type="date"
                        value={data.birthdate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("birthdate", e.target.value)}
                        required
                    />
                    {errors.birthdate && <div className="text-danger">{errors.birthdate}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Аватар</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("avatar", e.target.files ? e.target.files[0] : null)}
                    />
                    {errors.avatar && <div className="text-danger">{errors.avatar}</div>}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={processing}>
                    Создать
                </Button>
            </Form>
        </Container>
    );
};

export default Create;
