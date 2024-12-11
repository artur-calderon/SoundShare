// InventoryItem component (each draggable item)
import "./styles.css";
import { useDrag } from "react-dnd";

const ITEM_TYPE = "INVENTORY_ITEM";
function InventoryItem({ item, slotSize }) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: item.id, width: item.width, height: item.height },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="inventory-item"
      style={{
        width: item.width * slotSize,
        height: item.height * slotSize,
        opacity: isDragging ? 0.5 : 1,
        position: "absolute",
        top: item.y * slotSize,
        left: item.x * slotSize,
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover",
      }}
    />
  );
}
export default InventoryItem;
