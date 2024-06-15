<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Проверяет, что приложение возвращает успешный ответ.
     */
    public function test_application_returns_successful_response(): void
    {
        $response = $this->get('/users');

        $response->assertStatus(200);
    }
}
