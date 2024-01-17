<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $method = $this->method();

        if ($method == 'PUT') {
            return [
                'title' => ['required', 'string'],
                'author' => ['required', 'string'],
                'genre' => ['required', 'string'],
                'description' => ['required', 'string'],
                'publishedDate' => ['required', 'date'],
            ];
        } else {
            return [
                'title' => ['sometimes', 'required', 'string'],
                'author' => ['sometimes', 'required', 'string'],
                'genre' => ['sometimes', 'required', 'string'],
                'description' => ['sometimes', 'required', 'string'],
                'publishedDate' => ['sometimes', 'required', 'date'],
            ];
        }
    }

    public function prepareForValidation()
    {

        if ($this->publishedDate) {
            $this->merge([
                'published_date' => $this->publishedDate
            ]);
        };
    }
}
