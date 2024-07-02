<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/users');
});

Route::resource('users', UserController::class)->except(['destroy']);

Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
Route::delete('users/{id}/forceDelete', [UserController::class, 'forceDelete'])->name('users.forceDelete');
Route::post('users/{id}/ban', [UserController::class, 'ban'])->name('users.ban');
Route::post('users/{id}/unban', [UserController::class, 'unban'])->name('users.unban');
Route::post('users/{id}/delete', [UserController::class, 'delete'])->name('users.delete');
