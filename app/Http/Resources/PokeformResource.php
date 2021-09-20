<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PokeformResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->pm_id,
            'form_id' => $this->form_id,
        ];
    }
}
