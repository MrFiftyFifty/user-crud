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
    public function index()
    {
        return Inertia::render('Users/Index', ['users' => User::withTrashed()->get()]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        User::create($data);

        return redirect(route('users.index'))->with('message', __('messages.create_user'));
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', ['user' => $user]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', ['user' => $user]);
    }

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

        return redirect(route('users.index'))->with('message', __('messages.edit_user'));
    }

    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect(route('users.index'))->with('message', __('messages.delete_user'));
    }

    public function ban($id)
    {
        $user = User::findOrFail($id);
        $user->state->transitionTo(Banned::class);

        return redirect(route('users.index'))->with('message', __('messages.ban_user'));
    }

    public function unban($id)
    {
        $user = User::findOrFail($id);
        $user->state->transitionTo(Active::class);

        return redirect(route('users.index'))->with('message', __('messages.unban_user'));
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();

        return redirect(route('users.index'))->with('message', __('messages.restore_user'));
    }

    public function forceDelete($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        $user->forceDelete();

        return redirect(route('users.index'))->with('message', __('messages.delete_user'));
    }
}
