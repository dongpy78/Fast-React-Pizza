import { useDispatch } from "react-redux"
import Button from "../../ui/Button"
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpDateQuantityItem({pizzaId, currentQuantity}) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center md:gap-3 gap-2">
      <Button type='round' onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button type='round' onClick={() => dispatch(increaseItemQuantity(pizzaId))}>+</Button>
    </div>
  )
}

export default UpDateQuantityItem
