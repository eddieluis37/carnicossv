<?php

namespace App\Http\Controllers\reportes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\centros\Centrocosto;
use App\Models\SaleDetail;
use App\Models\Compensadores_detail;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Product;
use Maatwebsite\Excel\Facades\Excel;

use App\Exports\ReporteAsignarPreciosProd;



class reporteasignarpreciosController extends Controller
{
   
    public function reporteExcel($listaprecio, $categoria)
    {
       // dd($listaprecio, $categoria);

        $reportName = 'Reporte asignar precios a productos_' . uniqid() . '.xlsx';
        return Excel::download(new ReporteAsignarPreciosProd($listaprecio, $categoria), $reportName);
    }

}
