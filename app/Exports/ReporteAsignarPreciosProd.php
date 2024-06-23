<?php

namespace App\Exports;

use App\Models\Order;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;


use Maatwebsite\Excel\Concerns\FromCollection;      // para trabajar con colecciones y obtener la data
use Maatwebsite\Excel\Concerns\WithHeadings;        // para definir los títulos de encabezado
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;   // para interactuar con el libro
use Maatwebsite\Excel\Concerns\WithCustomStartCell; // para definir la celda donde inicia el reporte
use Maatwebsite\Excel\Concerns\WithTitle;           // para colocar nombre a las hojas del libro
use Maatwebsite\Excel\Concerns\WithStyles;          // para dar formato a las celdas
use Carbon\Carbon;

use Maatwebsite\Excel\Sheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;


class ReporteAsignarPreciosProd implements FromCollection, WithHeadings, WithCustomStartCell, WithTitle, WithStyles, WithEvents
{

    protected $listaprecioId;
    protected $categoriaId;

    function __construct($f1, $f2)
    {
        $this->listaprecioId = $f1;
        $this->categoriaId = $f2;

        //  dd($this->dateFrom, $this->dateTo);

    }

    public function collection()
    {  
        $costoVariable = 1357; // Recibir el valor de costo_variable
        $costoFijo = 1389; // valor de costo_fijo
        $data = [];

        $data = DB::table('listapreciodetalles as lpd')
        ->join('listaprecios as lp', 'lp.id', '=', 'lpd.listaprecio_id')
        ->join('products as pro', 'pro.id', '=', 'lpd.product_id')
        ->join('categories as cat', 'pro.category_id', '=', 'cat.id')
        ->select(
            'cat.name as namecategoria',
            'pro.id as productId',
            'pro.name as nameproducto',           
            'pro.cost as costo',
            DB::raw('(pro.cost + ' . $costoVariable . ') as costo_total'), // Sumar costo_variable a pro.cost
            'lpd.porc_util_proyectada as porc_util_proyectada',
            DB::raw('(pro.cost + ' . $costoVariable . ') / (1 - (porc_util_proyectada / 100) ) as precio_proyectado '),
            'lpd.precio as precio',
            'lpd.porc_descuento as porc_descuento',
            DB::raw('((precio - (pro.cost + ' . $costoVariable . ')) - (porc_descuento / 100) * precio) as utilidad '),
            'lpd.utilidad as porc_utilidad',
            DB::raw('((precio - (pro.cost + ' . $costoVariable . ')) - (porc_descuento / 100) * precio) - ' . $costoFijo . ' as contribucion'),
            'lpd.status as status',
        )
        ->where('lpd.listaprecio_id', $this->listaprecioId)
        ->where('pro.category_id', $this->categoriaId)  
        ->get();

        return $data;
    }

    //cabeceras del reporte
    public function headings(): array
    {
        return ["CAT", "ID", "PRODUCTOS", "COSTO", "TOTAL_COSTO", "% UTILIDAD_PROYECTADA", "PRECIO_PROYECTADO", "PRECIO", "% DESCUENTO", "UTILIDAD", "%UTILIDAD", "CONTRIBUCION", "STATUS"];
    }


    public function startCell(): string
    {
        return 'A2';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            2 => ['font' => ['bold' => true]],
        ];
    }

    public function title(): string
    {
        return 'Reporte de compras por productos';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $event->sheet->getDelegate()->getColumnDimension('A')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('B')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('C')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('D')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('E')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('F')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('G')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('H')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('I')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('J')->setAutoSize(true);
                $event->sheet->getDelegate()->getColumnDimension('K')->setAutoSize(true);

                // Ajustar automáticamente el tamaño de todas las columnas
                //      $event->sheet->getDelegate()->getDelegate()->getDelegate()->calculateColumnWidths();

                // Agrega la funcion autosuma a la columnas
                /*   $event->sheet->getDelegate()->setCellValue('K' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(K2:K' . $event->sheet->getDelegate()->getHighestRow() . ')');
                
                $event->sheet->getDelegate()->setCellValue('J' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(J2:J' . $event->sheet->getDelegate()->getHighestRow() . ')');
                $event->sheet->getDelegate()->setCellValue('I' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(I2:I' . $event->sheet->getDelegate()->getHighestRow() . ')');
                $event->sheet->getDelegate()->setCellValue('H' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(H2:H' . $event->sheet->getDelegate()->getHighestRow() . ')');           
                $event->sheet->getDelegate()->setCellValue('G' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(G2:G' . $event->sheet->getDelegate()->getHighestRow() . ')');
                $event->sheet->getDelegate()->setCellValue('F' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(F2:F' . $event->sheet->getDelegate()->getHighestRow() . ')');
                $event->sheet->getDelegate()->setCellValue('E' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(E2:E' . $event->sheet->getDelegate()->getHighestRow() . ')');
             */
                $event->sheet->getDelegate()->setCellValue('D' . ($event->sheet->getDelegate()->getHighestRow() + 1), '=SUM(D2:D' . $event->sheet->getDelegate()->getHighestRow() . ')');
                $event->sheet->getDelegate()->getStyle('D')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('E')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('F')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('G')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('H')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('I')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('J')->getNumberFormat()->setFormatCode('#,##0.00');
                $event->sheet->getDelegate()->getStyle('K')->getNumberFormat()->setFormatCode('#,##0.00');
            },
        ];
    }

    /* public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $columns = range('D', 'K');

                foreach ($columns as $column) {
                    $event->sheet->getDelegate()->getColumnDimension($column)->setAutoSize(true);

                    $lastRow = $event->sheet->getDelegate()->getHighestRow();
                    $event->sheet->getDelegate()->setCellValue($column . ($lastRow + 1), "=SUM($column:$column$lastRow)");
                    $event->sheet->getDelegate()->getStyle($column)->getNumberFormat()->setFormatCode('#,##0.00');
                }
            },
        ];
    } */
}
