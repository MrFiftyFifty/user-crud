import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Form, Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Create: React.FC = () => {
    const { t } = useTranslation();
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
            <h1 className="my-4">{t('create_user')}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control
                        type="text"
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("name", e.target.value)}
                        placeholder={t('name')}
                        required
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t('email')}</Form.Label>
                    <Form.Control
                        type="email"
                        value={data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("email", e.target.value)}
                        placeholder={t('email')}
                        required
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t('gender')}</Form.Label>
                    <Form.Select
                        value={data.gender}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData("gender", e.target.value)}
                        required
                    >
                        <option value="">{t('select_gender')}</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                    </Form.Select>
                    {errors.gender && <div className="text-danger">{errors.gender}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t('birthdate')}</Form.Label>
                    <Form.Control
                        type="date"
                        value={data.birthdate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("birthdate", e.target.value)}
                        required
                    />
                    {errors.birthdate && <div className="text-danger">{errors.birthdate}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{t('avatar')}</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("avatar", e.target.files ? e.target.files[0] : null)}
                    />
                    {errors.avatar && <div className="text-danger">{errors.avatar}</div>}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={processing}>
                    {t('create_user')}
                </Button>
            </Form>
        </Container>
    );
};

export default Create;
