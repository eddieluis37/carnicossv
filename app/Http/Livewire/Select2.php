<?php

namespace App\Http\Livewire;

use App\Models\Product;
use Livewire\Component;

class Select2 extends Component
{
    public $products, $productSelectedId, $productSelectedName;  

    

  public function mount()
  {
      $this->products =[];
  }  


  public function render()
  {
    $this->products = Product::orderBy('name','asc')->get();

    return view('livewire.utils.select2')
    ->extends('layouts.theme.app')
    ->section('content');
    }
    
}
