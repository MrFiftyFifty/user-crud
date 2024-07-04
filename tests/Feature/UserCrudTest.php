<?php

namespace Tests\Feature;

use App\Models\User;
use App\States\Active;
use App\States\Banned;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserCrudTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can be created.
     *
     * @test
     */
    public function it_can_create_a_user()
    {
        Storage::fake('public');

        $avatar = UploadedFile::fake()->create('avatar.jpg');

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'gender' => 'male',
            'birthdate' => '2000-01-01',
            'avatar' => $avatar,
        ];

        $response = $this->post('/users', $userData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    /**
     * Test that users can be read.
     *
     * @test
     */
    public function it_can_read_users()
    {
        $user = User::factory()->create();

        $response = $this->get('/users');

        $response->assertStatus(200);
        $response->assertSee($user->name);
    }

    /**
     * Test that a user can be updated.
     *
     * @test
     */
    public function it_can_update_a_user()
    {
        $user = User::factory()->create();

        $updatedData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'gender' => 'female',
            'birthdate' => '1990-01-01',
        ];

        $response = $this->put("/users/{$user->id}", $updatedData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', array_merge(['id' => $user->id], $updatedData));
    }

    /**
     * Test that a user can be deleted.
     *
     * @test
     */
    public function it_can_delete_a_user()
    {
        $user = User::factory()->create();

        $response = $this->post("/users/{$user->id}/delete");

        $response->assertRedirect('/users');
        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);
    }

    /**
     * Test that a user can be created with an avatar.
     *
     * @test
     */
    public function it_can_create_a_user_with_avatar()
    {
        Storage::fake('public');

        $avatar = UploadedFile::fake()->create('avatar.jpg');

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'gender' => 'male',
            'birthdate' => '2000-01-01',
            'avatar' => $avatar,
        ];

        $response = $this->post('/users', $userData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }

    /**
     * Test that a user can be updated with a new avatar.
     *
     * @test
     */
    public function it_can_update_a_user_with_new_avatar()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $oldAvatar = UploadedFile::fake()->create('old_avatar.jpg');
        $user->update(['avatar' => $oldAvatar->store('avatars', 'public')]);

        $newAvatar = UploadedFile::fake()->create('new_avatar.jpg');

        $updatedData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'gender' => 'female',
            'birthdate' => '1990-01-01',
            'avatar' => $newAvatar,
        ];

        $response = $this->put("/users/{$user->id}", $updatedData);

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', array_merge(['id' => $user->id], [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ]));
    }

    /**
     * Test that the avatar is deleted when the user is deleted.
     *
     * @test
     */
    public function it_deletes_avatar_when_user_is_deleted()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $avatar = UploadedFile::fake()->create('avatar.jpg');
        $user->update(['avatar' => $avatar->store('avatars', 'public')]);

        $response = $this->post("/users/{$user->id}/delete");

        $response->assertRedirect('/users');
        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);

        // Ensure the avatar is deleted
        Storage::disk('public')->assertMissing('avatars/' . $avatar->hashName());
    }

    /**
     * Test that a user can be banned.
     *
     * @test
     */
    public function it_can_ban_a_user()
    {
        $user = User::factory()->create();

        $response = $this->post("/users/{$user->id}/ban");

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'state' => 'App\\States\\Banned',
        ]);
    }

    /**
     * Test that a user can be unbanned.
     *
     * @test
     */
    public function it_can_unban_a_user()
    {
        $user = User::factory()->create(['state' => Banned::class]);

        $response = $this->post("/users/{$user->id}/unban");

        $response->assertRedirect('/users');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'state' => 'App\\States\\Active',
        ]);
    }
}
