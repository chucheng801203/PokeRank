<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class IdNameCollection extends ResourceCollection
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
        $col_name = 'name_zh_tw';
        return $this->collection->mapWithKeys(function ($item, $key) use($col_name) {
            return [$item['id'] => $item[$col_name]];
        });
    }
}
