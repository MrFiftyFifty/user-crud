<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserCrudTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can be created.
     */
    public function test_it_can_create_a_user()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'gender' => 'male',
            'birthdate' => '2000-01-01 12:00:00',
        ];

        $response = $this->post('/users', $userData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', $userData);
    }

    /**
     * Test that users can be read.
     */
    public function test_it_can_read_users()
    {
        $user = User::factory()->create();

        $response = $this->get('/users');

        $response->assertStatus(200);
        $response->assertSee($user->name);
    }

    /**
     * Test that a user can be updated.
     */
    public function test_it_can_update_a_user()
    {
        $user = User::factory()->create();

        $updatedData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'gender' => 'female',
            'birthdate' => '1990-01-01 12:00:00',
        ];

        $response = $this->put("/users/{$user->id}", $updatedData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', array_merge(['id' => $user->id], $updatedData));
    }

    /**
     * Test that a user can be deleted.
     */
    public function test_it_can_delete_a_user()
    {
        $user = User::factory()->create();

        $response = $this->delete("/users/{$user->id}");

        $response->assertRedirect('/users');
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}