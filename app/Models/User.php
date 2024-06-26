<?php

namespace App\Models;

use App\States\UserState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\ModelStates\HasStates;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasStates, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'birthdate',
        'avatar',
        'state',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birthdate' => 'date:Y-m-d',
        'state' => UserState::class,
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user's gender with the first letter capitalized.
     *
     * @return string
     */
    public function getGenderAttribute($value)
    {
        return $value === 'male' ? 'Мужской' : 'Женский';
    }
}
