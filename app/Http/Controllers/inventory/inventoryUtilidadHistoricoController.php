<?php

namespace App\Http\Controllers\inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\centros\Centrocosto;
use Illuminate\Support\Facades\DB;

class inventoryUtilidadHistoricoController extends Controller
{

    public function indexhistutilidad()
    {
        $startDate = '2023-05-01';
        $endDate = '2023-05-08';

        /*  $category = Category::whereIn('id', [1, 2, 3, 4, 5, 6, 7, 8, 9])->orderBy('name', 'asc')->get();
 */
        $category = Category::orderBy('name', 'asc')->get();
        $centros = Centrocosto::Where('status', 1)->get();

        // llama al metodo para calcular el stock
        //   $this->totales(request());
        $response = $this->totaleshistutilidad(request()); // Call the totales method
        $totalStock = $response->getData()->totalStock; // Retrieve the totalStock value from the response

        return view('inventory.consolidado_histutilidad', compact('category', 'centros', 'startDate', 'endDate', 'totalStock'));
    }
   
    public function showhistutilidad(Request $request)
    {   
        $centrocostoId = $request->input('centrocostoId');
        $categoriaId = $request->input('categoriaId');
        $fechai = $request->input('fechai');
        $fechaf = $request->input('fechaf');

        $data = DB::table('centro_costo_product_hists as ccp')
            ->join('products as pro', 'pro.id', '=', 'ccp.products_id')
            ->join('categories as cat', 'pro.category_id', '=', 'cat.id')
            ->select(
                'cat.name as namecategoria',
                'pro.name as nameproducto',
                'ccp.fecha as fecha', 
                'ccp.consecutivo as consecutivo',                
                'ccp.cto_invinicial_total as invinicial',
                'ccp.cto_compralote_total as compraLote',
                'ccp.cto_compensados_total as compensados',
                'ccp.cto_trasladoing_total as trasladoing',
                'ccp.cto_trasladosal_total as trasladosal',
                'ccp.cto_venta_total as venta',
                'ccp.cto_notacredito as notacredito',
                'ccp.cto_notadebito as notadebito',                
               
            )
            ->where('ccp.centrocosto_id', $centrocostoId)
            ->where('pro.category_id', $categoriaId)
            ->where('pro.status', 1)
            ->whereBetween('fecha', [$fechai, $fechaf])  
            ->get();

     /*  
        foreach ($data as $item) {
            $cto_invfinal_total = ($item->cto_invinicial + $item->cto_compraLote + $item->cto_compensados + $item->trasladoing) - (($item->invfinaltotal) + $item->trasladosal);
            $item->cto_invfinal_total = round($cto_invfinal_total, 2);
        } */

        return datatables()->of($data)
            ->addIndexColumn()
            ->make(true);
    }  

    public function totaleshistutilidad(Request $request)
    {
        $centrocostoId = $request->input('centrocostoId');
        $categoriaId = $request->input('categoriaId');
        $fechai = $request->input('fechai');
        $fechaf = $request->input('fechaf');

        $data = DB::table('centro_costo_product_hists as ccp')
            ->join('products as pro', 'pro.id', '=', 'ccp.products_id')
            ->join('categories as cat', 'pro.category_id', '=', 'cat.id')
            ->select(
                'cat.name as namecategoria',
                'pro.name as nameproducto',
                'ccp.cto_invinicial_total as invinicial',
                'ccp.cto_compralote_total as compraLote',           
                'ccp.cto_compensados_total as compensados',
                'ccp.cto_trasladoing_total as trasladoing',
                'ccp.cto_trasladosal_total as trasladosal',
                'ccp.cto_venta_total as venta',
                'ccp.cto_notacredito as notacredito',
                'ccp.cto_notadebito as notadebito',
                'ccp.stock as stock',
                'ccp.fisico as fisico'
            )
            ->where('ccp.centrocosto_id', $centrocostoId)
            ->where('pro.category_id', $categoriaId)
            ->where('pro.status', 1)
            ->whereBetween('fecha', [$fechai, $fechaf])
            ->get();

        $totalStock = 0;
        $totalInvInicial = 0;
        $totalCompraLote = 0;      
        $totalCompensados = 0;
        $totalTrasladoIng = 0;
        $totalVenta = 0;
        $totalTrasladoSal = 0;
        $totalIngresos = 0;
        $totalSalidas = 0;
        $totalConteoFisico = 0;

        $diferenciaKilos = 0;
        $porcMermaPermitida = 0;
        $difKilosPermitidos = 0;
        $difKilos = 0;
        $porcMerma = 0;
        $difPorcentajeMerma = 0;

        foreach ($data as $item) {

            $stock = ($item->invinicial + $item->compraLote + $item->compensados + $item->trasladoing) - ($item->venta + $item->trasladosal);
            $item->stock = round($stock, 2);
            $totalStock += $stock;

            $ingresos = ($item->invinicial + $item->compraLote + $item->compensados + $item->trasladoing);
            $item->ingresos = round($ingresos, 2);
            $totalIngresos += $ingresos;

            $ventas = ($item->venta - $item->notacredito) + $item->notadebito;
            $item->ventas = round($ventas, 2);

            $salidas =  $item->trasladosal + (($item->venta - $item->notacredito) + $item->notadebito);
            $item->salidas = round($salidas, 2);
            $totalSalidas += $salidas;

            $totalInvInicial += $item->invinicial;
            $totalCompraLote += $item->compraLote;            
            $totalCompensados += $item->compensados;
            $totalTrasladoIng += $item->trasladoing;
            $totalVenta += $item->ventas;
            $totalVenta = $salidas;
            $totalTrasladoSal += $item->trasladosal;

            $totalConteoFisico += $item->fisico;
            $diferenciaKilos = $totalConteoFisico - $totalStock;
        }

        if ($totalIngresos <= 0) {
            $totalIngresos = 1;
        }

        $porcMerma = $diferenciaKilos / $totalIngresos;

        $porcMermaPermitida = 0.005;
        $difKilosPermitidos = -1 * ($totalIngresos * $porcMermaPermitida);
        $difKilos = $diferenciaKilos - $difKilosPermitidos;


        $difPorcentajeMerma = $porcMerma + $porcMermaPermitida;


        return response()->json(
            [
                'totalStock' => number_format($totalStock, 2),

                'totalInvInicial' => number_format($totalInvInicial, 2),
                'totalCompraLote' => number_format($totalCompraLote, 2),                
                'totalCompensados' => number_format($totalCompensados, 2),
                'totalTrasladoing' => number_format($totalTrasladoIng, 2),

                'totalVenta' => number_format($totalVenta, 2),
                'totalTrasladoSal' => number_format($totalTrasladoSal, 2),

                'totalIngresos' => number_format($totalIngresos, 2),
                'totalSalidas' => number_format($totalSalidas, 2),

                'totalConteoFisico' => number_format($totalConteoFisico, 2),

                'diferenciaKilos' => number_format($diferenciaKilos, 2),
                'difKilosPermitidos' => number_format($difKilosPermitidos, 2),
                'porcMerma' => number_format($porcMerma * 100, 2),
                'porcMermaPermitida' => number_format($porcMermaPermitida * 100, 2),
                'difKilos' => number_format($difKilos, 2),
                'difPorcentajeMerma' => number_format($difPorcentajeMerma * 100, 2),

            ]
        );
    }
}
