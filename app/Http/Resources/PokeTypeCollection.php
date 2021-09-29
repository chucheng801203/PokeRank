<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PokeTypeCollection extends ResourceCollection
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
        return $this->collection->mapToGroups(function ($item, $key) {
            return [
                $item['pokeform']['pm_id'] => [
                    'form_id' => $item['pokeform']['form_id'],
                    'type_id' => $item['type_id'],
                ],
            ];
        })->map(function ($item, $key) {
            return $item->mapToGroups(function ($item, $key) {
                return [$item['form_id'] => $item['type_id']];
            });
        });
    }
}
