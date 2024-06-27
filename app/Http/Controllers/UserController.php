<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\States\Active;
use App\States\Banned;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Users/Index', ['users' => User::withTrashed()->get()]);
    }

    /**
     * Show the form for creating a new user.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created user in storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        User::create($data);

        return redirect()->route('users.index')->with('message', __('messages.create_user'));
    }

    /**
     * Display the specified user.
     *
     * @return \Inertia\Response
     */
    public function show(User $user)
    {
        return Inertia::render('Users/Show', ['user' => $user]);
    }

    /**
     * Show the form for editing the specified user.
     *
     * @return \Inertia\Response
     */
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', ['user' => $user]);
    }

    /**
     * Update the specified user in storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return redirect()->route('users.index')->with('message', __('messages.edit_user'));
    }

    /**
     * Soft delete the specified user from storage.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('message', __('messages.delete_user'));
    }

    /**
     * Ban the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function ban($id)
    {
        $user = User::findOrFail($id);
        $user->state->transitionTo(Banned::class);

        return redirect()->route('users.index')->with('message', __('messages.ban_user'));
    }

    /**
     * Unban the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function unban($id)
    {
        $user = User::findOrFail($id);
        $user->state->transitionTo(Active::class);

        return redirect()->route('users.index')->with('message', __('messages.unban_user'));
    }

    /**
     * Restore the specified user from soft deletes.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return redirect()->route('users.index')->with('message', __('messages.restore_user'));
    }

    /**
     * Permanently delete the specified user from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        $user->forceDelete();

        return redirect()->route('users.index')->with('message', __('messages.delete_user'));
    }
}
