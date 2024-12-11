// InventorySlot component (each grid cell)[[
import "./styles.css";
import { useDrop } from "react-dnd";

const ITEM_TYPE = "INVENTORY_ITEM";
function InventorySlot({ x, y, items, moveItem, slotSize }) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (draggedItem) => moveItem(draggedItem.id, x, y),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const occupied = items.some(
    (item) =>
      x >= item.x &&
      x < item.x + item.width &&
      y >= item.y &&
      y < item.y + item.height,
  );

  return (
    <div
      ref={drop}
      className="inventory-slot"
      style={{
        width: slotSize,
        height: slotSize,
        backgroundColor: isOver
          ? "lightgreen"
          : occupied
            ? "lightgrey"
            : "white",
      }}
    />
  );
}
export default InventorySlot;
