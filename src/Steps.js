import { Group, Rect, Circle } from "react-konva";
function Steps(props) {
  const { equation_obj } = props;
  const { bbox, solveSteps } = equation_obj;

  // Defining dimensions for the steps box
  // X axis
  const size = App.size / 3;
  const minX = bbox[0][0];
  const maxX = minX + size;
  const centerX = (minX + maxX) / 2;
  // Y axis
  const minY = bbox[0][1];
  const maxY = minY + size;
  const centerY = (minY + maxY) / 2;

  // Other
  const marginX = 20;
  const marginY = 20;
  const increment = 10;
  const top = minY + marginY; // This will be incremented as the lines will render
  const bottom = maxY - marginY;

  return (
    <Group width={size} height={size}>
      <Rect
        x={bbox[0][0]}
        y={bbox[0][1]}
        width={size}
        height={size}
        fill="rgba(255,255,255,0.9)"
        stroke="#777"
        strokeWidth={1}
      />
      <Circle
        strokeWidth={1}
        stroke="black"
        radius={50}
        draggable
        x={centerX}
        y={centerY}
      />
    </Group>
  );
}

export default Steps;
