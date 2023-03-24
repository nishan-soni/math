import { useEffect, useRef, useState } from "react";
import { Circle, Line, RegularPolygon, Shape } from "react-konva";

export default function Distance(props) {
  const { updateSymbols, currentSymbols } = props;
  const x1 = currentSymbols["x1"];
  const x2 = currentSymbols["x2"];
  const y1 = currentSymbols["y1"];
  const y2 = currentSymbols["y2"];
  const factor = 100;
  const [p, setP] = useState({ x: 796.6935103983765, y: 490.3385372522989 });
  const [q, setQ] = useState({ x: 937.8024677262677, y: 418.5462607170564 });
  const [update, setUpdate] = useState(0);
  const pRef = useRef();
  const qRef = useRef();

  // Updates the current symbols

  useEffect(() => {
    let new_symbols = {
      x1: parseFloat((p.x / factor).toFixed(1)),
      x2: parseFloat((q.x / factor).toFixed(1)),
      y1: parseFloat((p.y / factor).toFixed(1)),
      y2: parseFloat((q.y / factor).toFixed(1)),
      PQ: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
    };

    updateSymbols({ ...currentSymbols, ...new_symbols });
    //console.log("update distance", p.x);
  }, [update]);

  // Whenever a or b is changed

  useEffect(() => {
    if (
      x1 !== undefined &&
      x2 !== undefined &&
      y1 !== undefined &&
      y2 !== undefined
    ) {
      if (x1 > 0 && x2 > 0 && y1 > 0 && y2 > 0) {
        //console.log({ x: x1, y: y1 });
        setP({
          x: parseFloat((x1 * factor).toFixed(1)),
          y: parseFloat((y1 * factor).toFixed(1)),
        });
        setQ({
          x: parseFloat((x2 * factor).toFixed(1)),
          y: parseFloat((y2 * factor).toFixed(1)),
        });
        // Update c in the current symbols
        currentSymbols.PQ = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        //onTriangleChange(new_symbols);
      }
    }
  }, [x1, y1, x2, y2]);

  return (
    <>
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(q.x, q.y);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        stroke="black"
      />
      <Circle
        id="p"
        radius={5}
        fill="black"
        stroke="black"
        x={p.x}
        y={p.y}
        draggable
        ref={pRef}
        onDragMove={(e) => {
          setP({
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          });
          setUpdate(update + 1);
        }}
      />
      <Circle
        id="q"
        radius={5}
        fill="black"
        stroke="black"
        x={q.x}
        y={q.y}
        draggable
        ref={qRef}
        onDragMove={(e) => {
          setQ({
            x: e.target.attrs.x,
            y: e.target.attrs.y,
          });
          setUpdate(update + 1);
        }}
      />
    </>
  );
}
