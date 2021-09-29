<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class IdPercentageCollection extends ResourceCollection
{
    public $preserveKeys = true;

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [];

        foreach ($this->collection as $rank) {
            if (empty($data[$rank->rule])) {
                $data[$rank->rule] = [];
            }

            if (empty($data[$rank->rule][$rank->pokeform->form_id])) {
                $data[$rank->rule][$rank->pokeform->form_id] = [];
            }

            $data[$rank->rule][$rank->pokeform->form_id][] = [
                'id' => $rank->id,
                'percentage' => $rank->percentage,
            ];
        }

        return $data;
    }
}
