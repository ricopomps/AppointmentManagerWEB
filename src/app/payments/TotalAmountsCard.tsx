import { formatMoney } from "@/lib/utils";

interface TotalAmountCardProps {
  totalRecipe: number;
  totalCost: number;
}

export default function TotalAmountCard({
  totalRecipe,
  totalCost,
}: TotalAmountCardProps) {
  return (
    <div className="mb-2 flex w-full min-w-[200px] max-w-[400px] justify-end p-4">
      <div className="isolate aspect-video w-full rounded-xl bg-white/20 p-4 text-center text-neutral shadow-lg ring-1 ring-black/5 md:w-fit">
        <div className="mb-2 font-bold text-success">
          Receita total: {formatMoney(totalRecipe)}
        </div>
        <div className="text-danger mb-2 font-bold">
          Custo (Protético): {formatMoney(totalCost)}
        </div>
        <div className="mb-2 font-bold text-primary">
          Subtotal: {formatMoney(totalRecipe - totalCost)}
        </div>
        <div className="mb-2 font-bold text-info">
          Dentista: {formatMoney((totalRecipe - totalCost) * 0.6)}
        </div>
        <div className="font-bold text-warning">
          Clínica: {formatMoney((totalRecipe - totalCost) * 0.4)}
        </div>
      </div>
    </div>
  );
}
